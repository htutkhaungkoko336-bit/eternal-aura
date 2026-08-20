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
            const data = callbackQuery.data; // ပုံစံ - confirm_collectionName_docId
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;
            const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

            // 🔴 ေဒတာများကို အတိအကျ ခွဲထုတ်ခြင်း
            const parts = data.split('_');
            const action = parts[0];          // confirm သို့မဟုတ် reject
            const collectionName = parts[1];  // 1vs1_registrations, 5vs5_registrations စသည်ဖြင့်
            const docId = parts[2];           // Firestore ရဲ့ Document ID အစစ်

            let newStatus = "";
            let responseText = "";

            if (action === 'confirm') {
                newStatus = 'CONFIRMED';
                responseText = "✅ This registration has been CONFIRMED.";
            } else if (action === 'reject') {
                newStatus = 'REJECTED';
                responseText = "❌ This registration has been REJECTED.";
            }

            // 🔴 Firestore ထဲတွင် docId ကိုသုံး၍ တိုက်ရိုက် Update လုပ်ခြင်း (အလွန်မြန်ဆန်ပြီး မှန်ကန်သည်)
            try {
                if (collectionName && docId) {
                    await db.collection(collectionName).doc(docId).update({ status: newStatus });
                }
            } catch (dbError) {
                console.error("Database Update Error:", dbError);
            }

            // Telegram Group ထဲရှိ မူလစာသားကို အပ်ဒိတ်လုပ်ပြီး ခလုတ်ဖြုတ်ခြင်း
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

            // Telegram သို့ အကြောင်းပြန်ခြင်း (Loading animation ပျောက်ရန်)
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