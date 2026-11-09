const fetch = require('node-fetch');
const FormData = require('form-data');

// 1. မူလ ရှိပြီးသား Registration နှင့် Refund များကို Group သို့ ပို့သော Function
async function sendRegistrationToTelegram(userData, paymentSlipBase64, collectionName, docId) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const GROUP_ID = process.env.REGISTRATION_GROUP_ID;

    if (!BOT_TOKEN || !GROUP_ID) {
        console.error("Telegram Token or Registration Group ID is missing.");
        return { success: false, message: "Telegram config missing" };
    }

    const mode = userData.mode || 'N/A';
    let detailsCaption = '';

    if (mode === '1vs1') {
        detailsCaption = `
🎮 **Mode:** 1VS1
━━━━━━━━━━━━━━━━━━━
👤 **User ID:** ${userData.userId || 'N/A'}
🎮 **In-Game Name:** ${userData.inGameName || 'N/A'}
🆔 **Game ID:** ${userData.gameId || 'N/A'}
🦸 **Hero Name:** ${userData.heroName || 'N/A'}

💳 **KPay Name:** ${userData.kpayName || 'N/A'}
📱 **KPay Ph No:** ${userData.kpayPhNo || 'N/A'}
📞 **Contact Ph No:** ${userData.contactPhNo || 'N/A'}
💰 **Fee:** ${userData.fee || 'N/A'}

🕒 **Time:** ${userData.time || 'N/A'}
🖼️ **Logo URL:** ${userData.logo || 'N/A'}
        `.trim();
    } else if (mode === '5vs5') {
        detailsCaption = `
🎮 **Mode:** 5VS5 Squad
━━━━━━━━━━━━━━━━━━━
👤 **User ID:** ${userData.userId || 'N/A'}
🛡️ **Squad Name:** ${userData.sqName || 'N/A'}

🐾 **Roamer:** ${userData.roamer?.name || 'N/A'} (ID: ${userData.roamer?.id || 'N/A'})
⚔️ **EXP:** ${userData.exp?.name || 'N/A'} (ID: ${userData.exp?.id || 'N/A'})
💰 **Gold:** ${userData.gold?.name || 'N/A'} (ID: ${userData.gold?.id || 'N/A'})
🔮 **Mid:** ${userData.mid?.name || 'N/A'} (ID: ${userData.mid?.id || 'N/A'})
🌿 **Jungle:** ${userData.jungle?.name || 'N/A'} (ID: ${userData.jungle?.id || 'N/A'})

💳 **KPay Name:** ${userData.kpayName || 'N/A'}
📱 **KPay Ph No:** ${userData.kpayPhNo || 'N/A'}
📞 **Contact Ph No:** ${userData.contactPhNo || 'N/A'}
💰 **Fee:** ${userData.fee || 'N/A'}

🕒 **Time:** ${userData.time || 'N/A'}
🖼️ **Logo URL:** ${userData.logo || 'N/A'}
        `.trim();
    } else if (mode === 'tournament') {
        detailsCaption = `
🎮 **Mode:** Tournament
━━━━━━━━━━━━━━━━━━━
👤 **User ID:** ${userData.userId || 'N/A'}
🏆 **Team Name:** ${userData.teamName || 'N/A'}
📌 **Slot:** ${userData.slot || 'N/A'} | 🎯 **Selected:** ${userData.selectedSlot || 'N/A'}

💳 **KPay Name:** ${userData.kpayAccountName || 'N/A'}
📱 **KPay Ph No:** ${userData.kpayPhoneNumber || 'N/A'}
📞 **Contact Ph No:** ${userData.contactPhoneNumber || 'N/A'}
💰 **Fee:** ${userData.fee || 'N/A'}

🕒 **Time:** ${userData.time || 'N/A'}
🖼️ **Team Logo URL:** ${userData.teamLogo || 'N/A'}
        `.trim();
    } else if (collectionName === 'refund_requests') {
        detailsCaption = `
💸 **REFUND REQUEST** 💸
━━━━━━━━━━━━━━━━━━━
👤 **User ID:** ${userData.userId || 'N/A'}
🎮 **Mode/Type:** ${userData.mode || 'N/A'} / ${userData.type || 'N/A'}
📦 **Quantity:** ${userData.qty || '1'}
💳 **KPay Name:** ${userData.kpayName || 'N/A'}
📱 **KPay Ph No:** ${userData.kpayPhNo || 'N/A'}
📞 **Contact Ph No:** ${userData.contactPhNo || 'N/A'}
💰 **Amount:** ${userData.amount || 'N/A'}
🕒 **Time:** ${userData.time || 'N/A'}
        `.trim();
    } else {
        detailsCaption = `🎮 **Mode:** ${mode}`;
    }

    const titleHeader = collectionName === 'refund_requests' 
        ? "🔄 **NEW REFUND REQUEST** 🔄" 
        : "🚀 **NEW REGISTRATION** 🚀";

    const caption = `${titleHeader}\n━━━━━━━━━━━━━━━━━━━\n${detailsCaption}`.trim();

    const inlineKeyboard = {
        inline_keyboard: [
            [
                { text: "✅ Confirm", callback_data: `confirm_${collectionName}_${docId}` },
                { text: "❌ Reject", callback_data: `reject_${collectionName}_${docId}` }
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
        form.append('photo', imageBuffer, { filename: 'payment_slip.jpg', contentType: 'image/jpeg' });
        form.append('caption', caption);
        form.append('parse_mode', 'Markdown');
        form.append('reply_markup', JSON.stringify(inlineKeyboard));

        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
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

// 2. 🆕 လူခေါ် Post / Recruitment Card များကို Telegram Channel သို့ ပို့ပေးသော Function (ထပ်ထည့်လိုက်သည်)
async function sendRecruitmentToTelegram(recruitmentData) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHANNEL_ID = process.env.RECRUITMENT_CHANNEL_ID;

    if (!BOT_TOKEN || !CHANNEL_ID) {
        console.error("Telegram Token or Recruitment Channel ID is missing.");
        return { success: false, message: "Telegram config missing" };
    }

    const { fee, role, username, userProfileLink } = recruitmentData;

    const channelMessage = `🔥 <b>PLAYER RECRUITMENT</b> 🔥\n` +
                           `━━━━━━━━━━━━━━━━━━━\n` +
                           `💰 <b>Fee:</b> ${fee}\n` +
                           `🎯 <b>Looking For:</b> ${role}\n` +
                           `👤 <b>Contact:</b> <a href="${userProfileLink}">${username}</a>\n\n` +
                           `⚡️ စိန်ခေါ်ရန် သို့မဟုတ် ဆက်သွယ်ရန် အောက်ပါ ခလုတ်ကို နှိပ်ပါ။`;

    const channelKeyboard = {
        inline_keyboard: [
            [
                { text: `💬 Contact ${username}`, url: userProfileLink }
            ]
        ]
    };

    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: channelMessage,
                parse_mode: 'HTML',
                reply_markup: channelKeyboard
            })
        });

        const result = await res.json();
        return result.ok ? { success: true } : { success: false, error: result };
    } catch (error) {
        console.error("Telegram Recruitment Send Error:", error);
        return { success: false, message: error.message };
    }
}

// Function နှစ်ခုစလုံးကို Export လုပ်ပေးခြင်း
module.exports = { 
    sendRegistrationToTelegram, 
    sendRecruitmentToTelegram 
};