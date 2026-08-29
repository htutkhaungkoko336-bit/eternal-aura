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

        // Database ထဲရှိ keys များကို Frontend မှ မျှော်လင့်ထားသော modes structure ထဲသို့ အသေအချာ Map လုပ်ခြင်း
        const userData = userDoc.data();
        const k = userData.keys || {}; // Database ထဲက keys object ကို ယူခြင်း

        // Database ထဲရှိ keys များကို Frontend မှ မျှော်လင့်ထားသော modes structure ထဲသို့ အသေအချာ Map လုပ်ခြင်း
        const keys = {
            modes: {
                '5v5': {
                    '5k': k['5v5-5k'] !== undefined ? k['5v5-5k'] : (k['5vs5-5k'] !== undefined ? k['5vs5-5k'] : (k['5v5_5k'] || k['5vs5_5k'] || 0)),
                    '10k': k['5v5-10k'] !== undefined ? k['5v5-10k'] : (k['5vs5-10k'] !== undefined ? k['5vs5-10k'] : (k['5v5_10k'] || k['5vs5_10k'] || 0)),
                    '15k': k['5v5-15k'] !== undefined ? k['5v5-15k'] : (k['5vs5-15k'] !== undefined ? k['5vs5-15k'] : (k['5v5_15k'] || k['5vs5_15k'] || 0)),
                    '25k': k['5v5-25k'] !== undefined ? k['5v5-25k'] : (k['5vs5-25k'] !== undefined ? k['5vs5-25k'] : (k['5v5_25k'] || k['5vs5_25k'] || 0)),
                    '50k': k['5v5-50k'] !== undefined ? k['5v5-50k'] : (k['5vs5-50k'] !== undefined ? k['5vs5-50k'] : (k['5v5_50k'] || k['5vs5_50k'] || 0))
                },
                '1v1': {
                    '5k': k['1v1-5k'] !== undefined ? k['1v1-5k'] : (k['1vs1-5k'] !== undefined ? k['1vs1-5k'] : (k['1v1_5k'] || k['1vs1_5k'] || 0)),
                    '10k': k['1v1-10k'] !== undefined ? k['1v1-10k'] : (k['1vs1-10k'] !== undefined ? k['1vs1-10k'] : (k['1v1_10k'] || k['1vs1_10k'] || 0)),
                    '15k': k['1v1-15k'] !== undefined ? k['1v1-15k'] : (k['1vs1-15k'] !== undefined ? k['1vs1-15k'] : (k['1v1_15k'] || k['1vs1_15k'] || 0)),
                    '25k': k['1v1-25k'] !== undefined ? k['1v1-25k'] : (k['1vs1-25k'] !== undefined ? k['1vs1-25k'] : (k['1v1_25k'] || k['1vs1_25k'] || 0)),
                    '50k': k['1v1-50k'] !== undefined ? k['1v1-50k'] : (k['1vs1-50k'] !== undefined ? k['1vs1-50k'] : (k['1v1_50k'] || k['1vs1_50k'] || 0))
                },
                'tournament': {
                    'pass': k['tournament'] !== undefined ? k['tournament'] : (k['tour'] || 0)
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