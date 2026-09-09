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

function formatPlayerField(player) {
    if (!player) return { name: '-', id: '-' };
    if (typeof player === 'object') {
        return {
            name: player.name || player.inGameName || '-',
            id: player.id || player.gameId || '-'
        };
    }
    return { name: player, id: '-' };
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

    // 🔥 2. POST Method - Room အသစ်ဖန်တီးခြင်း (သို့မဟုတ်) Room ထဲသို့ Join ခြင်း
    if (method === 'POST') {
        try {
            const { userId, roomTitle, targetMode, targetKeyType, boType, roomId } = req.body;

            // အကယ်၍ roomId ပါလာလျှင် ဒါဟာ Room ဝင် Join တဲ့ Request ဖြစ်ပါတယ်
            if (roomId) {
                if (!userId) {
                    return res.status(400).json({ success: false, message: "Missing userId for joining room" });
                }

                // တခြားသူ့ Room ကို Join မလုပ်ခင် ဒီ user ဟာ ကိုယ်ပိုင် room ထောင်ထားတာ (သို့) အခြား room တစ်ခုခု join ပြီးသားဖြစ်နေလား စစ်မယ်
                const existingRoomHost = await db.collection('active_rooms').where('hostId', '==', userId).get();
                if (!existingRoomHost.empty) {
                    return res.status(400).json({ success: false, message: "သင့်တွင် Active ဖြစ်နေသော Room ရှိနှင့်ပြီးဖြစ်၍ တခြား Room သို့ Join ၍ မရပါ။" });
                }

                const existingRoomJoined = await db.collection('active_rooms').where('joinedUserId', '==', userId).get();
                if (!existingRoomJoined.empty) {
                    return res.status(400).json({ success: false, message: "သင်သည် အခြား Room တစ်ခုကို Join ပြီးသား ဖြစ်ပါသည်။" });
                }

                const roomRef = db.collection('active_rooms').doc(roomId);
                const roomDoc = await roomRef.get();

                if (!roomDoc.exists) {
                    return res.status(404).json({ success: false, message: "Room not found or already deleted" });
                }

                const roomData = roomDoc.data();
                if (roomData.hostId === userId) {
                    return res.status(400).json({ success: false, message: "ကိုယ့် Room ကို ကိုယ်တိုင် Join ၍ မရပါ။" });
                }
                if (roomData.joinedUserId) {
                    return res.status(400).json({ success: false, message: "ဤ Room သည် အခြားသူ Join ပြီးသား (Locked ဖြစ်နေသော) ဖြစ်ပါသည်။" });
                }

                // Room ထဲသို့ joinedUserId ကို ထည့်သွင်း update လုပ်မည်
                await roomRef.update({
                    joinedUserId: userId,
                    status: 'matched'
                });

                return res.status(200).json({ success: true, message: "Successfully joined the room" });
            }

            // Room အသစ်ဖန်တီးသည့် Logic (roomId မပါလာလျှင်)
            if (!userId || !targetMode || !targetKeyType) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            const existingRoomCheck = await db.collection('active_rooms').where('hostId', '==', userId).get();
            if (!existingRoomCheck.empty) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'သင့်တွင် Active ဖြစ်နေသော Room တစ်ခု ရှိနှင့်ပြီးသား ဖြစ်ပါသည်။ Room အသစ်ထပ်ထောင်လိုပါက ရှိပြီးသား Room ကို အရင် Cancel ပါ။' 
                });
            }

            // User က Join ပြီးသားဖြစ်နေရင်လည်း Room အသစ်ထောင်ခွင့်မပေးပါ
            const existingJoinedCheck = await db.collection('active_rooms').where('joinedUserId', '==', userId).get();
            if (!existingJoinedCheck.empty) {
                return res.status(400).json({ success: false, message: "သင်သည် Room တစ်ခုကို Join ပြီးသားဖြစ်၍ Room အသစ်ထပ်မံ ဖန်တီး၍ မရပါ။" });
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

            let matchedReg = null;

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

                    matchedReg = matchedRegs[0];

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
                createdAt: getYangonTimeStr(),
                joinedUserId: null, // Join မည့်သူ့ ID အလွတ်စထားမည်
                
                inGameName: matchedReg?.inGameName || teamName,
                heroName: matchedReg?.heroName || '',
                
                sqName: matchedReg?.sqName || teamName,
                roamer: formatPlayerField(matchedReg?.roamer),
                exp: formatPlayerField(matchedReg?.exp),
                gold: formatPlayerField(matchedReg?.gold),
                mid: formatPlayerField(matchedReg?.mid),
                jungle: formatPlayerField(matchedReg?.jungle),

                contactPhNo: matchedReg?.contactPhNo || matchedReg?.kpayPhNo || ''
            };

            await db.collection('active_rooms').doc(userId).set(roomData);

            return res.status(200).json({ 
                success: true, 
                message: "Room created successfully", 
                roomData: roomData 
            });

        } catch (error) {
            console.error("Create/Join Room Error:", error);
            return res.status(500).json({ success: false, message: "Server Error", error: error.message });
        }
    }

    // 🔥 3. DELETE Method - Room ဖျက်ခြင်း (သို့မဟုတ်) Join ထားတာကို Cancel လုပ်ခြင်း
    if (method === 'DELETE') {
        try {
            const { userId, roomId } = req.body; 
            if (!userId) {
                return res.status(400).json({ success: false, message: "Missing userId for cancellation" });
            }

            // အကယ်၍ roomId ပို့ပေးထားပြီး ကိုယ်က host မဟုတ်ဘဲ join ထားသူဆိုရင် joinedUserId ကို ပြန်ဖြုတ်မယ်
            if (roomId) {
                const roomRef = db.collection('active_rooms').doc(roomId);
                const roomDoc = await roomRef.get();
                if (roomDoc.exists) {
                    const rData = roomDoc.data();
                    if (rData.joinedUserId === userId) {
                        await roomRef.update({
                            joinedUserId: null,
                            status: 'waiting'
                        });
                        return res.status(200).json({ success: true, message: "Left room successfully" });
                    }
                }
            }

            // ဒါမှမဟုတ်ရင် Host အနေနဲ့ ထောင်ထားတဲ့ Room ကို လုံးဝ ဖျက်ပစ်မယ်
            await db.collection('active_rooms').doc(userId).delete();

            // တခြား room တွေမှာ joined လုပ်ထားတာရှိရင်လည်း အဲ့ဒီ room တွေထဲက joinedUserId ကို ရှင်းထုတ်ပေးမယ်
            const joinedSnapshot = await db.collection('active_rooms').where('joinedUserId', '==', userId).get();
            const batch = db.batch();
            joinedSnapshot.forEach(doc => {
                batch.update(doc.ref, { joinedUserId: null, status: 'waiting' });
            });
            await batch.commit();

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
}