import { initAuth } from './auth.js';

const formContent = document.getElementById('form-content');

formContent.style.display = 'flex';
formContent.style.flexDirection = 'column';
formContent.style.gap = '15px';
formContent.style.width = '100%';

initAuth(formContent, async (phone, pin) => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substring(2, 12);
        localStorage.setItem('device_id', deviceId);
    }

    try {
        // ပထမအကြိမ် ဖုန်းနံပါတ်ဖြင့် စစ်ဆေးခြင်း
        const response = await fetch('/api/userid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: phone, pin: pin, deviceId: deviceId })
        });

        const data = await response.json();

        if (data.success) {
            handleLoginSuccess(data.name || "User");
            return;
        }

        // Device အသစ်ဖြစ်နေ၍ PIN တောင်းပါက
        if (data.requiresPassword) {
            showPinInputScreen(phone, deviceId);
            return;
        }

        // User အသစ်ဖြစ်နေ၍ Name ထည့်ခိုင်းရန် လိုအပ်ပါက
        if (data.requiresRegistration) {
            showNameInputScreen(phone, pin, deviceId);
            return;
        }

        alert("အမှားအယွင်းရှိသည်: " + (data.message || "Unknown error"));

    } catch (err) {
        console.error("Network error:", err);
        alert("ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။");
    }
});

// A. User အသစ်အတွက် Name တောင်းမည့် Screen
function showNameInputScreen(phone, pin, deviceId) {
    formContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
            <p style="color: #94a3b8; font-size: 14px; text-align: left; width: 100%;">Enter Your Name</p>
            <div class="input-box" style="width: 100%; background-color: #1e293b; padding: 16px 20px; border-radius: 16px; border: 1px solid #334155;">
                <input type="text" id="username-input" placeholder="Your Name" maxlength="25" autofocus style="width: 100%; color: white; background: transparent; border: none; font-size: 16px; outline: none;">
            </div>
            <button class="next-btn" id="finish-btn" style="width: 100%; justify-content: center; padding: 14px 20px; margin-top: 5px; display: flex; align-items: center; gap: 8px;">
                <span>Finish</span>
            </button>
        </div>
    `;

    document.getElementById('finish-btn').addEventListener('click', async () => {
        const username = document.getElementById('username-input').value.trim();
        if (!username) {
            alert("ကျေးဇူးပြု၍ နာမည်ထည့်ပါ။");
            return;
        }

        try {
            const response = await fetch('/api/userid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, phone: phone, pin: pin, deviceId: deviceId })
            });

            const data = await response.json();
            if (data.success) {
                handleLoginSuccess(data.name);
            } else {
                alert("စာရင်းသွင်းမအောင်မြင်ပါ: " + data.message);
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။");
        }
    });
}

// B. Device အသစ်အတွက် PIN ထပ်တောင်းမည့် Screen
function showPinInputScreen(phone, deviceId) {
    formContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
            <p style="color: #94a3b8; font-size: 14px; text-align: left; width: 100%;">New Device Detected. Enter Your PIN</p>
            <div class="input-box" style="width: 100%; background-color: #1e293b; padding: 16px 20px; border-radius: 16px; border: 1px solid #334155;">
                <input type="password" id="login-pin-input" placeholder="Enter PIN" autofocus style="width: 100%; color: white; background: transparent; border: none; font-size: 16px; outline: none;">
            </div>
            <button class="next-btn" id="verify-pin-btn" style="width: 100%; justify-content: center; padding: 14px 20px; margin-top: 5px; display: flex; align-items: center; gap: 8px;">
                <span>Verify & Login</span>
            </button>
        </div>
    `;

    document.getElementById('verify-pin-btn').addEventListener('click', async () => {
        const enteredPin = document.getElementById('login-pin-input').value.trim();
        if (!enteredPin) {
            alert("ကျေးဇူးပြု၍ PIN ထည့်ပါ။");
            return;
        }

        try {
            const response = await fetch('/api/userid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phone, pin: enteredPin, deviceId: deviceId })
            });

            const data = await response.json();
            if (data.success) {
                handleLoginSuccess(data.name || "User");
            } else {
                alert("PIN မှားယွင်းနေပါသည်: " + (data.message || "Access denied"));
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။");
        }
    });
}

// C. အောင်မြင်ပါက Home Screen / Bottom Nav ပြရန်
function handleLoginSuccess(username) {
    localStorage.setItem('userName', username);
    document.querySelector('.container').innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: flex-end; position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; box-sizing: border-box; pointer-events: none;">
            <div id="bottom-nav" style="display: flex; justify-content: space-around; align-items: center; background-color: #0f172a; border-top: 1px solid #1e293b; padding: 12px 0 24px 0; width: 100%; pointer-events: auto;">
                <div class="nav-item" data-tab="mode" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #38bdf8;">
                    <span style="font-size: 10px;">Mode</span>
                </div>
                <div class="nav-item" data-tab="match" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #94a3b8;">
                    <span style="font-size: 10px;">Match</span>
                </div>
                <div class="nav-item" data-tab="notification" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #94a3b8;">
                    <span style="font-size: 10px;">Notification</span>
                </div>
                <div class="nav-item" data-tab="profile" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #94a3b8;">
                    <span style="font-size: 10px;">Profile</span>
                </div>
            </div>
        </div>
    `;
}