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
        const update = req.body;

        // Telegram Callback Query (Admin Action) ဖြစ်နေလျှင်
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

            // Database Confirm လုပ်ဆောင်ချက်များ (Registration နှင့် Refund များကို +1 / -1 လုပ်ပေးခြင်း)
            try {
                if (collectionName && docId && action === 'confirm') {
                    
                    // 1. REFUND REQUESTS အတွက် Confirm လုပ်ခြင်း (ရှိပြီးသား keys တွေထဲကနေ -1 နှုတ်မည်)
                    if (collectionName === 'refund_requests') {
                        const refundDocRef = db.collection('refund_requests').doc(docId);
                        await refundDocRef.update({ status: 'CONFIRMED' });

                        const refundDoc = await refundDocRef.get();
                        if (refundDoc.exists) {
                            const refundData = refundDoc.data();
                            const userId = refundData.userId;
                            const mode = (refundData.mode || '').toString().toLowerCase(); // '5vs5', '1vs1', သို့မဟုတ် 'tournament'
                            const type = (refundData.type || '').toString().toLowerCase(); // '5k', '10k', '15k', '25k', '50k'
                            const qty = Number(refundData.qty) || 1;

                            if (userId) {
                                let keyFieldToDecrement = "";
                                
                                if (mode === 'tournament') {
                                    keyFieldToDecrement = "keys.tournament";
                                } else if (mode.includes('5vs5') || mode.includes('5v5')) {
                                    // 5vs5 အတွက် သေချာခွဲထုတ်ခြင်း
                                    if (type.includes('50k')) keyFieldToDecrement = "keys.5vs5-50k";
                                    else if (type.includes('25k')) keyFieldToDecrement = "keys.5vs5-25k";
                                    else if (type.includes('15k')) keyFieldToDecrement = "keys.5vs5-15k";
                                    else if (type.includes('10k')) keyFieldToDecrement = "keys.5vs5-10k";
                                    else keyFieldToDecrement = "keys.5vs5-5k";
                                } else {
                                    // ကျန်ရှိပါက 1vs1 အဖြစ် သတ်မှတ်မည်
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
                                        console.log(`Refund: Updated ${keyFieldToDecrement} to ${updatedQty}`);
                                    }
                                }
                            }
                        }
                    } 
                    // 2. REGISTRATIONS အတွက် Confirm လုပ်ခြင်း (ရှိပြီးသားကို +1 တိုးမည်)
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
                                    console.log(`Registration: Incremented ${keyFieldToIncrement} by 1`);
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

        // -------------------------------------------------------------
        // User Authentication & Registration (Device / Phone Login)
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