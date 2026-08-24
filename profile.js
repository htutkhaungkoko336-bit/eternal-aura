import { renderTrophyShowcase } from './trophies.js';

export function renderProfileScreen(container) {
    const userName = localStorage.getItem('user_profile_name') || localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('user_profile_id') || localStorage.getItem('userId') || "EA-99821";
    const userKey = localStorage.getItem('user_profile_key') || "EA-KEY-5599-CYBER-99X";
    const savedAvatar = localStorage.getItem('user_profile_avatar') || "";

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
                background: linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.98));
                border: 1px solid rgba(244, 63, 94, 0.4);
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
                box-shadow: inset 0 0 40px rgba(244, 63, 94, 0.15);
                perspective: 1000px;
            }

            /* Nested Cubes Wrapper (အကြီးထဲ အသေးထည့်ရန်) */
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
                background: #38bdf8;
                box-shadow: 0 0 12px #38bdf8, 0 0 25px #0284c7, 0 0 35px #ffffff;
                opacity: 0.9;
                animation: beamPulse 1.6s ease-in-out infinite;
            }

            @keyframes beamPulse {
                0%, 100% { opacity: 0.4; height: 20px; }
                50% { opacity: 1; height: 28px; }
            }

            /* Outer Cube (Cube အကြီး) */
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
                background: rgba(2, 6, 23, 0.45); /* ပိုပြီးဖင်မြင်ရအောင် ပွင့်လင်းစေသည် */
                border: 1px solid rgba(56, 189, 248, 0.3);
            }

            .cyber-cube.outer-cube .cube-face.front  { transform: translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.back   { transform: rotateY(180deg) translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.right  { transform: rotateY(90deg) translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.left   { transform: rotateY(-90deg) translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.top    { transform: rotateX(90deg) translateZ(42.5px); }
            .cyber-cube.outer-cube .cube-face.bottom { transform: rotateX(-90deg) translateZ(42.5px); }


            /* Inner Cube (Cube အသေး - အကြီးထဲမှာရှိမည့်ဟာ) */
            .cyber-cube.inner-cube {
                width: 42px;
                height: 42px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -21px;
                margin-left: -21px;
                transform-style: preserve-3d;
                animation: rotateInnerCube 8s infinite linear reverse; /* ပြောင်းပြန် දිශာနဲ့ ပိုလန်းစေရန် */
            }

            @keyframes rotateInnerCube {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                100% { transform: rotateX(360deg) rotateY(-360deg); }
            }

            .cyber-cube.inner-cube .cube-face {
                width: 42px;
                height: 42px;
                background: rgba(244, 63, 94, 0.4);
                border: 1px solid rgba(244, 63, 94, 0.6);
            }

            .cyber-cube.inner-cube .cube-face::before {
                background: conic-gradient(
                    transparent 0deg, 
                    transparent 60deg, 
                    #f43f5e 75%, 
                    #ffffff 85%, 
                    #f43f5e 95%, 
                    transparent 100%
                ) !important;
                filter: drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 4px #f43f5e) !important;
            }

            .cyber-cube.inner-cube .cube-face.front  { transform: translateZ(21px); }
            .cyber-cube.inner-cube .cube-face.back   { transform: rotateY(180deg) translateZ(21px); }
            .cyber-cube.inner-cube .cube-face.right  { transform: rotateY(90deg) translateZ(21px); }
            .cyber-cube.inner-cube .cube-face.left   { transform: rotateY(-90deg) translateZ(21px); }
            .cyber-cube.inner-cube .cube-face.top    { transform: rotateX(90deg) translateZ(21px); }
            .cyber-cube.inner-cube .cube-face.bottom { transform: rotateX(-90deg) translateZ(21px); }


            /* Common Cube Face Design */
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
                    #38bdf8 75%, 
                    #ffffff 85%, 
                    #38bdf8 95%, 
                    transparent 100%
                );
                animation: electricCornerFlow 1.8s linear infinite;
                filter: drop-shadow(0 0 12px #ffffff) drop-shadow(0 0 6px #38bdf8);
            }

            .cube-face::after {
                content: '';
                position: absolute;
                top: 2px; left: 2px;
                right: 2px; bottom: 2px;
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid rgba(56, 189, 248, 0.4);
                box-shadow: inset 0 0 10px rgba(56, 189, 248, 0.3);
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
            }

            .pedestal-top-face {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 35px;
                background: linear-gradient(135deg, rgba(244, 63, 94, 0.55) 0%, rgba(192, 38, 211, 0.5) 50%, rgba(15, 23, 42, 0.95) 100%);
                clip-path: polygon(18% 0%, 82% 0%, 100% 35%, 92% 100%, 8% 100%, 0% 35%);
                border-top: 2px solid #ff2d55;
                box-shadow: inset 0 0 25px rgba(244, 63, 94, 0.8);
                z-index: 2;
            }

            .pedestal-side-body {
                position: absolute;
                top: 18px;
                left: 4px;
                width: calc(100% - 8px);
                height: 30px;
                background: linear-gradient(180deg, #38021c 0%, #020617 100%);
                clip-path: polygon(18% 0%, 82% 0%, 92% 100%, 8% 100%);
                box-shadow: 
                    0 15px 35px rgba(2, 6, 23, 0.95), 
                    inset 0 0 22px rgba(244, 63, 94, 0.9);
                z-index: 1;
                animation: pedestalEdgeTrace 2.5s infinite alternate;
            }

            @keyframes pedestalEdgeTrace {
                0% { box-shadow: 0 15px 35px rgba(2, 6, 23, 0.95), inset 0 0 18px rgba(244, 63, 94, 0.8), 0 0 15px #f43f5e; }
                50% { box-shadow: 0 15px 40px rgba(2, 6, 23, 0.95), inset 0 0 30px rgba(192, 38, 211, 1), 0 0 28px #c084fc; }
                100% { box-shadow: 0 15px 35px rgba(2, 6, 23, 0.95), inset 0 0 18px rgba(244, 63, 94, 0.8), 0 0 15px #f43f5e; }
            }

            .cyber-3d-pedestal-wrapper::after {
                content: '';
                position: absolute;
                bottom: -14px;
                left: 12px;
                width: 166px;
                height: 10px;
                background: #f43f5e;
                clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
                box-shadow: 0 0 30px #f43f5e, 0 0 55px #c084fc, 0 0 75px #f43f5e;
                opacity: 0.95;
                z-index: 0;
            }

            /* Trophy Box Content Area */
            .box-content-area {
                opacity: 0;
                visibility: hidden;
                transform: scale(0.95);
                transition: opacity 0.7s ease, transform 0.7s ease, visibility 0.7s ease;
                width: 100%;
                position: absolute;
                top: 20px;
                left: 0;
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

            #trophy-showcase-target * {
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            /* Bottom Grid Cards */
            .bottom-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 14px;
                box-sizing: border-box;
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
                border-color: #f43f5e;
                box-shadow: 0 0 18px rgba(244, 63, 94, 0.4);
            }

            .action-card .icon {
                font-size: 18px;
                margin-bottom: 4px;
            }

            .action-card .title {
                font-size: 10px;
                font-weight: bold;
                color: #fb7185;
                letter-spacing: 1px;
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
                border: 2px solid #f43f5e;
                border-radius: 20px;
                padding: 40px 30px;
                width: 90%;
                max-width: 360px;
                text-align: center;
                box-shadow: 0 0 50px rgba(244, 63, 94, 0.7);
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
                background: linear-gradient(135deg, #f43f5e, #c084fc);
                border: none;
                border-radius: 10px;
                color: white;
                padding: 10px 32px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 0 18px rgba(244, 63, 94, 0.6);
                transition: opacity 0.2s ease;
                margin-top: 15px;
            }

            .zoom-close-btn:hover {
                opacity: 0.9;
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

            <!-- Cyber Stage (Nested Cubes Inside Pedestal) -->
            <div class="cyber-stage" id="cyber-stage-box">
                <!-- Nested Cubes (Outer Large Cube + Inner Small Cube) -->
                <div class="nested-cubic-wrapper" id="cyber-cube-trigger" title="Cube ကိုနှိပ်၍ Trophy များဖွင့်ပါ">
                    <!-- Outer Large Cube -->
                    <div class="cyber-cube outer-cube">
                        <div class="cube-face front"></div>
                        <div class="cube-face back"></div>
                        <div class="cube-face right"></div>
                        <div class="cube-face left"></div>
                        <div class="cube-face top"></div>
                        <div class="cube-face bottom"></div>
                    </div>
                    <!-- Inner Small Cube -->
                    <div class="cyber-cube inner-cube">
                        <div class="cube-face front"></div>
                        <div class="cube-face back"></div>
                        <div class="cube-face right"></div>
                        <div class="cube-face left"></div>
                        <div class="cube-face top"></div>
                        <div class="cube-face bottom"></div>
                    </div>
                </div>

                <!-- 3D Pedestal with Bright Red & Purple Tracing Edges -->
                <div class="cyber-3d-pedestal-wrapper" id="cyber-3d-base">
                    <div class="pedestal-top-face"></div>
                    <div class="pedestal-side-body"></div>
                </div>

                <!-- Trophy Box Content Area -->
                <div class="box-content-area" id="trophy-box-content">
                    <div id="trophy-showcase-target"></div>
                </div>
            </div>

            <!-- Key & History Cards -->
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

    // Toggle & Modal Logic for Nested Cubes
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
                <div style="text-align: center; color: #fb7185;">
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

    document.getElementById('key-card-btn').addEventListener('click', () => {
        alert(`SECURITY KEY: ${userKey}`);
    });

    document.getElementById('history-card-btn').addEventListener('click', () => {
        alert("ACTIVITY LOGS: Active & Secure");
    });
}