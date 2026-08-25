import { renderTrophyShowcase } from './trophies.js';

export function renderProfileScreen(container) {
    const userName = localStorage.getItem('user_profile_name') || localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('user_profile_id') || localStorage.getItem('userId') || "EA-99821";
    const userKey = localStorage.getItem('user_profile_key') || "EA-KEY-5599-CYBER-99X";
    const savedAvatar = localStorage.getItem('user_profile_avatar') || "";

    // ဥပမာ သုံးစွဲသူရဲ့ Key အရေအတွက် (Localstorage ကနေ ယူသုံးလို့ရပါတယ်)
    let userKeyCount = parseInt(localStorage.getItem('user_profile_key_count') || '12');

    container.innerHTML = `
        <style>
            /* Scroll bar အားလုံးကို လုံးဝဖျောက်ရန် */
            ::-webkit-scrollbar {
                display: none;
                width: 0px;
                height: 0px;
            }
            * {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            html, body {
                max-width: 100%;
                overflow-x: hidden !important;
            }

            .profile-wrapper {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 16px;
                box-sizing: border-box;
                color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                position: relative;
                overflow-x: hidden !important;
                transition: all 0.3s ease;
            }

            /* Trophy ပွင့်နေချိန် အပေါ်ဘန်နာကိုသာ ဖျောက်မည် */
            .profile-wrapper.trophy-active .top-banner {
                opacity: 0;
                visibility: hidden;
                height: 0;
                margin: 0;
                padding: 0;
                overflow: hidden;
                pointer-events: none;
                transition: all 0.4s ease;
            }

            /* Top Compact Banner */
            .top-banner {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid #0ea5e9;
                border-radius: 16px;
                padding: 12px 16px;
                display: flex;
                align-items: center;
                gap: 14px;
                box-shadow: 0 0 20px rgba(14, 165, 233, 0.25);
                backdrop-filter: blur(10px);
                margin-bottom: 16px;
                box-sizing: border-box;
                transition: all 0.4s ease;
            }

            .avatar-box {
                width: 50px;
                height: 50px;
                background: #020617;
                border: 2px solid #38bdf8;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                flex-shrink: 0;
                box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
            }

            .avatar-box img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0; left: 0;
            }

            .profile-info h3 {
                margin: 0;
                font-size: 14px;
                color: #38bdf8;
                text-shadow: 0 0 8px rgba(56, 189, 248, 0.5);
            }

            .profile-info p {
                margin: 3px 0 0 0;
                font-size: 11px;
                color: #94a3b8;
                font-family: monospace;
            }

            /* Cyber Stage */
            .cyber-stage {
                background: transparent;
                border: none;
                border-radius: 16px;
                padding: 24px 8px 36px 8px;
                margin-bottom: 16px;
                text-align: center;
                position: relative;
                min-height: 290px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                overflow: hidden !important;
                box-sizing: border-box;
                box-shadow: none;
                perspective: 1000px;
                transition: all 0.4s ease;
            }

            /* Single Cube Wrapper */
            .nested-cubic-wrapper {
                perspective: 900px;
                width: 110px;
                height: 110px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: opacity 0.5s ease, transform 0.5s ease;
                animation: coreFloat 3.2s ease-in-out infinite;
                z-index: 3;
                margin-bottom: 18px;
                position: relative;
            }

            @keyframes coreFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
            }

            .nested-cubic-wrapper.hidden {
                opacity: 0;
                transform: scale(0.5);
                pointer-events: none;
                position: absolute;
                display: none;
            }

            .nested-cubic-wrapper::after {
                content: '';
                position: absolute;
                bottom: -24px;
                width: 3px;
                height: 24px;
                background: #c084fc;
                box-shadow: 0 0 12px #c084fc, 0 0 25px #9333ea, 0 0 35px #ffffff;
                opacity: 0.9;
                animation: beamPulse 1.6s ease-in-out infinite;
            }

            @keyframes beamPulse {
                0%, 100% { opacity: 0.4; height: 20px; }
                50% { opacity: 1; height: 28px; }
            }

            /* Outer Cube */
            .cyber-cube.outer-cube {
                width: 85px;
                height: 85px;
                position: relative;
                transform-style: preserve-3d;
                animation: rotateOuterCube 12s infinite linear;
            }

            @keyframes rotateOuterCube {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                100% { transform: rotateX(360deg) rotateY(360deg); }
            }

            .cyber-cube.outer-cube .cube-face {
                width: 85px;
                height: 85px;
                background: rgba(15, 23, 42, 0.5);
                border: 1px solid rgba(192, 132, 252, 0.4);
            }

            .cyber-cube.outer-cube .cube-face.front  { transform: translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.back   { transform: rotateY(180deg) translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.right  { transform: rotateY(90deg) translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.left   { transform: rotateY(-90deg) translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.top    { transform: rotateX(90deg) translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.bottom { transform: rotateX(-90deg) translateZ(42.5px); }

            .cube-face {
                position: absolute;
                box-sizing: border-box;
                overflow: hidden;
            }

            .cube-face::before {
                content: '';
                position: absolute;
                top: -50%; left: -50%;
                width: 200%; height: 200%;
                background: conic-gradient(
                    transparent 0deg, 
                    transparent 60deg, 
                    #c084fc 75%, 
                    #38bdf8 85%, 
                    #c084fc 95%, 
                    transparent 100%
                );
                animation: electricCornerFlow 1.8s linear infinite;
                filter: drop-shadow(0 0 12px #c084fc) drop-shadow(0 0 6px #38bdf8);
            }

            .cube-face::after {
                content: '';
                position: absolute;
                top: 2px; left: 2px;
                right: 2px; bottom: 2px;
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid rgba(192, 132, 252, 0.5);
                box-shadow: inset 0 0 12px rgba(192, 132, 252, 0.4);
            }

            @keyframes electricCornerFlow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* --- 3D Pedestal --- */
            .cyber-3d-pedestal-wrapper {
                position: relative;
                width: 190px;
                height: 60px;
                transform-style: preserve-3d;
                transform: perspective(800px) rotateX(25deg);
                z-index: 2;
                margin-top: 5px;
                transition: all 0.3s ease;
            }

            .pedestal-top-face {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 35px;
                background: linear-gradient(135deg, rgba(147, 51, 234, 0.6) 0%, rgba(56, 189, 248, 0.5) 50%, rgba(15, 23, 42, 0.95) 100%);
                clip-path: polygon(18% 0%, 82% 0%, 100% 35%, 92% 100%, 8% 100%, 0% 35%);
                border-top: 2px solid #c084fc;
                box-shadow: inset 0 0 25px rgba(192, 132, 252, 0.8);
                z-index: 2;
            }

            .pedestal-side-body {
                position: absolute;
                top: 18px; left: 4px;
                width: calc(100% - 8px); height: 30px;
                background: linear-gradient(180deg, #2e1065 0%, #020617 100%);
                clip-path: polygon(18% 0%, 82% 0%, 92% 100%, 8% 100%);
                box-shadow: 0 15px 35px rgba(2, 6, 23, 0.95), inset 0 0 22px rgba(147, 51, 234, 0.9);
                z-index: 1;
            }

            /* Trophy Box Content Area */
            .box-content-area {
                opacity: 0;
                visibility: hidden;
                transform: scale(0.95);
                transition: opacity 0.7s ease, transform 0.7s ease, visibility 0.7s ease;
                width: 100%;
                position: absolute;
                top: 20px; left: 0;
                padding: 0 8px;
                box-sizing: border-box;
                pointer-events: none;
                overflow: hidden !important;
                z-index: 4;
            }

            .box-content-area.open {
                opacity: 1;
                visibility: visible;
                transform: scale(1);
                position: relative;
                top: 0;
                pointer-events: auto;
            }

            #trophy-showcase-target {
                width: 100%;
                max-width: 100%;
                overflow: hidden !important;
                box-sizing: border-box;
            }

            /* Bottom Grid Cards */
            .bottom-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 14px;
                box-sizing: border-box;
                transition: all 0.4s ease;
            }

            .action-card {
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid #334155;
                border-radius: 12px;
                padding: 12px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
                box-sizing: border-box;
            }

            .action-card:hover {
                border-color: #c084fc;
                box-shadow: 0 0 18px rgba(192, 132, 252, 0.4);
            }

            .profile-wrapper.trophy-active .action-card {
                opacity: 0.4;
                cursor: not-allowed;
                pointer-events: none;
            }

            .action-card .icon {
                font-size: 18px;
                margin-bottom: 4px;
            }

            .action-card .title {
                font-size: 10px;
                font-weight: bold;
                color: #d8b4fe;
                letter-spacing: 1px;
            }

            /* Key Management Modal / Box */
            .key-modal-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(2, 6, 23, 0.85);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .key-modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .key-modal-content {
                background: rgba(15, 23, 42, 0.98);
                border: 2px solid #c084fc;
                border-radius: 20px;
                padding: 24px 16px;
                width: 90%;
                max-width: 420px;
                text-align: center;
                box-shadow: 0 0 40px rgba(192, 132, 252, 0.5);
                box-sizing: border-box;
            }

            .key-modal-content h3 {
                color: #38bdf8;
                margin-top: 0;
                margin-bottom: 12px;
                font-size: 16px;
            }

            .key-count-display {
                background: rgba(30, 41, 59, 0.7);
                border: 1px dashed #c084fc;
                padding: 8px;
                border-radius: 8px;
                margin-bottom: 15px;
                font-size: 13px;
                color: #f1f5f9;
            }

            .section-label {
                font-size: 12px;
                color: #cbd5e1;
                margin: 10px 0 6px 0;
                text-align: left;
                font-weight: bold;
            }

            .mode-btn-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 6px;
                margin-bottom: 12px;
            }

            .mode-select-btn {
                background: #0f172a;
                border: 1px solid #475569;
                color: #f8fafc;
                padding: 8px 4px;
                font-size: 11px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .mode-select-btn:hover, .mode-select-btn.selected {
                background: #9333ea;
                border-color: #38bdf8;
                box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
            }

            .result-action-box {
                background: #020617;
                border: 1px solid #334155;
                border-radius: 10px;
                padding: 12px;
                margin-top: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            }

            .result-text {
                font-size: 12px;
                color: #38bdf8;
                text-align: left;
                word-break: break-all;
            }

            .refund-action-btn {
                background: linear-gradient(135deg, #ef4444, #f59e0b);
                border: none;
                color: white;
                padding: 8px 14px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: bold;
                cursor: pointer;
                flex-shrink: 0;
                box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
            }

            .refund-action-btn:hover {
                opacity: 0.9;
            }

            .close-key-modal {
                background: #334155;
                border: none;
                color: white;
                padding: 8px 20px;
                border-radius: 8px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 15px;
            }

            /* Zoom Modal */
            .trophy-zoom-modal {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(2, 6, 23, 0.85);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
                box-sizing: border-box;
                overflow: hidden;
            }

            .trophy-zoom-modal.active {
                opacity: 1;
                visibility: visible;
            }

            .trophy-zoom-content {
                background: rgba(15, 23, 42, 0.95);
                border: 2px solid #c084fc;
                border-radius: 20px;
                padding: 40px 30px;
                width: 90%;
                max-width: 360px;
                text-align: center;
                box-shadow: 0 0 50px rgba(192, 132, 252, 0.7);
                transform: scale(0.6);
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
            }

            .trophy-zoom-modal.active .trophy-zoom-content {
                transform: scale(1);
            }

            .zoomed-trophy-container {
                transform: scale(2.8);
                margin: 50px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .zoom-close-btn {
                background: linear-gradient(135deg, #9333ea, #38bdf8);
                border: none;
                border-radius: 10px;
                color: white;
                padding: 10px 32px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 0 18px rgba(147, 51, 234, 0.6);
                transition: opacity 0.2s ease;
                margin-top: 15px;
            }
        </style>

        <div class="profile-wrapper" id="profile-main-wrapper">
            <!-- Top Banner -->
            <div class="top-banner">
                <label class="avatar-box" id="avatar-container" title="ဓာတ်ပုံပြောင်းရန် နှိပ်ပါ">
                    ${savedAvatar ? `<img src="${savedAvatar}">` : `<span id="avatar-plus">+</span>`}
                    <input type="file" id="file-input" accept="image/*" style="display: none;">
                </label>
                <div class="profile-info">
                    <h3>${userName}</h3>
                    <p>ID: ${userId}</p>
                </div>
            </div>

            <!-- Cyber Stage -->
            <div class="cyber-stage" id="cyber-stage-box">
                <div class="nested-cubic-wrapper" id="cyber-cube-trigger" title="Cube ကိုနှိပ်၍ Trophy များဖွင့်ပါ">
                    <div class="cyber-cube outer-cube">
                        <div class="cube-face front"></div>
                        <div class="cube-face back"></div>
                        <div class="cube-face right"></div>
                        <div class="cube-face left"></div>
                        <div class="cube-face top"></div>
                        <div class="cube-face bottom"></div>
                    </div>
                </div>

                <div class="cyber-3d-pedestal-wrapper" id="cyber-3d-base">
                    <div class="pedestal-top-face"></div>
                    <div class="pedestal-side-body"></div>
                </div>

                <div class="box-content-area" id="trophy-box-content">
                    <div id="trophy-showcase-target"></div>
                </div>
            </div>

            <!-- Key & History Cards (KEY ကတ်ပြားကို Button အဖြစ်ပြောင်းထားသည်) -->
            <div class="bottom-grid">
                <div class="action-card" id="key-card-btn">
                    <div class="icon">🔑</div>
                    <div class="title">KEY</div>
                </div>
                <div class="action-card" id="history-card-btn">
                    <div class="icon">📜</div>
                    <div class="title">HISTORY</div>
                </div>
            </div>
        </div>

        <!-- Key Management Modal (Handwritten design implementation) -->
        <div class="key-modal-overlay" id="key-modal-overlay">
            <div class="key-modal-content">
                <h3>KEY MANAGEMENT</h3>
                <div class="key-count-display" id="key-count-text">ပိုင်ဆိုင်သော Key အရေအတွက်: <b>${userKeyCount} ခု</b></div>

                <div class="section-label">5vs5 Mode Keys</div>
                <div class="mode-btn-grid" id="grid-5v5">
                    <button class="mode-select-btn" data-mode="5vs5" data-val="5k" data-amount="5000">5k</button>
                    <button class="mode-select-btn" data-mode="5vs5" data-val="10k" data-amount="10000">10k</button>
                    <button class="mode-select-btn" data-mode="5vs5" data-val="15k" data-amount="15000">15k</button>
                    <button class="mode-select-btn" data-mode="5vs5" data-val="25k" data-amount="25000">25k</button>
                    <button class="mode-select-btn" data-mode="5vs5" data-val="50k" data-amount="50000">50k</button>
                </div>

                <div class="section-label">1vs1 Mode Keys</div>
                <div class="mode-btn-grid" id="grid-1v1">
                    <button class="mode-select-btn" data-mode="1vs1" data-val="5k" data-amount="5000">5k</button>
                    <button class="mode-select-btn" data-mode="1vs1" data-val="10k" data-amount="10000">10k</button>
                    <button class="mode-select-btn" data-mode="1vs1" data-val="15k" data-amount="15000">15k</button>
                    <button class="mode-select-btn" data-mode="1vs1" data-val="25k" data-amount="25000">25k</button>
                    <button class="mode-select-btn" data-mode="1vs1" data-val="50k" data-amount="50000">50k</button>
                </div>

                <div class="result-action-box" id="result-action-box" style="display: none;">
                    <div class="result-text" id="result-message-text">ကျေးဇူးပြု၍ Mode တစ်ခုကို ရွေးချယ်ပါ</div>
                    <button class="refund-action-btn" id="refund-btn">Refund</button>
                </div>

                <button class="close-key-modal" id="close-key-modal">ပိတ်မည်</button>
            </div>
        </div>

        <!-- Trophy Zoom Modal Overlay -->
        <div class="trophy-zoom-modal" id="trophy-zoom-modal">
            <div class="trophy-zoom-content">
                <div class="zoomed-trophy-container" id="zoomed-trophy-wrapper"></div>
                <button class="zoom-close-btn" id="zoom-close-btn">OK</button>
            </div>
        </div>
    `;

    // Avatar Upload Logic
    const fileInput = document.getElementById('file-input');
    const avatarContainer = document.getElementById('avatar-container');

    if (fileInput && avatarContainer) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64Img = event.target.result;
                    localStorage.setItem('user_profile_avatar', base64Img);
                    avatarContainer.innerHTML = `<img src="${base64Img}"><input type="file" id="file-input" accept="image/*" style="display: none;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Toggle & Modal Logic for Cube & Trophy Hidden Layout
    const profileMainWrapper = document.getElementById('profile-main-wrapper');
    const cyberCubeTrigger = document.getElementById('cyber-cube-trigger');
    const cyber3DBase = document.getElementById('cyber-3d-base');
    const trophyBoxContent = document.getElementById('trophy-box-content');
    let isTrophiesOpen = false;

    const zoomModal = document.getElementById('trophy-zoom-modal');
    const zoomedTrophyWrapper = document.getElementById('zoomed-trophy-wrapper');
    const zoomCloseBtn = document.getElementById('zoom-close-btn');

    cyberCubeTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isTrophiesOpen) return;

        isTrophiesOpen = true;
        profileMainWrapper.classList.add('trophy-active');
        cyberCubeTrigger.classList.add('hidden');
        if (cyber3DBase) cyber3DBase.style.display = 'none';
        trophyBoxContent.classList.add('open');
    });

    document.addEventListener('click', (e) => {
        if (!isTrophiesOpen) return;
        if (zoomModal.classList.contains('active')) return;

        const clickedInsideTrophy = e.target.closest('#trophy-showcase-target');
        const clickedCube = e.target.closest('#cyber-cube-trigger');
        const clickedModal = e.target.closest('#trophy-zoom-modal');

        if (!clickedInsideTrophy && !clickedCube && !clickedModal) {
            setTimeout(() => {
                isTrophiesOpen = false;
                profileMainWrapper.classList.remove('trophy-active');
                trophyBoxContent.classList.remove('open');
                cyberCubeTrigger.classList.remove('hidden');
                if (cyber3DBase) cyber3DBase.style.display = 'block';
            }, 150);
        }
    });

    renderTrophyShowcase('trophy-showcase-target', (trophy, elementHTML) => {
        if (elementHTML) {
            zoomedTrophyWrapper.innerHTML = elementHTML;
        } else {
            zoomedTrophyWrapper.innerHTML = `
                <div style="text-align: center; color: #d8b4fe;">
                    <div style="font-size: 50px;">${trophy.icon || '🏆'}</div>
                    <div style="font-size: 14px; font-weight: bold; margin-top: 8px;">${trophy.name || ''}</div>
                </div>
            `;
        }
        zoomModal.classList.add('active');
    });

    zoomCloseBtn.addEventListener('click', () => {
        zoomModal.classList.remove('active');
    });

    zoomModal.addEventListener('click', (e) => {
        e.target === zoomModal && zoomModal.classList.remove('active');
    });

    // --- Key Button & Mode Box Popup Logic ---
    const keyCardBtn = document.getElementById('key-card-btn');
    const keyModalOverlay = document.getElementById('key-modal-overlay');
    const closeKeyModal = document.getElementById('close-key-modal');
    const modeSelectBtns = document.querySelectorAll('.mode-select-btn');
    const resultActionBox = document.getElementById('result-action-box');
    const resultMessageText = document.getElementById('result-message-text');
    const refundBtn = document.getElementById('refund-btn');

    let selectedModeData = null;

    keyCardBtn.addEventListener('click', () => {
        if (profileMainWrapper.classList.contains('trophy-active')) return;
        keyModalOverlay.classList.add('active');
    });

    closeKeyModal.addEventListener('click', () => {
        keyModalOverlay.classList.remove('active');
    });

    keyModalOverlay.addEventListener('click', (e) => {
        if (e.target === keyModalOverlay) {
            keyModalOverlay.classList.remove('active');
        }
    });

    modeSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeSelectBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            const mode = btn.getAttribute('data-mode');
            const val = btn.getAttribute('data-val');
            const amount = btn.getAttribute('data-amount');

            selectedModeData = { mode, val, amount };

            // လက်ရေးနဲ့ပြထားတဲ့ ပုံစံအတိုင်း စာသားပေါ်လာစေရန်
            resultMessageText.innerHTML = `${mode} mode ${val} အတွက် ငွေသား ${amount}ks ကို ပြန်လည်လွဲပေးပါမည်`;
            resultActionBox.style.display = 'flex';
        });
    });

    refundBtn.addEventListener('click', () => {
        if (!selectedModeData) return;
        
        // Refund လုပ်တဲ့အခါ လုပ်ဆောင်မယ့် Logic (ဥပမာ- Alert ပြသခြင်း သို့မဟုတ် Key အရေအတွက် ပြန်ပေါင်းပေးခြင်း)
        alert(`အောင်မြင်ပါသည်! ${selectedModeData.mode} (${selectedModeData.val}) အတွက် ငွေပမာဏ ${selectedModeData.amount}ks ကို Refund ပြန်လည်ထုတ်ပေးပြီးပါပြီ။`);
        
        // ပြီးရင် box ကို ပုံမှန်အခြေအနေပြန်ထားရန်
        resultActionBox.style.display = 'none';
        modeSelectBtns.forEach(b => b.classList.remove('selected'));
        selectedModeData = null;
    });
}