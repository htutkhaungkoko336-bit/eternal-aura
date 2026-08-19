const fetch = require('node-fetch');
const FormData = require('form-data');

async function sendRegistrationToTelegram(userData, paymentSlipBase64) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const GROUP_ID = process.env.REGISTRATION_GROUP_ID;

    if (!BOT_TOKEN || !GROUP_ID) {
        console.error("Telegram Token or Registration Group ID is missing.");
        return { success: false, message: "Telegram config missing" };
    }

    // Admin Group ထဲ ပို့မည့် စာသားပုံစံ
    const caption = `
🚨 **New Registration Pending!** 🚨

👤 **Name:** ${userData.name || 'N/A'}
📞 **Phone:** ${userData.phone || 'N/A'}
🎮 **Mode:** ${userData.selectedGameMode || userData.mode || 'N/A'}
🆔 **User ID:** ${userData.userId || 'N/A'}
💰 **Total Fee:** ${userData.totalFee || 'N/A'}
📝 **Slot:** ${userData.slot || 'N/A'}
    `.trim();

    // Confirm နဲ့ Reject ခလုတ်များ (Callback Data ပါဝင်သည်)
    const inlineKeyboard = {
        inline_keyboard: [
            [
                { text: "✅ Confirm", callback_data: `confirm_${userData.userId}_${Date.now()}` },
                { text: "❌ Reject", callback_data: `reject_${userData.userId}_${Date.now()}` }
            ]
        ]
    };

    try {
        let base64Data = paymentSlipBase64;
        if (base64Data && base64Data.includes(',')) {
            base64Data = base64Data.split(',')[1];
        }

        const imageBuffer = Buffer.from(base64Data, 'base64');

        const form = new FormData();
        form.append('chat_id', GROUP_ID);
        form.append('photo', imageBuffer, { filename: 'slip.jpg', contentType: 'image/jpeg' });
        form.append('caption', caption);
        form.append('parse_mode', 'Markdown');
        form.append('reply_markup', JSON.stringify(inlineKeyboard));

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
        const res = await fetch(url, {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        });

        const result = await res.json();
        return result.ok ? { success: true } : { success: false, error: result };
    } catch (error) {
        console.error("Telegram Send Error:", error);
        return { success: false, message: error.message };
    }
}

module.exports = { sendRegistrationToTelegram };