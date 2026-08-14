const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    }) 
  : getApps()[0];

const db = getFirestore(app);

function generateUniqueUserId() {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AURA-${randomStr}`;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    try {
        // req.body ထဲမှ name ကိုပါ ထည့်သွင်းလက်ခံခြင်း
        const { name, phone, pin, deviceId } = req.body;

        if (!name || !phone || !pin || !deviceId) {
            return res.status(400).json({ success: false, message: "Name, Phone, PIN, and Device ID are required" });
        }

        const userId = generateUniqueUserId();

        // မြန်မာစံတော်ချိန် (Yangon Time - UTC+6:30) သို့ ပြောင်းလဲခြင်း
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const yangonTime = new Date(utc + (3600000 * 6.5));

        // Format: 14-8-2026
        const dateStr = `${yangonTime.getDate()}-${yangonTime.getMonth() + 1}-${yangonTime.getFullYear()}`;
        
        // Format: 2:28 pm
        let hours = yangonTime.getHours();
        const minutes = yangonTime.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12; // 12-hour format
        const timeStr = `${hours}:${minutes} ${ampm}`;

        const userData = {
            userId: userId,
            name: name,
            phone: phone,
            pin: pin,
            deviceId: deviceId,
            date: dateStr,      // သိမ်းဆည်းမည့် Date
            time: timeStr,      // သိမ်းဆည်းမည့် Time
            createdAt: new Date().toISOString() // Sorting အတွက်မူရင်း အချိန်
        };

        await db.collection('users').doc(userId).set(userData);
        return res.status(200).json({ 
            success: true, 
            message: "User created successfully", 
            userId: userId 
        });

    } catch (error) {
        console.error("Error creating user ID:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};