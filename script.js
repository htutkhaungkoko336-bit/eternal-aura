// main.js
import { initAuth } from './auth.js';
import { renderModeScreen } from './mode.js';

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

// App စတင်ဖွင့်သည်နှင့် လုပ်ဆောင်ရမည့် စနစ်များ
document.addEventListener('DOMContentLoaded', () => {
    // Authentication စနစ်ကို စတင်ခြင်း (auth.js ထဲက logic များကို အပြည့်အဝ အသုံးပြုရန်)
    if (typeof initAuth === 'function' && formContent) {
        initAuth(formContent, (username) => {
            handleLoginSuccess(username);
        });
    }

    // လိုအပ်ပါက အခြားအစပျိုးမှုများ ပြုလုပ်နိုင်သည်
});

// A. Login သို့မဟုတ် Registration အောင်မြင်သွားပါက Home Screen နှင့် Mode Screen ကိုပါ ပူးတွဲပြသရန်
function handleLoginSuccess(username) {
    localStorage.setItem('userName', username || "User");
    
    // Login Form ကို ဖျောက်ပြီး Main Container ထဲမှာ Mode Screen နဲ့ Bottom Nav ပေါ်လာစေရန်
    if (formContent) {
        formContent.style.display = 'none';
    }

    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div id="app-content" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: hidden; padding: 0; box-sizing: border-box;"></div>
            <div style="display: flex; flex-direction: column; justify-content: flex-end; position: absolute; bottom: 0px; left: 0; width: 100%; box-sizing: border-box; pointer-events: none;">
                <div id="bottom-nav" style="display: flex; justify-content: space-around; align-items: center; background-color: #0f172a; border-top: 1px solid #1e293b; padding: 10px 0 16px 0; width: 100%; pointer-events: auto;">
                    
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
            </div>
        `;
    }

    // Login အောင်မြင်တာနဲ့ Mode Screen ကို အလိုအလျောက် စတင်ပြသမည်
    const dynamicAppContent = document.getElementById('app-content');
    if (dynamicAppContent) {
        renderModeScreen(dynamicAppContent);
    }

    // Bottom Nav များကို နှိပ်သည့်အခါ အရောင်ပြောင်းရန်
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.style.color = '#94a3b8');
            this.style.color = '#38bdf8';
            
            const tab = this.getAttribute('data-tab');
            if (tab === 'mode') {
                if (dynamicAppContent) renderModeScreen(dynamicAppContent);
            } else {
                if (dynamicAppContent) dynamicAppContent.innerHTML = `<div style="color: white; text-align: center; margin-top: 50px;">${tab.toUpperCase()} Screen Coming Soon</div>`;
            }
        });
    });
}