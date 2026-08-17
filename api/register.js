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
            registrationData = {
                userId: data.userId,
                inGameName: data.inGameName || '',
                gameId: data.gameId || '',
                heroName: data.heroName || '',
                kpayName: data.kpayName || '',
                kpayPhNo: data.kpayPhNo || '',
                contactPhNo: data.contactPhNo || '',
                fee: data.fee || '',
                bo: data.bo || '',
                logo: data.logo || '', // Image URL or Base64
                paymentSlip: data.paymentSlip || '', // Image URL or Base64
                status: 'PENDING', // PENDING, CONFIRM, REJECT
                time: getYangonTimeStr(),
                createdAt: new Date()
            };
        } 
        // ၂။ 5VS5 Mode အတွက်
        else if (mode === '5vs5') {
            collectionName = '5vs5_registrations';
            registrationData = {
                userId: data.userId,
                sqName: data.sqName || '',
                logo: data.logo || '',
                roamer: { name: data.roamerName || '', id: data.roamerId || '' },
                exp: { name: data.expName || '', id: data.expId || '' },
                gold: { name: data.goldName || '', id: data.goldId || '' },
                mid: { name: data.midName || '', id: data.midId || '' },
                jungle: { name: data.jungleName || '', id: data.jungleId || '' },
                kpayName: data.kpayName || '',
                kpayPhNo: data.kpayPhNo || '',
                contactPhNo: data.contactPhNo || '',
                fee: data.fee || '',
                bo: data.bo || '',
                paymentSlip: data.paymentSlip || '',
                status: 'PENDING',
                time: getYangonTimeStr(),
                createdAt: new Date()
            };
        } 
        // ၃။ TOURNAMENT Mode အတွက် (5VS5 ပုံစံတူသော်လည်း Fields နာမည် သီးသန့်ခွဲထားသည်)
        else if (mode === 'tournament') {
            collectionName = 'tournament_registrations';
            registrationData = {
                userId: data.userId,
                teamName: data.teamName || '',
                teamLogo: data.teamLogo || '',
                playerRoamer: { name: data.playerRoamerName || '', gameId: data.playerRoamerId || '' },
                playerExp: { name: data.playerExpName || '', gameId: data.playerExpId || '' },
                playerGold: { name: data.playerGoldName || '', gameId: data.playerGoldId || '' },
                playerMid: { name: data.playerMidName || '', gameId: data.playerMidId || '' },
                playerJungle: { name: data.playerJungleName || '', gameId: data.playerJungleId || '' },
                kpayAccountName: data.kpayAccountName || '',
                kpayPhoneNumber: data.kpayPhoneNumber || '',
                contactPhoneNumber: data.contactPhoneNumber || '',
                fee: "50K", // Tournament အတွက် 50K အမြဲသေချာစေရန်
                boFormat: data.boFormat || '',
                paymentSlipUrl: data.paymentSlipUrl || '',
                status: 'PENDING',
                time: getYangonTimeStr(),
                createdAt: new Date()
            };
        } else {
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