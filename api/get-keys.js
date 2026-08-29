const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    }) 
  : getApps()[0];

const db = getFirestore(app);

module.exports = async function handler(req, res) {
    // 1. Handle GET: Fetch User Keys
    if (req.method === 'GET') {
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
            const k = userData.keys || {};

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

            return res.status(200).json({ success: true, keys: keys });

        } catch (error) {
            console.error("Fetch Keys Error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    // 2. Handle POST: Process Refund and Deduct Keys
    if (req.method === 'POST') {
        try {
            const { userId, mode, type, qty } = req.body;

            if (!userId || !mode || !type || typeof qty !== 'number' || qty <= 0) {
                return res.status(400).json({ success: false, message: "Invalid refund parameters" });
            }

            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const userData = userDoc.data();
            const k = userData.keys || {};

            // ညီမရဲ့ Database key ပုံစံအတိုင်း Field နာမည်ဖန်တီးခြင်း (ဥပမာ: '5v5-5k' သို့မဟုတ် 'tournament')
            const dbKeyName = mode === 'tournament' ? 'tournament' : `${mode}-${type}`;
            const currentQty = k[dbKeyName] !== undefined ? k[dbKeyName] : (k[mode === 'tournament' ? 'tour' : `${mode}_${type}`] || 0);

            if (currentQty < qty) {
                return res.status(400).json({ success: false, message: "Insufficient keys for refund" });
            }

            // Firestore FieldValue ကိုသုံးပြီး လုံခြုံစွာ နှုတ်ခြင်း
            await userRef.update({
                [`keys.${dbKeyName}`]: FieldValue.increment(-qty)
            });

            return res.status(200).json({ success: true, message: "Refund processed successfully" });

        } catch (error) {
            console.error("Refund Error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
};