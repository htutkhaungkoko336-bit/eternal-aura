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

        // ၁။ ဤ Device တွင် အခြားဖုန်းနံပါတ်ဖြင့် အကောင့်ရှိပြီးသားလား စစ်ဆေးခြင်း (Device တစ်ခုလျှင် ဖုန်း (1) ခုသာ)
        const deviceCheckSnapshot = await usersRef.where('deviceId', '==', deviceId).get();
        let hasOtherPhoneOnThisDevice = false;
        deviceCheckSnapshot.forEach(doc => {
            if (doc.data().phone !== phone) {
                hasOtherPhoneOnThisDevice = true;
            }
        });

        if (hasOtherPhoneOnThisDevice && !name && !pin) {
            const phoneCheck = await usersRef.where('phone', '==', phone).get();
            if (phoneCheck.empty) {
                return res.status(400).json({ 
                    success: false, 
                    message: "This device is already bound to another phone number." 
                });
            }
        }

        // ၂။ ဖုန်းနံပါတ် Database ထဲတွင် ရှိမရှိ စစ်ဆေးခြင်း
        const snapshot = await usersRef.where('phone', '==', phone).get();

        // -------------------------------------------------------------
        // (က) ဖုန်းနံပါတ် မရှိသေးပါက (အကောင့်အသစ် Register လုပ်ရန်)
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
                deviceId: deviceId, // ပထမဆုံး Register လုပ်တဲ့ Original Device ID ကို အမြဲတမ်း အတည်အဖြစ် သိမ်းမည်
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

        // ပထမဆုံး Register လုပ်ထားတဲ့ Original Device နဲ့ တူမှသာ Password မလိုဘဲ တန်းဝင်ခွင့်ပေးမည်
        if (userData.deviceId === deviceId) {
            return res.status(200).json({ 
                success: true, 
                message: "Original device matched. Login successful", 
                name: userData.name 
            });
        }

        // -------------------------------------------------------------
        // (ဂ) DEVICE မတူတော့ပါက (Original Device မဟုတ်တော့ပါက)
        // -------------------------------------------------------------
        // PIN မပါသေးဘူးဆိုရင် PIN တောင်းဖို့ Front-end ကို အချက်ပြမည်
        if (!pin) {
            return res.status(200).json({ 
                requiresPassword: true, 
                message: "Different device detected. Please enter PIN." 
            });
        }

        // ပေးပို့လာသော PIN မှန်မမှန် စစ်ဆေးခြင်း
        const isPasswordValid = bcrypt.compareSync(pin, userData.pin);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Incorrect PIN. Access denied." });
        }

        // PIN မှန်ကန်ပါက ဝင်ခွင့်ပေးမည်ဖြစ်ပြီး၊ Original Device ID ကို **လုံးဝ (လုံးဝ) မပြောင်းလဲဘဲ** အစောကအတိုင်း ဆက်ထားမည်။ 
        // (ထို့ကြောင့် ဤ Device အသစ်ဖြင့် နောင်လာမည့်အကြိမ်များတွင်လည်း PIN ထပ်တောင်းနေဦးမည် ဖြစ်သည်)

        return res.status(200).json({ 
            success: true, 
            message: "Login successful on another device with PIN", 
            name: userData.name 
        });

    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};