const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Firebase Admin Initialize လုပ်ခြင်း
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

// ImgBB သို့ ပုံတင်ပေးမည့် Function
async function uploadToImgBB(base64Image) {
    if (!base64Image || !base64Image.startsWith('data:image')) {
        return base64Image; // ပုံမဟုတ်ဘဲ URL ဖြစ်နေပြီးသားဆိုရင် တန်းပြန်ပေးမယ်
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
    return result.data.url; // ImgBB မှ ထွက်လာသော ပုံ Link
}

module.exports = async function handler(req, res) {
    // POST Method ဟုတ်မဟုတ် စစ်ဆေးခြင်း
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    try {
        const { mode, data } = req.body;

        if (!mode || !data || !data.userId) {
            return res.status(400).json({ success: false, message: "Mode, Data, and User ID are required" });
        }

        let collectionName = '';
        let registrationData = {};

        // ၁။ 1VS1 Mode အတွက်
        if (mode === '1vs1') {
            collectionName = '1vs1_registrations';
            
            // Logo နဲ့ Payment Slip ကို ImgBB သို့ တင်ခြင်း
            // (payment.js သို့မဟုတ် formData ကလာတဲ့ ပုံနာမည် အမျိုးမျိုးကို ခြုံပြီး ဖမ်းပေးခြင်း)
            const logoToUpload = data.logo || data.logoBase64 || '';
            const slipToUpload = data.paymentSlip || data.paymentSlipUrl || '';

            const logoUrl = await uploadToImgBB(logoToUpload);
            const slipUrl = await uploadToImgBB(slipToUpload);

            registrationData = {
                userId: data.userId,
                // Frontend က gameName လို့ ပို့ရင် inGameName ထဲ ထည့်မယ် (မပါရင် ဒုတိယနာမည်ကို ယူမယ်)
                inGameName: data.gameName || data.inGameName || '',
                // Frontend က playerId လို့ ပို့ရင် gameId ထဲ ထည့်မယ်
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
                createdAt: new Date()
            };
        }
        // ၂။ 5VS5 Mode အတွက်
        else if (mode === '5vs5') {
            collectionName = '5vs5_registrations';
            
            // Logo နဲ့ Payment Slip ကို ImgBB သို့ တင်ခြင်း
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
                createdAt: new Date()
            };
        } 
        // ၃။ TOURNAMENT Mode အတွက်
        else if (mode === 'tournament') {
            collectionName = 'tournament_registrations';
            
            // Team Logo နဲ့ Payment Slip ကို ImgBB သို့ တင်ခြင်း
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
                createdAt: new Date()
            };
        }
            else {
            return res.status(400).json({ success: false, message: "Invalid registration mode" });
        }

        // သဆိုင်ရာ Collection ထဲသို့ Data အသစ် ထည့်သွင်းခြင်း
        const docRef = await db.collection(collectionName).add(registrationData);

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