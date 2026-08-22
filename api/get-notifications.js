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

        // orderBy ကို ဖြုတ်ပြီး .get() လုပ်မည် (Index လိုတော့ပါဘူး)
        const snapshot = await db.collection('notifications')
            .where('userId', '==', userId)
            .get();

        const notifications = [];
        snapshot.forEach(doc => {
            notifications.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // JavaScript ဘက်ကနေ createdAt အသစ်ဆုံးကို အပေါ်တင်ပြီး Sort လုပ်မည်
        notifications.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
        });

        return res.status(200).json({ 
            success: true, 
            notifications: notifications 
        });

    } catch (error) {
        console.error("Fetch Notifications Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};