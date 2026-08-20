const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fetch = require('node-fetch');

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

        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const data = callbackQuery.data; // ပုံစံ - c_5_iaGZgFGk4GAqndwSpph (သို့) r_5_...
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;
            const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

            const parts = data.split('_');
            const actionPrefix = parts[0]; // 'c' သို့မဟုတ် 'r'
            
            let newStatus = "";
            let responseText = "";
            let adminReasonText = "Registration rejected by admin";

            if (actionPrefix === 'c') {
                newStatus = 'CONFIRMED';
                responseText = "✅ This registration has been CONFIRMED.";
            } else if (actionPrefix === 'r') {
                newStatus = 'REJECTED';
                responseText = "❌ This registration has been REJECTED.";
            }

            // 🔴 တိကျသော Document တစ်ခုတည်းကိုသာ update လုပ်ခြင်း
            try {
                if (parts.length >= 3) {
                    const colCode = parts[1];
                    const docId = parts[2];

                    let collectionName = '';
                    if (colCode === '1') collectionName = '1vs1_registrations';
                    else if (colCode === '5') collectionName = '5vs5_registrations';
                    else if (colCode === 't') collectionName = 'tournament_registrations';

                    if (collectionName && docId) {
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

                            // ထို Document တစ်ခုတည်းကိုသာ တိုက်ရိုက် Update ချမည်
                            await docRef.update(updateData);
                        }
                    }
                }
            } catch (dbError) {
                console.error("Database Update Error:", dbError);
            }

            // Telegram Group ထဲရှိ မူလစာသားကို အပ်ဒိတ်လုပ်ပေးခြင်း (ခလုတ်များကို ဖြုတ်ရန်)
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: messageId,
                    caption: `${callbackQuery.message.caption}\n\n*Status: ${responseText}*`,
                    parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [] }
                })
            });

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