const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { sendRegistrationToTelegram } = require('./telegram'); 

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

async function uploadToImgBB(base64Image) {
    if (!base64Image || !base64Image.startsWith('data:image')) {
        return base64Image; 
    }

    const apiKey = process.env.IMGBB_API_KEY;
    const base64Data = base64Image.split(',')[1];
    
    const formData = new URLSearchParams();
    formData.append('image', base64Data);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    if (!result.success) {
        throw new Error("ImgBB Upload Failed: " + (result.error?.message || "Unknown error"));
    }
    return result.data.url;
}

module.exports = async function handler(req, res) {
    // 🔥 GET Request လာလျှင် Firestore ထဲရှိ Tournament Brackets များကို ပြန်ထုတ်ပေးရန်
    if (req.method === 'GET') {
        try {
            const docRef = db.collection('tournaments').doc('mainConfig');
            const docSnap = await docRef.get();

            if (!docSnap.exists) {
                return res.status(200).json({ success: true, data: null });
            }

            return res.status(200).json({ 
                success: true, 
                data: docSnap.data() 
            });
        } catch (error) {
            console.error("GET Brackets Error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // POST Request မဟုတ်လျှင် ခွင့်မပြုပါ
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    try {
        const { mode, data } = req.body;

        if (!mode || !data || !data.userId) {
            return res.status(400).json({ success: false, message: "Mode, Data, and User ID are required" });
        }

        let collectionName = '';
        let registrationData = {};
        let slipForTelegram = '';
        let gameModeKey = ''; 

        if (mode === '1vs1') {
            collectionName = '1vs1_registrations';
            gameModeKey = '1vs1-5k';
            const logoToUpload = data.logo || data.logoBase64 || '';
            const slipToUpload = data.paymentSlip || data.paymentSlipUrl || '';
            slipForTelegram = slipToUpload;

            const logoUrl = await uploadToImgBB(logoToUpload);
            const slipUrl = await uploadToImgBB(slipToUpload);

            registrationData = {
                userId: data.userId,
                inGameName: data.gameName || data.inGameName || '',
                gameId: data.playerId || data.gameId || '',
                heroName: data.heroName || '',
                kpayName: data.kpayName || '',
                kpayPhNo: data.kpayPhoneNumber || data.kpayPhNo || '',
                contactPhNo: data.contactPhoneNumber || data.contactPhNo || '',
                fee: data.fee || '',
                logo: logoUrl,          
                paymentSlip: slipUrl,   
                status: 'PENDING', 
                time: getYangonTimeStr(),
                createdAt: new Date(),
                used: false 
            };
        }
        else if (mode === '5vs5') {
            collectionName = '5vs5_registrations';
            gameModeKey = '5vs5-5k';
            slipForTelegram = data.paymentSlip;

            const logoUrl = await uploadToImgBB(data.logo);
            const slipUrl = await uploadToImgBB(data.paymentSlip);

            registrationData = {
                userId: data.userId,
                sqName: data.sqName || '',
                logo: logoUrl,
                roamer: { name: data.roamerName || '', id: data.roamerId || '' },
                exp: { name: data.expName || '', id: data.expId || '' },
                gold: { name: data.goldName || '', id: data.goldId || '' },
                mid: { name: data.midName || '', id: data.midId || '' },
                jungle: { name: data.jungleName || '', id: data.jungleId || '' },
                kpayName: data.kpayName || '',
                kpayPhNo: data.kpayPhNo || '',
                contactPhNo: data.contactPhNo || '',
                fee: data.fee || '',
                paymentSlip: slipUrl,
                status: 'PENDING',
                time: getYangonTimeStr(),
                createdAt: new Date(),
                used: false 
            };
        } 
        else if (mode === 'tournament') {
            collectionName = 'tournament_registrations';
            gameModeKey = 'tournament';
            slipForTelegram = data.paymentSlipUrl;

            const teamLogoUrl = await uploadToImgBB(data.teamLogo);
            const slipUrl = await uploadToImgBB(data.paymentSlipUrl);

            registrationData = {
                userId: data.userId,
                teamName: data.teamName || '',
                teamLogo: teamLogoUrl,
                playerRoamer: { name: data.playerRoamerName || '', gameId: data.playerRoamerId || '' },
                playerExp: { name: data.playerExpName || '', gameId: data.playerExpId || '' },
                playerGold: { name: data.playerGoldName || '', gameId: data.playerGoldId || '' },
                playerMid: { name: data.playerMidName || '', gameId: data.playerMidId || '' },
                playerJungle: { name: data.playerJungleName || '', gameId: data.playerJungleId || '' },
                kpayAccountName: data.kpayAccountName || '',
                kpayPhoneNumber: data.kpayPhoneNumber || '',
                contactPhoneNumber: data.contactPhoneNumber || '',
                fee: "50K", 
                slot: data.slot || '',
                selectedSlot: data.selectedSlot || '',
                paymentSlipUrl: slipUrl,
                status: 'PENDING',
                time: getYangonTimeStr(),
                createdAt: new Date(),
                used: false 
            };
        } 
        else if (mode === 'update_brackets') {
            collectionName = 'tournaments';
            const docId = 'mainConfig'; 

            registrationData = {
                groups: data.groups || [],
                semis: data.semis || [],
                champion: data.champion || {},
                winner_userid: data.winner_userid || data.winnerUserId || '',
                updatedAt: new Date(),
                updatedBy: data.userId || 'admin'
            };

            const bracketRef = db.collection(collectionName).doc(docId);
            await bracketRef.set(registrationData, { merge: true });

            return res.status(200).json({ 
                success: true, 
                message: "Tournament brackets and slots updated successfully" 
            });
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid registration mode" });
        }

        const docRef = await db.collection(collectionName).add(registrationData);

        const userRef = db.collection('users').doc(data.userId);
        await userRef.set({
            [gameModeKey]: FieldValue.increment(1)
        }, { merge: true });

        const telegramPayload = {
            ...registrationData,
            mode: mode
        };

        const telegramResult = await sendRegistrationToTelegram(telegramPayload, slipForTelegram, collectionName, docRef.id);
        if (!telegramResult.success) {
            console.error("Telegram Error:", telegramResult.error);
        }

        return res.status(200).json({ 
            success: true, 
            message: `${mode} registration submitted successfully`, 
            registrationId: docRef.id 
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};