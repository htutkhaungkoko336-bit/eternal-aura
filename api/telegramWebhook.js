const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');

const app = getApps().length === 0 
    ? initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      }) 
    : getApps()[0];

const db = getFirestore(app);

function generateUniqueUserId() {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AURA-${randomStr}`;
}

function getYangonTimeStr() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const yangonTime = new Date(utc + (3600000 * 6.5));
    const dateStr = `${yangonTime.getDate()}-${yangonTime.getMonth() + 1}-${yangonTime.getFullYear()}`;
    let hours = yangonTime.getHours();
    const minutes = yangonTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${dateStr}    ${hours}:${minutes} ${ampm}`;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(200).send('Webhook is active');
    }

    try {
        const update = req.body || {};

        // Telegram က ဘာပဲ ပို့ပို့ Server ဘက်က 400 မတက်စေရန် Telegram Request ဟုတ်မဟုတ် စစ်ဆေးခြင်း
        const isTelegramUpdate = update.callback_query || update.message || update.inline_query;

        // -------------------------------------------------------------
        // 🔥 0. Match Code ဖြင့် Active Room ကို ရှာပြီး Data ပြန်ထုတ်ပေးသော Logic (API / Frontend မှ လှမ်းခေါ်စဉ်)
        // -------------------------------------------------------------
        if (update.action === 'search_by_matchcode') {
            const { matchCode } = update;
            
            if (!matchCode) {
                return res.status(400).json({ success: false, message: "Missing matchCode" });
            }

            const roomSnapshot = await db.collection('active_rooms')
                .where('matchCode', '==', matchCode.trim())
                .get();

            if (roomSnapshot.empty) {
                return res.status(404).json({ 
                    success: false, 
                    message: "ပေးထားသော Match Code နှင့် ကိုက်ညီသော Active Room ရှမတွေ့ပါ။" 
                });
            }

            let roomData = null;
            roomSnapshot.forEach(doc => {
                roomData = {
                    roomId: doc.id,
                    ...doc.data()
                };
            });

            return res.status(200).json({
                success: true,
                message: "Match Code နှင့် ကိုက်ညီသော Room အချက်အလက်များ ရရှိပါပြီ။",
                room: roomData
            });
        }

// -------------------------------------------------------------
// 🔥 Telegram Bot Match Search Code (Inline Buttons များနှင့် Winner ရွေးချယ်ရန် Confirm တောင်းသော ပုံစံ)
// -------------------------------------------------------------
if (update.message && update.message.text) {
    const messageText = update.message.text.trim();
    const chatId = update.message.chat.id;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (messageText.startsWith('REV-') || messageText.startsWith('/search') || messageText.length === 10) {
        const matchCode = messageText.startsWith('/search') 
            ? messageText.split(' ')[1] 
            : messageText;

        if (matchCode) {
            const cleanMatchCode = matchCode.trim().toUpperCase();

            const roomSnapshot = await db.collection('active_rooms')
                .where('matchCode', '==', cleanMatchCode)
                .get();

            let replyMessage = "";
            let hostTeamName = "Host";
            let joinerTeamName = "Joiner";
            let docId = "";

            if (roomSnapshot.empty) {
                replyMessage = `❌ ပေးထားသော Match Code (${cleanMatchCode}) နှင့် ကိုက်ညီသော Active Room ရှမတွေ့ပါ။`;
            } else {
                let roomInfo = `✅ Match Code တွေ့ရှိပါပြီ!\n\n`;
                
                roomSnapshot.forEach(doc => {
                    const d = doc.data();
                    docId = doc.id; // Callback query အတွက် ID ယူခြင်း
                    hostTeamName = d.teamName || 'Host';
                    joinerTeamName = d.joinerTeamName || 'Joiner';

                    roomInfo += `📌 Room ID: ${doc.id}\n`;
                    roomInfo += `🔑 Match Code: ${d.matchCode || '-'}\n`;
                    roomInfo += `🏷 Room Title: ${d.roomTitle || '-'}\n`;
                    roomInfo += `🎮 Mode: ${d.mode || '-'}\n`;
                    roomInfo += `💰 Fee Type: ${d.keyType || '-'}\n`;
                    roomInfo += `🏆 BO Type: ${d.boType || '-'}\n`;
                    roomInfo += `📊 Status: ${d.status || '-'}\n\n`;
                    
                    // 🔥 HOST အချက်အလက်များ
                    roomInfo += `👑 HOST (Room Owner):\n`;
                    roomInfo += `- User ID: ${d.hostId || '-'}\n`;
                    roomInfo += `- Contact Ph: ${d.contactPhNo || '-'}\n`;
                    roomInfo += `- Team Name: ${hostTeamName}\n`;
                    roomInfo += `- In-Game Name: ${d.inGameName || '-'}\n`;
                    roomInfo += `- Game ID: ${d.gameId || '-'}\n`;
                    roomInfo += `- Squad: ${d.sqName || '-'}\n`;
                    roomInfo += `- Kpay Name: ${d.kpayName || '-'}\n`;
                    roomInfo += `- Kpay Ph: ${d.kpayPhNo || '-'}\n`;

                    if (d.mode === '5v5') {
                        roomInfo += `  ⚔️ Mid: ${d.mid?.name || '-'} (ID: ${d.mid?.id || '-'})\n`;
                        roomInfo += `  🛡 Roamer: ${d.roamer?.name || '-'} (ID: ${d.roamer?.id || '-'})\n`;
                        roomInfo += `  🗡 Exp: ${d.exp?.name || '-'} (ID: ${d.exp?.id || '-'})\n`;
                        roomInfo += `  🪙 Gold: ${d.gold?.name || '-'} (ID: ${d.gold?.id || '-'})\n`;
                        roomInfo += `  🌿 Jungle: ${d.jungle?.name || '-'} (ID: ${d.jungle?.id || '-'})\n\n`;
                    } else {
                        roomInfo += `\n`;
                    }

                    // 🔥 JOINER အချက်အလက်များ
                    roomInfo += `⚔️ JOINER:\n`;
                    roomInfo += `- User ID: ${d.joinedUserId || '-'}\n`;
                    roomInfo += `- Contact Ph: ${d.joinerContactPhNo || '-'}\n`;
                    roomInfo += `- Team Name: ${joinerTeamName}\n`;
                    roomInfo += `- In-Game Name: ${d.joinerInGameName || '-'}\n`;
                    roomInfo += `- Game ID: ${d.joinerGameId || '-'}\n`;
                    roomInfo += `- Squad: ${d.joinerSqName || '-'}\n`;
                    roomInfo += `- Kpay Name: ${d.joinerKpayName || '-'}\n`;
                    roomInfo += `- Kpay Ph: ${d.joinerKpayPhNo || '-'}\n`;

                    if (d.mode === '5v5') {
                        roomInfo += `  ⚔️ Mid: ${d.joinerMid?.name || '-'} (ID: ${d.joinerMid?.id || '-'})\n`;
                        roomInfo += `  🛡 Roamer: ${d.joinerRoamer?.name || '-'} (ID: ${d.joinerRoamer?.id || '-'})\n`;
                        roomInfo += `  🗡 Exp: ${d.joinerExp?.name || '-'} (ID: ${d.joinerExp?.id || '-'})\n`;
                        roomInfo += `  🪙 Gold: ${d.joinerGold?.name || '-'} (ID: ${d.joinerGold?.id || '-'})\n`;
                        roomInfo += `  🌿 Jungle: ${d.joinerJungle?.name || '-'} (ID: ${d.joinerJungle?.id || '-'})\n`;
                    }
                });
                
                replyMessage = roomInfo;
            }

            // Button များနှင့် စာသားများ ထည့်သွင်းခြင်း
            const requestBody = {
                chat_id: chatId,
                text: replyMessage
            };

            if (!roomSnapshot.empty) {
                replyMessage += `\n🎯 **Winner Team ရွေးချယ်ပါ**`; // ပုံမှန်စာသားအောက်တွင် ထပ်ထည့်ပေးခြင်း
                requestBody.text = replyMessage;
                requestBody.reply_markup = {
                    inline_keyboard: [
                        [
                            { text: `🏆 ${hostTeamName} (Win)`, callback_data: `win_${docId}_host` },
                            { text: `🏆 ${joinerTeamName} (Win)`, callback_data: `win_${docId}_joiner` }
                        ]
                    ]
                };
            }

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            return res.status(200).json({ status: 'success' });
        }
    }
}

// -------------------------------------------------------------
// 🔥 Checkbox ဖြင့် အတည်ပြုပြီးမှ Winner သတ်မှတ်သည့် Callback Query Handler
// -------------------------------------------------------------
if (update.callback_query) {
    const callbackQuery = update.callback_query;
    const callbackData = callbackQuery.data;
    const queryId = callbackQuery.id;
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    // ၁။ အမှန်ခြစ် (Checkbox) ခလုတ်ကို နှိပ်လိုက်သောအခါ
    if (callbackData && callbackData.startsWith('toggle_check_')) {
        const roomId = callbackData.split('_')[2];

        try {
            const roomRef = db.collection('active_rooms').doc(roomId);
            const roomDoc = await roomRef.get();

            if (!roomDoc.exists) {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        callback_query_id: queryId,
                        text: "❌ ဤ Room အား ရှာမတွေ့တော့ပါ။",
                        show_alert: true
                    })
                });
                return res.status(200).json({ status: 'error', message: 'Room not found' });
            }

            const roomData = roomDoc.data();
            const hostName = roomData.teamName || 'Host';
            const joinerName = roomData.joinerTeamName || 'Joiner';

            // လက်ရှိ အမှန်ခြစ် အခြေအနေကို ပြောင်းပြန်လှန်မည် (True ဖြစ်လျှင် False၊ False ဖြစ်လျှင် True)
            const currentChecked = roomData.isChecked || false;
            const newCheckedState = !currentChecked;

            // Firestore ထဲတွင် isChecked အခြေအနေကို Update လုပ်ခြင်း
            await roomRef.update({
                isChecked: newCheckedState
            });

            // ခလုတ်ပုံစံကို အမှန်ခြစ်ပါသည်/မပါသည် ပြောင်းလဲပြသရန် Message ကို Edit လုပ်ခြင်း
            const originalText = callbackQuery.message.text.split('\n\n-------------------')[0];
            const checkTextLabel = newCheckedState ? "☑️ အမှန်ခြစ်ပြီးပါပြီ (Checked)" : "🔲 အမှန်ခြစ်ရန် (Unchecked)";

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: messageId,
                    text: originalText,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: checkTextLabel, callback_data: `toggle_check_${roomId}` }
                            ],
                            [
                                { text: `🏆 ${hostName} (Win)`, callback_data: `win_${roomId}_host` },
                                { text: `🏆 ${joinerName} (Win)`, callback_data: `win_${roomId}_joiner` }
                            ]
                        ]
                    }
                })
            });

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    callback_query_id: queryId,
                    text: newCheckedState ? "✅ အမှန်ခြစ်ပြီးပါပြီ။ ယခု Winner ခလုတ်ကို နှိပ်နိုင်ပါပြီ။" : "☑️ အမှန်ခြစ်ကို ဖြုတ်လိုက်ပါပြီ။",
                    show_alert: false
                })
            });

        } catch (error) {
            console.error("Toggle Check Error:", error);
        }

        return res.status(200).json({ status: 'success' });
    }

    // ၂။ Winner ခလုတ်ကို နှိပ်လိုက်သောအခါ (အမှန်ခြစ်ထားမှသာ Winner သတ်မှတ်မည်)
    if (callbackData && callbackData.startsWith('win_')) {
        const parts = callbackData.split('_');
        const winningSide = parts[2]; // 'host' သို့မဟုတ် 'joiner'
        const roomId = parts[1];

        try {
            const roomRef = db.collection('active_rooms').doc(roomId);
            const roomDoc = await roomRef.get();

            if (!roomDoc.exists) {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        callback_query_id: queryId,
                        text: "❌ ဤ Room အား ရှာမတွေ့တော့ပါ။",
                        show_alert: true
                    })
                });
                return res.status(200).json({ status: 'error', message: 'Room not found' });
            }

            const roomData = roomDoc.data();

            // 🔥 အမှန်ခြစ် (Checkbox) ခြစ်ထားခြင်း ရှိမရှိ စစ်ဆေးခြင်း
            if (!roomData.isChecked) {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        callback_query_id: queryId,
                        text: "❌ ကျေးဇူးပြု၍ ပထမဦးဆုံး အပေါ်က Checkbox လေးကို အရင်နှိပ်ပြီး အမှန်ခြစ်ပေးပါ။",
                        show_alert: true
                    })
                });
                return res.status(200).json({ status: 'error', message: 'Not checked yet' });
            }

            const winnerTeamName = winningSide === 'host' ? (roomData.teamName || 'Host') : (roomData.joinerTeamName || 'Joiner');
            const winnerUserId = winningSide === 'host' ? roomData.hostId : roomData.joinedUserId;

            // 🔥 Firestore ထဲတွင် winnerTeam, winnerId နှင့် status ကို update လုပ်ခြင်း
            await roomRef.update({
                winnerTeam: winnerTeamName,
                winnerId: winnerUserId,
                winningSide: winningSide,
                status: 'completed'
            });

            // Screen အလယ်တွင် Pop-up Alert ပေါ်လာစေရန်
            const alertText = `⚠️ သေချာပါပြီလား? ${winnerTeamName} အား Winner အဖြစ် အတည်ပြုပြီးပါပြီ။`;

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    callback_query_id: queryId,
                    text: alertText,
                    show_alert: true
                })
            });

            // Chat ထဲတွင် Winner အတည်ပြုပြီးကြောင်း စာသားပို့ပေးခြင်း
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `🏆 ဤ Match အတွက် Winner Team မှာ **${winnerTeamName}** ဖြစ်ကြောင်း အတည်ပြုပြီးပါပြီ။`,
                    parse_mode: 'Markdown'
                })
            });

        } catch (error) {
            console.error("Set Winner Error:", error);
        }

        return res.status(200).json({ status: 'success' });
    }
}

