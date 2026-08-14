// auth.js - ဖုန်းနံပါတ်နှင့် PIN လက်ခံစစ်ဆေးခြင်း Module

export function initAuth(formContent, onComplete) {
    // ပထမဆုံး ဖုန်းနံပါတ်ထည့်မည့် Screen ကို ပြသခြင်း
    formContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
            <p style="color: #94a3b8; font-size: 14px; text-align: left; width: 100%;">Enter Phone Number</p>
            <div class="input-box" style="width: 100%; background-color: #1e293b; padding: 16px 20px; border-radius: 16px; border: 1px solid #334155;">
                <input type="tel" id="phone-input" placeholder="Phone Number" maxlength="11" inputmode="numeric" style="width: 100%; color: white; background: transparent; border: none; font-size: 16px; outline: none;" autofocus>
            </div>
        </div>
        <button class="next-btn" id="next-btn" style="width: 100%; justify-content: center; padding: 14px 20px; margin-top: 5px; display: flex; align-items: center; gap: 8px;">
            <span>Next</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        </button>
    `;

    const phoneInput = document.getElementById('phone-input');
    const nextBtn = document.getElementById('next-btn');

    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    });

    nextBtn.addEventListener('click', async () => {
        const phoneVal = phoneInput.value.trim();
        if (phoneVal === '') {
            alert("ကျေးဇူးပြု၍ ဖုန်းနံပါတ် ထည့်ပါ။");
            return;
        }

        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = 'dev_' + Math.random().toString(36).substring(2, 12);
            localStorage.setItem('device_id', deviceId);
        }

        try {
            // ဖုန်းနံပါတ်နှင့် Device ID ကို ဆာဗာသို့ အရင်ပို့စစ်မည် (PIN မပါသေးပါ)
            const response = await fetch('/api/userid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneVal, deviceId: deviceId })
            });

            const data = await response.json();

            // ၁။ Device လည်းတူ၊ ဖုန်းလည်းရှိပြီးသားဆိုရင် တန်းဝင်မည် (Auto Login)
            if (data.success) {
                if (typeof onComplete === 'function') {
                    onComplete(phoneVal, null); // script.js ကနေ success ကို ကိုင်တွယ်ပါမယ်
                }
                return;
            }

            // ၂။ ဖုန်းရှိသော်လည်း Device ID မတူတော့၍ PIN တောင်းခံလာပါက (Login PIN Screen သို့သွားမည်)
            if (data.requiresPassword) {
                showLoginPinScreen(formContent, phoneVal, deviceId, onComplete);
                return;
            }

            // ၃။ ဖုန်းနံပါတ် မရှိသေးပါက (Register - Create PIN Screen သို့သွားမည်)
            if (data.requiresRegistration) {
                showCreatePinScreen(formContent, phoneVal, deviceId, onComplete);
                return;
            }

            alert("အမှားအယွင်းရှိသည်: " + (data.message || "Unknown error"));

        } catch (err) {
            console.error("Network error:", err);
            alert("ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။");
        }
    });
}

// (က) User အသစ်အတွက် PIN အသစ်ဖန်တီးမည့် Screen (Create & Confirm PIN)
function showCreatePinScreen(formContent, phoneVal, deviceId, onComplete) {
    formContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
            <div style="width: 100%;">
                <p style="color: #94a3b8; font-size: 13px; margin-bottom: 6px; text-align: left;">Create your own 6-digit PIN</p>
                <div class="otp-container" style="display: flex; gap: 6px; justify-content: center; width: 100%;">
                    <input type="password" class="otp-box pin-1" maxlength="1" inputmode="numeric" autofocus>
                    <input type="password" class="otp-box pin-1" maxlength="1" inputmode="numeric">
                    <input type="password" class="otp-box pin-1" maxlength="1" inputmode="numeric">
                    <input type="password" class="otp-box pin-1" maxlength="1" inputmode="numeric">
                    <input type="password" class="otp-box pin-1" maxlength="1" inputmode="numeric">
                    <input type="password" class="otp-box pin-1" maxlength="1" inputmode="numeric">
                </div>
            </div>

            <div style="width: 100%;">
                <p style="color: #94a3b8; font-size: 13px; margin-bottom: 6px; text-align: left;">Confirm your 6-digit PIN</p>
                <div class="otp-container" style="display: flex; gap: 6px; justify-content: center; width: 100%;">
                    <input type="password" class="otp-box pin-2" maxlength="1" inputmode="numeric">
                    <input type="password" class="otp-box pin-2" maxlength="1" inputmode="numeric">
                    <input type="password" class="otp-box pin-2" maxlength="1" inputmode="numeric">
                    <input type="password" class="otp-box pin-2" maxlength="1" inputmode="numeric">
                    <input type="password" class="otp-box pin-2" maxlength="1" inputmode="numeric">
                    <input type="password" class="otp-box pin-2" maxlength="1" inputmode="numeric">
                </div>
            </div>

            <button class="next-btn" id="confirm-btn" style="width: 100%; justify-content: center; padding: 14px 20px; margin-top: 5px; display: flex; align-items: center; gap: 8px;">
                <span>Confirm</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </button>
        </div>
    `;

    setupOtpInputs();

    document.getElementById('confirm-btn').addEventListener('click', () => {
        const pin1Arr = document.querySelectorAll('.pin-1');
        const pin2Arr = document.querySelectorAll('.pin-2');

        let pin1 = '';
        let pin2 = '';

        pin1Arr.forEach(i => pin1 += i.value);
        pin2Arr.forEach(i => pin2 += i.value);

        if (pin1.length < 6 || pin2.length < 6) {
            alert("ကျေးဇူးပြု၍ ကိုယ်ပိုင် PIN ဂဏန်း ၆ လုံး အပြည့်ထည့်ပါ။");
            return;
        }

        if (pin1 !== pin2) {
            alert("PIN ဂဏန်းများ မကိုက်ညီပါ။ ထပ်မံစစ်ဆေးပါ။");
            return;
        }

        if (typeof onComplete === 'function') {
            onComplete(phoneVal, pin1);
        }
    });
}

