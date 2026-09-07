const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

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

        // ၁။ လိုအပ်သော ဒေတာများ ပါဝင်ခြင်း ရှိမရှိ စစ်ဆေးခြင်း
        if (!userId || !targetMode || !targetKeyType) {
            return res.status(400).json({ success: false, message: "Missing required fields (userId, targetMode, targetKeyType)" });
        }

        const usersRef = db.collection('users');
        const roomsRef = db.collection('active_rooms');

        // ၂။ User ရှိမရှိ နှင့် Key လက်ကျန် လုံလောက်မှု ရှိမရှိ စစ်ဆေးခြင်း
        const userDocRef = usersRef.doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userData = userDoc.data();
        const userKeys = userData.keys || {};
        
        // ယူမည့် Key အမျိုးအစား (ဥပမာ - "1vs1-5k သို့မဟုတ် tournament")
        const currentKeyCount = userKeys[targetKeyType] || 0;

        if (currentKeyCount <= 0) {
            return res.status(400).json({ success: false, message: "Key မလုံလောက်ပါ။ ကျေးဇူးပြု၍ Key ထပ်ဖြည့်ပါ။" });
        }

        // ၃။ User တွင် Room တစ်ခုခုပြီးသား (သို့မဟုတ် active ဖြစ်နေတာ) ရှိမရှိ စစ်ဆေးခြင်း ( விருப்பရှိလျှင် ထည့်ရန် )
        const existingRoom = await roomsRef.doc(userId).get();
        if (existingRoom.exists) {
            // ရှေ့က Room ဟောင်း ရှိနေသေးရင် ဖျက်ပေးခြင်း သို့မဟုတ် တားမြစ်ခြင်း
            await roomsRef.doc(userId).delete();
        }

        // ၄။ Key ကို ၁ ခု နှုတ်ယူခြင်း
        const updatedKeys = {
            ...userKeys,
            [targetKeyType]: currentKeyCount - 1
        };

        await userDocRef.update({
            keys: updatedKeys
        });

        // ၅။ Room အသစ်ကို တည်ဆောက်ပြီး Firestore သို့ သိမ်းဆည်းခြင်း
        const roomData = {
            hostId: userId,
            hostName: userData.name || 'Player',
            hostPhone: userData.phone || '',
            roomTitle: roomTitle || `${targetMode} Room`,
            mode: targetMode,
            keyType: targetKeyType,
            boType: boType || 'BO1',
            status: 'waiting', // waiting, playing, finished
            createdAt: getYangonTimeStr()
        };

        // User တစ်ဦးလျှင် Room တစ်ခု သတ်မှတ်ရန် userId ကို doc id အဖြစ်သုံးသည်
        await roomsRef.doc(userId).set(roomData);

        return res.status(200).json({ 
            success: true, 
            message: "Room successfully created", 
            roomData: roomData,
            remainingKeys: updatedKeys[targetKeyType]
        });

    } catch (error) {
        console.error("Create Room Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};