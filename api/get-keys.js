const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    }) 
  : getApps()[0];

const db = getFirestore(app);

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userData = userDoc.data();

        // Database ထဲက flat fields များကို frontend မျှော်လင့်ထားတဲ့ modes structure ထဲသို့ ပြောင်းလဲခြင်း
        const keys = {
            modes: {
                '5v5': {
                    '5k': userData['5v5-5k'] || 0,
                    '10k': userData['5v5-10k'] || 0,
                    '15k': userData['5v5-15k'] || 0,
                    '25k': userData['5v5-25k'] || 0,
                    '50k': userData['5v5-50k'] || 0
                },
                '1v1': {
                    '5k': userData['1vs1-5k'] || 0,
                    '10k': userData['1vs1-10k'] || 0,
                    '15k': userData['1vs1-15k'] || 0,
                    '25k': userData['1vs1-25k'] || 0,
                    '50k': userData['1vs1-50k'] || 0
                },
                'tournament': {
                    'pass': userData['tournament'] || 0
                }
            }
        };

        return res.status(200).json({ 
            success: true, 
            keys: keys 
        });

    } catch (error) {
        console.error("Fetch Keys Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};