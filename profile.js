// profile.js - 3D Esports Trophy Showcase System

export function renderProfileScreen(container) {
    const userName = localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('userId') || "EA-88492";
    const userAvatar = localStorage.getItem('userAvatar') || ""; 
    const userKey = localStorage.getItem('userKey') || "EA-KEY-9988-XYZ";
    
    // Trophies Data
    const championCount = parseInt(localStorage.getItem('trophy_champion') || '1');
    const duelCounts = [
        parseInt(localStorage.getItem('trophy_1v1_tier1') || '3'),
        parseInt(localStorage.getItem('trophy_1v1_tier2') || '1'),
        parseInt(localStorage.getItem('trophy_1v1_tier3') || '0'),
        parseInt(localStorage.getItem('trophy_1v1_tier4') || '0'),
        parseInt(localStorage.getItem('trophy_1v1_tier5') || '0'),
    ];
    const squadCounts = [
        parseInt(localStorage.getItem('trophy_5v5_tier1') || '2'),
        parseInt(localStorage.getItem('trophy_5v5_tier2') || '0'),
        parseInt(localStorage.getItem('trophy_5v5_tier3') || '0'),
        parseInt(localStorage.getItem('trophy_5v5_tier4') || '0'),
        parseInt(localStorage.getItem('trophy_5v5_tier5') || '0'),
    ];

    container.innerHTML = `
        <style>
            .cyber-profile-wrapper {
                padding: 16px;
                color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: radial-gradient(circle at top, #1e1b4b 0%, #020617 100%);
                min-height: 100%;
                box-sizing: border-box;
                padding-bottom: 60px;
            }

            /* --- Top Profile Card --- */
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
                margin-bottom: 14px;
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

            /* --- 3D Esports Trophy Vault Section --- */
            .esports-trophy-vault {
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.98));
                border: 1px solid rgba(250, 204, 21, 0.4);
                border-radius: 16px;
                padding: 14px;
                margin-bottom: 14px;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(250, 204, 21, 0.05);
            }
            .vault-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 14px;
                border-bottom: 1px solid #1e293b;
                padding-bottom: 8px;
            }
            .vault-title {
                font-size: 12px;
                font-weight: 900;
                color: #facc15;
                letter-spacing: 1.5px;
                text-shadow: 0 0 10px rgba(250, 204, 21, 0.5);
            }
            .vault-total {
                font-size: 11px;
                color: #38bdf8;
                font-family: monospace;
                background: rgba(56, 189, 248, 0.1);
                padding: 2px 8px;
                border-radius: 6px;
                border: 1px solid rgba(56, 189, 248, 0.3);
            }

            /* 1. Grand Champion Ultimate 3D Trophy Showcase */
            .grand-trophy-showcase {
                background: linear-gradient(135deg, rgba(250, 204, 21, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%);
                border: 2px solid #facc15;
                border-radius: 14px;
                padding: 14px;
                display: flex;
                align-items: center;
                gap: 14px;
                margin-bottom: 14px;
                box-shadow: 0 0 25px rgba(250, 204, 21, 0.3), inset 0 0 12px rgba(250, 204, 21, 0.2);
                position: relative;
                overflow: hidden;
            }
            .trophy-3d-icon {
                width: 60px;
                height: 60px;
                background: radial-gradient(circle, #facc15 0%, #b45309 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 20px #facc15;
                flex-shrink: 0;
                position: relative;
                border: 1px solid #fef08a;
            }
            .trophy-3d-icon svg {
                width: 36px;
                height: 36px;
                color: #020617;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
            }
            .trophy-stack-tag {
                position: absolute;
                bottom: -4px;
                right: -4px;
                background: #020617;
                color: #facc15;
                border: 1px solid #facc15;
                font-size: 10px;
                font-weight: 900;
                padding: 1px 6px;
                border-radius: 6px;
                box-shadow: 0 0 8px #facc15;
            }
            .grand-trophy-info h4 {
                margin: 0;
                font-size: 14px;
                font-weight: 900;
                color: #facc15;
                letter-spacing: 0.5px;
                text-shadow: 0 0 8px rgba(250, 204, 21, 0.6);
            }
            .grand-trophy-info p {
                margin: 3px 0 0 0;
                font-size: 10px;
                color: #cbd5e1;
            }
            .max-badge-pill {
                margin-left: auto;
                background: rgba(250, 204, 21, 0.2);
                color: #facc15;
                border: 1px solid #facc15;
                font-size: 9px;
                font-weight: 900;
                padding: 5px 8px;
                border-radius: 6px;
                letter-spacing: 1px;
                box-shadow: 0 0 10px rgba(250, 204, 21, 0.3);
            }

            /* 2. Mode Trophies Grid (10 Trophies: 1vs1 & 5vs5) */
            .mode-trophies-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            .mode-column {
                background: #020617;
                border: 1px solid #1e293b;
                border-radius: 12px;
                padding: 10px;
            }
            .mode-col-title {
                font-size: 10px;
                font-weight: 900;
                color: #38bdf8;
                margin-bottom: 8px;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                gap: 5px;
                border-bottom: 1px solid #0f172a;
                padding-bottom: 4px;
            }
            .trophy-card-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .trophy-mini-card {
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid #334155;
                border-radius: 8px;
                padding: 6px 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                transition: 0.2s;
            }
            .trophy-mini-card:hover {
                border-color: #38bdf8;
                box-shadow: 0 0 8px rgba(56, 189, 248, 0.3);
            }
            .tmc-left {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .tmc-icon-wrapper {
                width: 26px;
                height: 26px;
                background: linear-gradient(135deg, #38bdf8, #0369a1);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
                flex-shrink: 0;
            }
            .tmc-icon-wrapper svg {
                width: 15px;
                height: 15px;
                color: #020617;
            }
            .tmc-name {
                font-size: 10px;
                color: #f1f5f9;
                font-weight: bold;
            }
            .tmc-count {
                background: #020617;
                color: #38bdf8;
                border: 1px solid #38bdf8;
                font-size: 9px;
                font-weight: 900;
                padding: 1px 6px;
                border-radius: 6px;
                box-shadow: 0 0 6px rgba(56, 189, 248, 0.3);
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
            <!-- 1. Top Card -->
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

            <!-- 2. 3D Esports Trophy Vault (11 Trophies Showcase) -->
            <div class="esports-trophy-vault">
                <div class="vault-header">
                    <span class="vault-title">🏆 3D ESPORTS TROPHY VAULT</span>
                    <span class="vault-total">TOTAL: ${championCount + duelCounts.reduce((a,b)=>a+b, 0) + squadCounts.reduce((a,b)=>a+b, 0)}</span>
                </div>

                <!-- Grand Champion Ultimate 3D Cup -->
                <div class="grand-trophy-showcase">
                    <div class="trophy-3d-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                            <path d="M4 22h16"></path>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                        </svg>
                        <div class="trophy-stack-tag">x${championCount}</div>
                    </div>
                    <div class="grand-trophy-info">
                        <h4>GRAND CHAMPION CUP</h4>
                        <p>Ultimate World Championship Trophy</p>
                    </div>
                    <div class="max-badge-pill">PREMIER</div>
                </div>

                <!-- 10 Mode Trophies (5 for 1vs1, 5 for 5vs5) -->
                <div class="mode-trophies-section">
                    <!-- 1vs1 Tiers -->
                    <div class="mode-column">
                        <div class="mode-col-title">⚡ 1vs1 DUEL CUPS</div>
                        <div class="trophy-card-list">
                            ${duelCounts.map((count, index) => `
                                <div class="trophy-mini-card">
                                    <div class="tmc-left">
                                        <div class="tmc-icon-wrapper">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                                <path d="M4 22h16"></path>
                                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                                            </svg>
                                        </div>
                                        <span class="tmc-name">Fee T-${index + 1}</span>
                                    </div>
                                    <div class="tmc-count">x${Math.max(1, count)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 5vs5 Tiers -->
                    <div class="mode-column">
                        <div class="mode-col-title" style="color: #ec4899;">🛡️ 5vs5 SQUAD CUPS</div>
                        <div class="trophy-card-list">
                            ${squadCounts.map((count, index) => `
                                <div class="trophy-mini-card" style="border-color: rgba(236, 72, 153, 0.3);">
                                    <div class="tmc-left">
                                        <div class="tmc-icon-wrapper" style="background: linear-gradient(135deg, #ec4899, #9d174d); box-shadow: 0 0 8px rgba(236, 72, 153, 0.4);">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                                <path d="M4 22h16"></path>
                                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                                            </svg>
                                        </div>
                                        <span class="tmc-name">Fee T-${index + 1}</span>
                                    </div>
                                    <div class="tmc-count" style="color: #ec4899; border-color: #ec4899; box-shadow: 0 0 6px rgba(236, 72, 153, 0.3);">x${Math.max(1, count)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Action Grid (Key & History) -->
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

            <!-- 4. Network Message Section -->
            <div class="message-section">
                <div class="message-title">💬 ETERNAL AURA NETWORK CHAT</div>
                <input type="text" class="msg-input" id="peer-id-input" placeholder="Enter Receiver User ID (e.g. EA-12345)">
                <input type="text" class="msg-input" id="peer-msg-input" placeholder="ရဲဘော်ထံ ပို့မည့်စာသား ရေးပါ...">
                <button class="msg-btn" id="send-peer-msg-btn">TRANSMIT MESSAGE 🚀</button>
            </div>
        </div>
    `;

    // --- Logic ---
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