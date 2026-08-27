// /api/notifications.js (Backend API Endpoint)
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Firebase Admin SDK ကို Vercel Environment မှာ တစ်ကြိမ်သာ Initialize လုပ်ရန်
if (!admin.apps.length) {
    try {
        // Vercel Environment Variables ထဲက JSON string ကို ပြန်ဖတ်ခြင်း
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error("Firebase Admin Initialization Error:", error);
    }
}

module.exports = async function handler(req, res) {
    try {
        const db = getFirestore();
        const notifsRef = db.collection('notifications');

        // GET: User တစ်ယောက်ရဲ့ Notification တွေ အားလုံးကို လှမ်းတောင်းတဲ့အခါ
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

            // အသစ်ဆုံး Notification တွေ အပေါ်ဆုံးရောက်အောင် အချိန်အလိုက် စီပေးခြင်း (createdAt ကြီးစဉ်ငယ်လိုက်)
            notifications.sort((a, b) => b.createdAt - a.createdAt);

            return res.status(200).json({ success: true, notifications });
        }

        // POST: Notification အသစ် တစ်ခုခုဝင်လာလို့ Database ထဲ သိမ်းတဲ့အခါ
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
                createdAt: Date.now() // အချိန်အလိုက် စီဖို့အတွက်
            };

            const docRef = await notifsRef.add(newNoti);

            return res.status(200).json({ success: true, id: docRef.id, message: "Notification saved successfully" });
        }

        // အကယ်၍ အခြား Method များ ဝင်လာပါက
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });

    } catch (error) {
        console.error("API Server Error:", error);
        // HTML မဟုတ်ဘဲ JSON သက်သက် သေချာပြန်ပေးခြင်းဖြင့် Frontend တွင် SyntaxError တက်ခြင်းကို ကာကွယ်ပေးသည်
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};