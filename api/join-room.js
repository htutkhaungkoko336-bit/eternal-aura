const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = getApps().length === 0 
    ? initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      }) 
    : getApps()[0];

const db = getFirestore(app);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    try {
        const { userId, roomId } = req.body;

        if (!userId || !roomId) {
            return res.status(400).json({ success: false, message: 'Missing required fields (userId or roomId)' });
        }

        // ၁။ ဒီ user ဟာ ကိုယ်ပိုင် room ထောင်ထားတာ (သို့) အခြား room တစ်ခုခု join ပြီးသားဖြစ်နေလား စစ်မယ်
        const existingRoomHost = await db.collection('active_rooms').where('hostId', '==', userId).get();
        if (!existingRoomHost.empty) {
            return res.status(400).json({ success: false, message: "သင့်တွင် Active ဖြစ်နေသော Room ရှိနှင့်ပြီးဖြစ်၍ တခြား Room သို့ Join ၍ မရပါ။" });
        }

        const existingRoomJoined = await db.collection('active_rooms').where('joinedUserId', '==', userId).get();
        if (!existingRoomJoined.empty) {
            return res.status(400).json({ success: false, message: "သင်သည် အခြား Room တစ်ခုကို Join ပြီးသား ဖြစ်ပါသည်။" });
        }

        // ၂။ Join မယ့် Room ရှိမရှိ စစ်မယ်
        const roomRef = db.collection('active_rooms').doc(roomId);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
            return res.status(404).json({ success: false, message: "Room not found or already deleted" });
        }

        const roomData = roomDoc.data();
        
        // ၃။ ကိုယ့် Room ကို ကိုယ်ပြန် join တာလား စစ်မယ်
        if (roomData.hostId === userId) {
            return res.status(400).json({ success: false, message: "ကိုယ့် Room ကို ကိုယ်တိုင် Join ၍ မရပါ။" });
        }
        
        // ၄။ အခြားသူ join ပြီးသားလား စစ်မယ်
        if (roomData.joinedUserId) {
            return res.status(400).json({ success: false, message: "ဤ Room သည် အခြားသူ Join ပြီးသား (Locked ဖြစ်နေသော) ဖြစ်ပါသည်။" });
        }

        // ၅။ Database ထဲမှာ joinedUserId နှင့် status ကို update လုပ်မည်
        await roomRef.update({
            joinedUserId: userId,
            status: 'matched'
        });

        return res.status(200).json({ success: true, message: 'Successfully joined the room' });
        
    } catch (error) {
        console.error('Join room API error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
}