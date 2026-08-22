// profile.js - Cyberpunk Profile with High-Tech SVG Trophies

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

            /* --- High-Tech Trophies Styling --- */
            .trophies-group {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 8px;
            }
            
            /* Big Champion Trophy (SVG Container) */
            .cyber-trophy-big {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #334155; /* မရသေးရင် အရိပ်လို မှိန်နေမယ် */
                transition: 0.4s ease;
            }
            .cyber-trophy-big.active {
                color: #facc15; /* ရွှေရောင် လင်းလက်မည် */
                filter: drop-shadow(0 0 8px #facc15) drop-shadow(0 0 16px #eab308);
                transform: scale(1.1);
            }

            /* Small Mode Trophies Row */
            .small-trophies-row {
                display: flex;
                gap: 8px;
            }
            .cyber-trophy-small {
                width: 22px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #334155;
                transition: 0.4s ease;
            }
            .cyber-trophy-small.active-1v1 {
                color: #38bdf8; /* Cyan Neon for 1vs1 */
                filter: drop-shadow(0 0 6px #38bdf8);
            }
            .cyber-trophy-small.active-5v5 {
                color: #ec4899; /* Pink/Purple Neon for 5vs5 */
                filter: drop-shadow(0 0 6px #ec4899);
            }

            /* Action Grid */
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
            <!-- Top Card -->
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

                <!-- High-Tech SVG Trophies -->
                <div class="trophies-group">
                    <!-- Champion Trophy (Big) -->
                    <div class="cyber-trophy-big ${isChampion ? 'active' : ''}" title="Champion Trophy">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                            <path d="M4 22h16"></path>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                        </svg>
                    </div>

                    <!-- Small Trophies (1vs1 & 5vs5) -->
                    <div class="small-trophies-row">
                        <!-- 1vs1 Winner Icon (Lightning/Flash) -->
                        <div class="cyber-trophy-small ${has1vs1Win ? 'active-1v1' : ''}" title="1vs1 Winner">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                        </div>
                        <!-- 5vs5 Winner Icon (Shield) -->
                        <div class="cyber-trophy-small ${has5vs5Win ? 'active-5v5' : ''}" title="5vs5 Winner">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Grid -->
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

            <!-- Message Section -->
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