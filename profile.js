// profile.js - Profile Shell with Interactive Trophy Box Showcase
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

            /* 1. Top Compact Banner (Avatar + Name/ID) */
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

            .avatar-box span {
                font-size: 20px;
                color: #38bdf8;
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

            /* 2. Trophy Box Section (ဂိမ်းဆန်ဆန် Box ပုံစံ) */
            .trophy-box-container {
                background: rgba(15, 23, 42, 0.95);
                border: 1.5px solid #facc15;
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 16px;
                box-shadow: 0 0 30px rgba(250, 204, 21, 0.25), inset 0 0 15px rgba(56, 189, 248, 0.15);
                position: relative;
                overflow: hidden;
            }

            .box-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                user-select: none;
            }

            .box-title-area {
                font-size: 12px;
                font-weight: 900;
                color: #facc15;
                letter-spacing: 1.5px;
                text-shadow: 0 0 8px rgba(250, 204, 21, 0.5);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .toggle-btn {
                background: linear-gradient(135deg, #facc15 0%, #ca8a04 100%);
                color: #020617;
                border: none;
                border-radius: 8px;
                padding: 5px 12px;
                font-size: 10px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(250, 204, 21, 0.4);
                transition: transform 0.2s ease;
            }

            .toggle-btn:active {
                transform: scale(0.95);
            }

            /* Box အထဲက ဖလားတွေပေါ်လာမည့် Area (Animation ပါဝင်သည်) */
            .box-content-area {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out;
                opacity: 0;
                margin-top: 0;
            }

            .box-content-area.open {
                max-height: 1200px;
                opacity: 1;
                margin-top: 14px;
                border-top: 1px dashed rgba(250, 204, 21, 0.4);
                padding-top: 14px;
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

            <!-- Trophy Box Component (Box ဖွင့်ပိတ် လုပ်လို့ရသော ပုံစံ) -->
            <div class="trophy-box-container">
                <div class="box-header" id="trophy-box-toggle">
                    <div class="box-title-area">
                        🎁 ELITE TROPHY BOX (11 UNLOCKED)
                    </div>
                    <button class="toggle-btn" id="box-action-btn">OPEN BOX</button>
                </div>
                
                <div class="box-content-area" id="trophy-box-content">
                    <div id="trophy-showcase-target">
                        <!-- trophies.js မှ ဖလားများ (အပေါ်၅၊ အောက်၅၊ အလယ်ကြီး၁) ဤနေရာသို့ ဝင်ရောက်မည် -->
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
                    Open the Trophy Box above and tap any trophy to view specific details.
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

    // Trophy Box Toggle Logic (Box ဖွင့်ပိတ်လုပ်သည့် Function)
    const boxToggleHeader = document.getElementById('trophy-box-toggle');
    const boxContentArea = document.getElementById('trophy-box-content');
    const boxActionBtn = document.getElementById('box-action-btn');
    let isBoxOpen = false;

    boxToggleHeader.addEventListener('click', () => {
        isBoxOpen = !isBoxOpen;
        if (isBoxOpen) {
            boxContentArea.classList.add('open');
            boxActionBtn.textContent = 'CLOSE BOX';
        } else {
            boxContentArea.classList.remove('open');
            boxActionBtn.textContent = 'OPEN BOX';
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
                <div class="history-row"><span>Trophy Box State</span><span class="status-success">READY</span></div>
                <div class="history-row"><span>Profile Data Updated</span><span class="status-success">COMPLETED</span></div>
            `;
        }
    });
}