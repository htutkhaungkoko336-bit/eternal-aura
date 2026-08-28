const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    }) 
  : getApps()[0];

const db = getFirestore(app);

module.exports = async function handler(req, res) {
    try {
        const usersRef = db.collection('users');

        // 1. GET: User ရဲ့ Key ဒေတာများကို Database မှ တိုက်ရိုက်ဆွဲထုတ်ရန်
        if (req.method === 'GET') {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required" });
            }

            const userDoc = await usersRef.doc(userId).get();
            if (!userDoc.exists) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const userData = userDoc.data();
            return res.status(200).json({ 
                success: true, 
                keys: userData.keys || {
                    modes: {
                        '5v5': { '5k': 0, '10k': 0, '15k': 0, '25k': 0, '50k': 0 },
                        '1v1': { '5k': 0, '10k': 0, '15k': 0, '25k': 0, '50k': 0 },
                        'tournament': { 'pass': 0 }
                    }
                } 
            });
        }

        // 2. POST: Key Refund လုပ်ခြင်း သို့မဟုတ် Database ထဲက Key ကို နှုတ်ယူရန်
        if (req.method === 'POST') {
            const { userId, mode, type, qty, kpayName, kpayPhone, action } = req.body;

            if (!userId || !mode || !type || !qty) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            const userDocRef = usersRef.doc(userId);
            const userDoc = await userDocRef.get();

            if (!userDoc.exists) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            let userData = userDoc.data();
            let keys = userData.keys || {
                modes: {
                    '5v5': { '5k': 0, '10k': 0, '15k': 0, '25k': 0, '50k': 0 },
                    '1v1': { '5k': 0, '10k': 0, '15k': 0, '25k': 0, '50k': 0 },
                    'tournament': { 'pass': 0 }
                }
            };

            if (action === 'refund') {
                if (!keys.modes[mode] || keys.modes[mode][type] < qty) {
                    return res.status(400).json({ success: false, message: "Key အရေအတွက် မလုံလောက်ပါ။" });
                }

                // Database ထဲမှာ Key ကို နှုတ်မည်
                keys.modes[mode][type] -= qty;

                // Refund ඉල්ලဆိုမှုကို သီးသန့် collection တစ်ခုထဲ သိမ်းဆည်းနိုင်သည်
                await db.collection('refund_requests').add({
                    userId,
                    mode,
                    type,
                    qty,
                    kpayName,
                    kpayPhone,
                    status: 'PENDING',
                    createdAt: Date.now()
                });

                // User ရဲ့ keys ကို Database တွင် Update လုပ်မည်
                await userDocRef.update({ keys });

                return res.status(200).json({ 
                    success: true, 
                    message: "Refund request successful", 
                    updatedKeys: keys 
                });
            }
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};