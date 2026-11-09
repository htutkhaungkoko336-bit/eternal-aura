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

function generateMatchPanelText(d, docId) {
    const hostTeamName = d.teamName || 'Host';
    const joinerTeamName = d.joinerTeamName || 'Joiner';

    let text = `🎮 <b>MATCH CONTROL PANEL</b>\n`;
    text += `━━━━━━━━━━━━━━━━━━━\n`;
    text += `📌 <b>Room ID:</b> <code>${docId}</code>\n`;
    text += `🔑 <b>Match Code:</b> <code>${d.matchCode || '-'}</code>\n`;
    text += `🏷 <b>Room Title:</b> ${d.roomTitle || '-'}\n`;
    text += `⚡️ <b>Mode:</b> ${d.mode || '-'} | <b>BO:</b> ${d.boType || '-'}\n`;
    text += `💰 <b>Fee Type:</b> ${d.keyType || '-'}\n`;
    text += `📊 <b>Status:</b> <code>${d.status || '-'}</code>\n`;
    text += `🕒 <b>Created At:</b> ${d.createdAt || '-'}\n\n`;

    text += `<blockquote expandable>`;
    text += `👑 <b>HOST TEAM:</b> ${hostTeamName}\n`;
    text += `• User ID: <code>${d.hostId || '-'}</code>\n`;
    text += `• Contact Ph: ${d.contactPhNo || '-'}\n`;
    text += `• In-Game Name: ${d.inGameName || '-'}\n`;
    text += `• Game ID: <code>${d.gameId || '-'}</code>\n`;
    text += `• Squad Name: ${d.sqName || '-'}\n`;
    if (d.mode === '1v1') {
        text += `• Hero Name: <b>${d.heroName || '-'}</b>\n`;
        text += `• First Pick: ${d.firstPick || '-'}\n`;
    }
    text += `• Kpay Name: ${d.kpayName || '-'}\n`;
    text += `• Kpay Ph: ${d.kpayPhNo || '-'}\n`;
    text += `• Host Ready: ${d.hostReady ? '✅ Yes' : '❌ No'}\n`;

    if (d.mode === '5v5') {
        text += `  -- <b>5v5 Lineup (Host)</b> --\n`;
        text += `  ⚔️ Mid: ${d.mid?.name || '-'} (ID: ${d.mid?.id || '-'})\n`;
        text += `  🛡 Roamer: ${d.roamer?.name || '-'} (ID: ${d.roamer?.id || '-'})\n`;
        text += `  🗡 Exp: ${d.exp?.name || '-'} (ID: ${d.exp?.id || '-'})\n`;
        text += `  🪙 Gold: ${d.gold?.name || '-'} (ID: ${d.gold?.id || '-'})\n`;
        text += `  🌿 Jungle: ${d.jungle?.name || '-'} (ID: ${d.jungle?.id || '-'})\n`;
    }
    text += `\n`;

    text += `⚔️ <b>JOINER TEAM:</b> ${joinerTeamName}\n`;
    text += `• User ID: <code>${d.joinedUserId || '-'}</code>\n`;
    text += `• Contact Ph: ${d.joinerContactPhNo || '-'}\n`;
    text += `• In-Game Name: ${d.joinerInGameName || '-'}\n`;
    text += `• Game ID: <code>${d.joinerGameId || '-'}</code>\n`;
    text += `• Squad Name: ${d.joinerSqName || '-'}\n`;
    if (d.mode === '1v1') {
        text += `• Hero Name: <b>${d.joinerHeroName || '-'}</b>\n`;
    }
    text += `• Kpay Name: ${d.joinerKpayName || '-'}\n`;
    text += `• Kpay Ph: ${d.joinerKpayPhNo || '-'}\n`;
    text += `• Joiner Ready: ${d.joinerReady ? '✅ Yes' : '❌ No'}\n`;

    if (d.mode === '5v5') {
        text += `  -- <b>5v5 Lineup (Joiner)</b> --\n`;
        text += `  ⚔️ Mid: ${d.joinerMid?.name || '-'} (ID: ${d.joinerMid?.id || '-'})\n`;
        text += `  🛡 Roamer: ${d.joinerRoamer?.name || '-'} (ID: ${d.joinerRoamer?.id || '-'})\n`;
        text += `  🗡 Exp: ${d.joinerExp?.name || '-'} (ID: ${d.joinerExp?.id || '-'})\n`;
        text += `  🪙 Gold: ${d.joinerGold?.name || '-'} (ID: ${d.joinerGold?.id || '-'})\n`;
        text += `  🌿 Jungle: ${d.joinerJungle?.name || '-'} (ID: ${d.joinerJungle?.id || '-'})\n`;
    }
    text += `</blockquote>`;

    if (d.winnerTeam) {
        text += `\n━━━━━━━━━━━━━━━━━━━\n`;
        text += `🏆 <b>Winner Team:</b> ${d.winnerTeam} အနိုင်ရသွားပါပြီ။ ✅`;
    } else {
        text += `\n━━━━━━━━━━━━━━━━━━━`;
    }

    return text;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(200).send('Webhook is active');
    }

    try {
        const update = req.body || {};
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHANNEL_ID = process.env.RECRUITMENT_CHANNEL_ID;

        const isTelegramUpdate = update.callback_query || update.message || update.inline_query;

        // -------------------------------------------------------------
        // 🔥 0. Match Code ဖြင့် Active Room ကို ရှာခြင်း (API / Frontend)
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
        // 🔥 1. Telegram Bot Messages (/start Command & Match Search)
        // -------------------------------------------------------------
        if (update.message && update.message.text) {
            const messageText = update.message.text.trim();
            const chatId = update.message.chat.id;

            // 🎯 /start ဖြင့် လူခေါ်ခြင်း Flow ကို စတင်ခြင်း
            if (messageText.startsWith('/start')) {
                const inlineKeyboard = {
                    inline_keyboard: [
                        [
                            { text: "5k", callback_data: `fee_5k` },
                            { text: "10k", callback_data: `fee_10k` },
                            { text: "15k", callback_data: `fee_15k` }
                        ],
                        [
                            { text: "25k", callback_data: `fee_25k` },
                            { text: "50k", callback_data: `fee_50k` }
                        ]
                    ]
                };

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "🔥 <b>Eternal Aura Matchmaking Bot</b> 🔥\n\n💰 <b>Match Fee ဘယ်လောက်နဲ့ ကစားမှာလဲ?</b>\nကျေးဇူးပြု၍ အောက်ပါတို့မှ တစ်ခုကို ရွေးချယ်ပါ။",
                        parse_mode: 'HTML',
                        reply_markup: inlineKeyboard
                    })
                });
                return res.status(200).json({ status: 'success' });
            }

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
                    let docId = "";
                    let isCompleted = false;

                    if (roomSnapshot.empty) {
                        replyMessage = `❌ <b>Match ရှာမတွေ့ပါ။</b>\nပေးထားသော Code (${cleanMatchCode}) နှင့် ကိုက်ညီသော Active Room မရှိပါ။`;
                    } else {
                        roomSnapshot.forEach(doc => {
                            const d = doc.data();
                            docId = doc.id; 
                            if (d.winnerTeam) isCompleted = true;

                            replyMessage = generateMatchPanelText(d, docId);
                        });
                    }

                    const requestBody = {
                        chat_id: chatId,
                        text: replyMessage,
                        parse_mode: 'HTML'
                    };

                    if (!roomSnapshot.empty && !isCompleted) {
                        requestBody.reply_markup = {
                            inline_keyboard: [
                                [
                                    { text: `👥 Choose Team`, callback_data: `choose_team_${docId}` }
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
        // 🔥 2. Callback Query Handler (Multi-role Selection & Actions)
        // -------------------------------------------------------------
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const callbackData = callbackQuery.data;
            const queryId = callbackQuery.id;
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;

            console.log("Received callback data:", callbackData);

            // 🎯 A. Fee ရွေးပြီးပါက Multi-select Roles များ ပြပေးခြင်း
            if (callbackData && callbackData.startsWith('fee_')) {
                const fee = callbackData.split('_')[1];
                const inlineKeyboard = {
                    inline_keyboard: [
                        [
                            { text: "⚪️ Exp Laner", callback_data: `role_${fee}_Exp` },
                            { text: "⚪️ Gold Laner", callback_data: `role_${fee}_Gold` }
                        ],
                        [
                            { text: "⚪️ Mid Laner", callback_data: `role_${fee}_Mid` },
                            { text: "⚪️ Jungler", callback_data: `role_${fee}_Jungle` }
                        ],
                        [
                            { text: "⚪️ Roamer", callback_data: `role_${fee}_Roamer` }
                        ],
                        [
                            { text: "✅ Done (ပြီးပါပြီ)", callback_data: `done_${fee}` }
                        ]
                    ]
                };

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: messageId,
                        text: `✅ Fee: <b>${fee}</b> ရွေးချယ်ပြီးပါပြီ။\n\n🎯 <b>လိုချင်သော Role များကို လိုသလောက် ရွေးချယ်ပါ:</b>\nရွေးပြီးပါက အောက်ဆုံးရှိ "✅ Done" ကို နှိပ်ပါ။`,
                        parse_mode: 'HTML',
                        reply_markup: inlineKeyboard
                    })
                });

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: queryId, text: `Fee: ${fee} ရွေးပြီးပါပြီ။` })
                });

                return res.status(200).json({ status: 'success' });
            }

            // 🎯 B. Role များကို နှိပ်တိုင်း အမှန်ခြစ် Toggle လုပ်ပေးခြင်း (Multi-select)
            if (callbackData && callbackData.startsWith('role_')) {
                const parts = callbackData.split('_');
                const clickedRole = parts[2];

                const replyMarkup = callbackQuery.message.reply_markup;
                let rows = replyMarkup ? replyMarkup.inline_keyboard : [];
                
                rows = rows.map(row => {
                    return row.map(btn => {
                        if (btn.callback_data.startsWith('role_')) {
                            const btnRole = btn.callback_data.split('_')[2];
                            let isChecked = btn.text.startsWith('✅');

                            if (btnRole === clickedRole) {
                                isChecked = !isChecked;
                            }

                            if (isChecked) {
                                return { text: `✅ ${btnRole}`, callback_data: btn.callback_data };
                            } else {
                                return { text: `⚪️ ${btnRole}`, callback_data: btn.callback_data };
                            }
                        }
                        return btn;
                    });
                });

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: { inline_keyboard: rows }
                    })
                });

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: queryId, text: "Role Updated" })
                });

                return res.status(200).json({ status: 'success' });
            }

            // 🎯 C. Done နှိပ်ပါက ရွေးထားသမျှ Roles များနှင့်အတူ Bot လင့်ခ် Button ပါ Channel သို့ ပို့ပေးခြင်း
            if (callbackData && callbackData.startsWith('done_')) {
                const fee = callbackData.split('_')[1];
                const replyMarkup = callbackQuery.message.reply_markup;
                let rows = replyMarkup ? replyMarkup.inline_keyboard : [];

                let selectedRoles = [];
                rows.forEach(row => {
                    row.forEach(btn => {
                        if (btn.callback_data.startsWith('role_') && btn.text.startsWith('✅')) {
                            selectedRoles.push(btn.callback_data.split('_')[2]);
                        }
                    });
                });

                if (selectedRoles.length === 0) {
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ callback_query_id: queryId, text: "⚠️ ကျေးဇူးပြု၍ အနည်းဆုံး Role တစ်ခု ရွေးချယ်ပါ။", show_alert: true })
                    });
                    return res.status(200).json({ status: 'success' });
                }

                const user = callbackQuery.from;
                const username = user.username ? `@${user.username}` : (user.first_name || 'Player');
                const userProfileLink = user.username ? `https://t.me/${user.username}` : `tg://user?id=${user.id}`;
                const rolesString = selectedRoles.join(', ');

                const channelMessage = `🔥 <b>PLAYER RECRUITMENT</b> 🔥\n` +
                                       `━━━━━━━━━━━━━━━━━━━\n` +
                                       `💰 <b>Fee:</b> ${fee}\n` +
                                       `🎯 <b>Looking For:</b> ${rolesString}\n` +
                                       `👤 <b>Contact:</b> <a href="${userProfileLink}">${username}</a>\n\n` +
                                       `⚡️ စိန်ခေါ်ရန် သို့မဟုတ် ကိုယ်တိုင်လူခေါ်ရန် အောက်ပါ ခလုတ်များကို နှိပ်ပါ။`;

                // Channel ထဲ ပို့မည့် Keyboard (Contact Button အပြင် Bot သို့ တန်းသွားမည့် Button ပါဝင်သည်)
                const channelKeyboard = {
                    inline_keyboard: [
                        [
                            { text: `💬 Contact ${username}`, url: userProfileLink }
                        ],
                        [
                            { text: `🤖 ကိုယ်တိုင် လူခေါ်ရန် Bot သို့သွားမည်`, url: `https://t.me/eternal_aura_bot?start=recruit` } // 👈 ကျေးဇူးပြု၍ your_bot_username နေရာတွင် ကိုယ့် Bot နာမည်အမှန် ထည့်ပါ
                        ]
                    ]
                };

                if (CHANNEL_ID) {
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: CHANNEL_ID,
                            text: channelMessage,
                            parse_mode: 'HTML',
                            reply_markup: channelKeyboard
                        })
                    });
                }

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: messageId,
                        text: `🎉 သင့်ရဲ့ လူခေါ်ဆိုမှု (Fee: ${fee} | Roles: ${rolesString}) ကို Telegram Channel ထဲသို့ အောင်မြင်စွာ တင်ပြီးပါပြီ။`,
                        parse_mode: 'HTML'
                    })
                });

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: queryId, text: "Successfully posted to channel!" })
                });

                return res.status(200).json({ status: 'success' });
            }

            if (callbackData && callbackData.startsWith('choose_team_')) {
                const roomId = callbackData.split('_')[2];
                try {
                    const roomRef = db.collection('active_rooms').doc(roomId);
                    const roomDoc = await roomRef.get();
                    if (!roomDoc.exists) {
                        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ callback_query_id: queryId, text: "❌ ဤ Room အား ရှာမတွေ့တော့ပါ။", show_alert: true })
                        });
                        return res.status(200).json({ status: 'error' });
                    }

                    const roomData = roomDoc.data();
                    const hostName = roomData.teamName || 'Host';
                    const joinerName = roomData.joinerTeamName || 'Joiner';

                    let keyboardLayout = [
                        [
                            { text: `🏆 ${hostName} (Win)`, callback_data: `win_${roomId}_host` },
                            { text: `🏆 ${joinerName} (Win)`, callback_data: `win_${roomId}_joiner` }
                        ]
                    ];

                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            message_id: messageId,
                            reply_markup: { inline_keyboard: keyboardLayout }
                        })
                    });

                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ callback_query_id: queryId, text: "🏆 Winner Team တစ်ခုကို ရွေးချယ်ပါ။" })
                    });
                } catch (e) { console.error("Choose Team Error:", e); }
                return res.status(200).json({ status: 'success' });
            }

            if (callbackData && callbackData.startsWith('win_')) {
                const parts = callbackData.split('_');
                const winningSide = parts[2];
                const roomId = parts[1];

                try {
                    const roomRef = db.collection('active_rooms').doc(roomId);
                    const roomDoc = await roomRef.get();
                    if (!roomDoc.exists) return res.status(200).json({ status: 'error' });

                    const roomData = roomDoc.data();
                    const winnerTeamName = winningSide === 'host' ? (roomData.teamName || 'Host') : (roomData.joinerTeamName || 'Joiner');
                    const winnerUserId = winningSide === 'host' ? roomData.hostId : roomData.joinedUserId;

                    const updatedRoomData = {
                        ...roomData,
                        winnerTeam: winnerTeamName,
                        winnerId: winnerUserId,
                        winningSide: winningSide,
                        status: 'completed',
                        completedAt: getYangonTimeStr()
                    };

                    const uniqueHistoryId = `${roomId}_${Date.now()}`;
                    await db.collection('history').doc(uniqueHistoryId).set(updatedRoomData);
                    await roomRef.delete();

                    const updatedMessageText = generateMatchPanelText(updatedRoomData, roomId);

                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            message_id: messageId,
                            text: updatedMessageText,
                            parse_mode: 'HTML',
                            reply_markup: { inline_keyboard: [] }
                        })
                    });

                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            callback_query_id: queryId,
                            text: `🎉 Winner အဖြစ် ${winnerTeamName} ကို သတ်မှတ်ပြီး Room အား history သို့ အသစ်တစ်ခုအနေဖြင့် သိမ်းဆည်းပြီးပါပြီ။`,
                            show_alert: true
                        })
                    });

                } catch (e) { console.error("Win Error:", e); }
                return res.status(200).json({ status: 'success' });
            }

            // Admin Actions (Confirm / Reject)
            const parts = callbackData.split('_');
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

                                        await userRef.update({ [keyFieldToDecrement]: updatedQty });
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
                                        await userRef.set({ keys: { [fieldKeyOnly]: 0 } }, { merge: true });
                                    }

                                    await userRef.update({ [keyFieldToIncrement]: FieldValue.increment(1) });
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
                    callback_query_id: queryId, 
                    text: newStatus ? `Successfully ${newStatus.toLowerCase()}!` : "Please select a reason" 
                })
            });

            return res.status(200).json({ status: 'success' });
        }

        if (isTelegramUpdate) {
            return res.status(200).json({ status: 'ok' });
        }

        // -------------------------------------------------------------
        // 3. User Authentication & Registration (Device / Phone Login)
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
                return res.status(400).json({ success: false, message: "This device is already bound to another phone number." });
            }
        }

        const snapshot = await usersRef.where('phone', '==', phone).get();

        if (snapshot.empty) {
            if (!name || !pin) {
                return res.status(200).json({ requiresRegistration: true, message: "Phone not found. Please provide name and PIN." });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPin = bcrypt.hashSync(pin, salt);
            const userId = generateUniqueUserId();
            const createdAtStr = getYangonTimeStr();
            const defaultRole = 'user';

            const defaultKeys = {
                "1vs1-5k": 0, "1vs1-10k": 0, "1vs1-15k": 0, "1vs1-25k": 0, "1vs1-50k": 0,
                "5vs5-5k": 0, "5vs5-10k": 0, "5vs5-15k": 0, "5vs5-25k": 0, "5vs5-50k": 0,
                "tournament": 0
            };

            await usersRef.doc(userId).set({
                userId, name, phone, pin: hashedPin, deviceId,
                role: defaultRole, keys: defaultKeys, createdAt: createdAtStr, recentLogins: []
            });

            return res.status(200).json({ success: true, message: "User registered successfully", name, userId, role: defaultRole });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (userData.deviceId === deviceId) {
            return res.status(200).json({ success: true, message: "Original device matched. Login successful", name: userData.name, userId: userData.userId, role: userData.role || 'user' });
        }

        if (!pin) {
            return res.status(200).json({ requiresPassword: true, message: "Different device detected. Please enter PIN." });
        }

        const isPasswordValid = bcrypt.compareSync(pin, userData.pin);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Incorrect PIN. Access denied." });
        }

        await usersRef.doc(userData.userId).update({
            recentLogins: FieldValue.arrayUnion({ deviceId, loginTime: getYangonTimeStr() })
        });

        return res.status(200).json({ success: true, message: "Login successful", name: userData.name, userId: userData.userId, role: userData.role || 'user' });

    } catch (error) {
        console.error("Auth/Webhook Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};