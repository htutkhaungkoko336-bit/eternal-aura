// ဥပမာ - Serverless function ကို the user's keys ဆွဲထုတ်ရန်
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = getApps().length === 0 ? initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
}) : getApps()[0];

const db = getFirestore(app);

module.exports = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ success: false, message: 'Missing userId' });

        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userData = userDoc.data();
        return res.status(200).json({
            success: true,
            keys: userData.keys || {} // Database ထဲက keys map ကို ပို့ပေးခြင်း
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};