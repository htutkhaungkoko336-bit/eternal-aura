// profile.js - Cyberpunk Achievement Badge & Master Card Layout

export function renderProfileScreen(container) {
    const userName = localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('userId') || "EA-88492";
    const userAvatar = localStorage.getItem('userAvatar') || ""; 
    const userKey = localStorage.getItem('userKey') || "EA-KEY-9988-XYZ";
    
    const isChampion = localStorage.getItem('isChampion') === 'true'; 
    const has1vs1Win = localStorage.getItem('has1vs1Win') === 'true';   
    const has5vs5Win = localStorage.getItem('has5vs5Win') === 'true';   

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

            /* --- Master Profile Card --- */
            .top-profile-card {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid #38bdf8;
                border-radius: 16px;
                padding: 14px;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
                backdrop-filter: blur(10px);
                margin-bottom: 12px;
            }
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

            /* --- Achievement Priority Banner (Champion Card) --- */
            .achievement-banner {
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
                border: 1px solid #334155;
                border-radius: 14px;
                padding: 12px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 14px;
                position: relative;
                overflow: hidden;
                transition: 0.4s ease;
            }
            /* Champion ဖြစ်သွားရင် ဘားတခုလုံး ရွှေရောင်လင်းမည် */
            .achievement-banner.champion-unlocked {
                border-color: #facc15;
                box-shadow: 0 0 20px rgba(250, 204, 21, 0.3), inset 0 0 10px rgba(250, 204, 21, 0.2);
                background: linear-gradient(135deg, rgba(49, 46, 12, 0.85), rgba(15, 23, 42, 0.95));
            }

            .ach-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            /* Hexagon Badge Icon Style */
            .ach-badge-icon {
                width: 44px;
                height: 44px;
                background: #020617;
                border: 2px solid #475569;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #475569;
                font-size: 20px;
                transition: 0.4s ease;
            }
            .achievement-banner.champion-unlocked .ach-badge-icon {
                border-color: #facc15;
                color: #facc15;
                background: rgba(250, 204, 21, 0.1);
                box-shadow: 0 0 12px #facc15;
            }

            .ach-info h4 {
                margin: 0;
                font-size: 13px;
                letter-spacing: 0.5px;
                color: #94a3b8;
                transition: 0.4s ease;
            }
            .achievement-banner.champion-unlocked .ach-info h4 {
                color: #facc15;
                text-shadow: 0 0 8px rgba(250, 204, 21, 0.5);
            }
            .ach-info p {
                margin: 2px 0 0 0;
                font-size: 10px;
                color: #64748b;
                font-family: monospace;
            }
            .achievement-banner.champion-unlocked .ach-info p {
                color: #fef08a;
            }

            /* Status Pill */
            .ach-status-pill {
                font-size: 10px;
                font-weight: bold;
                padding: 4px 10px;
                border-radius: 20px;
                background: #1e293b;
                color: #64748b;
                border: 1px solid #334155;
                letter-spacing: 1px;
            }
            .achievement-banner.champion-unlocked .ach-status-pill {
                background: #facc15;
                color: #020617;
                border-color: #fef08a;
                box-shadow: 0 0 10px #facc15;
            }

            /* --- Sub-Mode Wins Row (1vs1 & 5vs5) ---. */
            .sub-wins-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 14px;
            }
            .sub-win-card {
                background: rgba(15, 23, 42, 0.7);
                border: 1px solid #1e293b;
                border-radius: 10px;
                padding: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
                opacity: 0.4;
                transition: 0.3s;
            }
            .sub-win-card.active-mode {
                opacity: 1;
                border-color: #38bdf8;
                background: rgba(15, 23, 42, 0.9);
                box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
            }
            .sub-win-card.active-5v5 {
                opacity: 1;
                border-color: #ec4899;
                background: rgba(15, 23, 42, 0.9);
                box-shadow: 0 0 10px rgba(236, 72, 153, 0.2);
            }
            .sub-icon {
                font-size: 16px;
            }
            .sub-text span:first-child {
                display: block;
                font-size: 10px;
                color: #94a3b8;
                font-weight: bold;
            }
            .sub-text span:last-child {
                display: block;
                font-size: 11px;
                color: #f8fafc;
            }

            /* Action Grid & Panels */
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
                padding: 14px;
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
                font-size: 12px;
                font-weight: bold;
                color: #38bdf8;
                letter-spacing: 1px;
            }

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

            .message-section {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid #f43f5e;
                border-radius: 14px;
                padding: 14px;
                box-shadow: 0 0 12px rgba(244, 63, 94, 0.2);
            }
            .message-title {
                font-size: 12px;
                color: #f43f5e;
                font-weight: bold;
                margin-bottom: 8px;
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
            }
        </style>

        <div class="cyber-profile-wrapper">
            <!-- 1. Top Card (Avatar + Name + ID) -->
            <div class="top-profile-card">
                <label class="pf-upload-box" id="avatar-container" title="ဓာတ်ပုံပြောင်းရန်နှိပ်ပါ">
                    ${userAvatar ? `<img src="${userAvatar}" id="pf-img">` : `<span>+</span>`}
                    <input type="file" id="pf-file-input" accept="image/*" style="display: none;">
                </label>
                <div class="pf-text-info">
                    <h3>${userName}</h3>
                    <p>${userId}</p>
                </div>
            </div>

            <!-- 2. Achievement Priority Banner (Champion Status Highlight) -->
            <div class="achievement-banner ${isChampion ? 'champion-unlocked' : ''}">
                <div class="ach-left">
                    <div class="ach-badge-icon">
                        👑
                    </div>
                    <div class="ach-info">
                        <h4>TOURNAMENT CHAMPION</h4>
                        <p>${isChampion ? 'Ultimate Grandmaster Tier' : 'Status: Locked (Unclaimed)'}</p>
                    </div>
                </div>
                <div class="ach-status-pill">
                    ${isChampion ? 'UNLOCKED' : 'LOCKED'}
                </div>
            </div>

            <!-- 3. Sub-Mode Wins Status Grid (1vs1 & 5vs5) -->
            <div class="sub-wins-grid">
                <div class="sub-win-card ${has1vs1Win ? 'active-mode' : ''}">
                    <span class="sub-icon">⚡</span>
                    <div class="sub-text">
                        <span>1vs1 DUEL</span>
                        <span>${has1vs1Win ? 'VICTOR' : 'UNRANKED'}</span>
                    </div>
                </div>
                <div class="sub-win-card ${has5vs5Win ? 'active-5v5' : ''}">
                    <span class="sub-icon">🛡️</span>
                    <div class="sub-text">
                        <span>5vs5 SQUAD</span>
                        <span>${has5vs5Win ? 'CHAMPION' : 'UNRANKED'}</span>
                    </div>
                </div>
            </div>

            <!-- 4. Action Grid (Key & History) -->
            <div class="action-grid">
                <div class="cyber-action-box" id="btn-key">
                    <span>KEY 🔑</span>
                </div>
                <div class="cyber-action-box" id="btn-history">
                    <span>HISTORY 📜</span>
                </div>
            </div>

            <div class="display-panel" id="panel-key">
                <div style="color: #38bdf8; font-weight: bold; margin-bottom: 4px;">YOUR SECURITY KEY:</div>
                <div style="font-family: monospace; background: #020617; padding: 6px; border-radius: 6px; border: 1px solid #1e293b; color: #facc15;">${userKey}</div>
            </div>

            <div class="display-panel" id="panel-history">
                <div style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">MATCH & REGISTER HISTORY:</div>
                <div style="background: #020617; padding: 6px 8px; border-radius: 6px; border: 1px solid #1e293b; margin-bottom: 4px;">
                    🔥 1vs1 Mode Register - <span style="color: #22c55e;">APPROVED</span>
                </div>
                <div style="background: #020617; padding: 6px 8px; border-radius: 6px; border: 1px solid #1e293b;">
                    🛡️ 5vs5 Tournament - <span style="color: #38bdf8;">PENDING</span>
                </div>
            </div>

            <!-- 5. Network Message Section -->
            <div class="message-section">
                <div class="message-title">💬 ETERNAL AURA NETWORK CHAT</div>
                <input type="text" class="msg-input" id="peer-id-input" placeholder="Enter Receiver User ID (e.g. EA-12345)">
                <input type="text" class="msg-input" id="peer-msg-input" placeholder="ရဲဘော်ထံ ပို့မည့်စာသား ရေးပါ...">
                <button class="msg-btn" id="send-peer-msg-btn">TRANSMIT MESSAGE 🚀</button>
            </div>
        </div>
    `;

    // --- Logic Interactivity ---
    const fileInput = document.getElementById('pf-file-input');
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Image = event.target.result;
                localStorage.setItem('userAvatar', base64Image);
                const avatarContainer = document.getElementById('avatar-container');
                avatarContainer.innerHTML = `<img src="${base64Image}" id="pf-img"><input type="file" id="pf-file-input" accept="image/*" style="display: none;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    const btnKey = document.getElementById('btn-key');
    const panelKey = document.getElementById('panel-key');
    const panelHistory = document.getElementById('panel-history');

    btnKey.addEventListener('click', () => {
        panelKey.classList.toggle('show');
        panelHistory.classList.remove('show');
    });

    const btnHistory = document.getElementById('btn-history');
    btnHistory.addEventListener('click', () => {
        panelHistory.classList.toggle('show');
        panelKey.classList.remove('show');
    });

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