// -------------------------------------------------------------
// 🔥 3။ Telegram ထဲသို့ Room စတင်ပို့ဆောင်သော Code အပိုင်း (Checkbox ပါဝင်သည်)
// -------------------------------------------------------------
// (အောက်ပါ ကုဒ်ကို Room ဖန်တီးသည့်နေရာ သို့မဟုတ် sendMessage လုပ်သည့်နေရာတွင် ထည့်သုံးပါ)

await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        chat_id: chatId,
        text: roomMessageText,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                // 🔥 ဤနေရာတွင် Checkbox ခလုတ်ကို အပေါ်ဆုံး၌ ထည့်ပေးထားပါသည်
                [
                    { text: `🔲 အမှန်ခြစ်ရန် (Unchecked)`, callback_data: `toggle_check_${roomId}` }
                ],
                // မူလ Winner ခလုတ်များ
                [
                    { text: `🏆 ${hostName} (Win)`, callback_data: `win_${roomId}_host` },
                    { text: `🏆 ${joinerName} (Win)`, callback_data: `win_${roomId}_joiner` }
                ]
            ]
        }
    })
});

        // 1. Telegram Callback Query (Admin Action) လုပ်ဆောင်ချက်များ
        // -------------------------------------------------------------
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const data = callbackQuery.data; 
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;
            const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

            console.log("Received callback data:", data);

            const parts = data.split('_');
            const action = parts[0]; 
            
            let collectionName = "";
            let docId = "";
            let reasonKey = "";

            if (parts[1] === 'refund' && parts[2] === 'requests') {
                collectionName = 'refund_requests';
                docId = parts[3];
            } else if (action === 'select') {
                reasonKey = parts[1]; 
                if (parts[2] === 'refund' && parts[3] === 'requests') {
                    collectionName = 'refund_requests';
                    docId = parts[4];
                } else {
                    collectionName = `${parts[2]}_${parts[3]}`;
                    docId = parts[4];
                }
            } else {
                collectionName = `${parts[1]}_${parts[2]}`; 
                docId = parts[3];
            }

            let newStatus = "";
            let responseText = "";
            let updateKeyboard = false;
            let newInlineKeyboard = [];

            const prefix = collectionName;

            if (action === 'confirm') {
                newStatus = 'CONFIRMED';
                responseText = "✅ This request has been CONFIRMED.";
                updateKeyboard = true;
                newInlineKeyboard = []; 
            }
            else if (action === 'reject') {
                responseText = "⚠️ ပယ်ချရမည့် အကြောင်းရင်းကို ရွေးချယ်ပါ:";
                updateKeyboard = true;
                newInlineKeyboard = [
                    [{ text: "🚫 ညစ်ညမ်းပုံ/မသင့်လျော်သောပုံ", callback_data: `select_r1_${prefix}_${docId}` }],
                    [{ text: "⚠️ Game Name/ID မှားယွင်း", callback_data: `select_r2_${prefix}_${docId}` }],
                    [{ text: "💰 ငွေပမာဏ မမှန်", callback_data: `select_r3_${prefix}_${docId}` }],
                    [{ text: "📝 အချက်အလက် မပြည့်စုံ", callback_data: `select_r4_${prefix}_${docId}` }],
                    [{ text: "🔄 အကောင့်အမည်/ဖုန်းနံပါတ် မှားယွင်း", callback_data: `select_r5_${prefix}_${docId}` }],
                    [{ text: "🔙 Back", callback_data: `back_${prefix}_${docId}` }]
                ];
            }
            else if (action === 'select') {
                const reasonsMap = {
                    'r1': 'ညစ်ညမ်းပုံ/မသင့်လျော်သောပုံများပါဝင်နေပါသည်။',
                    'r2': 'Game Name / Game ID မှားယွင်းနေပါသည်',
                    'r3': 'ငွေပမာဏ လျော့နည်းနေပါသည်။',
                    'r4': 'အချက်အလက်များ မပြည့်စုံပါ',
                    'r5': 'K pay Phone Number / Name မှားယွင်းနေပါသည်။'
                };
                
                const rejectionReasonText = reasonsMap[reasonKey] || 'အခြားအကြောင်းပြချက်ဖြင့် ပယ်ချပါသည်';
                newStatus = 'REJECTED';
                responseText = `❌ REJECTED\nReason: ${rejectionReasonText}`;
                updateKeyboard = true;
                newInlineKeyboard = []; 
                
                if (collectionName && docId) {
                    try {
                        const regDocRef = db.collection(collectionName).doc(docId);
                        await regDocRef.update({
                            status: 'REJECTED',
                            rejectionReason: rejectionReasonText
                        });
                    } catch (dbErr) {
                        console.error("Database Update Error inside select action:", dbErr);
                    }
                }
            }
            else if (action === 'back') {
                responseText = "⏳ Waiting for admin action...";
                updateKeyboard = true;
                newInlineKeyboard = [
                    [
                        { text: "✅ Confirm", callback_data: `confirm_${prefix}_${docId}` },
                        { text: "❌ Reject", callback_data: `reject_${prefix}_${docId}` }
                    ]
                ];
            }

            try {
                if (collectionName && docId && action === 'confirm') {
                    if (collectionName === 'refund_requests') {
                        const refundDocRef = db.collection('refund_requests').doc(docId);
                        await refundDocRef.update({ status: 'CONFIRMED' });

                        const refundDoc = await refundDocRef.get();
                        if (refundDoc.exists) {
                            const refundData = refundDoc.data();
                            const userId = refundData.userId;
                            const mode = (refundData.mode || '').toString().toLowerCase(); 
                            const type = (refundData.type || '').toString().toLowerCase(); 
                            const qty = Number(refundData.qty) || 1;

                            if (userId) {
                                let keyFieldToDecrement = "";
                                
                                if (mode === 'tournament') {
                                    keyFieldToDecrement = "keys.tournament";
                                } else if (mode.includes('5vs5') || mode.includes('5v5')) {
                                    if (type.includes('50k')) keyFieldToDecrement = "keys.5vs5-50k";
                                    else if (type.includes('25k')) keyFieldToDecrement = "keys.5vs5-25k";
                                    else if (type.includes('15k')) keyFieldToDecrement = "keys.5vs5-15k";
                                    else if (type.includes('10k')) keyFieldToDecrement = "keys.5vs5-10k";
                                    else keyFieldToDecrement = "keys.5vs5-5k";
                                } else {
                                    if (type.includes('50k')) keyFieldToDecrement = "keys.1vs1-50k";
                                    else if (type.includes('25k')) keyFieldToDecrement = "keys.1vs1-25k";
                                    else if (type.includes('15k')) keyFieldToDecrement = "keys.1vs1-15k";
                                    else if (type.includes('10k')) keyFieldToDecrement = "keys.1vs1-10k";
                                    else keyFieldToDecrement = "keys.1vs1-5k";
                                }

                                if (keyFieldToDecrement) {
                                    const userRef = db.collection('users').doc(userId);
                                    const userDoc = await userRef.get();
                                    if (userDoc.exists) {
                                        const userData = userDoc.data();
                                        const keysObj = userData.keys || {};
                                        const fieldKeyOnly = keyFieldToDecrement.split('.')[1];
                                        const currentQty = Number(keysObj[fieldKeyOnly]) || 0;
                                        const updatedQty = Math.max(0, currentQty - qty);

                                        await userRef.update({
                                            [keyFieldToDecrement]: updatedQty
                                        });
                                    }
                                }
                            }
                        }
                    } else {
                        const regDocRef = db.collection(collectionName).doc(docId);
                        await regDocRef.update({ status: 'CONFIRMED' });

                        const regDoc = await regDocRef.get();
                        if (regDoc.exists) {
                            const regData = regDoc.data();
                            const userId = regData.userId;

                            if (userId) {
                                let keyFieldToIncrement = "";
                                const fee = (regData.fee || "").toLowerCase();

                                if (collectionName === '1vs1_registrations') {
                                    if (fee.includes('50k')) keyFieldToIncrement = "keys.1vs1-50k";
                                    else if (fee.includes('25k')) keyFieldToIncrement = "keys.1vs1-25k";
                                    else if (fee.includes('15k')) keyFieldToIncrement = "keys.1vs1-15k";
                                    else if (fee.includes('10k')) keyFieldToIncrement = "keys.1vs1-10k";
                                    else keyFieldToIncrement = "keys.1vs1-5k"; 
                                } else if (collectionName === 'tournament_registrations') {
                                    keyFieldToIncrement = "keys.tournament";
                                } else if (collectionName === '5vs5_registrations') {
                                    if (fee.includes('50k')) keyFieldToIncrement = "keys.5vs5-50k";
                                    else if (fee.includes('25k')) keyFieldToIncrement = "keys.5vs5-25k";
                                    else if (fee.includes('15k')) keyFieldToIncrement = "keys.5vs5-15k";
                                    else if (fee.includes('10k')) keyFieldToIncrement = "keys.5vs5-10k";
                                    else keyFieldToIncrement = "keys.5vs5-5k"; 
                                }

                                if (keyFieldToIncrement) {
                                    const userRef = db.collection('users').doc(userId);
                                    const userDoc = await userRef.get();
                                    const fieldKeyOnly = keyFieldToIncrement.split('.')[1];

                                    if (!userDoc.exists || !userDoc.data().keys || userDoc.data().keys[fieldKeyOnly] === undefined) {
                                        await userRef.set({
                                            keys: { [fieldKeyOnly]: 0 }
                                        }, { merge: true });
                                    }

                                    await userRef.update({
                                        [keyFieldToIncrement]: FieldValue.increment(1)
                                    });
                                }
                            }
                        }
                    }
                }
            } catch (dbError) {
                console.error("Database Confirm Error:", dbError);
            }

            if (updateKeyboard) {
                let originalCaption = callbackQuery.message.caption || "";
                if (originalCaption.includes("\n\n*Status:")) {
                    originalCaption = originalCaption.split("\n\n*Status:")[0];
                }

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: messageId,
                        caption: `${originalCaption}\n\n*Status: ${responseText}*`,
                        parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: newInlineKeyboard } 
                    })
                });
            }

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    callback_query_id: callbackQuery.id, 
                    text: newStatus ? `Successfully ${newStatus.toLowerCase()}!` : "Please select a reason" 
                })
            });

            return res.status(200).json({ status: 'success' });
        }

        // အကယ်၍ Telegram က ပို့လာတာဖြစ်ပြီး အထက်ပါ condition တွေနဲ့ မကိုက်ရင်တောင် 400 မပေးဘဲ 200 ပြန်ရန်
        if (isTelegramUpdate) {
            return res.status(200).json({ status: 'ok' });
        }

        // -------------------------------------------------------------
        // 2. User Authentication & Registration (Device / Phone Login)
        // -------------------------------------------------------------
        const { phone, deviceId, name, pin } = req.body;

        if (!phone || !deviceId) {
            return res.status(400).json({ success: false, message: "Phone and Device ID are required" });
        }

        const usersRef = db.collection('users');

        const deviceCheckSnapshot = await usersRef.where('deviceId', '==', deviceId).get();
        let hasOtherPhoneOnThisDevice = false;
        deviceCheckSnapshot.forEach(doc => {
            if (doc.data().phone !== phone) {
                hasOtherPhoneOnThisDevice = true;
            }
        });

        if (hasOtherPhoneOnThisDevice && !name && !pin) {
            const phoneCheck = await usersRef.where('phone', '==', phone).get();
            if (phoneCheck.empty) {
                return res.status(400).json({ 
                    success: false, 
                    message: "This device is already bound to another phone number." 
                });
            }
        }

        const snapshot = await usersRef.where('phone', '==', phone).get();

        if (snapshot.empty) {
            if (!name || !pin) {
                return res.status(200).json({ 
                    requiresRegistration: true, 
                    message: "Phone not found. Please provide name and PIN." 
                });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPin = bcrypt.hashSync(pin, salt);
            const userId = generateUniqueUserId();
            const createdAtStr = getYangonTimeStr();
            const defaultRole = 'user';

            const defaultKeys = {
                "1vs1-5k": 0,
                "1vs1-10k": 0,
                "1vs1-15k": 0,
                "1vs1-25k": 0,
                "1vs1-50k": 0,
                "5vs5-5k": 0,
                "5vs5-10k": 0,
                "5vs5-15k": 0,
                "5vs5-25k": 0,
                "5vs5-50k": 0,
                "tournament": 0
            };

            const newUserData = {
                userId: userId,
                name: name,
                phone: phone,
                pin: hashedPin,
                deviceId: deviceId,
                role: defaultRole,
                keys: defaultKeys,
                createdAt: createdAtStr,
                recentLogins: []
            };

            await usersRef.doc(userId).set(newUserData);

            return res.status(200).json({ 
                success: true, 
                message: "User registered successfully", 
                name: name,
                userId: userId,
                role: defaultRole
            });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (userData.deviceId === deviceId) {
            return res.status(200).json({ 
                success: true, 
                message: "Original device matched. Login successful", 
                name: userData.name,
                userId: userData.userId,
                role: userData.role || 'user'
            });
        }

        if (!pin) {
            return res.status(200).json({ 
                requiresPassword: true, 
                message: "Different device detected. Please enter PIN." 
            });
        }

        const isPasswordValid = bcrypt.compareSync(pin, userData.pin);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Incorrect PIN. Access denied." });
        }

        const loginRecord = {
            deviceId: deviceId,
            loginTime: getYangonTimeStr()
        };

        await usersRef.doc(userData.userId).update({
            recentLogins: FieldValue.arrayUnion(loginRecord)
        });

        return res.status(200).json({ 
            success: true, 
            message: "Login successful on another device with PIN", 
            name: userData.name,
            userId: userData.userId,
            role: userData.role || 'user'
        });

    } catch (error) {
        console.error("Auth/Webhook Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};