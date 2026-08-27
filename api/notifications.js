// ဥပမာ - /api/notifications.js (Backend API Endpoint)
const { getFirestore } = require('firebase-admin/firestore');
// (Firebase app ကို အပေါ်က ညီမရဲ့ code ထဲကအတိုင်း initialize လုပ်ပြီးသားလို့ ယူဆပါတယ်)

module.exports = async function handler(req, res) {
    const db = getFirestore();
    const notifsRef = db.collection('notifications');

    // GET: User တစ်ယောက်ရဲ့ Notification တွေ အားလုံးကို လှမ်းတောင်းတဲ့အခါ
    if (req.method === 'GET') {
        try {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required" });
            }

            const snapshot = await notifsRef.where('userId', '==', userId).get();
            let notifications = [];
            
            snapshot.forEach(doc => {
                notifications.push({ id: doc.id, ...doc.data() });
            });

            // အသစ်ဆုံး Notification တွေ အပေါ်ဆုံးရောက်အောင် အချိန်အလိုက် စီပေးနိုင်ပါတယ် (သို့မဟုတ် database query မှာ orderBy သုံးနိုင်)
            return res.status(200).json({ success: true, notifications });
        } catch (error) {
            console.error("Fetch Noti Error:", error);
            return res.status(500).json({ success: false, message: "Server Error" });
        }
    }

    // POST: Notification အသစ် တစ်ခုခုဝင်လာလို့ Database ထဲ သိမ်းတဲ့အခါ
    if (req.method === 'POST') {
        try {
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
                createdAt: Date.now() // အချိန်အလိုက် စီဖို့အတွက်
            };

            const docRef = await notifsRef.add(newNoti);

            return res.status(200).json({ success: true, id: docRef.id, message: "Notification saved successfully" });
        } catch (error) {
            console.error("Save Noti Error:", error);
            return res.status(500).json({ success: false, message: "Server Error" });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
};