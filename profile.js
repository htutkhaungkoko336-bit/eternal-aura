// profile.js - Cyberpunk City Style Profile & Achievements

export function renderProfileScreen(container) {
    const userName = localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('userId') || "EA-88492";
    const userAvatar = localStorage.getItem('userAvatar') || ""; 
    const userKey = localStorage.getItem('userKey') || "EA-KEY-9988-XYZ";

    container.innerHTML = `
        <style>
            .cyber-profile-wrapper {
                padding: 16px;
                color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: radial-gradient(circle at top, #311042 0%, #030712 100%);
                min-height: 100%;
                box-sizing: border-box;
                padding-bottom: 70px;
                position: relative;
            }

            /* --- Profile Header Layout (Top Info + Trophy Side by Side) --- */
            .profile-header-grid {
                display: flex;
                gap: 12px;
                align-items: center;
                margin-bottom: 14px;
            }

            .cyber-top-card {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid #ec4899;
                border-radius: 16px;
                padding: 14px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 10px;
                box-shadow: 0 0 20px rgba(236, 72, 153, 0.25);
                backdrop-filter: blur(10px);
                position: relative;
                overflow: hidden;
                flex: 1;
                min-height: 110px;
            }
            .cyber-top-card::after {
                content: '';
                position: absolute;
                top: 0; right: 0;
                width: 50px; height: 50px;
                background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), transparent);
                border-bottom-left-radius: 100%;
            }
            .pf-row-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .pf-upload-box {
                width: 50px;
                height: 50px;
                background: #020617;
                border: 2px dashed #ec4899;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                box-shadow: inset 0 0 10px rgba(236, 72, 153, 0.4);
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
                font-size: 20px;
                color: #ec4899;
                text-shadow: 0 0 8px #ec4899;
            }
            .pf-text-info h3 {
                margin: 0;
                font-size: 14px;
                color: #f472b6;
                text-shadow: 0 0 8px rgba(244, 114, 182, 0.5);
                letter-spacing: 0.5px;
            }
            .pf-text-info p {
                margin: 2px 0 0 0;
                font-size: 10px;
                color: #94a3b8;
                font-family: monospace;
            }

            /* --- Cyber Shield Trophy Mini Widget (Placed beside Profile) --- */
            .cyber-shield-wrapper {
                width: 110px;
                height: 125px;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(3, 7, 18, 0.98));
                border: 1.5px solid #06b6d4;
                clip-path: polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 10px rgba(236, 72, 153, 0.3);
                flex-shrink: 0;
            }
            .cyber-shield-wrapper::before {
                content: '';
                position: absolute;
                top: 4px; left: 4px; right: 4px; bottom: 4px;
                border: 1px dashed rgba(236, 72, 153, 0.6);
                clip-path: polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%);
                pointer-events: none;
                z-index: 10;
            }
            .cybercity-trophy-container {
                width: 90px;
                height: 100px;
                background: radial-gradient(circle at center, #1e1b4b 0%, #020617 100%);
                border: 1px solid rgba(6, 182, 212, 0.4);
                border-radius: 4px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                z-index: 2;
            }
            .holo-wing {
                position: absolute;
                width: 25px;
                height: 45px;
                background: linear-gradient(135deg, #06b6d4 0%, #ec4899 100%);
                top: 22px;
                opacity: 0.85;
            }
            .left-holo {
                left: 8px;
                clip-path: polygon(100% 0, 10% 25%, 30% 100%, 90% 75%);
                transform: skewY(-8deg);
            }
            .right-holo {
                right: 8px;
                clip-path: polygon(0 0, 90% 25%, 70% 100%, 10% 75%);
                transform: skewY(8deg);
            }
            .cyber-cup-body {
                position: absolute;
                width: 20px;
                height: 40px;
                background: linear-gradient(180deg, #38bdf8 0%, #0f172a 60%, #020617 100%);
                border: 0.5px solid #22d3ee;
                top: 24px;
                clip-path: polygon(25% 0%, 75% 0%, 100% 35%, 85% 100%, 15% 100%, 0% 35%);
                z-index: 2;
            }
            .circuit-line {
                position: absolute;
                top: 6px;
                left: 8px;
                width: 3px;
                height: 24px;
                background: #f472b6;
            }
            .cyber-base {
                position: absolute;
                bottom: 16px;
                width: 45px;
                height: 11px;
                background: #090d16;
                border: 0.5px solid #ec4899;
                border-radius: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3;
            }
            .cyber-badge-text {
                color: #22d3ee;
                font-size: 5px;
                font-weight: 900;
                letter-spacing: 1px;
                z-index: 4;
            }

            /* --- Cyber City Achievements Section --- */
            .cyber-achievements-box {
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid #06b6d4;
                border-radius: 16px;
                padding: 14px;
                margin-bottom: 14px;
                box-shadow: 0 0 25px rgba(6, 182, 212, 0.2);
            }
            .ach-header {
                font-size: 11px;
                font-weight: 900;
                color: #22d3ee;
                letter-spacing: 1.5px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #1e293b;
                padding-bottom: 6px;
                text-shadow: 0 0 8px rgba(34, 211, 238, 0.4);
            }
            .ach-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 8px;
            }
            .ach-item {
                background: linear-gradient(90deg, rgba(6, 182, 212, 0.08), rgba(15, 23, 42, 0.8));
                border: 1px solid rgba(6, 182, 212, 0.3);
                border-radius: 10px;
                padding: 10px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: 0.2s;
            }
            .ach-item:hover {
                border-color: #22d3ee;
                box-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
            }
            .ach-info-left h5 {
                margin: 0;
                font-size: 12px;
                color: #f8fafc;
                font-weight: bold;
                letter-spacing: 0.5px;
            }
            .ach-info-left p {
                margin: 2px 0 0 0;
                font-size: 10px;
                color: #94a3b8;
            }
            .ach-status-tag {
                background: rgba(34, 211, 238, 0.15);
                color: #22d3ee;
                border: 1px solid #22d3ee;
                font-size: 9px;
                font-weight: 900;
                padding: 3px 8px;
                border-radius: 6px;
                letter-spacing: 1px;
                box-shadow: 0 0 6px rgba(34, 211, 238, 0.3);
            }

            /* Action Grid (Key & History) */
            .action-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 14px;
            }
            .cyber-action-box {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid #334155;
                border-radius: 12px;
                padding: 14px;
                text-align: center;
                cursor: pointer;
                transition: 0.2s;
            }
            .cyber-action-box:hover {
                border-color: #a855f7;
                box-shadow: 0 0 12px rgba(168, 85, 247, 0.3);
            }
            .cyber-action-box span {
                font-size: 12px;
                font-weight: bold;
                color: #d8b4fe;
                letter-spacing: 1px;
            }

            .display-panel {
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid #a855f7;
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 14px;
                display: none;
                box-shadow: 0 0 12px rgba(168, 85, 247, 0.2);
                font-size: 12px;
            }
            .display-panel.show {
                display: block;
            }

            /* --- Floating Cyber Message Icon Button --- */
            .floating-msg-btn {
                position: fixed;
                bottom: 75px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #ec4899, #8b5cf6);
                border: 2px solid #f472b6;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
                z-index: 100;
                transition: transform 0.2s;
            }
            .floating-msg-btn:hover {
                transform: scale(1.1);
            }
            .floating-msg-btn svg {
                width: 22px;
                height: 22px;
                color: white;
            }

            /* Cyber Message Modal Popup */
            .cyber-modal {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(2, 6, 23, 0.8);
                backdrop-filter: blur(5px);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 200;
                padding: 16px;
                box-sizing: border-box;
            }
            .cyber-modal.show {
                display: flex;
            }
            .cyber-modal-content {
                background: #0f172a;
                border: 1px solid #ec4899;
                border-radius: 16px;
                padding: 16px;
                width: 100%;
                max-width: 320px;
                box-shadow: 0 0 25px rgba(236, 72, 153, 0.4);
            }
            .modal-title {
                font-size: 12px;
                font-weight: 900;
                color: #f472b6;
                margin-bottom: 12px;
                letter-spacing: 1px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-close {
                cursor: pointer;
                font-size: 14px;
                color: #94a3b8;
            }
            .msg-input {
                width: 100%;
                background: #020617;
                border: 1px solid #334155;
                color: white;
                padding: 8px 10px;
                border-radius: 8px;
                font-size: 11px;
                margin-bottom: 8px;
                box-sizing: border-box;
            }
            .msg-btn {
                background: linear-gradient(135deg, #ec4899, #be123c);
                color: white;
                border: none;
                width: 100%;
                padding: 8px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 11px;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(236, 72, 153, 0.4);
            }
        </style>

        <div class="cyber-profile-wrapper">
            <!-- Header Grid: Profile Card & Cyber Shield Trophy side-by-side -->
            <div class="profile-header-grid">
                <!-- 1. Top Card -->
                <div class="cyber-top-card">
                    <div class="pf-row-group">
                        <label class="pf-upload-box" id="avatar-container" title="ဓာတ်ပုံပြောင်းရန်နှိပ်ပါ">
                            ${userAvatar ? `<img src="${userAvatar}" id="pf-img">` : `<span>+</span>`}
                            <input type="file" id="pf-file-input" accept="image/*" style="display: none;">
                        </label>
                        <div class="pf-text-info">
                            <h3>${userName}</h3>
                            <p>${userId}</p>
                        </div>
                    </div>
                </div>

                <!-- 2. Cyber Shield Trophy Widget (Placed on the side) -->
                <div class="cyber-shield-wrapper" title="M7 Cyber City Champion Trophy">
                    <div class="cybercity-trophy-container">
                        <div class="holo-wing left-holo"></div>
                        <div class="holo-wing right-holo"></div>
                        <div class="cyber-cup-body">
                            <div class="circuit-line"></div>
                        </div>
                        <div class="cyber-base">
                            <span class="cyber-badge-text">M7 TROPHY</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Cyber City Achievements Section -->
            <div class="cyber-achievements-box">
                <div class="ach-header">
                    <span>⚡ CYBER CITY ACHIEVEMENTS</span>
                    <span style="color: #06b6d4; font-family: monospace;">UNLOCKED: 3/3</span>
                </div>
                <div class="ach-grid">
                    <div class="ach-item">
                        <div class="ach-info-left">
                            <h5>NEON PIONEER</h5>
                            <p>Connected to the Cyber Grid network</p>
                        </div>
                        <div class="ach-status-tag">ACTIVE</div>
                    </div>
                    <div class="ach-item">
                        <div class="ach-info-left">
                            <h5>DUEL MASTER</h5>
                            <p>Completed 1vs1 tactical matches</p>
                        </div>
                        <div class="ach-status-tag">COMPLETED</div>
                    </div>
                    <div class="ach-item">
                        <div class="ach-info-left">
                            <h5>SQUAD COMMANDER</h5>
                            <p>Registered 5vs5 elite operations</p>
                        </div>
                        <div class="ach-status-tag">ELITE</div>
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
                <div style="color: #d8b4fe; font-weight: bold; margin-bottom: 4px;">YOUR SECURITY KEY:</div>
                <div style="font-family: monospace; background: #020617; padding: 6px; border-radius: 6px; border: 1px solid #334155; color: #facc15;">${userKey}</div>
            </div>

            <div class="display-panel" id="panel-history">
                <div style="color: #d8b4fe; font-weight: bold; margin-bottom: 6px;">MATCH & REGISTER HISTORY:</div>
                <div style="background: #020617; padding: 6px 8px; border-radius: 6px; border: 1px solid #334155; margin-bottom: 4px;">
                    🔥 1vs1 Mode Register - <span style="color: #22c55e;">APPROVED</span>
                </div>
                <div style="background: #020617; padding: 6px 8px; border-radius: 6px; border: 1px solid #334155;">
                    🛡️ 5vs5 Tournament - <span style="color: #38bdf8;">PENDING</span>
                </div>
            </div>

            <!-- 5. Floating Message Icon Button -->
            <div class="floating-msg-btn" id="open-msg-modal" title="ရဲဘော်များထံ မက်ဆေ့ခ်ျပို့ရန်">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>

            <!-- Modal Popup for Messaging -->
            <div class="cyber-modal" id="msg-modal">
                <div class="cyber-modal-content">
                    <div class="modal-title">
                        <span>💬 CYBER NETWORK CHAT</span>
                        <span class="modal-close" id="close-msg-modal">✕</span>
                    </div>
                    <input type="text" class="msg-input" id="peer-id-input" placeholder="Receiver User ID (e.g. EA-12345)">
                    <input type="text" class="msg-input" id="peer-msg-input" placeholder="ရဲဘော်ထံ ပို့မည့်စာသား...">
                    <button class="msg-btn" id="send-peer-msg-btn">TRANSMIT 🚀</button>
                </div>
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

    // Modal Control
    const modal = document.getElementById('msg-modal');
    const openModalBtn = document.getElementById('open-msg-modal');
    const closeModalBtn = document.getElementById('close-msg-modal');

    openModalBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
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
        modal.classList.remove('show');
    });
}