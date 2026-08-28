const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const bcrypt = require('bcryptjs');

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
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    try {
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

            const formattedKeys = {
                modes: {
                    '5v5': {
                        '5k': userData.keys?.["5vs5-5k"] || 0,
                        '10k': userData.keys?.["5vs5-10k"] || 0,
                        '15k': userData.keys?.["5vs5-15k"] || 0,
                        '25k': userData.keys?.["5vs5_25k"] || 0,
                        '50k': userData.keys?.["5vs5_50k"] || 0
                    },
                    '1v1': {
                        '5k': userData.keys?.["1vs1-5k"] || 0,
                        '10k': userData.keys?.["1vs1-10k"] || 0,
                        '15k': userData.keys?.["1vs1-15k"] || 0,
                        '25k': userData.keys?.["1vs1-25k"] || 0,
                        '50k': userData.keys?.["1vs1-50k"] || 0
                    },
                    'tournament': {
                        'pass': userData.keys?.["tournament"] || 0
                    }
                }
            };
            const newUserData = {
                userId: userId,
                name: name,
                phone: phone,
                pin: hashedPin,
                deviceId: deviceId,
                role: defaultRole,
                keys: formattedKeys,
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
        console.error("Auth Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};