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
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
    }

    try {
        // 5vs5_registrations သို့မဟုတ် သက်ဆိုင်ရာ Collection ထဲတွင် userId Field ဖြင့် ရှာဖွေခြင်း
        // (လိုအပ်ပါက 1vs1_registrations များကိုပါ ထပ်စစ်နိုင်သည်)
        const collections = ['5vs5_registrations', '1vs1_registrations', 'tournament_registrations'];
        let foundData = null;

        for (const colName of collections) {
            const snapshot = await db.collection(colName).where('userId', '==', userId).get();
            if (!snapshot.empty) {
                foundData = snapshot.docs[0].data();
                break;
            }
        }

        if (!foundData) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            status: foundData.status || 'PENDING',
            reason: foundData.reason || ''
        });

    } catch (error) {
        console.error("Check Status Error:", error);
        return res.status(500).json({ error: error.message });
    }
};