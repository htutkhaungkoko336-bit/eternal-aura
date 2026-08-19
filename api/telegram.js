const fetch = require('node-fetch');
const FormData = require('form-data');

async function sendRegistrationToTelegram(userData, paymentSlipBase64) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const GROUP_ID = process.env.REGISTRATION_GROUP_ID;

    if (!BOT_TOKEN || !GROUP_ID) {
        console.error("Telegram Token or Registration Group ID is missing.");
        return { success: false, message: "Telegram config missing" };
    }

    const mode = userData.mode || 'N/A';
    let detailsCaption = '';

    // Mode တစ်ခုချင်းစီအလိုက် ပေါ်မယ့် အချက်အလက်များ သတ်မှတ်ခြင်း
    if (mode === '1vs1') {
        detailsCaption = `
🎮 **Mode:** 1VS1
👤 **In-Game Name:** ${userData.inGameName || userData.gameName || 'N/A'}
🆔 **Game ID:** ${userData.gameId || userData.playerId || 'N/A'}
🦸 **Hero:** ${userData.heroName || 'N/A'}
💳 **KPay Name:** ${userData.kpayName || 'N/A'}
📱 **KPay Ph No:** ${userData.kpayPhNo || userData.kpayPhoneNumber || 'N/A'}
        `.trim();
    } 
    else if (mode === '5vs5') {
        detailsCaption = `
🎮 **Mode:** 5VS5 Squad
🛡️ **Squad Name:** ${userData.sqName || 'N/A'}
🐾 **Roamer:** ${userData.roamer?.name || userData.roamerName || 'N/A'} (ID: ${userData.roamer?.id || userData.roamerId || 'N/A'})
⚔️ **EXP:** ${userData.exp?.name || userData.expName || 'N/A'} (ID: ${userData.exp?.id || userData.expId || 'N/A'})
💰 **Gold:** ${userData.gold?.name || userData.goldName || 'N/A'} (ID: ${userData.gold?.id || userData.goldId || 'N/A'})
🔮 **Mid:** ${userData.mid?.name || userData.midName || 'N/A'} (ID: ${userData.mid?.id || userData.midId || 'N/A'})
🌿 **Jungle:** ${userData.jungle?.name || userData.jungleName || 'N/A'} (ID: ${userData.jungle?.id || userData.jungleId || 'N/A'})
        `.trim();
    } 
    else if (mode === 'tournament') {
        detailsCaption = `
🎮 **Mode:** Tournament (${userData.selectedSlot || userData.slot || 'N/A'})
🏆 **Team Name:** ${userData.teamName || 'N/A'}
🛡️ **Roamer:** ${userData.playerRoamer?.name || 'N/A'} (${userData.playerRoamer?.gameId || 'N/A'})
⚔️ **EXP:** ${userData.playerExp?.name || 'N/A'} (${userData.playerExp?.gameId || 'N/A'})
💰 **Gold:** ${userData.playerGold?.name || 'N/A'} (${userData.playerGold?.gameId || 'N/A'})
🔮 **Mid:** ${userData.playerMid?.name || 'N/A'} (${userData.playerMid?.gameId || 'N/A'})
🌿 **Jungle:** ${userData.playerJungle?.name || 'N/A'} (${userData.playerJungle?.gameId || 'N/A'})
        `.trim();
    } else {
        detailsCaption = `🎮 **Mode:** ${mode}`;
    }

    // Admin Group ထဲ ပို့မည့် စာသားပုံစံအပြည့်အစုံ
    const caption = `
🚨 **New Registration Pending!** 🚨

${detailsCaption}

📞 **Contact Phone:** ${userData.contactPhoneNumber || userData.contactPhNo || 'N/A'}
💰 **Total Fee:** ${userData.fee || userData.totalFee || 'N/A'}
👤 **User ID:** ${userData.userId || 'N/A'}
    `.trim();

    // Confirm နဲ့ Reject ခလုတ်များ
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