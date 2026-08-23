// profile.js - Profile Shell with Smooth Fade Trophy Toggle
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
                position: relative;
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

            /* 2. Cyber Stage (Cube & Trophies Container) */
            .cyber-stage {
                background: rgba(15, 23, 42, 0.95);
                border-radius: 16px;
                padding: 24px 16px;
                margin-bottom: 16px;
                text-align: center;
                position: relative;
                min-height: 160px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            /* Perfect 3D Cyber Cubic */
            .cubic-wrapper {
                perspective: 900px;
                width: 110px;
                height: 110px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: opacity 0.5s ease, transform 0.5s ease;
            }

            .cubic-wrapper.hidden {
                opacity: 0;
                transform: scale(0.5);
                pointer-events: none;
                position: absolute;
                display: none;
            }

            .cyber-cube {
                width: 70px;
                height: 70px;
                position: relative;
                transform-style: preserve-3d;
                animation: rotateCube 10s infinite linear;
            }

            @keyframes rotateCube {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                100% { transform: rotateX(360deg) rotateY(360deg); }
            }

            .cube-face {
                position: absolute;
                width: 70px;
                height: 70px;
                background: rgba(14, 165, 233, 0.08);
                border: 1.5px solid #38bdf8;
                box-shadow: inset 0 0 12px rgba(56, 189, 248, 0.3);
            }

            .cube-face.front  { transform: translateZ(35px); }
            .cube-face.back   { transform: rotateY(180deg) translateZ(35px); }
            .cube-face.right  { transform: rotateY(90deg) translateZ(35px); }
            .cube-face.left   { transform: rotateY(-90deg) translateZ(35px); }
            .cube-face.top    { transform: rotateX(90deg) translateZ(35px); }
            .cube-face.bottom { transform: rotateX(-90deg) translateZ(35px); }

            /* Trophy Box Content Area (Smooth Fade & Slow Transition - Scroll မဖြစ်တော့ပါ) */
            .box-content-area {
                opacity: 0;
                visibility: hidden;
                transform: scale(0.95);
                transition: opacity 0.7s ease, transform 0.7s ease, visibility 0.7s ease;
                width: 100%;
                position: absolute;
                top: 20px;
                left: 0;
                padding: 0 16px;
                box-sizing: border-box;
                pointer-events: none;
            }

            .box-content-area.open {
                opacity: 1;
                visibility: visible;
                transform: scale(1);
                position: relative;
                top: 0;
                pointer-events: auto;
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
        </style>

        <div class="profile-wrapper" id="profile-main-wrapper">
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

            <!-- Cyber Stage (Cube & Trophies) -->
            <div class="cyber-stage" id="cyber-stage-box">
                <!-- Perfect 3D Cyber Cubic -->
                <div class="cubic-wrapper" id="cyber-cube-trigger" title="Cube ကိုနှိပ်၍ Trophy များဖွင့်ပါ">
                    <div class="cyber-cube">
                        <div class="cube-face front"></div>
                        <div class="cube-face back"></div>
                        <div class="cube-face right"></div>
                        <div class="cube-face left"></div>
                        <div class="cube-face top"></div>
                        <div class="cube-face bottom"></div>
                    </div>
                </div>

                <!-- Trophy Box Content Area (Trophies ၁၁ လုံး) -->
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

    // Elements for Toggle Logic
    const cyberCubeTrigger = document.getElementById('cyber-cube-trigger');
    const trophyBoxContent = document.getElementById('trophy-box-content');
    let isTrophiesOpen = false;

    // 1. Cube ကို နှိပ်မှသာ Trophy များ နှေးကွေးချောမွေ့စွာ ပွင့်မည်
    cyberCubeTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isTrophiesOpen) return;

        isTrophiesOpen = true;
        cyberCubeTrigger.classList.add('hidden');
        trophyBoxContent.classList.add('open');
    });

    // 2. Trophy ကိုယ်တိုင် သို့မဟုတ် Cube ကို မထိဘဲ အပြင်ဘက် သို့မဟုတ် အလွတ်နေရာများကို ထိမှသာ Trophy နှေးကွေးစွာ ပြန်ပိတ်မည်
    document.addEventListener('click', (e) => {
        if (!isTrophiesOpen) return;

        const clickedInsideTrophy = e.target.closest('#trophy-showcase-target');
        const clickedCube = e.target.closest('#cyber-cube-trigger');

        if (!clickedInsideTrophy && !clickedCube) {
            setTimeout(() => {
                isTrophiesOpen = false;
                trophyBoxContent.classList.remove('open');
                cyberCubeTrigger.classList.remove('hidden');
            }, 150); // ပိုမိုသဘာဝကျပြီး တည်ငြိမ်စေရန်
        }
    });

    // Render Trophy Showcase inside the Box using trophies.js module function
    renderTrophyShowcase('trophy-showcase-target', (trophy) => {
        // Trophy ကို နှိပ်သည့်အခါ ဆက်လက်ကြည့်ရှုနိုင်ရန်
    });

    // Key Button Action
    document.getElementById('key-card-btn').addEventListener('click', () => {
        alert(`SECURITY KEY: ${userKey}`);
    });

    // History Button Action
    document.getElementById('history-card-btn').addEventListener('click', () => {
        alert("ACTIVITY LOGS: Active & Secure");
    });
}