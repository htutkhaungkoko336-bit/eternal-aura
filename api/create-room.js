const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

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

        // ၁။ User ID, Mode နှင့် Key Type ပါမပါ စစ်ဆေးခြင်း
        if (!userId || !targetMode || !targetKeyType) {
            return res.status(400).json({ success: false, message: "Missing required fields (userId, targetMode, targetKeyType)" });
        }

        const usersRef = db.collection('users');
        const userDoc = await usersRef.doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userData = userDoc.data();
        let teamName = userData.name || 'Player';
        let teamLogo = userData.photoURL || userData.avatar || 'FrontLogo.jpg';

        // ၂။ Mode ကိုစစ်ဆေးပြီး သက်ဆိုင်ရာ Registration Collection ကို ရွေးချယ်ခြင်း
        let regCollectionName = '';
        let gameModeKey = '';

        const lowerMode = targetMode.toLowerCase();
        if (lowerMode.includes('1v1') || lowerMode.includes('1vs1')) {
            regCollectionName = '1vs1_registrations';
            gameModeKey = `1vs1-${targetKeyType.toLowerCase()}`;
        } else if (lowerMode.includes('5v5') || lowerMode.includes('5vs5')) {
            regCollectionName = '5vs5_registrations';
            gameModeKey = `5vs5-${targetKeyType.toLowerCase()}`;
        } else if (lowerMode.includes('tournament')) {
            regCollectionName = 'tournament_registrations';
            gameModeKey = 'tournament';
        }

        if (regCollectionName) {
            // ၃။ userId ဖြင့် Registration စာရင်းများကို ရှာဖွေခြင်း
            const regSnapshot = await db.collection(regCollectionName)
                .where('userId', '==', userId)
                .get();

            let matchedReg = null;
            regSnapshot.forEach(doc => {
                const regData = doc.data();
                // fee (ဥပမာ '50K' သို့မဟုတ် '5k') တိုက်ဆိုင်စစ်ဆေးခြင်း
                if (regData.fee && regData.fee.toString().toUpperCase() === targetKeyType.toUpperCase()) {
                    matchedReg = regData;
                }
            });

            // ၄။ တွေ့ရှိပါက Registration ထဲက Name နဲ့ Logo ကို အစားထိုးယူမည်
            if (matchedReg) {
                if (lowerMode.includes('5v5') || lowerMode.includes('5vs5')) {
                    teamName = matchedReg.sqName || teamName;
                } else if (lowerMode.includes('tournament')) {
                    teamName = matchedReg.teamName || teamName;
                    teamLogo = matchedReg.teamLogo || matchedReg.teamLogoUrl || teamLogo;
                } else {
                    teamName = matchedReg.inGameName || teamName;
                }
                
                if (matchedReg.logo || matchedReg.paymentSlip) {
                    teamLogo = matchedReg.logo || matchedReg.paymentSlip;
                }
            }
        }

        // ၅။ active_rooms ထဲသို့ သိမ်းဆည်းခြင်း (userId ကို doc id အဖြစ်သုံးမည်)
        const roomData = {
            hostId: userId,
            teamName: teamName,
            teamLogo: teamLogo,
            roomTitle: roomTitle || `${targetMode} Room`,
            mode: targetMode,
            keyType: targetKeyType,
            boType: boType || 'BO1',
            status: 'waiting',
            createdAt: getYangonTimeStr()
        };

        await db.collection('active_rooms').doc(userId).set(roomData);

        return res.status(200).json({ 
            success: true, 
            message: "Room created successfully", 
            roomData: roomData 
        });

    } catch (error) {
        console.error("Create Room Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};