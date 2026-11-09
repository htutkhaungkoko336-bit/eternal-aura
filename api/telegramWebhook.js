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
    text += `</blockquote>`;

    return text;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(200).send('Webhook is active');
    }

    try {
        const update = req.body || {};
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

        // -------------------------------------------------------------
        // 🔥 0. API / Frontend မှ လှမ်းခေါ်သော search_by_matchcode
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
                return res.status(404).json({ success: false, message: "Match Code ရှမတွေ့ပါ။" });
            }

            let roomData = null;
            roomSnapshot.forEach(doc => {
                roomData = { roomId: doc.id, ...doc.data() };
            });

            return res.status(200).json({ success: true, room: roomData });
        }

        // -------------------------------------------------------------
        // 🔥 1. Telegram Callback Query (Confirm / Reject / Win Actions) - ထိပ်ဆုံးသို့ တင်ထားပါသည်
        // -------------------------------------------------------------
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const callbackData = callbackQuery.data;
            const queryId = callbackQuery.id;
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;

            console.log("Received callback data:", callbackData);

            // A. Choose Team / Win Actions
            if (callbackData.startsWith('choose_team_') || callbackData.startsWith('win_')) {
                // (Existing Match Win Logic)
                if (callbackData.startsWith('choose_team_')) {
                    const roomId = callbackData.split('_')[2];
                    const roomRef = db.collection('active_rooms').doc(roomId);
                    const roomDoc = await roomRef.get();
                    if (!roomDoc.exists) {
                        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ callback_query_id: queryId, text: "❌ Room အား ရှာမတွေ့ပါ။", show_alert: true })
                        });
                        return res.status(200).json({ status: 'error' });
                    }
                    const roomData = roomDoc.data();
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId, message_id: messageId,
                            reply_markup: { inline_keyboard: [[
                                { text: `🏆 ${roomData.teamName || 'Host'} (Win)`, callback_data: `win_${roomId}_host` },
                                { text: `🏆 ${roomData.joinerTeamName || 'Joiner'} (Win)`, callback_data: `win_${roomId}_joiner` }
                            ]] }
                        })
                    });
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ callback_query_id: queryId, text: "🏆 Winner Team တစ်ခုကို ရွေးချယ်ပါ။" })
                    });
                    return res.status(200).json({ status: 'success' });
                }

                if (callbackData.startsWith('win_')) {
                    const parts = callbackData.split('_');
                    const winningSide = parts[2];
                    const roomId = parts[1];
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
                            chat_id: chatId, message_id: messageId,
                            text: updatedMessageText, parse_mode: 'HTML',
                            reply_markup: { inline_keyboard: [] }
                        })
                    });
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ callback_query_id: queryId, text: `🎉 Winner အဖြစ် ${winnerTeamName} သတ်မှတ်ပြီးပါပြီ။`, show_alert: true })
                    });
                    return res.status(200).json({ status: 'success' });
                }
            }

            // B. Registration & Refund Confirm / Reject Actions
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
            } else if (action === 'reject') {
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
            } else if (action === 'select') {
                const reasonsMap = {
                    'r1': 'ညစ်ညမ်းပုံ/မသင့်လျော်သောပုံများပါဝင်နေပါသည်။',
                    'r2': 'Game Name / Game ID မှားယွင်းနေပါသည်',
                    'r3': 'ငွေပမာဏ လျော့နည်းနေပါသည်။',
                    'r4': 'အချက်အလက်များ မပြည့်စုံပါ',
                    'r5': 'K pay Phone Number / Name မှားယွင်းနေပါသည်။'
                };
                const rejectionReasonText = reasonsMap[reasonKey] || 'အခြားအကြောင်းပြချက်';
                newStatus = 'REJECTED';
                responseText = `❌ REJECTED\nReason: ${rejectionReasonText}`;
                updateKeyboard = true;
                newInlineKeyboard = []; 
                
                if (collectionName && docId) {
                    await db.collection(collectionName).doc(docId).update({
                        status: 'REJECTED',
                        rejectionReason: rejectionReasonText
                    }).catch(err => console.error("Reject update error:", err));
                }
            } else if (action === 'back') {
                responseText = "⏳ Waiting for admin action...";
                updateKeyboard = true;
                newInlineKeyboard = [
                    [{ text: "✅ Confirm", callback_data: `confirm_${prefix}_${docId}` }, { text: "❌ Reject", callback_data: `reject_${prefix}_${docId}` }]
                ];
            }

            try {
                if (collectionName && docId && action === 'confirm') {
                    const regDocRef = db.collection(collectionName).doc(docId);
                    await regDocRef.update({ status: 'CONFIRMED' });

                    const regDoc = await regDocRef.get();
                    if (regDoc.exists) {
                        const regData = regDoc.data();
                        const userId = regData.userId;
                        if (userId) {
                            let keyFieldToIncrement = "";
                            const fee = (regData.fee || "").toLowerCase();

                            if (collectionName.includes('1vs1')) {
                                if (fee.includes('50k')) keyFieldToIncrement = "keys.1vs1-50k";
                                else if (fee.includes('25k')) keyFieldToIncrement = "keys.1vs1-25k";
                                else if (fee.includes('15k')) keyFieldToIncrement = "keys.1vs1-15k";
                                else if (fee.includes('10k')) keyFieldToIncrement = "keys.1vs1-10k";
                                else keyFieldToIncrement = "keys.1vs1-5k"; 
                            } else if (collectionName.includes('tournament')) {
                                keyFieldToIncrement = "keys.tournament";
                            } else if (collectionName.includes('5vs5')) {
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

        // -------------------------------------------------------------
        // 🔥 2. Telegram Bot Match Search Messages
        // -------------------------------------------------------------
        if (update.message && update.message.text) {
            const messageText = update.message.text.trim();
            const chatId = update.message.chat.id;

            if (messageText.startsWith('REV-') || messageText.startsWith('/search') || messageText.length === 10) {
                const matchCode = messageText.startsWith('/search') ? messageText.split(' ')[1] : messageText;
                if (matchCode) {
                    const cleanMatchCode = matchCode.trim().toUpperCase();
                    const roomSnapshot = await db.collection('active_rooms').where('matchCode', '==', cleanMatchCode).get();

                    let replyMessage = "";
                    let docId = "";
                    let isCompleted = false;

                    if (roomSnapshot.empty) {
                        replyMessage = `❌ <b>Match ရှာမတွေ့ပါ။</b>`;
                    } else {
                        roomSnapshot.forEach(doc => {
                            const d = doc.data();
                            docId = doc.id; 
                            if (d.winnerTeam) isCompleted = true;
                            replyMessage = generateMatchPanelText(d, docId);
                        });
                    }

                    const requestBody = { chat_id: chatId, text: replyMessage, parse_mode: 'HTML' };
                    if (!roomSnapshot.empty && !isCompleted) {
                        requestBody.reply_markup = { inline_keyboard: [[{ text: `👥 Choose Team`, callback_data: `choose_team_${docId}` }]] };
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
        // 3. User Authentication & Registration (Device / Phone Login)
        // -------------------------------------------------------------
        const { phone, deviceId, name, pin } = req.body;
        if (!phone || !deviceId) {
            return res.status(200).json({ status: 'ok' }); // Telegram updates တွေအတွက် 400 မတက်စေရန်
        }

        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('phone', '==', phone).get();

        if (snapshot.empty) {
            if (!name || !pin) {
                return res.status(200).json({ requiresRegistration: true, message: "Please provide name and PIN." });
            }
            const salt = bcrypt.genSaltSync(10);
            const hashedPin = bcrypt.hashSync(pin, salt);
            const userId = generateUniqueUserId();

            await usersRef.doc(userId).set({
                userId, name, phone, pin: hashedPin, deviceId,
                role: 'user', keys: { "1vs1-5k": 0 }, createdAt: getYangonTimeStr(), recentLogins: []
            });

            return res.status(200).json({ success: true, name, userId, role: 'user' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (userData.deviceId === deviceId || (pin && bcrypt.compareSync(pin, userData.pin))) {
            return res.status(200).json({ success: true, name: userData.name, userId: userData.userId, role: userData.role || 'user' });
        }

        return res.status(200).json({ requiresPassword: true, message: "Please enter PIN." });

    } catch (error) {
        console.error("Auth/Webhook Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};