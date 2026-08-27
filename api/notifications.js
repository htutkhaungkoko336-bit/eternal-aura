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
        const notifsRef = db.collection('notifications');

        // 1. GET: Notification တွေ လှမ်းဆွဲထုတ်ရန်
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

        // 2. POST: Notification အသစ် သိမ်းဆည်းရန်
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

        // 3. PATCH: Notification တစ်ခုချင်းစီကို Read (ဖတ်ပြီးသား) အဖြစ်ပြောင်းရန်
        if (req.method === 'PATCH') {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ success: false, message: "Notification ID is required" });
            }

            await notifsRef.doc(id).update({ isRead: true });
            return res.status(200).json({ success: true, message: "Marked as read successfully" });
        }

        // 4. DELETE: Notification ကို Database ထဲကနေ ဖျက်ရန်
        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ success: false, message: "Notification ID is required" });
            }

            await notifsRef.doc(id).delete();
            return res.status(200).json({ success: true, message: "Notification deleted successfully" });
        }

        res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });

    } catch (error) {
        console.error("API Server Error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};