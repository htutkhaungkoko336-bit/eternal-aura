// main.js
import { initAuth } from './auth.js';
import { renderModeScreen } from './mode.js';
import { addNotification, renderNotificationScreen } from './notification.js';

// DOM Elements များကို ရယူခြင်း
const formContent = document.getElementById('form-content');

// Form Content အတွက် styling များကို သတ်မှတ်ခြင်း
if (formContent) {
    formContent.style.display = 'flex';
    formContent.style.flexDirection = 'column';
    formContent.style.gap = '15px';
    formContent.style.width = '100%';
}

document.addEventListener('DOMContentLoaded', () => {
    // Authentication စတင်ရန်
    if (typeof initAuth === 'function' && formContent) {
        initAuth(formContent, async (phone, pin) => {
            let deviceId = localStorage.getItem('device_id');
            if (!deviceId) {
                deviceId = 'dev_' + Math.random().toString(36).substring(2, 12);
                localStorage.setItem('device_id', deviceId);
            }

            try {
                const response = await fetch('/api/userid', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phone, pin: pin, deviceId: deviceId })
                });

                const data = await response.json();

                if (data.success) {
                    handleLoginSuccess(data.name || "User");
                } else if (data.requiresPassword) {
                    showPinInputScreen(phone, deviceId);
                } else if (data.requiresRegistration) {
                    showNameInputScreen(phone, pin, deviceId);
                } else {
                    alert("အမှားအယွင်းရှိသည်: " + (data.message || "Unknown error"));
                }
            } catch (err) {
                console.error("Network error:", err);
                alert("ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။");
            }
        });
    }
});

// A. Name Input Screen
function showNameInputScreen(phone, pin, deviceId) {
    formContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
            <p style="color: #94a3b8; font-size: 14px;">Enter Your Name</p>
            <div class="input-box" style="width: 100%; background-color: #1e293b; padding: 16px; border-radius: 16px;">
                <input type="text" id="username-input" placeholder="Your Name" maxlength="25" style="width: 100%; color: white; background: transparent; border: none; outline: none;">
            </div>
            <button class="next-btn" id="finish-btn" style="width: 100%; padding: 14px;">Finish</button>
        </div>
    `;

    document.getElementById('finish-btn').addEventListener('click', async () => {
        const username = document.getElementById('username-input').value.trim();
        if (!username) return alert("ကျေးဇူးပြု၍ နာမည်ထည့်ပါ။");

        const response = await fetch('/api/userid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: username, phone, pin, deviceId })
        });
        const data = await response.json();
        if (data.success) handleLoginSuccess(data.name);
    });
}

// B. PIN Input Screen
function showPinInputScreen(phone, deviceId) {
    formContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
            <p style="color: #94a3b8; font-size: 14px;">New Device Detected. Enter Your PIN</p>
            <div class="input-box" style="width: 100%; background-color: #1e293b; padding: 16px; border-radius: 16px;">
                <input type="password" id="login-pin-input" placeholder="Enter PIN" style="width: 100%; color: white; background: transparent; border: none; outline: none;">
            </div>
            <button class="next-btn" id="verify-pin-btn" style="width: 100%; padding: 14px;">Verify & Login</button>
        </div>
    `;

    document.getElementById('verify-pin-btn').addEventListener('click', async () => {
        const enteredPin = document.getElementById('login-pin-input').value.trim();
        const response = await fetch('/api/userid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, pin: enteredPin, deviceId })
        });
        const data = await response.json();
        if (data.success) handleLoginSuccess(data.name || "User");
    });
}

// C. Login Success & Main Interface
function handleLoginSuccess(username) {
    localStorage.setItem('userName', username);
    formContent.style.display = 'none';

    document.querySelector('.container').innerHTML = `
        <div id="app-content" style="width: 100%; height: 100%; display: flex; flex-direction: column;"></div>
        <div id="bottom-nav" style="display: flex; justify-content: space-around; position: absolute; bottom: 0; width: 100%; background: #0f172a; padding: 10px 0;">
            <div class="nav-item" data-tab="mode" style="color: #38bdf8; cursor: pointer;">Mode</div>
            <div class="nav-item" data-tab="match" style="color: #94a3b8; cursor: pointer;">Match</div>
            <div class="nav-item" data-tab="notification" style="color: #94a3b8; cursor: pointer;">Notification</div>
            <div class="nav-item" data-tab="profile" style="color: #94a3b8; cursor: pointer;">Profile</div>
        </div>
    `;

    renderModeScreen(document.getElementById('app-content'));

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            const targetContent = document.getElementById('app-content');
            
            if (tab === 'mode') renderModeScreen(targetContent);
            else if (tab === 'notification') renderNotificationScreen(targetContent);
            else targetContent.innerHTML = `<div style="color: white; text-align: center; margin-top: 50px;">${tab.toUpperCase()} Coming Soon</div>`;
        });
    });
}

// ညီမလေးအတွက် အကြံပြုချက် - Tournament Registration ပြီးတဲ့နေရာမှာ ဒီ function ကို ခေါ်ပါ
export function triggerRegistrationNotification(mode, fee, type) {
    addNotification(
        "Tournament Registration Submitted",
        `🛡️ <strong>${mode} Mode</strong> အတွက် <strong>Fee ${fee}</strong> ဖြင့် <strong>${type}</strong> အတွက် registration တင်ထားပါသည်။ Admin မှ စစ်ဆေးပြီးလျှင် noti ပြန်တက်မည်။`
    );
}