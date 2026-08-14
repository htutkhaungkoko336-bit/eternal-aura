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
        const { name, phone, pin, deviceId } = req.body;

        if (!phone || !deviceId) {
            return res.status(400).json({ success: false, message: "Phone and Device ID are required" });
        }

        // ၁။ ဖုန်းနံပါတ်ဖြင့် Database ထဲတွင် အရင်ရှိနှင့်ပြီးသား User ရှိမရှိ ရှာခြင်း
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('phone', '==', phone).get();

        // -------------------------------------------------------------
        // A. အကယ်၍ အဆိုပါ ဖုန်းနံပါတ်ဖြင့် Register လုပ်ပြီးသား ရှိနှင့်ပြီးဆိုလျှင် (Login အနေဖြင့် စစ်မည်)
        // -------------------------------------------------------------
        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const userData = userDoc.data();

            // အခြေအနေ (က): ဖုန်းနံပါတ်လည်းတူ၊ Device ID လည်း တူနေလျှင် (Password မလိုဘဲ တန်းဝင်ခွင့်ပေးမည်)
            if (userData.deviceId === deviceId) {
                return res.status(200).json({ 
                    success: true, 
                    message: "Auto login successful", 
                    userId: userData.userId,
                    name: userData.name
                });
            }

            // အခြေအနေ (ခ): ဖုန်းနံပါတ်တူသော်လည်း Device ID မတူတော့လျှင် (Device ချိန်းထားခြင်းဖြစ်므로 Password - PIN တောင်းရမည်)
            if (!pin) {
                return res.status(401).json({ 
                    success: false, 
                    requiresPassword: true, 
                    message: "New device detected. Please enter your PIN." 
                });
            }

            // User ရိုက်ထည့်လိုက်သော PIN ကို Database ထဲမှ Hashed PIN နှင့် တိုက်စစ်ခြင်း
            const isPasswordValid = bcrypt.compareSync(pin, userData.pin);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: "Incorrect PIN. Access denied." });
            }

            // Password မှန်ကန်ပါက Device ID အသစ်ကို Database တွင် Update လုပ်ပေးခြင်း (Optional)
            await usersRef.doc(userData.userId).update({ deviceId: deviceId });

            return res.status(200).json({ 
                success: true, 
                message: "Login successful with new device", 
                userId: userData.userId,
                name: userData.name
            });
        }

        // -------------------------------------------------------------
        // B. အကယ်၍ ဖုန်းနံပါတ် အသစ်ဖြစ်နေလျှင် (Register အသစ်လုပ်မည်)
        // -------------------------------------------------------------
        if (!name || !pin) {
            return res.status(400).json({ success: false, message: "Name and PIN are required for registration" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPin = bcrypt.hashSync(pin, salt);
        const userId = generateUniqueUserId();

        // မြန်မာစံတော်ချိန် (Yangon Time - UTC+6:30) ယူခြင်း
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
            userId: userId 
        });

    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};