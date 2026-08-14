import { initAuth } from './auth.js';

const formContent = document.getElementById('form-content');

formContent.style.display = 'flex';
formContent.style.flexDirection = 'column';
formContent.style.gap = '15px';
formContent.style.width = '100%';

// Auth စတင်ခြင်း (ဖုန်းနှင့် PIN အောင်မြင်ပါက ဒီထဲသို့ ဒေတာရောက်လာမည်)
initAuth(formContent, (phone, pin) => {
    
    // PIN အောင်မြင်သွားပါက Name ထည့်ခိုင်းမည့် အပိုင်း
    formContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
            <p style="color: #94a3b8; font-size: 14px; text-align: left; width: 100%;">Enter Your Name</p>
            <div class="input-box" style="width: 100%; background-color: #1e293b; padding: 16px 20px; border-radius: 16px; border: 1px solid #334155;">
                <input type="text" id="username-input" placeholder="Your Name" maxlength="20" autofocus style="width: 100%; color: white; background: transparent; border: none; font-size: 16px; outline: none;">
            </div>
                        <button class="next-btn" id="finish-btn" style="width: 100%; justify-content: center; padding: 14px 20px; margin-top: 5px; display: flex; align-items: center; gap: 8px;">
                <span>Finish</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </button>
        </div>
    `;

    const finishBtn = document.getElementById('finish-btn');
    const usernameInput = document.getElementById('username-input');

    finishBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        if (!username) {
            alert("ကျေးဇူးပြု၍ နာမည်ထည့်ပါ။");
            return;
        }

        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = 'dev_' + Math.random().toString(36).substring(2, 12);
            localStorage.setItem('device_id', deviceId);
        }

        // script.js ကနေ Backend သို့ တိုက်ရိုက် Fetch လုပ်ခြင်း
        try {
            const response = await fetch('/api/userid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: username,
                    phone: phone,
                    pin: pin,
                    deviceId: deviceId
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log("Created User ID:", data.userId);
                localStorage.setItem('userName', username);

                // အောင်မြင်သွားပါက Bottom Navigation ပြသခြင်း
                document.querySelector('.container').innerHTML = `
                    <div style="display: flex; flex-direction: column; justify-content: flex-end; position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; box-sizing: border-box; pointer-events: none;">
                        <div id="bottom-nav" style="display: flex; justify-content: space-around; align-items: center; background-color: #0f172a; border-top: 1px solid #1e293b; padding: 12px 0 24px 0; width: 100%; pointer-events: auto;">
                            
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

                const navItems = document.querySelectorAll('.nav-item');
                navItems.forEach(item => {
                    item.addEventListener('click', function() {
                        navItems.forEach(nav => nav.style.color = '#94a3b8');
                        this.style.color = '#38bdf8';
                    });
                });

            } else {
                alert("စာရင်းသွင်းရာတွင် အမှားအယွင်းရှိသည်: " + (data.message || data.error));
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။");
        }
    });
});