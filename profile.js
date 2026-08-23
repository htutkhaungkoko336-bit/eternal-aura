// profile.js - Pure Cyber Cubic with Shatter Animation & Trophy Box
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

            /* 2. Cubic & Showcase Area */
            .cyber-stage {
                background: rgba(15, 23, 42, 0.95);
                border: 1.5px solid #0ea5e9;
                border-radius: 16px;
                padding: 24px 16px;
                margin-bottom: 16px;
                text-align: center;
                box-shadow: 0 0 30px rgba(14, 165, 233, 0.25);
                position: relative;
                min-height: 140px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            /* Pure Cyber Cubic (စာသား၊ border အပြင်အဆင် မပါ) */
            .cubic-wrapper {
                perspective: 800px;
                width: 90px;
                height: 90px;
                cursor: pointer;
                transition: transform 0.4s ease, opacity 0.4s ease;
            }

            .cubic-wrapper.hidden {
                transform: scale(0) rotate(720deg);
                opacity: 0;
                pointer-events: none;
                position: absolute;
            }

            .cyber-cube {
                width: 100%;
                height: 100%;
                position: relative;
                transform-style: preserve-3d;
                animation: rotateCube 7s infinite linear;
            }

            .cyber-cube.shattering {
                animation: shatterAnim 0.8s forwards cubic-bezier(0.25, 1, 0.5, 1);
            }

            .cyber-cube.assembling {
                animation: assembleAnim 0.8s forwards cubic-bezier(0.25, 1, 0.5, 1);
            }

            @keyframes rotateCube {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                100% { transform: rotateX(360deg) rotateY(360deg); }
            }

            @keyframes shatterAnim {
                0% { transform: rotateX(0deg) rotateY(0deg) scale(1); filter: brightness(1); }
                50% { transform: rotateX(540deg) rotateY(540deg) scale(1.6); filter: brightness(2); opacity: 0.8; }
                100% { transform: rotateX(1080deg) rotateY(1080deg) scale(0); filter: brightness(3); opacity: 0; }
            }

            @keyframes assembleAnim {
                0% { transform: rotateX(1080deg) rotateY(1080deg) scale(0); filter: brightness(3); opacity: 0; }
                100% { transform: rotateX(0deg) rotateY(0deg) scale(1); filter: brightness(1); opacity: 1; }
            }

            .cube-face {
                position: absolute;
                width: 90px;
                height: 90px;
                background: rgba(14, 165, 233, 0.12);
                border: 1px solid rgba(56, 189, 248, 0.6);
                box-shadow: inset 0 0 15px rgba(56, 189, 248, 0.3);
            }

            .cube-face.front  { transform: translateZ(45px); }
            .cube-face.back   { transform: rotateY(180deg) translateZ(45px); }
            .cube-face.right  { transform: rotateY(90deg) translateZ(45px); }
            .cube-face.left   { transform: rotateY(-90deg) translateZ(45px); }
            .cube-face.top    { transform: rotateX(90deg) translateZ(45px); }
            .cube-face.bottom { transform: rotateX(-90deg) translateZ(45px); }

            /* Trophy Box Content Area (ဖလားများ ပေါ်လာမည့်နေရာ) */
            .box-content-area {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.5s ease-in-out, opacity 0.4s ease-in-out;
                opacity: 0;
                width: 100%;
            }

            .box-content-area.open {
                max-height: 1200px;
                opacity: 1;
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
                <!-- Pure Cyber Cubic -->
                <div class="cubic-wrapper" id="cyber-cube-trigger" title="Cube ကိုနှိပ်၍ Trophy များဖွင့်ပါ">
                    <div class="cyber-cube" id="rotating-cube">
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

            <!-- Interactive Detail Container -->
            <div class="detail-view-box" id="detail-display-area">
                <div style="color: #64748b; text-align: center; padding-top: 10px;">
                    Tap the Cyber Cubic above to shatter and reveal trophies.
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

    // Elements for Animation
    const cyberCubeTrigger = document.getElementById('cyber-cube-trigger');
    const rotatingCube = document.getElementById('rotating-cube');
    const trophyBoxContent = document.getElementById('trophy-box-content');
    const profileWrapper = document.getElementById('profile-main-wrapper');
    let isTrophiesOpen = false;

    // 1. Cube ကို နှိပ်လိုက်သောအခါ (Shatter ဖြစ်ပြီး Trophies ပေါ်လာခြင်း)
    cyberCubeTrigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Click event ပျံ့နှံ့မှုကို တားဆီးခြင်း
        if (isTrophiesOpen) return;

        isTrophiesOpen = true;
        rotatingCube.classList.add('shattering');

        setTimeout(() => {
            cyberCubeTrigger.classList.add('hidden');
            rotatingCube.classList.remove('shattering');
            trophyBoxContent.classList.add('open');
        }, 600);
    });

    // 2. ဘေးနေရာတစ်ခုခုကို ထောက်လိုက်သောအခါ (Trophies ပျောက်ပြီး Cube ပြန်ဆက်သွားခြင်း)
    profileWrapper.addEventListener('click', (e) => {
        // အကယ်၍ Trophies ပွင့်နေပြီး၊ နှိပ်လိုက်တဲ့နေရာက Trophy သို့မဟုတ် Control ကဒ်တွေ မဟုတ်ဘူးဆိုရင်
        if (isTrophiesOpen && !e.target.closest('#trophy-showcase-target') && !e.target.closest('.bottom-grid') && !e.target.closest('.top-banner') && !e.target.closest('.detail-view-box')) {
            isTrophiesOpen = false;
            
            // Trophies များကို ဖျောက်မည်
            trophyBoxContent.classList.remove('open');
            
            // Cube ကို ပြန်ပေါ်လာစေပြီး Assemble (ပြန်ဆက်) သည့် Animation ထည့်မည်
            cyberCubeTrigger.classList.remove('hidden');
            rotatingCube.classList.add('assembling');

            setTimeout(() => {
                rotatingCube.classList.remove('assembling');
            }, 800);
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
                <div class="history-row"><span>Cubic State</span><span class="status-success">READY / ASSEMBLED</span></div>
                <div class="history-row"><span>Profile Status</span><span class="status-success">SECURE</span></div>
            `;
        }
    });
}