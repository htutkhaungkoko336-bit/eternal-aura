const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
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
            const data = callbackQuery.data; 
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;
            const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

            console.log("Received callback data:", data);

            const firstUnderscore = data.indexOf('_');
            const action = data.substring(0, firstUnderscore); 
            const remaining = data.substring(firstUnderscore + 1);
            
            const lastUnderscore = remaining.lastIndexOf('_');
            const collectionName = remaining.substring(0, lastUnderscore);
            const docId = remaining.substring(lastUnderscore + 1);

            let newStatus = "";
            let responseText = "";
            let updateKeyboard = false;
            let newInlineKeyboard = [];

            if (action === 'confirm') {
                newStatus = 'CONFIRMED';
                responseText = "✅ This request has been CONFIRMED.";
                updateKeyboard = true;
            } 
            else if (action === 'reject') {
                responseText = "⚠️ ပယ်ချရမည့် အကြောင်းရင်းကို ရွေးချယ်ပါ:";
                updateKeyboard = true;
                newInlineKeyboard = [
                    [{ text: "🚫 ညစ်ညမ်းပုံ/မသင့်လျော်သောပုံ", callback_data: `select_r1_${collectionName}_${docId}` }],
                    [{ text: "⚠️ Game Name/ID မှားယွင်း", callback_data: `select_r2_${collectionName}_${docId}` }],
                    [{ text: "💰 ငွေပမာဏ မမှန်", callback_data: `select_r3_${collectionName}_${docId}` }],
                    [{ text: "📝 အချက်အလက် မပြည့်စုံ", callback_data: `select_r4_${collectionName}_${docId}` }],
                    [{ text: "🔄 အကောင့်အမည်/ဖုန်းနံပါတ် မှားယွင်း", callback_data: `select_r5_${collectionName}_${docId}` }],
                    [{ text: "🔙 Back", callback_data: `back_${collectionName}_${docId}` }]
                ];
            }
            else if (action === 'select') {
                const firstUnderscoreInRem = remaining.indexOf('_');
                const reasonKey = remaining.substring(0, firstUnderscoreInRem); 
                const restOfData = remaining.substring(firstUnderscoreInRem + 1);

                const lastUnderscoreInRest = restOfData.lastIndexOf('_');
                const actualCollection = restOfData.substring(0, lastUnderscoreInRest);
                const actualDocId = restOfData.substring(lastUnderscoreInRest + 1);

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

                if (actualCollection && actualDocId) {
                    try {
                        const regDocRef = db.collection(actualCollection).doc(actualDocId);
                        await regDocRef.update({
                            status: 'REJECTED',
                            rejectionReason: rejectionReasonText
                        });
                        console.log(`SUCCESS: Database updated ${actualCollection}/${actualDocId} to REJECTED with reason.`);
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
                        { text: "✅ Confirm", callback_data: `confirm_${collectionName}_${docId}` },
                        { text: "❌ Reject", callback_data: `reject_${collectionName}_${docId}` }
                    ]
                ];
            }

            // Database Confirm လုပ်ဆောင်ချက်များ
            try {
                if (collectionName && docId && action === 'confirm') {
                    
                    // 1. REFUND REQUESTS အတွက် Confirm လုပ်ခြင်း
                    if (collectionName === 'refund_requests') {
                        const refundDocRef = db.collection('refund_requests').doc(docId);
                        
                        await refundDocRef.update({ status: 'CONFIRMED' });
                        console.log(`SUCCESS: Database updated refund_requests/${docId} to CONFIRMED.`);

                        const refundDoc = await refundDocRef.get();
                        if (refundDoc.exists) {
                            const refundData = refundDoc.data();
                            const userId = refundData.userId;
                            const mode = refundData.mode; // '1vs1', '5vs5', 'tournament'
                            const type = refundData.type; // '5k', '10k', etc.
                            const qty = Number(refundData.qty) || 1;

                            if (userId && mode) {
                                const userRef = db.collection('users').doc(userId);
                                const userDoc = await userRef.get();

                                if (userDoc.exists) {
                                    const userData = userDoc.data();
                                    const keysObj = userData.keys || {};
                                    
                                    // Field နာမည်ကို ပုံစံတကျ ဖြစ်အောင် သတ်မှတ်ခြင်း (hyphen ကိုသာ သုံးမည်)
                                    let dbKeyName = "";
                                    if (mode === 'tournament') {
                                        dbKeyName = 'tournament';
                                    } else {
                                        dbKeyName = `${mode}-${type}`;
                                    }

                                    const currentQty = Number(keysObj[dbKeyName]) || 0;
                                    
                                    // အနှုတ် (Negative) မသွားစေဘဲ အနည်းဆုံး 0 သို့မဟုတ် ရှိပြီးသားအဟောင်းမှသာ နှုတ်မည်
                                    const updatedQty = Math.max(0, currentQty - qty);

                                    await userRef.update({
                                        [`keys.${dbKeyName}`]: updatedQty
                                    });
                                    console.log(`Successfully deducted keys. Current ${dbKeyName} updated to ${updatedQty} for user ${userId}.`);
                                }
                            }
                        }
                    } 
                    // 2. REGISTRATIONS အတွက် Confirm လုပ်ခြင်း
                    else {
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
                                    try {
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
                                        console.log(`User ${userId} got +1 key for ${keyFieldToIncrement}`);
                                    } catch (userErr) {
                                        console.error("Error updating user keys (non-blocking):", userErr);
                                    }
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
        }

        return res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ error: error.message });
    }
};