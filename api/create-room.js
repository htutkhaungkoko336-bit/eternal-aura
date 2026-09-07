const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    }) 
  : getApps()[0];

const db = getFirestore(app);

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

        // ၁။ User ရှိမရှိ စစ်ဆေးခြင်း
        const userDocRef = usersRef.doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userData = userDoc.data();
        let registeredTeamName = userData.name || 'Player';
        let registeredLogo = userData.photoURL || userData.avatar || 'FrontLogo.jpg';

        // ၂. ညီမတောင်းဆိုထားတဲ့အတိုင်း Registration Collection ထဲမှာ လိုက်ရှာခြင်း
        // ဥပမာ - 5v5 ဆိုရင် "5v5_registrations" သို့မဟုတ် "5vs5_registrations"
        const normalizedMode = targetMode.toLowerCase().replace('v', 'vs'); // 5v5 -> 5vs5
        const regCollectionName = `${normalizedMode}_registrations`;
        
        try {
            const regSnapshot = await db.collection(regCollectionName).get();
            
            regSnapshot.forEach(doc => {
                const regData = doc.data();
                // Registration ထဲက field တစ်ခုချင်းစီကို စစ်ဆေးခြင်း
                for (let key in regData) {
                    const subField = regData[key];
                    if (subField && typeof subField === 'object' && subField.id === userId) {
                        // Key Type (ဥပမာ 50k) နဲ့ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးခြင်း
                        if (regData.fee && regData.fee.toUpperCase() === targetKeyType.toUpperCase()) {
                            if (regData.name) registeredTeamName = regData.name;
                            if (regData.logo) registeredLogo = regData.logo;
                        }
                    }
                }
            });
        } catch (err) {
            console.log("Registration collection not found or error:", err);
        }

        // ၃။ Key များကို နှုတ်ယူခြင်း
        const userKeys = userData.keys || {};
        const matchedKeyName = Object.keys(userKeys).find(k => k.toLowerCase().includes(targetKeyType.toLowerCase()) && k.toLowerCase().includes(targetMode.toLowerCase()));
        
        if (matchedKeyName && userKeys[matchedKeyName] > 0) {
            userKeys[matchedKeyName] -= 1;
            await userDocRef.update({ keys: userKeys });
        }

        // ၄။ active_rooms ထဲတွင် userId ကို doc id အဖြစ် သိမ်းဆည်းခြင်း
        const roomData = {
            hostId: userId,
            teamName: registeredTeamName,   // Registration ထဲက ရလာတဲ့ Team Name
            teamLogo: registeredLogo,       // Registration ထဲက ရလာတဲ့ Logo
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
            message: "Room successfully created", 
            roomData: roomData 
        });

    } catch (error) {
        console.error("Create Room Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};