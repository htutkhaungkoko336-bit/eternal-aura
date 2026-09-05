const fetch = require('node-fetch');
const FormData = require('form-data');

// Collection အမည်များကို အတိုကောက် Mapping ပြုလုပ်ခြင်း (Callback Data ၆၄ လုံး အောက်တွင် ဆံ့စေရန်)
const collectionMap = {
    '1vs1_registrations': 'r1',
    '5vs5_registrations': 'r5',
    'tournament_registrations': 'rt',
    'refund_requests': 'ref'
};

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
    } 
    else if (mode === '5vs5') {
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
    } 
    else if (mode === 'tournament') {
        detailsCaption = `
🎮 **Mode:** Tournament
━━━━━━━━━━━━━━━━━━━
👤 **User ID:** ${userData.userId || 'N/A'}
🏆 **Team Name:** ${userData.teamName || 'N/A'}
📌 **Slot:** ${userData.slot || 'N/A'} | 🎯 **Selected:** ${userData.selectedSlot || 'N/A'}

🛡️ **Roamer:** ${userData.playerRoamer?.name || 'N/A'} (${userData.playerRoamer?.gameId || 'N/A'})
⚔️ **EXP:** ${userData.playerExp?.name || 'N/A'} (${userData.playerExp?.gameId || 'N/A'})
💰 **Gold:** ${userData.playerGold?.name || 'N/A'} (${userData.playerGold?.gameId || 'N/A'})
🔮 **Mid:** ${userData.playerMid?.name || 'N/A'} (${userData.playerMid?.id || 'N/A'})
🌿 **Jungle:** ${userData.playerJungle?.name || 'N/A'} (${userData.playerJungle?.gameId || 'N/A'})

💳 **KPay Name:** ${userData.kpayAccountName || 'N/A'}
📱 **KPay Ph No:** ${userData.kpayPhoneNumber || 'N/A'}
📞 **Contact Ph No:** ${userData.contactPhoneNumber || 'N/A'}
💰 **Fee:** ${userData.fee || 'N/A'}

🕒 **Time:** ${userData.time || 'N/A'}
🖼️ **Team Logo URL:** ${userData.teamLogo || 'N/A'}
        `.trim();
    } else {
        detailsCaption = `🎮 **Mode:** ${mode}`;
    }

    const caption = `
🚀 **NEW REGISTRATION** 🚀
━━━━━━━━━━━━━━━━━━━
${detailsCaption}
    `.trim();

    const shortCollection = collectionMap[collectionName] || collectionName;

    const inlineKeyboard = {
        inline_keyboard: [
            [
                { text: "✅ Confirm", callback_data: `confirm_${shortCollection}_${docId}` },
                { text: "❌ Reject", callback_data: `reject_${shortCollection}_${docId}` }
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