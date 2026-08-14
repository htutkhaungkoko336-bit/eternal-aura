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

        // ၁။ ယခု လက်ရှိ Device ID ဖြင့် အခြားဖုန်းနံပါတ်တစ်ခုခုကို Register လုပ်ပြီးသား ရှိနှင့်ပြီးပြီလား စစ်ဆေးခြင်း
        const deviceCheckSnapshot = await usersRef.where('deviceId', '==', deviceId).get();
        
        let existingUserOnThisDevice = null;
        deviceCheckSnapshot.forEach(doc => {
            const data = doc.data();
            // ဒီ Device မှာ အခြားဖုန်းနံပါတ်နဲ့ ရှိနေပြီးသားလား (ထည့်သွင်းလာတဲ့ phone နဲ့ မတူဘဲ တစ်ခြားဖုန်းဖြစ်နေရင်)
            if (data.phone !== phone) {
                existingUserOnThisDevice = data;
            }
        });

        // အကယ်၍ ဒီ Device မှာ အခြားဖုန်းနံပါတ်နဲ့ Register လုပ်ထားပြီးသား ရှိနေရင် အသစ်လုပ်ခွင့် လုံးဝမပေးပါ
        if (existingUserOnThisDevice && !name && !pin) {
            // ဒါက ဖုန်းအသစ်နဲ့ အသစ်လာလုပ်တာကို တားဆီးတာဖြစ်ပါတယ်
            // (သို့သော် အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း PIN နဲ့ ဝင်ခွင့်ကိုတော့ စစ်ဆေးပေးပါမယ်)
        }

        // ၂။ သုံးစွဲသူ ရိုက်ထည့်လိုက်တဲ့ ဖုန်းနံပါတ် Database ထဲမှာ ရှိမရှိ စစ်ဆေးခြင်း
        const snapshot = await usersRef.where('phone', '==', phone).get();

        // -------------------------------------------------------------
        // (က) ဖုန်းနံပါတ် မရှိသေးပါက (အကောင့်အသစ် Register လုပ်ရန်)
        // -------------------------------------------------------------
        if (snapshot.empty) {
            // အဓိက စည်းကမ်းချက် - ဤ Device တွင် အခြားဖုန်းနံပါတ်ဖြင့် အကောင့်ရှိပြီးသားဆိုလျှင် အသစ်ထပ်လုပ်ခွင့်မပေးပါ
            if (!deviceCheckSnapshot.empty) {
                let hasOtherPhone = false;
                deviceCheckSnapshot.forEach(doc => {
                    if (doc.data().phone !== phone) hasOtherPhone = true;
                });

                if (hasOtherPhone) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "This device is already registered with another phone number. You cannot create a new account here." 
                    });
                }
            }

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
        // (ခ) ဖုန်းနံပါတ် ရှိပြီးသားဖြစ်ပါက (Login ဝင်ရန်)
        // -------------------------------------------------------------
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Device ID လည်း တူနေရင် Password တောင် မလိုဘဲ တန်းဝင်ခွင့်ပေးမည် (Auto Login)
        if (userData.deviceId === deviceId) {
            return res.status(200).json({ 
                success: true, 
                message: "Device matched. Login successful", 
                name: userData.name 
            });
        }

        // Device ID မတူတော့ဘူး (ဒါပေမဲ့ ဒီဖုန်းနံပါတ်ပိုင်ရှင်က ဒီ Device ကနေ ဝင်ချင်တာဖြစ်လို့ PIN တောင်းမည်)
        if (!pin) {
            return res.status(200).json({ 
                requiresPassword: true, 
                message: "Device changed. Please enter PIN." 
            });
        }

        // ပေးပို့လာသော PIN မှန်မမှန် စစ်ဆေးခြင်း
        const isPasswordValid = bcrypt.compareSync(pin, userData.pin);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Incorrect PIN. Access denied." });
        }

        // PIN မှန်ကန်ပါက ဤ Device အသစ်အတွက် Device ID ကို Update လုပ်ပေးပြီး ဝင်ခွင့်ပေးမည်
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