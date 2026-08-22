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
        // ၁။ GET Method (Notification များကို လှမ်းဆွဲယူရန်)
        if (req.method === 'GET') {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required" });
            }

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

            // createdAt အသစ်ဆုံးကို အပေါ်တင်ပြီး Sort လုပ်ခြင်း
            notifications.sort((a, b) => {
                const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return timeB - timeA;
            });

            return res.status(200).json({ 
                success: true, 
                notifications: notifications 
            });
        }

        // ၂။ POST Method (Notification ကို ဖျက်ရန်)
        if (req.method === 'POST') {
            const { notificationId } = req.body;

            if (!notificationId) {
                return res.status(400).json({ success: false, message: "Notification ID is required" });
            }

            await db.collection('notifications').doc(notificationId).delete();
            
            return res.status(200).json({ 
                success: true, 
                message: "Notification deleted successfully" 
            });
        }

        // အခြား Method များအတွက်
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });

    } catch (error) {
        console.error("Notifications API Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};