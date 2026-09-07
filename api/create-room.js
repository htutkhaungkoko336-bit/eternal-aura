const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    }) 
  : getApps()[0];

const db = getFirestore(app);

// မြန်မာစံတော်ချိန် ရယူရန် Helper Function
function getYangonTimeStr() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const yangonTime = new Date(utc + (3600000 * 6.5));
    const dateStr = `${yangonTime.getDate()}-${yangonTime.getMonth() + 1}-${yangonTime.getFullYear()}`;
    let hours = yangonTime.getHours();
    const minutes = yangonTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${dateStr}    ${hours}:${minutes} ${ampm}`;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    try {
        const { userId, roomTitle, targetMode, targetKeyType, boType } = req.body;

        if (!userId || !targetMode || !targetKeyType) {
            return res.status(400).json({ success: false, message: "Missing required fields (userId, targetMode, targetKeyType)" });
        }

        const usersRef = db.collection('users');
        const roomsRef = db.collection('active_rooms');

        // ၁။ User ရှိမရှိ နှင့် Key လက်ကျန် စစ်ဆေးခြင်း
        const userDocRef = usersRef.doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userData = userDoc.data();
        const userKeys = userData.keys || {};
        
        // keyType များကို ချိန်ကိုက်ရန် (ဥပမာ: "5vs5-50k" သို့မဟုတ် "50k")
        // Frontend ပို့ပုံပေါ်မူတည်၍ key format ကို ညှိပေးနိုင်သည်
        const keyStoreKey = `${targetMode}-${targetKeyType}`; 
        const currentKeyCount = userKeys[keyTypeFinder(userKeys, targetMode, targetKeyType)] ?? userKeys[targetKeyType] ?? 0;

        // အကယ်၍ Key မလုံလောက်ပါက (လောလောဆယ် key စစ်ဆေးမှုကို လိုသလို ဖြုတ်/ထည့် လုပ်နိုင်သည်)
        // if (currentKeyCount <= 0) {
        //     return res.status(400).json({ success: false, message: "Key မလုံလောက်ပါ။" });
        // }

        // ၂။ ညီမပြထားတဲ့ ပုံစံအတိုင်း Mode အလိုက် registration collection ကို ရှာမည်
        // ဥပမာ - 5vs5 ဆိုရင် "5vs5_registrations"
        const regCollectionName = `${targetMode}_registrations`;
        const regSnapshot = await db.collection(regCollectionName).get();

        let registeredTeamName = userData.name || 'Player';
        let registeredLogo = userData.photoURL || 'FrontLogo.jpg';
        let isFoundRegistration = false;

        // Document တစ်ခုချင်းစီထဲမှာ User ID (ဥပမာ field name က id ဖြစ်နေတာကို တွေ့ရပါတယ်) နဲ့ 
        // ဝင်ထားတဲ့ keyType (ဥပမာ fee သို့မဟုတ် gold/jungle စသည့် map ထဲက data) ကို စစ်ဆေးခြင်း
        regSnapshot.forEach(doc => {
            const regData = doc.data();
            
            // ဥပမာ - ဒီ doc ထဲမှာ user ရဲ့ id ပါမပါ နှင့် keyType နဲ့ ကိုက်ညီမှုရှိမရှိ စစ်ဆေးခြင်း
            // ညီမပြထားတဲ့ screenshot အရ fee (သို့) gold စတဲ့ field တွေထဲမှာ id နဲ့ name တွေရှိနေတာကို တွေ့ရပါတယ်
            for (let key in regData) {
                const subField = regData[key];
                if (subField && typeof subField === 'object' && subField.id === userId) {
                    // keyType (ဥပမာ 50K) နဲ့ တူမတူ စစ်ဆေးရန် (fee field ကို စစ်ဆေးခြင်း)
                    if (regData.fee && regData.fee.toUpperCase() === targetKeyType.toUpperCase()) {
                        isFoundRegistration = true;
                        if (regData.name) registeredTeamName = regData.name;
                        if (regData.logo) registeredLogo = regData.logo;
                    }
                }
            }
        });

        // ၃။ အကယ်၍ registration ထဲမှာ ရှာမတွေ့ရင်တောင် User ရဲ့ profile ထဲက နာမည်/ပုံကို ယူသုံးမည်
        // ဒါမှမဟုတ် registration မရှိရင် Room ထောင်ခွင့်မပေးချင်ရင် ဒီမှာ error ထုတ်လို့ရပါတယ်

        // ၄။ Key ကို ၁ ခု နှုတ်ယူခြင်း (လက်ကျန်ရှိမှ နှုတ်မည်)
        const matchedKeyName = Object.keys(userKeys).find(k => k.toLowerCase().includes(targetKeyType.toLowerCase()) && k.toLowerCase().includes(targetMode.toLowerCase()));
        if (matchedKeyName && userKeys[matchedKeyName] > 0) {
            userKeys[matchedKeyName] -= 1;
            await userDocRef.update({ keys: userKeys });
        }

        // ၅။ active_rooms collection အသစ်ထဲတွင် ဤ userId ကို Document ID အဖြစ် အသုံးပြု၍ Host အဖြစ် သိမ်းဆည်းခြင်း
        const roomData = {
            hostId: userId,
            teamName: registeredTeamName,   // Registration ထဲက Team Name (သို့မဟုတ် User နာမည်)
            teamLogo: registeredLogo,       // Registration ထဲက Logo
            roomTitle: roomTitle || `${targetMode} Room`,
            mode: targetMode,
            keyType: targetKeyType,
            boType: boType || 'BO1',
            status: 'waiting', 
            createdAt: getYangonTimeStr()
        };

        await roomsRef.doc(userId).set(roomData);

        return res.status(200).json({ 
            success: true, 
            message: "Room successfully created and hosted", 
            roomData: roomData 
        });

    } catch (error) {
        console.error("Create Room Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Helper for finding key in object
function keyTypeFinder(keysObj, mode, type) {
    for (let k in keysObj) {
        if (k.toLowerCase().includes(mode.toLowerCase()) && k.toLowerCase().includes(type.toLowerCase())) {
            return k;
        }
    }
    return type;
}