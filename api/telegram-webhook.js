const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fetch = require('node-fetch');

// Firebase Admin Initialize လုပ်ခြင်း
const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    }) 
  : getApps()[0];

const db = getFirestore(app);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(200).send('Webhook is active');
    }

    try {
        const update = req.body;

        // Admin က Inline Button ကို နှိပ်မှသာ ဝင်လာမည်
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const data = callbackQuery.data; // ဥပမာ- confirm_collectionName_docId_userId (သို့) မူလပုံစံ
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;
            const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

            // Data ကို underscore (_) ဖြင့် ခွဲထုတ်ခြင်း
            const parts = data.split('_');
            const action = parts[0]; // 'confirm' သို့မဟုတ် 'reject'
            
            let newStatus = "";
            let responseText = "";
            let adminReasonText = "Registration rejected by admin"; // လိုအပ်ပါက အကြောင်းပြချက်

            if (action === 'confirm') {
                newStatus = 'CONFIRMED';
                responseText = "✅ This registration has been CONFIRMED.";
            } else if (action === 'reject') {
                newStatus = 'REJECTED';
                responseText = "❌ This registration has been REJECTED.";
            }

            // --- Firebase Database ထဲမှ သက်ဆိုင်ရာ Document တစ်ခုတည်းကိုသာ Update ပြုလုပ်ခြင်း ---
            try {
                // အကယ်၍ Callback data ထဲမှာ collection နဲ့ docId ပါလာလျှင် (အတိအကျ ထိန်းချုပ်ရန်)
                if (parts.length >= 3) {
                    const collectionName = parts[1];
                    const docId = parts[2];

                    const docRef = db.collection(collectionName).doc(docId);
                    const docSnap = await docRef.get();

                    if (docSnap.exists) {
                        let updateData = {
                            status: newStatus,
                            updatedAt: new Date()
                        };

                        if (newStatus === 'REJECTED') {
                            updateData.rejectReason = adminReasonText;
                        }

                        await docRef.update(updateData);
                    }
                } 
                else {
                    // ရှေးဟောင်းပုံစံ (userId တစ်ခုတည်းနဲ့ လာခဲ့ရင် - Backup အနေနဲ့ ထားရှိခြင်း)
                    const userId = parts[1];
                    const collections = ['1vs1_registrations', '5vs5_registrations', 'tournament_registrations'];
                    
                    for (const col of collections) {
                        const querySnapshot = await db.collection(col).where('userId', '==', userId).get();
                        if (!querySnapshot.empty) {
                            const updatePromises = querySnapshot.docs.map(doc => {
                                let updateData = { status: newStatus, updatedAt: new Date() };
                                if (newStatus === 'REJECTED') updateData.rejectReason = adminReasonText;
                                return doc.ref.update(updateData);
                            });
                            await Promise.all(updatePromises);
                        }
                    }
                }
            } catch (dbError) {
                console.error("Database Update Error:", dbError);
            }
            // --------------------------------------------------------------------

            // Telegram Group ထဲရှိ မူလစာသားကို အပ်ဒိတ်လုပ်ပေးခြင်း (ခလုတ်များကို ဖြုတ်ရန်)
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: messageId,
                    caption: `${callbackQuery.message.caption}\n\n*Status: ${responseText}*`,
                    parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [] } // ခလုတ်များကို ဖယ်ရှားခြင်း
                })
            });

            // Telegram သို့ အကြောင်းပြန်ခြင်း (Loading animation ပျောက်သွားရန်)
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    callback_query_id: callbackQuery.id, 
                    text: `Successfully ${newStatus.toLowerCase()}!` 
                })
            });
        }

        return res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ error: error.message });
    }
};