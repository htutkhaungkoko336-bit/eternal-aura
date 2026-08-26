const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    }) 
  : getApps()[0];

const db = getFirestore(app);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'Missing userId parameter' });
        }

        // မျိုးစုံသော Mode Collection များကို စစ်ဆေးရန် (1vs1, 5vs5, tournament)
        const collections = ['1vs1_registrations', '5vs5_registrations', 'tournament_registrations'];
        let foundData = null;

        for (const colName of collections) {
            const snapshot = await db.collection(colName).where('userId', '==', userId).limit(1).get();
            if (!snapshot.empty) {
                foundData = snapshot.docs[0].data();
                break;
            }
        }

        if (!foundData) {
            return res.status(200).json({ success: true, status: 'NONE' });
        }

        return res.status(200).json({
            success: true,
            status: foundData.status, // 'PENDING', 'CONFIRMED', 'REJECTED'
            rejectionReason: foundData.rejectionReason || null
        });

    } catch (error) {
        console.error("Status Check Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};