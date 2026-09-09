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

    if (method === 'POST') {
        try {
            const { userId, roomTitle, targetMode, targetKeyType, boType, roomId } = req.body;

            // 🔥 1. JOIN ROOM LOGIC (Joiner ဘက်မှ Room သို့ ဝင်ခြင်း)
            if (roomId) {
                if (!userId) {
                    return res.status(400).json({ success: false, message: "Missing userId for joining room" });
                }

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

                const userDoc = await db.collection('users').doc(userId).get();
                let userData = userDoc.exists ? userDoc.data() : {};

                let joinerTeamName = userData.name || 'Player';
                let joinerTeamLogo = userData.photoURL || userData.avatar || 'FrontLogo.jpg';

                let regCollectionName = '';
                const lowerMode = (roomData.mode || '').toLowerCase();
                
                if (lowerMode.includes('1v1') || lowerMode.includes('1vs1')) {
                    regCollectionName = '1vs1_registrations';
                } else if (lowerMode.includes('5v5') || lowerMode.includes('5vs5')) {
                    regCollectionName = '5vs5_registrations';
                } else if (lowerMode.includes('tournament')) {
                    regCollectionName = 'tournament_registrations';
                }

                let joinerMatchedReg = null;

                if (regCollectionName) {
                    const regSnapshot = await db.collection(regCollectionName)
                        .where('userId', '==', userId)
                        .get();

                    let matchedRegs = [];
                    regSnapshot.forEach(doc => {
                        const regData = doc.data();
                        // fee ကို Mode / KeyType အတိုင်း တိုက်စစ်ခြင်း
                        if (regData.fee && regData.fee.toString().toUpperCase() === roomData.keyType.toUpperCase()) {
                            matchedRegs.push(regData);
                        }
                    });

                    if (matchedRegs.length > 0) {
                        // အရင်ဆုံး တတင်ထားသော register (createdAt အဟောင်းဆုံး) ကို ရှာရန် အစဉ်လိုက်စီခြင်း
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

                        joinerMatchedReg = matchedRegs[0];

                        // Joiner ၏ logo နှင့် sqName/TeamName ကို ဆွဲထုတ် သတ်မှတ်ခြင်း
                        if (lowerMode.includes('5v5') || lowerMode.includes('5vs5')) {
                            joinerTeamName = joinerMatchedReg.sqName || joinerTeamName;
                        } else if (lowerMode.includes('tournament')) {
                            joinerTeamName = joinerMatchedReg.teamName || joinerTeamName;
                        } else {
                            joinerTeamName = joinerMatchedReg.inGameName || joinerTeamName;
                        }
                        
                        if (joinerMatchedReg.logo || joinerMatchedReg.teamLogo || joinerMatchedReg.paymentSlip) {
                            joinerTeamLogo = joinerMatchedReg.logo || joinerMatchedReg.teamLogo || joinerMatchedReg.paymentSlip;
                        }
                    }
                }

                await roomRef.update({
                    joinedUserId: userId,
                    joinedTeamName: joinerTeamName,
                    joinedTeamLogo: joinerTeamLogo,
                    
                    joinerInGameName: joinerMatchedReg?.inGameName || joinerTeamName,
                    joinerPlayerId: joinerMatchedReg?.playerId || joinerMatchedReg?.gameId || '',
                    joinerHeroName: joinerMatchedReg?.heroName || '',
                    
                    joinerSqName: joinerMatchedReg?.sqName || joinerTeamName,
                    joinerRoamer: formatPlayerField(joinerMatchedReg?.roamer || joinerMatchedReg?.playerRoamer),
                    joinerExp: formatPlayerField(joinerMatchedReg?.exp || joinerMatchedReg?.playerExp),
                    joinerGold: formatPlayerField(joinerMatchedReg?.gold || joinerMatchedReg?.playerGold),
                    joinerMid: formatPlayerField(joinerMatchedReg?.mid || joinerMatchedReg?.playerMid),
                    joinerJungle: formatPlayerField(joinerMatchedReg?.jungle || joinerMatchedReg?.playerJungle),

                    joinerContactPhNo: joinerMatchedReg?.contactPhNo || joinerMatchedReg?.kpayPhNo || joinerMatchedReg?.contactPhoneNumber || '',
                    status: 'matched'
                });

                return res.status(200).json({ success: true, message: "Successfully joined the room" });
            }

            // 🔥 2. CREATE ROOM LOGIC (Host ဘက်မှ Room အသစ်ဖန်တီးခြင်း)
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

            const existingJoinedCheck = await db.collection('active_rooms').where('joinedUserId', '==', userId).get();
            if (!existingJoinedCheck.empty) {
                return res.status(400).json({ success: false, message: "သင်သည် Room တစ်ခုကို Join ပြီးသားဖြစ်၍ Room အသစ်ထပ်မံ ဖန်တီး၍ မရပါ။" });
            }

            const userDoc = await db.collection('users').doc(userId).get();
            let userData = userDoc.exists ? userDoc.data() : {};

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
                    // userId, mode (collection), နှင့် fee (targetKeyType) တို့ဖြင့် ကိုက်ညီမှုစစ်ဆေးခြင်း
                    if (regData.fee && regData.fee.toString().toUpperCase() === targetKeyType.toUpperCase()) {
                        matchedRegs.push(regData);
                    }
                });

                if (matchedRegs.length > 0) {
                    // အရင်ဆုံး တတင်ထားသော register (createdAt အဟောင်းဆုံး) ကို ရှာရန် စီခြင်း
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

                    // Host ၏ logo နှင့် sqName/TeamName ကို မှတ်ပုံတင်ထဲမှ အဓိက ဆွဲထုတ်ခြင်း
                    if (lowerMode.includes('5v5') || lowerMode.includes('5vs5')) {
                        teamName = matchedReg.sqName || teamName;
                    } else if (lowerMode.includes('tournament')) {
                        teamName = matchedReg.teamName || teamName;
                    } else {
                        teamName = matchedReg.inGameName || teamName;
                    }
                    
                    if (matchedReg.logo || matchedReg.teamLogo || matchedReg.paymentSlip) {
                        teamLogo = matchedReg.logo || matchedReg.teamLogo || matchedReg.paymentSlip;
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
                joinedUserId: null, 
                
                // Host ၏ အချက်အလက်များ
                inGameName: matchedReg?.inGameName || teamName,
                playerId: matchedReg?.playerId || matchedReg?.gameId || '',
                heroName: matchedReg?.heroName || '',
                
                sqName: matchedReg?.sqName || teamName,
                roamer: formatPlayerField(matchedReg?.roamer || matchedReg?.playerRoamer),
                exp: formatPlayerField(matchedReg?.exp || matchedReg?.playerExp),
                gold: formatPlayerField(matchedReg?.gold || matchedReg?.playerGold),
                mid: formatPlayerField(matchedReg?.mid || matchedReg?.playerMid),
                jungle: formatPlayerField(matchedReg?.jungle || matchedReg?.playerJungle),

                contactPhNo: matchedReg?.contactPhNo || matchedReg?.kpayPhNo || matchedReg?.contactPhoneNumber || '',

                // Joiner နေရာအတွက် အစပိုင်းတွင် အလွတ်ထားရှိခြင်း
                joinedTeamName: null,
                joinedTeamLogo: null,
                joinerInGameName: '',
                joinerPlayerId: '',
                joinerHeroName: '',
                joinerSqName: '',
                joinerRoamer: { name: '-', id: '-' },
                joinerExp: { name: '-', id: '-' },
                joinerGold: { name: '-', id: '-' },
                joinerMid: { name: '-', id: '-' },
                joinerJungle: { name: '-', id: '-' },
                joinerContactPhNo: ''
            };

            const newRoomRef = await db.collection('active_rooms').add(roomData);

            return res.status(200).json({ 
                success: true, 
                message: "Room created successfully", 
                roomId: newRoomRef.id,
                roomData: roomData 
            });

        } catch (error) {
            console.error("Create/Join Room Error:", error);
            return res.status(500).json({ success: false, message: "Server Error", error: error.message });
        }
    }

    if (method === 'DELETE') {
        try {
            const { userId, roomId } = req.body; 
            if (!userId) {
                return res.status(400).json({ success: false, message: "Missing userId for cancellation" });
            }

            if (roomId) {
                const roomRef = db.collection('active_rooms').doc(roomId);
                const roomDoc = await roomRef.get();
                if (roomDoc.exists) {
                    const rData = roomDoc.data();
                    if (rData.joinedUserId === userId) {
                        await roomRef.update({
                            joinedUserId: null,
                            joinedTeamName: null,
                            joinedTeamLogo: null,
                            joinerInGameName: '',
                            joinerPlayerId: '',
                            joinerHeroName: '',
                            joinerSqName: '',
                            joinerRoamer: { name: '-', id: '-' },
                            joinerExp: { name: '-', id: '-' },
                            joinerGold: { name: '-', id: '-' },
                            joinerMid: { name: '-', id: '-' },
                            joinerJungle: { name: '-', id: '-' },
                            joinerContactPhNo: '',
                            status: 'waiting'
                        });
                        return res.status(200).json({ success: true, message: "Left room successfully" });
                    }
                }
            }

            const hostRoomsSnapshot = await db.collection('active_rooms').where('hostId', '==', userId).get();
            const batch = db.batch();
            hostRoomsSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });

            const joinedSnapshot = await db.collection('active_rooms').where('joinedUserId', '==', userId).get();
            joinedSnapshot.forEach(doc => {
                batch.update(doc.ref, { 
                    joinedUserId: null, 
                    joinedTeamName: null,
                    joinedTeamLogo: null,
                    joinerInGameName: '',
                    joinerPlayerId: '',
                    joinerHeroName: '',
                    joinerSqName: '',
                    joinerRoamer: { name: '-', id: '-' },
                    joinerExp: { name: '-', id: '-' },
                    joinerGold: { name: '-', id: '-' },
                    joinerMid: { name: '-', id: '-' },
                    joinerJungle: { name: '-', id: '-' },
                    joinerContactPhNo: '',
                    status: 'waiting' 
                });
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
};