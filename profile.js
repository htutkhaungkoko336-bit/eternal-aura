// profile.js - Cyber Profile & Gaming Status Page

export function renderProfileScreen(container) {
    const userName = localStorage.getItem('user_profile_name') || localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('user_profile_id') || localStorage.getItem('userId') || "EA-99821";
    const userKey = localStorage.getItem('user_profile_key') || "EA-KEY-5599-CYBER-99X";
    const savedAvatar = localStorage.getItem('user_profile_avatar') || "";

    container.innerHTML = `
        <style>
            .playing-wrapper {
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                padding: 16px;
                box-sizing: border-box;
                color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            /* Profile & Trophy Top Grid */
            .top-grid {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: center;
                margin-bottom: 14px;
            }

            /* Profile Card */
            .profile-card {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid #ec4899;
                border-radius: 16px;
                padding: 14px;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 0 20px rgba(236, 72, 153, 0.25);
                backdrop-filter: blur(10px);
                min-height: 90px;
                box-sizing: border-box;
            }

            .avatar-box {
                width: 55px;
                height: 55px;
                background: #020617;
                border: 2px dashed #ec4899;
                border-radius: 12px;
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
                font-size: 22px;
                color: #ec4899;
            }

            .profile-info h3 {
                margin: 0;
                font-size: 15px;
                color: #f472b6;
                text-shadow: 0 0 8px rgba(244, 114, 182, 0.5);
            }

            .profile-info p {
                margin: 4px 0 0 0;
                font-size: 11px;
                color: #94a3b8;
                font-family: monospace;
            }

            /* Trophy Widget Box */
            .trophy-box {
                width: 90px;
                height: 100px;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(3, 7, 18, 0.98));
                border: 1.5px solid #06b6d4;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
                position: relative;
            }

            .trophy-icon {
                font-size: 28px;
                margin-bottom: 4px;
                filter: drop-shadow(0 0 8px #22d3ee);
            }

            .trophy-title {
                font-size: 8px;
                font-weight: 900;
                color: #22d3ee;
                letter-spacing: 1px;
            }

            /* Sections Box (Key & History) */
            .section-card {
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid #334155;
                border-radius: 14px;
                padding: 14px;
                margin-bottom: 12px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }

            .section-title {
                font-size: 11px;
                font-weight: bold;
                color: #d8b4fe;
                letter-spacing: 1px;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .content-box {
                background: #020617;
                border: 1px solid #475569;
                border-radius: 8px;
                padding: 10px;
                font-size: 12px;
                font-family: monospace;
                color: #38bdf8;
                word-break: break-all;
            }

            .history-item {
                padding: 6px 0;
                border-bottom: 1px solid #1e293b;
                font-size: 11px;
                color: #94a3b8;
                display: flex;
                justify-content: space-between;
            }

            .history-item:last-child {
                border-bottom: none;
            }

            .highlight-text {
                color: #4ade80;
                font-weight: bold;
            }
        </style>

        <div class="playing-wrapper">
            <!-- Top Grid: Profile Card & Trophy -->
            <div class="top-grid">
                <!-- Profile Information Card -->
                <div class="profile-card">
                    <label class="avatar-box" id="avatar-container" title="ဓာတ်ပုံပြောင်းရန် နှိပ်ပါ">
                        ${savedAvatar ? `<img src="${savedAvatar}">` : `<span id="avatar-plus">+</span>`}
                        <input type="file" id="file-input" accept="image/*" style="display: none;">
                    </label>
                    <div class="profile-info">
                        <h3>${userName}</h3>
                        <p>ID: ${userId}</p>
                    </div>
                </div>

                <!-- Trophy Section -->
                <div class="trophy-box" title="Trophies Earned">
                    <div class="trophy-icon">🏆</div>
                    <div class="trophy-title">M7 TROPHY</div>
                </div>
            </div>

            <!-- Key Section -->
            <div class="section-card">
                <div class="section-title">
                    <span>🔑 SECURITY KEY</span>
                    <span style="font-size: 9px; color: #a855f7;">VERIFIED</span>
                </div>
                <div class="content-box">
                    ${userKey}
                </div>
            </div>

            <!-- History Section -->
            <div class="section-card">
                <div class="section-title">
                    <span>📜 ACTIVITY HISTORY</span>
                    <span style="font-size: 9px; color: #a855f7;">LOGS</span>
                </div>
                <div class="content-box">
                    <div class="history-item">
                        <span>1vs1 Match Registered</span>
                        <span class="highlight-text">SUCCESS</span>
                    </div>
                    <div class="history-item">
                        <span>Profile Data Updated</span>
                        <span class="highlight-text">COMPLETED</span>
                    </div>
                    <div class="history-item">
                        <span>System Login Connection</span>
                        <span style="color: #38bdf8;">ONLINE</span>
                    </div>
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
}