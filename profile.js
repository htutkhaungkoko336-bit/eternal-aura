// profile.js - Cyber Profile & Trophy-First Layout
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

            /* 2. Main Trophy Showcase Section (ဦးစားပေးနေရာကြီး) */
            .main-showcase-section {
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid #0ea5e9;
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 16px;
                box-shadow: 0 0 25px rgba(14, 165, 233, 0.2);
            }

            .showcase-header {
                font-size: 12px;
                font-weight: bold;
                color: #facc15;
                letter-spacing: 1.5px;
                margin-bottom: 14px;
                text-shadow: 0 0 8px rgba(250, 204, 21, 0.4);
                display: flex;
                align-items: center;
                gap: 8px;
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

            <!-- Main Trophy Showcase (Profile ဝင်လိုက်တာနဲ့ Trophy (၁၁) လုံး တန်းပေါ်နေမည့်နေရာ) -->
            <div class="main-showcase-section">
                <div class="showcase-header">
                    🏆 ACHIEVEMENT SHOWCASE (TROPHY COLLECTION)
                </div>
                <div id="trophy-showcase-target">
                    <!-- trophies.js မှ ဖလားများ ဤနေရာသို့ ဝင်ရောက်မည် -->
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
                    Tap any trophy above to view specific details.
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

    const detailArea = refDetailArea => document.getElementById('detail-display-area');

    // Render Trophy Showcase using trophies.js module function
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
                <div class="history-row"><span>1vs1 Match Registered</span><span class="status-success">SUCCESS</span></div>
                <div class="history-row"><span>Profile Data Updated</span><span class="status-success">COMPLETED</span></div>
            `;
        }
    });
}