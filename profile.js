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

            /* 1. Top Unified Banner (Avatar + Info + Champion Trophy) */
            .top-banner {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid #ec4899;
                border-radius: 16px;
                padding: 12px;
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 12px;
                align-items: center;
                box-shadow: 0 0 20px rgba(236, 72, 153, 0.25);
                backdrop-filter: blur(10px);
                margin-bottom: 14px;
            }

            .avatar-box {
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
                flex-shrink: 0;
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
                color: #ec4899;
            }

            .profile-info h3 {
                margin: 0;
                font-size: 14px;
                color: #f472b6;
                text-shadow: 0 0 8px rgba(244, 114, 182, 0.5);
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

            .champion-trophy-box {
                width: 55px;
                height: 55px;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(3, 7, 18, 0.98));
                border: 1.5px solid #06b6d4;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
                cursor: pointer;
            }

            .champion-trophy-box span:first-child {
                font-size: 20px;
                filter: drop-shadow(0 0 6px #22d3ee);
            }

            .champion-trophy-box span:last-child {
                font-size: 7px;
                font-weight: 900;
                color: #22d3ee;
                margin-top: 2px;
                letter-spacing: 0.5px;
            }

            /* 2. Trophy Collection Middle Button */
            .trophy-collection-btn {
                width: 100%;
                background: rgba(30, 41, 59, 0.9);
                border: 1px solid #a855f7;
                border-radius: 12px;
                padding: 12px;
                text-align: center;
                color: #d8b4fe;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 1px;
                cursor: pointer;
                box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
                margin-bottom: 14px;
                transition: all 0.2s ease;
            }

            .trophy-collection-btn:hover {
                background: rgba(168, 85, 247, 0.15);
                box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
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

            /* Dynamic Detail View Box (Popup/Container for Key or History details) */
            .detail-view-box {
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid #475569;
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
            <!-- Top Banner: Avatar, Name/ID, Champion Trophy -->
            <div class="top-banner">
                <label class="avatar-box" id="avatar-container" title="ဓာတ်ပုံပြောင်းရန် နှိပ်ပါ">
                    ${savedAvatar ? `<img src="${savedAvatar}">` : `<span id="avatar-plus">+</span>`}
                    <input type="file" id="file-input" accept="image/*" style="display: none;">
                </label>
                <div class="profile-info">
                    <h3>${userName}</h3>
                    <p>ID: ${userId}</p>
                </div>
                <div class="champion-trophy-box" id="champ-trophy-btn" title="Champion Trophy">
                    <span>🏆</span>
                    <span>TROPHY</span>
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
                    Select an option above (Key or History) to view details.
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
            <div style="color: #a855f7; font-weight: bold; margin-bottom: 6px;">SECURITY KEY VERIFIED:</div>
            <div>${userKey}</div>
        `;
    });

    document.getElementById('history-card-btn').addEventListener('click', () => {
        detailArea.innerHTML = `
            <div style="color: #d8b4fe; font-weight: bold; margin-bottom: 6px;">ACTIVITY LOGS:</div>
            <div class="history-row"><span>1vs1 Match Registered</span><span class="status-success">SUCCESS</span></div>
            <div class="history-row"><span>Profile Data Updated</span><span class="status-success">COMPLETED</span></div>
            <div class="history-row"><span>System Login Connection</span><span style="color: #38bdf8;">ONLINE</span></div>
        `;
    });

    document.getElementById('trophy-collection-trigger').addEventListener('click', () => {
        detailArea.innerHTML = `
            <div style="color: #22d3ee; font-weight: bold; margin-bottom: 6px;">TROPHY COLLECTION:</div>
            <div class="history-row"><span>M7 World Championship</span><span class="status-success">UNLOCKED</span></div>
            <div class="history-row"><span>Season 25 Glory</span><span class="status-success">UNLOCKED</span></div>
        `;
    });

    document.getElementById('champ-trophy-btn').addEventListener('click', () => {
        detailArea.innerHTML = `
            <div style="color: #f472b6; font-weight: bold; margin-bottom: 6px;">CHAMPION TROPHY STATUS:</div>
            <div>Elite Tier Badge Active. Verified tournament winner credentials loaded.</div>
        `;
    });
}