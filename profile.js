// profile.js - Cyberpunk Theme Profile Screen with Sketch Layout

export function renderProfileScreen(container) {
    // LocalStorage မှ အချက်အလက်များ ရယူခြင်း (သို့မဟုတ် Default)
    const userName = localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('userId') || "EA-88492";
    const userAvatar = localStorage.getItem('userAvatar') || ""; // Profile ပုံအတွက် (Base64 or URL)
    const userKey = localStorage.getItem('userKey') || "EA-KEY-9988-XYZ";
    
    // Achievement / Champion အခြေအနေများ (localStorage မှာ သိမ်းမည်)
    const isChampion = localStorage.getItem('isChampion') === 'true'; // ကြီးတဲ့ဖလား လင်းမလင်း
    const has1vs1Win = localStorage.getItem('has1vs1Win') === 'true';   // 1vs1 ဖလားသေး
    const has5vs5Win = localStorage.getItem('has5vs5Win') === 'true';   // 5vs5 ဖလားသေး

    container.innerHTML = `
        <style>
            .cyber-profile-wrapper {
                padding: 16px;
                color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: radial-gradient(circle at top, #1e1b4b 0%, #020617 100%);
                min-height: 100%;
                box-sizing: border-box;
                padding-bottom: 50px;
            }
            /* Top Header Card (Avatar + Name + ID + Trophies) */
            .top-profile-card {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid #38bdf8;
                border-radius: 16px;
                padding: 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
                backdrop-filter: blur(10px);
                margin-bottom: 14px;
            }
            .profile-left-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            /* Profile Picture Upload Box (+) */
            .pf-upload-box {
                width: 60px;
                height: 60px;
                background: #020617;
                border: 2px dashed #38bdf8;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                box-shadow: inset 0 0 8px rgba(56, 189, 248, 0.3);
                flex-shrink: 0;
            }
            .pf-upload-box img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
            }
            .pf-upload-box span {
                font-size: 24px;
                color: #38bdf8;
                text-shadow: 0 0 5px #38bdf8;
            }
            .pf-text-info h3 {
                margin: 0;
                font-size: 15px;
                color: #38bdf8;
                text-shadow: 0 0 5px rgba(56, 189, 248, 0.5);
            }
            .pf-text-info p {
                margin: 3px 0 0 0;
                font-size: 11px;
                color: #94a3b8;
                font-family: monospace;
            }
            /* Trophy Section */
            .trophies-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
            }
            /* Big Champion Trophy */
            .big-trophy {
                font-size: 26px;
                filter: grayscale(100%) opacity(0.3);
                transition: 0.3s;
            }
            .big-trophy.active {
                filter: grayscale(0%) opacity(1);
                text-shadow: 0 0 15px #facc15, 0 0 30px #facc15;
                transform: scale(1.1);
            }
            /* Small Trophies (1vs1 & 5vs5) */
            .small-trophies-row {
                display: flex;
                gap: 6px;
            }
            .small-trophy {
                font-size: 14px;
                filter: grayscale(100%) opacity(0.2);
                transition: 0.3s;
            }
            .small-trophy.active {
                filter: grayscale(0%) opacity(1);
                text-shadow: 0 0 8px #38bdf8;
            }

            /* Key & History Buttons Grid */
            .action-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 14px;
            }
            .cyber-action-box {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid #1e293b;
                border-radius: 12px;
                padding: 16px;
                text-align: center;
                cursor: pointer;
                transition: 0.2s;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }
            .cyber-action-box:hover {
                border-color: #38bdf8;
                box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
            }
            .cyber-action-box span {
                font-size: 13px;
                font-weight: bold;
                color: #38bdf8;
                letter-spacing: 1px;
            }

            /* Expandable Display Area (Key & History Modal/Box) */
            .display-panel {
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid #38bdf8;
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 14px;
                display: none;
                box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
                font-size: 12px;
            }
            .display-panel.show {
                display: block;
            }

            /* Message Section (Cyber City Style) */
            .message-section {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid #f43f5e;
                border-radius: 14px;
                padding: 14px;
                box-shadow: 0 0 12px rgba(244, 63, 94, 0.2);
            }
            .message-title {
                font-size: 13px;
                color: #f43f5e;
                font-weight: bold;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .msg-input {
                width: 100%;
                background: #020617;
                border: 1px solid #1e293b;
                color: white;
                padding: 8px 10px;
                border-radius: 8px;
                font-size: 11px;
                margin-bottom: 8px;
                box-sizing: border-box;
            }
            .msg-input:focus {
                border-color: #f43f5e;
                outline: none;
                box-shadow: 0 0 8px rgba(244, 63, 94, 0.4);
            }
            .msg-btn {
                background: linear-gradient(135deg, #f43f5e, #be123c);
                color: white;
                border: none;
                width: 100%;
                padding: 8px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 11px;
                cursor: pointer;
                box-shadow: 0 0 8px rgba(244, 63, 94, 0.4);
            }
        </style>

        <div class="cyber-profile-wrapper">
            <!-- 1. Top Section: PF Box (+), Name, ID, Trophies -->
            <div class="top-profile-card">
                <div class="profile-left-group">
                    <label class="pf-upload-box" id="avatar-container" title="ဓာတ်ပုံပြောင်းရန်နှိပ်ပါ">
                        ${userAvatar ? `<img src="${userAvatar}" id="pf-img">` : `<span>+</span>`}
                        <input type="file" id="pf-file-input" accept="image/*" style="display: none;">
                    </label>
                    <div class="pf-text-info">
                        <h3>${userName}</h3>
                        <p>${userId}</p>
                    </div>
                </div>

                <!-- Trophies (Champion & Mode Wins) -->
                <div class="trophies-group">
                    <div class="big-trophy ${isChampion ? 'active' : ''}" title="Champion Trophy">🏆</div>
                    <div class="small-trophies-row">
                        <span class="small-trophy ${has1vs1Win ? 'active' : ''}" title="1vs1 Winner">⚡</span>
                        <span class="small-trophy ${has5vs5Win ? 'active' : ''}" title="5vs5 Winner">🛡️</span>
                    </div>
                </div>
            </div>

            <!-- 2. Key & History Buttons Grid -->
            <div class="action-grid">
                <div class="cyber-action-box" id="btn-key">
                    <span>KEY 🔑</span>
                </div>
                <div class="cyber-action-box" id="btn-history">
                    <span>HISTORY 📜</span>
                </div>
            </div>

            <!-- Expandable Panel for Key -->
            <div class="display-panel" id="panel-key">
                <div style="color: #38bdf8; font-weight: bold; margin-bottom: 4px;">YOUR SECURITY KEY:</div>
                <div style="font-family: monospace; background: #020617; padding: 6px; border-radius: 6px; border: 1px solid #1e293b; color: #facc15;">${userKey}</div>
                <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">ဒီကုဒ်ကို မည်သူ့ကိုမျှ မပေးပါ။</div>
            </div>

            <!-- Expandable Panel for History -->
            <div class="display-panel" id="panel-history">
                <div style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">MATCH & REGISTER HISTORY:</div>
                <div style="background: #020617; padding: 6px 8px; border-radius: 6px; border: 1px solid #1e293b; margin-bottom: 4px;">
                    🔥 1vs1 Mode Register - <span style="color: #22c55e;">APPROVED</span>
                </div>
                <div style="background: #020617; padding: 6px 8px; border-radius: 6px; border: 1px solid #1e293b;">
                    🛡️ 5vs5 Tournament - <span style="color: #38bdf8;">PENDING</span>
                </div>
            </div>

            <!-- 3. Message Section (User to User Connect) -->
            <div class="message-section">
                <div class="message-title">💬 ETERNAL AURA NETWORK CHAT</div>
                <input type="text" class="msg-input" id="peer-id-input" placeholder="Enter Receiver User ID (e.g. EA-12345)">
                <input type="text" class="msg-input" id="peer-msg-input" placeholder="ရဲဘော်ထံ ပို့မည့်စာသား ရေးပါ...">
                <button class="msg-btn" id="send-peer-msg-btn">TRANSMIT MESSAGE 🚀</button>
            </div>
        </div>
    `;

    // --- JavaScript Logic for Interactivity ---

    // 1. Profile Photo Upload & LocalStorage Persistence (Database မလိုဘဲ သိမ်းရန်)
    const fileInput = document.getElementById('pf-file-input');
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Image = event.target.result;
                localStorage.setItem('userAvatar', base64Image); // localStorage မှာ သိမ်းမည်
                
                // UI တွင် ချက်ချင်းပြောင်းရန်
                const avatarContainer = document.getElementById('avatar-container');
                avatarContainer.innerHTML = `<img src="${base64Image}" id="pf-img"><input type="file" id="pf-file-input" accept="image/*" style="display: none;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // 2. Key Box Toggle
    const btnKey = document.getElementById('btn-key');
    const panelKey = document.getElementById('panel-key');
    const panelHistory = document.getElementById('panel-history');

    btnKey.addEventListener('click', () => {
        panelKey.classList.toggle('show');
        panelHistory.classList.remove('show');
    });

    // 3. History Box Toggle
    const btnHistory = document.getElementById('btn-history');
    btnHistory.addEventListener('click', () => {
        panelHistory.classList.toggle('show');
        panelKey.classList.remove('show');
    });

    // 4. Message Send Action
    const sendMsgBtn = document.getElementById('send-peer-msg-btn');
    sendMsgBtn.addEventListener('click', () => {
        const peerId = document.getElementById('peer-id-input').value.trim();
        const msgText = document.getElementById('peer-msg-input').value.trim();

        if (!msgText) {
            alert("ကျေးဇူးပြု၍ ပို့မည့်စာသားကို ရေးပါ။");
            return;
        }

        alert(`✅ မက်ဆေ့ခ်ျကို ${peerId || 'Network User'} ထံသို့ အောင်မြင်စွာ ပို့ပြီးပါပြီ!`);
        document.getElementById('peer-msg-input').value = '';
        document.getElementById('peer-id-input').value = '';
    });
}