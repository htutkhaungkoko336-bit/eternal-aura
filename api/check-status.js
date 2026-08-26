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

        const collections = ['1vs1_registrations', '5vs5_registrations', 'tournament_registrations'];
        let foundData = null;
        let detectedMode = '1vs1';

        for (const colName of collections) {
            const snapshot = await db.collection(colName).where('userId', '==', userId).limit(1).get();
            if (!snapshot.empty) {
                foundData = snapshot.docs[0].data();
                // Collection နာမည်ပေါ်မူတည်ပြီး Mode ကို ခွဲထုတ်ခြင်း
                if (colName.includes('5vs5')) detectedMode = '5vs5';
                else if (colName.includes('tournament')) detectedMode = 'tournament';
                else detectedMode = '1vs1';
                break;
            }
        }

        if (!foundData) {
            return res.status(200).json({ success: true, status: 'NONE' });
        }

        return res.status(200).json({
            success: true,
            status: foundData.status, // 'PENDING', 'CONFIRMED', 'REJECTED'
            mode: foundData.mode || detectedMode, // Mode အမည်
            fee: foundData.fee || foundData.modeFee || '5,500Ks', // Fee ပမာဏ (အကယ်၍ DB ထဲမှာပါလျှင် ယူမည်၊ မပါက 5,500Ks သုံးမည်)
            rejectionReason: foundData.rejectionReason || null
        });

    } catch (error) {
        console.error("Status Check Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};