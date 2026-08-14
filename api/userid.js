const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const bcrypt = require('bcryptjs'); // PIN hashing အတွက်

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
        const { name, phone, pin, deviceId } = req.body;

        if (!name || !phone || !pin || !deviceId) {
            return res.status(400).json({ success: false, message: "Name, Phone, PIN, and Device ID are required" });
        }

        // PIN ကို Hash လုပ်ခြင်း
        const salt = bcrypt.genSaltSync(10);
        const hashedPin = bcrypt.hashSync(pin, salt);

        const userId = generateUniqueUserId();

        // မြန်မာစံတော်ချိန် (Yangon Time - UTC+6:30) ယူခြင်း
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const yangonTime = new Date(utc + (3600000 * 6.5));

        // Date Format: 14-8-2026
        const dateStr = `${yangonTime.getDate()}-${yangonTime.getMonth() + 1}-${yangonTime.getFullYear()}`;
        
        // Time Format: 2:34 pm
        let hours = yangonTime.getHours();
        const minutes = yangonTime.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;
        const timeStr = `${hours}:${minutes} ${ampm}`;

        // Date နဲ့ Time ကို createdAt တစ်ခုတည်းထဲ ပေါင်းထည့်ခြင်း
        const createdAtStr = `${dateStr}     ${timeStr}`;

        const userData = {
            userId: userId,
            name: name,
            phone: phone,
            pin: hashedPin,
            deviceId: deviceId,
            createdAt: createdAtStr // <--- လိုချင်တဲ့ ပုံစံအတိုင်း ပေါင်းပြီးသား ဝင်မည်
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