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
    const { method } = req;

    // 🔥 1. GET Method - Global Room များကို Mode နဲ့ KeyType အလိုက် လှမ်းထုတ်ပေးခြင်း
    if (method === 'GET') {
        try {
            const { mode, keyType } = req.query;
            let query = db.collection('active_rooms');

            if (mode) {
                query = query.where('mode', '==', mode);
            }
            if (keyType) {
                query = query.where('keyType', '==', keyType);
            }

            const snapshot = await query.get();
            let rooms = [];
            snapshot.forEach(doc => {
                rooms.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return res.status(200).json({ success: true, rooms });
        } catch (error) {
            console.error("Get Rooms Error:", error);
            return res.status(500).json({ success: false, message: "Server Error", error: error.message });
        }
    }

    // 🔥 2. POST Method - Room အသစ်ဖန်တီးပြီး active_rooms ထဲ သိမ်းမည် (Cancel မလုပ်မချင်း ဆက်ရှိနေမည်)
    if (method === 'POST') {
        try {
            const { userId, roomTitle, targetMode, targetKeyType, boType } = req.body;

            if (!userId || !targetMode || !targetKeyType) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            // 🛑 User မှာ active_rooms ထဲမှာ hostId နဲ့ တူတဲ့ Room ရှိပြီးသားလား အရင်စစ်ဆေးခြင်း
            const existingRoomCheck = await db.collection('active_rooms').where('hostId', '==', userId).get();

            if (!existingRoomCheck.empty) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'သင့်တွင် Active ဖြစ်နေသော Room တစ်ခု ရှိနှင့်ပြီးသား ဖြစ်ပါသည်။ Room အသစ်ထပ်ထောင်လိုပါက ရှိပြီးသား Room ကို အရင် Cancel ပါ။' 
                });
            }

            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const userData = userDoc.data();
            let teamName = userData.name || 'Player';
            let teamLogo = userData.photoURL || userData.avatar || 'FrontLogo.jpg';

            let regCollectionName = '';
            const lowerMode = targetMode.toLowerCase();
            
            if (lowerMode.includes('1v1') || lowerMode.includes('1vs1')) {
                regCollectionName = '1vs1_registrations';
            } else if (lowerMode.includes('5v5') || lowerMode.includes('5vs5')) {
                regCollectionName = '5vs5_registrations';
            } else if (lowerMode.includes('tournament')) {
                regCollectionName = 'tournament_registrations';
            }

            if (regCollectionName) {
                const regSnapshot = await db.collection(regCollectionName)
                    .where('userId', '==', userId)
                    .get();

                let matchedRegs = [];
                regSnapshot.forEach(doc => {
                    const regData = doc.data();
                    if (regData.fee && regData.fee.toString().toUpperCase() === targetKeyType.toUpperCase()) {
                        matchedRegs.push(regData);
                    }
                });

                if (matchedRegs.length > 0) {
                    matchedRegs.sort((a, b) => {
                        const getTimeVal = (createdAt) => {
                            if (!createdAt) return 0;
                            if (typeof createdAt.toMillis === 'function') return createdAt.toMillis();
                            if (typeof createdAt.toDate === 'function') return createdAt.toDate().getTime();
                            const parsed = new Date(createdAt).getTime();
                            return isNaN(parsed) ? 0 : parsed;
                        };
                        return getTimeVal(a.createdAt) - getTimeVal(b.createdAt);
                    });

                    const matchedReg = matchedRegs[0];

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

            // userId ကို Doc ID အဖြစ်သုံး၍ active_rooms ထဲ သိမ်းမည် (Cancel မလုပ်မချင်း ဤနေရာတွင် ရှိနေမည်)
            // ဒီနေရာမှာ .doc(userId).set() ကို သုံးထားတဲ့အတွက် User တစ်ယောက်မှာ Room တစ်ခုပဲ အမြဲ ရှိနေစေမှာ ဖြစ်ပါတယ်
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
    }

    // 🔥 3. DELETE Method - Cancel နှိပ်လိုက်မှ active_rooms ထဲမှ Room ကို ဖျက်ပစ်ခြင်း
    if (method === 'DELETE') {
        try {
            const { userId } = req.body; 
            if (!userId) {
                return res.status(400).json({ success: false, message: "Missing userId for cancellation" });
            }

            await db.collection('active_rooms').doc(userId).delete();

            return res.status(200).json({ 
                success: true, 
                message: "Room cancelled and deleted successfully" 
            });
        } catch (error) {
            console.error("Delete Room Error:", error);
            return res.status(500).json({ success: false, message: "Server Error", error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
};