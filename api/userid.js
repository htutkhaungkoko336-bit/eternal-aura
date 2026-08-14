const admin = require('firebase-admin');

// Random user ID ဖန်တီးပေးသော function
function generateUniqueUserId() {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AURA-${randomStr}`;
}

// User အချက်အလက်များကို Firestore သို့ သိမ်းဆည်းပေးသော function
async function createUser(phone, pin, deviceId) {
    try {
        const db = admin.firestore();
        const userId = generateUniqueUserId();
        const time = new Date().toISOString();

        const userData = {
            userId: userId,
            phone: phone,
            pin: pin,
            deviceId: deviceId,
            time: time
        };

        // 'users' collection ထဲတွင် userId ကို Document ID အဖြစ် သိမ်းမည်
        await db.collection('users').doc(userId).set(userData);

        return { success: true, userId: userId };
    } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, error: error.message };
    }
}

// Vercel Serverless Function Endpoint
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { phone, pin, deviceId } = req.body;

        if (!phone || !pin || !deviceId) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // User အသစ်ဆောက်ပြီး Firestore ထဲ သိမ်းမည်
        const result = await createUser(phone, pin, deviceId);

        if (result.success) {
            return res.status(200).json({ success: true, userId: result.userId });
        } else {
            return res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};