// (ခ) Device ပြောင်းသွားသူများအတွက် PIN တောင်းမည့် Screen (Login PIN)
function showLoginPinScreen(formContent, phoneVal, deviceId, onComplete) {
    formContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; align-items: center;">
            <p style="color: #94a3b8; font-size: 14px; text-align: center; width: 100%;">New Device Detected. Enter Your PIN</p>
            
            <div class="input-box" style="width: 100%; background-color: #1e293b; padding: 16px 20px; border-radius: 16px; border: 1px solid #334155;">
                <input type="password" id="login-pin-input" placeholder="Enter 6-digit PIN" maxlength="6" inputmode="numeric" autofocus style="width: 100%; color: white; background: transparent; border: none; font-size: 16px; outline: none; text-align: center; letter-spacing: 4px;">
            </div>

            <button class="next-btn" id="verify-pin-btn" style="width: 100%; justify-content: center; padding: 14px 20px; margin-top: 5px; display: flex; align-items: center; gap: 8px;">
                <span>Verify & Login</span>
            </button>
        </div>
    `;

    document.getElementById('verify-pin-btn').addEventListener('click', () => {
        const enteredPin = document.getElementById('login-pin-input').value.trim();
        if (enteredPin.length < 6) {
            alert("ကျေးဇူးပြု၍ PIN ဂဏန်း ၆ လုံး အပြည့်ထည့်ပါ။");
            return;
        }

        if (typeof onComplete === 'function') {
            onComplete(phoneVal, enteredPin);
        }
    });
}
// OTP Input များအတွက် Navigation လုပ်ဆောင်ချက်များ
function setupOtpInputs() {
    const inputs = document.querySelectorAll('.otp-box');
    inputs.forEach((input, index) => {
        input.style.flex = '1';
        input.style.height = '42px';
        input.style.maxWidth = '42px';
        input.style.textAlign = 'center';
        input.style.fontSize = '16px';
        input.style.fontWeight = 'bold';
        input.style.backgroundColor = '#1e293b';
        input.style.color = '#fff';
        input.style.border = '1px solid #334155';
        input.style.borderRadius = '10px';
        input.style.outline = 'none';

        input.addEventListener('input', (e) => {
            const val = e.target.value;
            if (!/^[0-9]$/.test(val)) {
                e.target.value = '';
                return;
            }
            if (val && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
}