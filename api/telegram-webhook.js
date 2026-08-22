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
            let rejectionReasonText = "";
            let updateKeyboard = false;
            let newInlineKeyboard = [];

            if (action === 'confirm') {
                newStatus = 'CONFIRMED';
                responseText = "✅ This registration has been CONFIRMED.";
                updateKeyboard = true;
            } 
            else if (action === 'reject') {
                responseText = "⚠️ ပယ်ချရသည့် အကြောင်းရင်းကို ရွေးချယ်ပါ:";
                updateKeyboard = true;
                newInlineKeyboard = [
                    [{ text: "🚫 ညစ်ညမ်းပုံ/မသင့်လျော်သောပုံ တင်ထားခြင်း", callback_data: `reason_r1_${collectionName}_${docId}` }],
                    [{ text: "⚠️ Game Name သို့မဟုတ် Game ID မှားယွင်းခြင်း", callback_data: `reason_r2_${collectionName}_${docId}` }],
                    [{ text: "💰 ငွေပမာဏ လျော့နည်းနေခြင်း (သို့) မမှန်ကန်ခြင်း", callback_data: `reason_r3_${collectionName}_${docId}` }],
                    [{ text: "📝 အချက်အလက်များ မပြည့်စုံခြင်း", callback_data: `reason_r4_${collectionName}_${docId}` }],
                    [{ text: "🔄 ငွေလွှဲအကောင့်အမည် သို့မဟုတ် ဖုန်းနံပါတ် မှားယွင်းခြင်း", callback_data: `reason_r5_${collectionName}_${docId}` }],
                    [{ text: "🔙 Back", callback_data: `back_${collectionName}_${docId}` }]
                ];
            }
                else if (action === 'reason') {
                newStatus = 'REJECTED';
                
                const parts = remaining.split('_');
                const reasonKey = parts[0]; 
                
                const reasonsMap = {
                    'r1': 'ညစ်ညမ်းပုံ သို့မဟုတ် မသင့်လျော်သော Payment Slip ဖြစ်ပါသည်',
                    'r2': 'Game Name သို့မဟုတ် Game ID မှားယွင်းနေပါသည်',
                    'r3': 'ငွေပမာဏ လျော့နည်းနေပါသည် သို့မဟုတ် မမှန်ကန်ပါ',
                    'r4': 'အချက်အလက်များ မပြည့်စုံပါ',
                    'r5': 'ငွေလွှဲအကောင့် အမည် သို့မဟုတ် ဖုန်းနံပါတ် မှားယွင်းနေပါသည်'
                };

                rejectionReasonText = reasonsMap[reasonKey] || 'အခြားအကြောင်းပြချက်ဖြင့် ပယ်ချပါသည်';
                responseText = `❌ REJECTED\nReason: ${rejectionReasonText}`;
                updateKeyboard = true;

                // ⚠️ အရေးကြီးသည် - Reason ရွေးလိုက်တာနဲ့ Database ထဲသို့ တိုက်ရိုက် Update လုပ်ရန် ဤနေရာတွင် ထည့်ပေးပါ
                if (collectionName && docId) {
                    try {
                        const regDocRef = db.collection(collectionName).doc(docId);
                        await regDocRef.update({
                            status: 'REJECTED',
                            rejectionReason: rejectionReasonText
                        });
                        console.log("Firestore status successfully updated to REJECTED with reason:", rejectionReasonText);
                    } catch (updateErr) {
                        console.error("Error updating rejection reason in DB:", updateErr);
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

            try {
                if (collectionName && docId) {
                    const regDocRef = db.collection(collectionName).doc(docId);

                    if (newStatus === 'CONFIRMED' || newStatus === 'REJECTED') {
                        const updateData = { status: newStatus };
                        if (newStatus === 'REJECTED' && rejectionReasonText) {
                            updateData.rejectionReason = rejectionReasonText;
                        }
                        await regDocRef.update(updateData);
                        console.log("Firestore registration status updated successfully to:", newStatus);
                    }

                    if (newStatus === 'CONFIRMED') {
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
                                    if (fee.includes('50k')) keyFieldToIncrement = "keys.5vs5_50k";
                                    else if (fee.includes('25k')) keyFieldToIncrement = "keys.5vs5_25k";
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
                console.error("Database Update Error:", dbError);
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