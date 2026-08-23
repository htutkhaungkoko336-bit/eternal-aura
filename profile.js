// profile.js - Profile Shell with Interactive Cyber Cubic & Trophy Box
import { renderTrophyShowcase } from './trophies.js';

export function renderProfileScreen(container) {
    const userName = localStorage.getItem('user_profile_name') || localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('user_profile_id') || localStorage.getItem('userId') || "EA-99821";
    const userKey = localStorage.getItem('user_profile_key') || "EA-KEY-5599-CYBER-99X";
    const savedAvatar = localStorage.getItem('user_profile_avatar') || "";

    container.innerHTML = `
        <style>
            .profile-wrapper {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 16px;
                box-sizing: border-box;
                color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            /* 1. Top Compact Banner */
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

            /* 2. Cyber Cubic Section (3D Rotating Cube) */
            .cyber-cubic-section {
                background: rgba(15, 23, 42, 0.95);
                border: 1.5px solid #0ea5e9;
                border-radius: 16px;
                padding: 20px 16px;
                margin-bottom: 16px;
                text-align: center;
                box-shadow: 0 0 30px rgba(14, 165, 233, 0.25), inset 0 0 15px rgba(250, 204, 21, 0.1);
                position: relative;
                overflow: hidden;
            }

            .cubic-wrapper {
                perspective: 800px;
                width: 100px;
                height: 100px;
                margin: 10px auto 16px auto;
                cursor: pointer;
            }

            .cyber-cube {
                width: 100%;
                height: 100%;
                position: relative;
                transform-style: preserve-3d;
                animation: rotateCube 8s infinite linear;
            }

            .cyber-cube.clicked {
                animation: rotateCubeFast 1.5s infinite linear;
            }

            @keyframes rotateCube {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                100% { transform: rotateX(360deg) rotateY(360deg); }
            }

            @keyframes rotateCubeFast {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                100% { transform: rotateX(720deg) rotateY(720deg); }
            }

            .cube-face {
                position: absolute;
                width: 100px;
                height: 100px;
                background: rgba(14, 165, 233, 0.15);
                border: 2px solid #38bdf8;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                box-shadow: inset 0 0 15px rgba(56, 189, 248, 0.4);
                backdrop-filter: blur(4px);
            }

            /* 3D Cube Face Positions */
            .cube-face.front  { transform: translateZ(50px); }
            .cube-face.back   { transform: rotateY(180deg) translateZ(50px); }
            .cube-face.right  { transform: rotateY(90deg) translateZ(50px); }
            .cube-face.left   { transform: rotateY(-90deg) translateZ(50px); }
            .cube-face.top    { transform: rotateX(90deg) translateZ(50px); }
            .cube-face.bottom { transform: rotateX(-90deg) translateZ(50px); }

            .cubic-instruction {
                font-size: 11px;
                color: #facc15;
                font-weight: bold;
                letter-spacing: 1px;
                text-shadow: 0 0 8px rgba(250, 204, 21, 0.5);
                animation: pulseText 2s infinite;
            }

            @keyframes pulseText {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }

            /* Trophy Box Content Area (ဖလားများ ဘွားခနဲ ပေါ်လာမည့်နေရာ) */
            .box-content-area {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.5s ease-in-out, opacity 0.4s ease-in-out, margin-top 0.4s ease-in-out;
                opacity: 0;
                margin-top: 0;
            }

            .box-content-area.open {
                max-height: 1200px;
                opacity: 1;
                margin-top: 16px;
                border-top: 1px dashed rgba(250, 204, 21, 0.4);
                padding-top: 16px;
            }

            /* 3. Key & History Side-by-Side Grid */
            .bottom-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 14px;
            }

            .action-card {
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid #334155;
                border-radius: 12px;
                padding: 12px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .action-card:hover {
                border-color: #38bdf8;
                box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
            }

            .action-card .icon {
                font-size: 18px;
                margin-bottom: 4px;
            }

            .action-card .title {
                font-size: 10px;
                font-weight: bold;
                color: #38bdf8;
                letter-spacing: 1px;
            }

            /* Detail View Box */
            .detail-view-box {
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid #334155;
                border-radius: 12px;
                padding: 12px;
                font-size: 11px;
                font-family: monospace;
                color: #38bdf8;
                word-break: break-all;
                min-height: 70px;
                box-sizing: border-box;
            }

            .history-row {
                padding: 5px 0;
                border-bottom: 1px solid #1e293b;
                display: flex;
                justify-content: space-between;
                color: #94a3b8;
            }

            .history-row:last-child {
                border-bottom: none;
            }

            .status-success {
                color: #4ade80;
                font-weight: bold;
            }
        </style>

        <div class="profile-wrapper">
            <!-- Top Banner: Avatar and Name/ID -->
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

            <!-- Cyber Cubic & Trophy Box Section -->
            <div class="cyber-cubic-section" id="cubic-section-box">
                <div class="cubic-wrapper" id="cyber-cube-trigger" title="နှိပ်၍ တံဆိပ်ဖလားများ ဖွင့်ပါ">
                    <div class="cyber-cube" id="rotating-cube">
                        <div class="cube-face front">🏆</div>
                        <div class="cube-face back">⭐</div>
                        <div class="cube-face right">💎</div>
                        <div class="cube-face left">🔥</div>
                        <div class="cube-face top">⚡</div>
                        <div class="cube-face bottom">👑</div>
                    </div>
                </div>
                <div class="cubic-instruction" id="cubic-text">✨ TAP CYBER CUBE TO UNLOCK TROPHIES ✨</div>
                
                <!-- Box Content Area: 11 Trophies (အပေါ်၅၊ အောက်၅၊ အလယ်ကြီး၁) -->
                <div class="box-content-area" id="trophy-box-content">
                    <div id="trophy-showcase-target">
                        <!-- trophies.js မှ ဖလား ၁၁ လုံး ဤနေရာသို့ ဝင်ရောက်မည် -->
                    </div>
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

            <!-- Interactive Detail Container -->
            <div class="detail-view-box" id="detail-display-area">
                <div style="color: #64748b; text-align: center; padding-top: 10px;">
                    Tap the spinning Cyber Cubic above to reveal your elite trophies.
                </div>
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

    // Cyber Cubic & Trophy Box Toggle Logic
    const cyberCubeTrigger = document.getElementById('cyber-cube-trigger');
    const rotatingCube = document.getElementById('rotating-cube');
    const trophyBoxContent = document.getElementById('trophy-box-content');
    const cubicText = document.getElementById('cubic-text');
    let isBoxOpen = false;

    cyberCubeTrigger.addEventListener('click', () => {
        isBoxOpen = !isBoxOpen;
        
        // Cube လည်တဲ့အရှိန်ကို ပိုမြန်သွားစေရန် Class ခေတ္တထည့်ခြင်း
        rotatingCube.classList.add('clicked');
        setTimeout(() => {
            rotatingCube.classList.remove('clicked');
        }, 1500);

        if (isBoxOpen) {
            trophyBoxContent.classList.add('open');
            cubicText.textContent = '▼ ELITE TROPHIES UNLOCKED (TAP CUBE TO CLOSE) ▼';
            cubicText.style.color = '#38bdf8';
        } else {
            trophyBoxContent.classList.remove('open');
            cubicText.textContent = '✨ TAP CYBER CUBE TO UNLOCK TROPHIES ✨';
            cubicText.style.color = '#facc15';
        }
    });

    // Render Trophy Showcase inside the Box using trophies.js module function
    renderTrophyShowcase('trophy-showcase-target', (trophy) => {
        const area = document.getElementById('detail-display-area');
        if (area) {
            area.innerHTML = `
                <div style="color: #facc15; font-weight: bold; margin-bottom: 4px;">🏆 ${trophy.subtitle} (${trophy.date})</div>
                <div style="color: #f8fafc; margin-bottom: 4px;">${trophy.desc}</div>
                <div class="history-row"><span>Status</span><span class="status-success">VERIFIED UNLOCKED</span></div>
            `;
        }
    });

    // Key Button Action
    document.getElementById('key-card-btn').addEventListener('click', () => {
        const area = document.getElementById('detail-display-area');
        if (area) {
            area.innerHTML = `
                <div style="color: #38bdf8; font-weight: bold; margin-bottom: 4px;">SECURITY KEY VERIFIED:</div>
                <div>${userKey}</div>
            `;
        }
    });

    // History Button Action
    document.getElementById('history-card-btn').addEventListener('click', () => {
        const area = document.getElementById('detail-display-area');
        if (area) {
            area.innerHTML = `
                <div style="color: #38bdf8; font-weight: bold; margin-bottom: 4px;">ACTIVITY LOGS:</div>
                <div class="history-row"><span>Cyber Cubic State</span><span class="status-success">ACTIVE ROTATION</span></div>
                <div class="history-row"><span>Profile Sync</span><span class="status-success">ONLINE</span></div>
            `;
        }
    });
}