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
        const { registrationId, userId, mode } = req.query;

        if (!registrationId || !userId || !mode) {
            return res.status(400).json({ success: false, message: 'Missing parameters' });
        }

        let collectionName = '';
        if (mode === '1vs1') collectionName = '1vs1_registrations';
        else if (mode === '5vs5') collectionName = '5vs5_registrations';
        else if (mode === 'tournament') collectionName = 'tournament_registrations';
        else return res.status(400).json({ success: false, message: 'Invalid mode' });

        const docRef = db.collection(collectionName).doc(registrationId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }

        const data = docSnap.data();

        if (data.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        return res.status(200).json({
            success: true,
            status: data.status, // 'PENDING', 'CONFIRMED', 'REJECTED'
            rejectionReason: data.rejectionReason || null,
            keys: data.keys || 0,         // <-- Key ဒေတာကို ထည့်ပေးလိုက်ပါပြီ
            balance: data.balance || 0    // <-- Balance ပါရင် ထည့်ပေးလိုက်ပါပြီ
        });

    } catch (error) {
        console.error("Status Check Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};