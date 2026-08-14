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
        const { name, phone, pin, deviceId } = req.body;

        // name ပါ ထည့်စစ်ဆေးမည်
        if (!name || !phone || !pin || !deviceId) {
            return res.status(400).json({ success: false, message: "Name, Phone, PIN, and Device ID are required" });
        }

        const userId = generateUniqueUserId();
        const time = new Date().toISOString();

        const userData = {
            userId: userId,
            name: name,
            phone: phone,
            pin: pin,
            deviceId: deviceId,
            time: time,
            updatedAt: time
        };

        await db.collection('users').doc(userId).set(userData);

        return res.status(200).json({ 
            success: true, 
            message: "User registered successfully", 
            userId: userId 
        });

    } catch (error) {
        console.error("Error creating user ID:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};