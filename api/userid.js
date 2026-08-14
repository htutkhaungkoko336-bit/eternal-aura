const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const bcrypt = require('bcryptjs');

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
        const { action, name, phone, pin, deviceId } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('phone', '==', phone).get();

        // -------------------------------------------------------------
        // CASE 1: အကယ်၍ ဖုန်းနံပါတ် ရှိနှင့်ပြီးသားဆိုလျှင် (Login / Check Device)
        // -------------------------------------------------------------
        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const userData = userDoc.data();

            // Device ID တူနေလျှင် Auto Login ဝင်ခွင့်ပေးမည်
            if (userData.deviceId === deviceId) {
                return res.status(200).json({ 
                    success: true, 
                    message: "Auto login successful", 
                    userId: userData.userId,
                    name: userData.name
                });
            }

            // Device ID မတူလျှင် PIN တောင်းရန် အချက်ပြမည်
            if (!pin) {
                return res.status(200).json({ 
                    requiresPassword: true, 
                    message: "New device detected. Please enter your PIN." 
                });
            }

            // PIN တိုက်စစ်ခြင်း
            const isPasswordValid = bcrypt.compareSync(pin, userData.pin);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: "Incorrect PIN. Access denied." });
            }

            // Device ID အသစ်ကို Update လုပ်မည်
            await usersRef.doc(userData.userId).update({ deviceId: deviceId });

            return res.status(200).json({ 
                success: true, 
                message: "Login successful with new device", 
                userId: userData.userId,
                name: userData.name
            });
        }

        // -------------------------------------------------------------
        // CASE 2: ဖုန်းနံပါတ် မရှိသေးပါက (Register အသစ်လုပ်ရန် Name နှင့် PIN လိုအပ်သည်)
        // -------------------------------------------------------------
        if (!name || !pin || !deviceId) {
            return res.status(200).json({ 
                requiresRegistration: true, 
                message: "User not found. Please provide name and PIN for registration." 
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPin = bcrypt.hashSync(pin, salt);
        const userId = generateUniqueUserId();

        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const yangonTime = new Date(utc + (3600000 * 6.5));

        const dateStr = `${yangonTime.getDate()}-${yangonTime.getMonth() + 1}-${yangonTime.getFullYear()}`;
        let hours = yangonTime.getHours();
        const minutes = yangonTime.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;
        const timeStr = `${hours}:${minutes} ${ampm}`;
        const createdAtStr = `${dateStr}     ${timeStr}`;

        const newUserData = {
            userId: userId,
            name: name,
            phone: phone,
            pin: hashedPin,
            deviceId: deviceId,
            createdAt: createdAtStr
        };

        await usersRef.doc(userId).set(newUserData);

        return res.status(200).json({ 
            success: true, 
            message: "User registered successfully", 
            userId: userId,
            name: name
        });

    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};