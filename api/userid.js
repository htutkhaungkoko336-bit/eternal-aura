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
        const { phone, deviceId, name, pin } = req.body;

        if (!phone || !deviceId) {
            return res.status(400).json({ success: false, message: "Phone and Device ID are required" });
        }

        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('phone', '==', phone).get();

        // -------------------------------------------------------------
        // ၁။ ဖုန်းနံပါတ် မရှိသေးပါက (User အသစ် - Register)
        // -------------------------------------------------------------
        if (snapshot.empty) {
            if (!name || !pin) {
                return res.status(200).json({ 
                    requiresRegistration: true, 
                    message: "Phone not found. Please provide name and PIN." 
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
            const createdAtStr = `${dateStr}     ${hours}:${minutes} ${ampm}`;

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
                name: name 
            });
        }

        // -------------------------------------------------------------
        // ၂။ ဖုန်းနံပါတ် ရှိပြီးသားဖြစ်ပါက (User ဟောင်း)
        // -------------------------------------------------------------
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // (က) Device ID တူနေပါက Password မလိုဘဲ ဝင်ခွင့်ပေးမည် (Auto Login)
        if (userData.deviceId === deviceId) {
            return res.status(200).json({ 
                success: true, 
                message: "Device matched. Login successful", 
                name: userData.name 
            });
        }

        // (ခ) Device ID မတူတော့ပါက (ဖုန်းချိန်းထားပါက) Password (PIN) ပါ၀င်လာခြင်း ရှိမရှိ စစ်မည်
        if (!pin) {
            return res.status(200).json({ 
                requiresPassword: true, 
                message: "Device changed. Please enter PIN." 
            });
        }

        // (ဂ) ပေးပို့လာသော PIN မှန်မမှန် စစ်ဆေးခြင်း
        const isPasswordValid = bcrypt.compareSync(pin, userData.pin);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Incorrect PIN. Access denied." });
        }

        // PIN မှန်ကန်ပါက Device ID အသစ်သို့ Update လုပ်ပေးပြီး ဝင်ခွင့်ပေးမည်
        await usersRef.doc(userData.userId).update({ deviceId: deviceId });

        return res.status(200).json({ 
            success: true, 
            message: "Login successful with PIN on new device", 
            name: userData.name 
        });

    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};