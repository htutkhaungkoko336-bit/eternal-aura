const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Firebase Admin SDK ကို လုံခြုံစွာ Initialize လုပ်ခြင်း
function initFirebaseAdmin() {
    if (admin.apps && admin.apps.length > 0) {
        return admin.apps[0];
    }
    
    const envVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!envVar) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT is missing in environment variables!");
    }

    const serviceAccount = JSON.parse(envVar);
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

module.exports = async function handler(req, res) {
    try {
        initFirebaseAdmin();
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