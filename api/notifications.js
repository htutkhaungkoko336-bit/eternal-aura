const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Firebase Admin SDK ကို Vercel Environment မှာ တစ်ကြိမ်သာ Initialize လုပ်ရန်
if (!admin.apps.length) {
    try {
        // Environment Variable ရှိမရှိ အရင်စစ်ဆေးခြင်း
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            console.error("FIREBASE_SERVICE_ACCOUNT is missing in environment variables!");
        }
    } catch (error) {
        console.error("Firebase Admin Initialization Error:", error);
    }
}

module.exports = async function handler(req, res) {
    try {
        const db = getFirestore();
        const notifsRef = db.collection('notifications');

        if (req.method === 'GET') {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required" });
            }

            const snapshot = await notifsRef.where('userId', '==', userId).get();
            let notifications = [];
            
            snapshot.forEach(doc => {
                notifications.push({ id: doc.id, ...doc.data() });
            });

            notifications.sort((a, b) => b.createdAt - a.createdAt);

            return res.status(200).json({ success: true, notifications });
        }

        if (req.method === 'POST') {
            const { userId, title, message, dateStr, timeStr } = req.body;
            if (!userId || !title || !message) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            const newNoti = {
                userId,
                title,
                message,
                dateStr: dateStr || "",
                timeStr: timeStr || "",
                isRead: false,
                createdAt: Date.now()
            };

            const docRef = await notifsRef.add(newNoti);

            return res.status(200).json({ success: true, id: docRef.id, message: "Notification saved successfully" });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });

    } catch (error) {
        console.error("API Server Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};