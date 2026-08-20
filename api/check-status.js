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
        const collections = ['5vs5_registrations', '1vs1_registrations', 'tournament_registrations'];
        let foundData = null;
        let latestTime = 0;

        for (const colName of collections) {
            // userId တူတာတွေကို ရှာမယ် (createdAt အလိုက် အသစ်ဆုံးကို ယူဖို့)
            const snapshot = await db.collection(colName)
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();

            if (!snapshot.empty) {
                const docData = snapshot.docs[0].data();
                const docTime = docData.createdAt && docData.createdAt.toMillis ? docData.createdAt.toMillis() : 0;
                
                // အသစ်ဆုံး စာရင်းသွင်းမှုကို ရွေးထုတ်ရန်
                if (docTime >= latestTime) {
                    latestTime = docTime;
                    foundData = docData;
                }
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