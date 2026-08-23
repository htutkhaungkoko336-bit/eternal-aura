// profile.js - MLBB Style Trophy Showcase & Collection System

export function renderProfileScreen(container) {
    const userName = localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('userId') || "EA-88492";
    const userAvatar = localStorage.getItem('userAvatar') || ""; 
    const userKey = localStorage.getItem('userKey') || "EA-KEY-9988-XYZ";
    
    // --- Trophy & Fee Data Simulation (localStorage မှ ရယူမည်၊ မရှိရင် Default ထည့်မည်) ---
    // 1. Champion Trophy (0 သို့မဟုတ် အကြိမ်ရေ)
    const championCount = parseInt(localStorage.getItem('trophy_champion') || '1'); // ဥပမာ x1
    
    // 2. 1vs1 Fee Tiers (5 ခု - ဥပမာ Entry Fee 1000, 3000, 5000, 10000, 20000)
    const duelCounts = [
        parseInt(localStorage.getItem('trophy_1v1_tier1') || '3'), // x3
        parseInt(localStorage.getItem('trophy_1v1_tier2') || '1'), // x1
        parseInt(localStorage.getItem('trophy_1v1_tier3') || '0'), // 0 ဆိုရင် မရသေးတာ (သို့မဟုတ် အနည်းဆုံး x1 ပြမယ်)
        parseInt(localStorage.getItem('trophy_1v1_tier4') || '0'),
        parseInt(localStorage.getItem('trophy_1v1_tier5') || '0'),
    ];

    // 3. 5vs5 Fee Tiers (5 ခု - ဥပမာ Entry Fee တူညီသော ၅ ဆင့်)
    const squadCounts = [
        parseInt(localStorage.getItem('trophy_5v5_tier1') || '2'), // x2
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

            /* --- MLBB Trophy Showcase Section --- */
            .trophy-showcase-container {
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid #302b63;
                border-radius: 16px;
                padding: 14px;
                margin-bottom: 14px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            }
            .section-title {
                font-size: 12px;
                font-weight: bold;
                color: #facc15;
                letter-spacing: 1px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #1e293b;
                padding-bottom: 6px;
            }

            /* 1. Ultimate Champion Featured Trophy (အလန်းဆုံးနဲ့ အကြီးဆုံး) */
            .grand-champion-card {
                background: linear-gradient(135deg, rgba(250, 204, 21, 0.15), rgba(15, 23, 42, 0.9));
                border: 2px solid #facc15;
                border-radius: 12px;
                padding: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
                box-shadow: 0 0 15px rgba(250, 204, 21, 0.3);
            }
            .gc-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .gc-icon-box {
                width: 48px;
                height: 48px;
                background: radial-gradient(circle, #facc15 0%, #ca8a04 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 26px;
                box-shadow: 0 0 12px #facc15;
                position: relative;
            }
            .stack-badge {
                position: absolute;
                bottom: -4px;
                right: -4px;
                background: #020617;
                color: #facc15;
                border: 1px solid #facc15;
                font-size: 10px;
                font-weight: bold;
                padding: 1px 5px;
                border-radius: 8px;
                box-shadow: 0 0 5px #facc15;
            }
            .gc-info h4 {
                margin: 0;
                font-size: 13px;
                color: #facc15;
                text-shadow: 0 0 8px rgba(250, 204, 21, 0.5);
                letter-spacing: 0.5px;
            }
            .gc-info p {
                margin: 2px 0 0 0;
                font-size: 10px;
                color: #cbd5e1;
            }

            /* 2. Grid for 10 Mode Trophies (5 for 1vs1, 5 for 5vs5) */
            .trophies-grid-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            .trophy-category-box {
                background: #020617;
                border: 1px solid #1e293b;
                border-radius: 10px;
                padding: 10px;
            }
            .cat-header {
                font-size: 11px;
                font-weight: bold;
                color: #38bdf8;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .tier-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .tier-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid #334155;
                padding: 6px 8px;
                border-radius: 8px;
            }
            .tier-info {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .tier-trophy-icon {
                font-size: 14px;
                filter: drop-shadow(0 0 5px #38bdf8);
            }
            .tier-name {
                font-size: 10px;
                color: #94a3b8;
                font-weight: bold;
            }
            .tier-stack {
                background: #1e293b;
                color: #38bdf8;
                border: 1px solid #38bdf8;
                font-size: 9px;
                font-weight: bold;
                padding: 1px 6px;
                border-radius: 6px;
                box-shadow: 0 0 5px rgba(56, 189, 248, 0.3);
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

            <!-- 2. MLBB Style Trophy Showcase (11 Trophies Total) -->
            <div class="trophy-showcase-container">
                <div class="section-title">
                    <span>🏆 TROPHY COLLECTION (11 TIERS)</span>
                    <span style="color: #38bdf8; font-family: monospace;">TOTAL: ${championCount + duelCounts.reduce((a,b)=>a+b, 0) + squadCounts.reduce((a,b)=>a+b, 0)}</span>
                </div>

                <!-- Grand Champion Trophy (1st Trophy - Ultimate) -->
                <div class="grand-champion-card">
                    <div class="gc-left">
                        <div class="gc-icon-box">
                            🏆
                            <div class="stack-badge">x${championCount}</div>
                        </div>
                        <div class="gc-info">
                            <h4>GRAND CHAMPION</h4>
                            <p>Ultimate Tournament Crown</p>
                        </div>
                    </div>
                    <div style="font-size: 11px; color: #facc15; font-weight: bold; background: rgba(250, 204, 21, 0.1); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(250, 204, 21, 0.4);">
                        MAX TIER
                    </div>
                </div>

                <!-- 10 Mode Fee Trophies Grid (5 for 1vs1, 5 for 5vs5) -->
                <div class="trophies-grid-section">
                    <!-- 1vs1 Fee Tiers (5 Trophies) -->
                    <div class="trophy-category-box">
                        <div class="cat-header">⚡ 1vs1 DUEL FEES</div>
                        <div class="tier-list">
                            ${duelCounts.map((count, index) => `
                                <div class="tier-item">
                                    <div class="tier-info">
                                        <span class="tier-trophy-icon">🏆</span>
                                        <span class="tier-name">Fee T-${index + 1}</span>
                                    </div>
                                    <div class="tier-stack">x${Math.max(1, count)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 5vs5 Fee Tiers (5 Trophies) -->
                    <div class="trophy-category-box">
                        <div class="cat-header" style="color: #ec4899;">🛡️ 5vs5 SQUAD FEES</div>
                        <div class="tier-list">
                            ${squadCounts.map((count, index) => `
                                <div class="tier-item" style="border-color: rgba(236, 72, 153, 0.3);">
                                    <div class="tier-info">
                                        <span class="tier-trophy-icon" style="filter: drop-shadow(0 0 5px #ec4899);">🏆</span>
                                        <span class="tier-name">Fee T-${index + 1}</span>
                                    </div>
                                    <div class="tier-stack" style="color: #ec4899; border-color: #ec4899;">x${Math.max(1, count)}</div>
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