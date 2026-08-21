// main.js
import { initAuth } from './auth.js';
import { renderModeScreen } from './mode.js';
import { addNotification, renderNotificationScreen } from './notification.js';

// DOM Elements များကို ရယူခြင်း
const formContent = document.getElementById('form-content');
const appContent = document.getElementById('app-content'); 

// Form Content အတွက် styling များကို သတ်မှတ်ခြင်း
if (formContent) {
    formContent.style.display = 'flex';
    formContent.style.flexDirection = 'column';
    formContent.style.gap = '15px';
    formContent.style.width = '100%';
}

document.addEventListener('DOMContentLoaded', () => {
    // လိုအပ်ပါက Authentication ကို စတင်ရန်
    if (typeof initAuth === 'function' && formContent) {
        initAuth(formContent, (data) => {
            // အောင်မြင်သွားပါက handleLoginSuccess သို့ ဒေတာပို့မည်
            handleLoginSuccess(data);
        });
    }

    // Mode မျက်နှာပြင်ကို စတင်ပြသရန်
    if (appContent) {
        renderModeScreen(appContent);
    }
});

// Login သို့မဟုတ် Register အောင်မြင်သွားပါက Home Screen နှင့် Mode Screen ကိုပါ ပူးတွဲပြသရန်
function handleLoginSuccess(data) {
    localStorage.setItem('userName', data.name || "User");
    
    if (data.userId) {
        localStorage.setItem('userId', data.userId);
    }
    
    // Login Form ကို ဖျောက်ခြင်း
    formContent.style.display = 'none';

    // Main Container ထဲသို့ UI အသစ်များ ထည့်သွင်းခြင်း
    document.querySelector('.container').innerHTML = `
        <!-- အပေါ်ဘက် Content Area -->
        <div id="app-content" style="position: absolute; top: 0; left: 0; width: 100%; bottom: 70px; display: flex; flex-direction: column; overflow-y: auto; box-sizing: border-box;"></div>
        
        <!-- အောက်ခြေ Bottom Nav Bar -->
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 70px; display: flex; justify-content: space-around; align-items: center; background-color: #0f172a; border-top: 1px solid #1e293b; box-sizing: border-box; z-index: 100; pointer-events: auto;">
            
            <div class="nav-item" data-tab="mode" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #38bdf8;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span style="font-size: 10px; margin-top: 4px;">Mode</span>
            </div>

            <div class="nav-item" data-tab="match" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #94a3b8;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m14.5 17.5-6-6"></path>
                    <path d="m13 19 6-6"></path>
                    <path d="m5 11 6 6"></path>
                    <path d="m11 5-6 6"></path>
                    <path d="m19 5-4 4"></path>
                    <path d="m9 19-4-4"></path>
                </svg>
                <span style="font-size: 10px; margin-top: 4px;">Match</span>
            </div>

            <div class="nav-item" data-tab="notification" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #94a3b8;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                <span style="font-size: 10px; margin-top: 4px;">Notification</span>
            </div>

            <div class="nav-item" data-tab="profile" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #94a3b8;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span style="font-size: 10px; margin-top: 4px;">Profile</span>
            </div>
        </div>
    `;

    // Mode Screen ကို စတင်ပြသခြင်း
    const dynamicAppContent = document.getElementById('app-content');
    if (dynamicAppContent) {
        renderModeScreen(dynamicAppContent);
    }

    // Bottom Nav Click Event များ သတ်မှတ်ခြင်း
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.style.color = '#94a3b8');
            this.style.color = '#38bdf8';
            
            const tab = this.getAttribute('data-tab');
            const targetContent = document.getElementById('app-content');
            
            if (!targetContent) return;

            if (tab === 'mode') {
                renderModeScreen(targetContent);
            } else if (tab === 'notification') {
                renderNotificationScreen(targetContent);
            } else {
                targetContent.innerHTML = `<div style="color: white; text-align: center; margin-top: 50px; font-weight: 600;">${tab.toUpperCase()} Screen Coming Soon</div>`;
            }
        });
    });

    // Notification Badge စစ်ဆေးခြင်း
    if (typeof updateNotificationBadge === 'function') {
        updateNotificationBadge();
    }
}