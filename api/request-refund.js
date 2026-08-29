const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    }) 
  : getApps()[0];

const db = getFirestore(app);

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    try {
        const { userId, mode, type, qty, kpayName, kpayPhone, paymentSlipBase64 } = req.body;

        if (!userId || !mode || !type || !qty || !kpayName || !kpayPhone) {
            return res.status(400).json({ success: false, message: "Missing required refund fields" });
        }

        // 1. Firestore တွင် refund_requests collection ထဲသို့ PENDING အနေဖြင့် မှတ်တမ်းတင်ခြင်း
        const refundRef = await db.collection('refund_requests').add({
            userId,
            mode,
            type,
            qty,
            kpayName,
            kpayPhone,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        });

        const docId = refundRef.id;
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const GROUP_ID = process.env.REFUND_GROUP_ID; // Environment ထဲက Refund Group ID ကို သုံးမည်

        if (!BOT_TOKEN || !GROUP_ID) {
            return res.status(500).json({ success: false, message: "Telegram bot configuration missing" });
        }

        // Telegram သို့ ပို့မည့် Message ပုံစံ
        const caption = `
🔄 **NEW REFUND REQUEST** 🔄
━━━━━━━━━━━━━━━━━━━
👤 **User ID:** ${userId}
🎮 **Mode:** ${mode.toUpperCase()} (${type})
🔑 **Qty to Refund:** ${qty} Keys
💳 **KPay Name:** ${kpayName}
📱 **KPay Phone:** ${kpayPhone}
        `.trim();

        const inlineKeyboard = {
            inline_keyboard: [
                [
                    { text: "✅ Confirm Refund", callback_data: `confirm_refund_requests_${docId}` },
                    { text: "❌ Reject", callback_data: `reject_refund_requests_${docId}` }
                ]
            ]
        };

        // Payment Slip ပုံပါ ပို့မည် (သို့မဟုတ် ပုံမပါရင် sendMessage သုံးမည်)
        let telegramRes;
        if (paymentSlipBase64) {
            let base64Data = paymentSlipBase64;
            if (base64Data.includes(',')) {
                base64Data = base64Data.split(',')[1];
            }
            const imageBuffer = Buffer.from(base64Data, 'base64');

            const form = new FormData();
            form.append('chat_id', GROUP_ID);
            form.append('photo', imageBuffer, { filename: 'refund_slip.jpg', contentType: 'image/jpeg' });
            form.append('caption', caption);
            form.append('parse_mode', 'Markdown');
            form.append('reply_markup', JSON.stringify(inlineKeyboard));

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: form,
                headers: form.getHeaders()
            });
            telegramRes = await response.json();
        } else {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: GROUP_ID,
                    text: caption,
                    parse_mode: 'Markdown',
                    reply_markup: inlineKeyboard
                })
            });
            telegramRes = await response.json();
        }

        if (!telegramRes.ok) {
            return res.status(500).json({ success: false, message: "Failed to send message to Telegram group" });
        }

        return res.status(200).json({ success: true, message: "Refund request submitted successfully" });

    } catch (error) {
        console.error("Refund Request Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};