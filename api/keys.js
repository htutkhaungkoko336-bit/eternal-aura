const { getApps, initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

if (!getApps().length) {
    initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    });
}

const db = getFirestore();

module.exports = async function handler(req, res) {
    // GET method အတွက် (User ၏ Key များကို ဆွဲထုတ်ရန်)
    if (req.method === 'GET') {
        try {
            const { userId } = req.query;

            if (!userId || userId === 'undefined' || userId === 'null') {
                return res.status(400).json({ success: false, message: "Valid User ID is required" });
            }

            const userDoc = await db.collection('users').doc(userId).get();

            if (!userDoc.exists) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const userData = userDoc.data();
            const keys = userData.keys || {};

            return res.status(200).json({
                success: true,
                keys: keys
            });

        } catch (error) {
            console.error("Fetch Keys Error:", error);
            return res.status(500).json({ success: false, message: "Server Error" });
        }
    }

    // POST method အတွက် (Refund လုပ်ခြင်း သို့မဟုတ် Key Update လုပ်ခြင်း)
    else if (req.method === 'POST') {
        try {
            const { userId, mode, type, qty, kpayName, kpayPhone, action } = req.body;
            
            if (!userId || userId === 'undefined' || userId === 'null' || !mode || !type || !qty) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            const userDocRef = db.collection('users').doc(userId);
            const userDoc = await userDocRef.get();

            if (!userDoc.exists) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const userData = userDoc.data();
            let keys = userData.keys || {};

            // Firestore ထဲက key field နာမည်နှင့် ကိုက်ညီအောင် ချိန်ညှိခြင်း
            let dbKey = '';
            if (mode === '5v5') {
                if (type === '25k') dbKey = '5vs5_25k';
                else if (type === '50k') dbKey = '5vs5_50k';
                else dbKey = `5vs5-${type}`;
            } else if (mode === '1v1') {
                dbKey = `1vs1-${type}`;
            }

            if (action === 'refund') {
                const currentQty = keys[dbKey] || 0;
                if (currentQty < qty) {
                    return res.status(400).json({ success: false, message: 'Key ပမာဏ မလုံလောက်ပါ။' });
                }

                // Key ကို နုတ်ယူခြင်း
                keys[dbKey] = currentQty - qty;

                // Firestore ကို Update လုပ်ခြင်း
                await userDocRef.update({ keys });
            }

            return res.status(200).json({ 
                success: true, 
                message: 'Successfully processed',
                updatedKeys: keys 
            });

        } catch (error) {
            console.error('Process Key Action Error:', error);
            return res.status(500).json({ success: false, message: 'Server Error' });
        }
    }

    // အခြား Method များဝင်လာပါက
    else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }
};