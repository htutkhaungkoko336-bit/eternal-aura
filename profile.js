// profile.js - Cyber Profile & Gaming Status Page (Custom Layout)

export function renderProfileScreen(container) {
    const userName = localStorage.getItem('user_profile_name') || localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('user_profile_id') || localStorage.getItem('userId') || "EA-99821";
    const userKey = localStorage.getItem('user_profile_key') || "EA-KEY-5599-CYBER-99X";
    const savedAvatar = localStorage.getItem('user_profile_avatar') || "";

    container.innerHTML = `
        <style>
            .profile-wrapper {
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                padding: 16px;
                box-sizing: border-box;
                color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            /* 1. Top Unified Banner (Avatar + Name/ID only) */
            .top-banner {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid #0ea5e9;
                border-radius: 16px;
                padding: 14px;
                display: flex;
                align-items: center;
                gap: 14px;
                box-shadow: 0 0 20px rgba(14, 165, 233, 0.25);
                backdrop-filter: blur(10px);
                margin-bottom: 14px;
            }

            .avatar-box {
                width: 55px;
                height: 55px;
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
                box-shadow: 0 0 12px rgba(56, 189, 248, 0.6), inset 0 0 8px rgba(56, 189, 248, 0.4);
                animation: electricGlow 2s infinite alternate;
            }

            @keyframes electricGlow {
                0% {
                    border-color: #38bdf8;
                    box-shadow: 0 0 8px rgba(56, 189, 248, 0.5), inset 0 0 5px rgba(56, 189, 248, 0.3);
                }
                100% {
                    border-color: #7dd3fc;
                    box-shadow: 0 0 16px rgba(125, 211, 252, 0.9), inset 0 0 10px rgba(125, 211, 252, 0.6);
                }
            }

            .avatar-box img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0; left: 0;
            }

            .avatar-box span {
                font-size: 22px;
                color: #38bdf8;
                text-shadow: 0 0 8px #38bdf8;
            }

            .profile-info {
                flex-grow: 1;
                overflow: hidden;
            }

            .profile-info h3 {
                margin: 0;
                font-size: 14px;
                color: #38bdf8;
                text-shadow: 0 0 8px rgba(56, 189, 248, 0.5);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .profile-info p {
                margin: 4px 0 0 0;
                font-size: 11px;
                color: #94a3b8;
                font-family: monospace;
            }

            /* 2. Trophy Collection Middle Button */
            .trophy-collection-btn {
                width: 100%;
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid #0ea5e9;
                border-radius: 12px;
                padding: 12px;
                text-align: center;
                color: #38bdf8;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 1px;
                cursor: pointer;
                box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);
                margin-bottom: 14px;
                transition: all 0.2s ease;
            }

            .trophy-collection-btn:hover {
                background: rgba(14, 165, 233, 0.15);
                box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
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
                padding: 14px;
                text-align: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
            }

            .action-card:hover {
                border-color: #38bdf8;
                box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
            }

            .action-card .icon {
                font-size: 20px;
                margin-bottom: 6px;
            }

            .action-card .title {
                font-size: 11px;
                font-weight: bold;
                color: #38bdf8;
                letter-spacing: 1px;
            }

            /* Dynamic Detail View Box */
            .detail-view-box {
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid #334155;
                border-radius: 12px;
                padding: 12px;
                font-size: 11px;
                font-family: monospace;
                color: #38bdf8;
                word-break: break-all;
                min-height: 80px;
                box-sizing: border-box;
            }

            .history-row {
                padding: 6px 0;
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
            <!-- Top Banner: Avatar and Name/ID only -->
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

            <!-- Trophy Collection Button -->
            <div class="trophy-collection-btn" id="trophy-collection-trigger">
                🏆 TROPHY COLLECTION
            </div>

            <!-- Key & History Side-by-Side Cards -->
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
                <div style="color: #64748b; text-align: center; padding-top: 15px;">
                    Select an option above to view details.
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

    // Interactive Button Actions
    const detailArea = document.getElementById('detail-display-area');
    
    document.getElementById('key-card-btn').addEventListener('click', () => {
        detailArea.innerHTML = `
            <div style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">SECURITY KEY VERIFIED:</div>
            <div>${userKey}</div>
        `;
    });

    document.getElementById('history-card-btn').addEventListener('click', () => {
        detailArea.innerHTML = `
            <div style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">ACTIVITY LOGS:</div>
            <div class="history-row"><span>1vs1 Match Registered</span><span class="status-success">SUCCESS</span></div>
            <div class="history-row"><span>Profile Data Updated</span><span class="status-success">COMPLETED</span></div>
            <div class="history-row"><span>System Login Connection</span><span style="color: #38bdf8;">ONLINE</span></div>
        `;
    });

    // Trophy Collection Button - Blank initially, shows trophies when clicked
    document.getElementById('trophy-collection-trigger').addEventListener('click', () => {
        detailArea.innerHTML = `
            <div style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">TROPHY COLLECTION:</div>
            <div class="history-row"><span>M7 World Championship</span><span class="status-success">UNLOCKED</span></div>
            <div class="history-row"><span>Season 25 Glory</span><span class="status-success">UNLOCKED</span></div>
        `;
    });
}