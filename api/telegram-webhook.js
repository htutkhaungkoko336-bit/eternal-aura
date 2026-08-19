module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(200).send('Webhook is active');
    }

    try {
        const update = req.body;

        // Admin က Inline Button ကို နှိပ်မှသာ ဝင်လာမည်
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const data = callbackQuery.data; // ဥပမာ- confirm_12345_timestamp
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;
            const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

            const [action, userId, timestamp] = data.split('_');

            let responseText = "";
            if (action === 'confirm') {
                responseText = "✅ This registration has been CONFIRMED.";
                // TODO: ဒီနေရာတွင် Firebase Database ထဲမှ သက်ဆိုင်ရာ userId ၏ status ကို 'approved' သို့ ပြောင်းပါ
            } else if (action === 'reject') {
                responseText = "❌ This registration has been REJECTED.";
                // TODO: ဒီနေရာတွင် Firebase Database ထဲမှ သက်ဆိုင်ရာ userId ၏ status ကို 'rejected' သို့ ပြောင်းပါ
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
                    reply_markup: { inline_keyboard: [] } // ခလုတ်များကို ဖယ်ရှားခြင်း
                })
            });

            // Telegram သို့ အကြောင်းပြန်ခြင်း (Loading animation ပျောက်သွားရန်)
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackQuery.id, text: "Successfully updated!" })
            });
        }

        return res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ error: error.message });
    }
};