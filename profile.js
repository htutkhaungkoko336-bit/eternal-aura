// profile.js - Cyberpunk Theme Profile Screen

export function renderProfileScreen(container) {
    // LocalStorage မှ User အချက်အလက်များကို ရယူခြင်း (မရှိရင် Default သုံးမည်)
    const userName = localStorage.getItem('userName') || "CyberPlayer";
    const userId = localStorage.getItem('userId') || "EA-99482";
    const userAvatar = localStorage.getItem('userAvatar') || "https://i.imgur.com/6YK7mcy.png"; // Default cyberpunk avatar
    const userKey = localStorage.getItem('userKey') || "KEY-9988-XYZ7";
    const userBalance = localStorage.getItem('userBalance') || "55,000 Ks";

    container.innerHTML = `
        <style>
            .cyber-profile-container {
                padding: 20px;
                color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: radial-gradient(circle at top, #1e1b4b 0%, #0f172a 100%);
                min-height: 100%;
                box-sizing: border-box;
                padding-bottom: 40px;
            }
            .cyber-card {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid #38bdf8;
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 16px;
                box-shadow: 0 0 15px rgba(56, 189, 248, 0.15);
                backdrop-filter: blur(10px);
            }
            .profile-header {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .avatar-box {
                position: relative;
                width: 75px;
                height: 75px;
                border-radius: 50%;
                border: 2px solid #38bdf8;
                overflow: hidden;
                box-shadow: 0 0 10px #38bdf8;
                flex-shrink: 0;
            }
            .avatar-box img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .profile-info h2 {
                margin: 0;
                font-size: 18px;
                color: #38bdf8;
                text-shadow: 0 0 8px rgba(56, 189, 248, 0.5);
            }
            .profile-info p {
                margin: 4px 0 0 0;
                font-size: 12px;
                color: #94a3b8;
            }
            .cyber-badge {
                display: inline-block;
                background: rgba(56, 189, 248, 0.1);
                color: #38bdf8;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 10px;
                border: 1px solid rgba(56, 189, 248, 0.3);
                margin-top: 6px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 16px;
            }
            .stat-box {
                background: rgba(30, 41, 59, 0.6);
                border: 1px solid #1e293b;
                border-radius: 12px;
                padding: 12px;
                text-align: center;
            }
            .stat-box span {
                display: block;
                font-size: 10px;
                color: #94a3b8;
            }
            .stat-box strong {
                font-size: 14px;
                color: #f43f5e;
                text-shadow: 0 0 5px rgba(244, 63, 94, 0.4);
            }
            .section-title {
                font-size: 14px;
                color: #38bdf8;
                margin-bottom: 10px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .winner-card-item {
                background: linear-gradient(135deg, rgba(244,63,94,0.1), rgba(56,189,248,0.1));
                border: 1px dashed #f43f5e;
                border-radius: 10px;
                padding: 10px;
                margin-bottom: 8px;
                font-size: 12px;
            }
            .cyber-input {
                width: 100%;
                background: #020617;
                border: 1px solid #1e293b;
                color: #fff;
                padding: 10px;
                border-radius: 8px;
                font-size: 12px;
                margin-bottom: 10px;
                box-sizing: border-box;
            }
            .cyber-input:focus {
                border-color: #38bdf8;
                outline: none;
                box-shadow: 0 0 8px rgba(56, 189, 248, 0.3);
            }
            .cyber-btn {
                background: linear-gradient(135deg, #38bdf8, #2563eb);
                color: white;
                border: none;
                padding: 10px;
                width: 100%;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                font-size: 12px;
                box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
                transition: 0.2s;
            }
            .cyber-btn:active {
                transform: scale(0.98);
            }
        </style>

        <div class="cyber-profile-container">
            <!-- Profile Main Card -->
            <div class="cyber-card">
                <div class="profile-header">
                    <div class="avatar-box">
                        <img src="${userAvatar}" alt="Avatar" id="user-avatar-img">
                    </div>
                    <div class="profile-info">
                        <h2>${userName}</h2>
                        <p>ID: <span style="color: #38bdf8; font-family: monospace;">${userId}</span></p>
                        <div class="cyber-badge">⚡ CYBER AGENT</div>
                    </div>
                </div>
            </div>

            <!-- Stats & Keys -->
            <div class="stats-grid">
                <div class="stat-box">
                    <span>SECURITY KEY</span>
                    <strong style="color: #38bdf8; font-size: 11px; font-family: monospace;">${userKey}</strong>
                </div>
                <div class="stat-box">
                    <span>BALANCE / FEE</span>
                    <strong>${userBalance}</strong>
                </div>
            </div>

            <!-- Winner Cards Section -->
            <div class="cyber-card">
                <div class="section-title">🏆 Winner Cards & History</div>
                <div class="winner-card-item">
                    <div style="color: #38bdf8; font-weight: bold;">🔥 1vs1 Mode Tournament Winner</div>
                    <div style="color: #94a3b8; font-size: 10px; margin-top: 2px;">Date: 2026-08-20 | Reward: 100,000 Ks</div>
                </div>
                <div class="winner-card-item" style="border-color: #38bdf8;">
                    <div style="color: #f43f5e; font-weight: bold;">🛡️ Squad Match History</div>
                    <div style="color: #94a3b8; font-size: 10px; margin-top: 2px;">Status: Registered & Verified</div>
                </div>
            </div>

            <!-- Message, Connect & Refund Request Section -->
            <div class="cyber-card">
                <div class="section-title">💬 Message / Connect & Refund</div>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 10px;">
                    User အချင်းချင်း ချိတ်ဆက်ရန် (သို့) Key / Fee Refund တောင်းဆိုရန် Admin ထံ တိုက်ရိုက်မက်ဆေ့ခ်ျ ပို့နိုင်ပါသည်။
                </p>
                <input type="text" id="target-user-id" class="cyber-input" placeholder="Enter Target User ID (e.g. EA-XXXXX)">
                <textarea id="refund-msg-text" class="cyber-input" rows="3" placeholder="မက်ဆေ့ခ်ျ (သို့) Refund တောင်းဆိုရန် အကြောင်းအရာရေးပါ..."></textarea>
                <button class="cyber-btn" id="send-cyber-msg-btn">TRANSMIT MESSAGE / REQUEST</button>
            </div>
        </div>
    `;

    // Event Listener for Message / Refund Button
    const sendBtn = document.getElementById('send-cyber-msg-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const targetId = document.getElementById('target-user-id').value.trim();
            const message = document.getElementById('refund-msg-text').value.trim();

            if (!message) {
                alert("ကျေးဇူးပြု၍ ပို့မည့်စာ (သို့) အကြောင်းအရာကို ရေးပါ။");
                return;
            }

            // ဤနေရာတွင် Message ပို့သည့် Database Logic (သို့) System Notification ထပ်ထည့်နိုင်ပါသည်
            alert(`✅ မက်ဆေ့ခ်ျ (သို့) တောင်းဆိုမှုကို အောင်မြင်စွာ ပို့ပြီးပါပြီ ရဲဘော်!\nTarget ID: ${targetId || 'Admin'}`);
            document.getElementById('refund-msg-text').value = '';
            document.getElementById('target-user-id').value = '';
        });
    }
}