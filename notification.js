// notification.js

export function renderNotificationScreen(container) {
    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; overflow-y: auto; background-color: #0b0f19;">
            
            <!-- Header -->
            <div style="margin-bottom: 20px;">
                <h2 style="font-size: 22px; font-weight: 800; background: linear-gradient(90deg, #38bdf8, #c084fc, #f43f5e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 1px; margin: 0;">
                    SYSTEM NOTIFICATIONS
                </h2>
                <p style="color: #64748b; font-size: 12px; margin-top: 4px;">SECURE CYBER COMMUNICATIONS</p>
            </div>

            <!-- Notifications List Container -->
            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">

                <!-- Cyber Notification Card 1 -->
                <div class="cyber-noti-card" style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border: 1px solid #38bdf8; border-radius: 8px; padding: 16px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.15); position: relative; overflow: hidden; cursor: pointer; transition: all 0.3s ease;">
                    
                    <!-- Cyber corner accent lines -->
                    <div style="position: absolute; top: 0; left: 0; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                    <div style="position: absolute; bottom: 0; right: 0; width: 6px; height: 6px; background-color: #f43f5e;"></div>

                    <!-- Visible Header (Always shown) -->
                    <div class="noti-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="display: inline-block; width: 8px; height: 8px; background-color: #38bdf8; border-radius: 50%; box-shadow: 0 0 8px #38bdf8;"></span>
                                <h3 style="color: #f8fafc; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">Registration Submitted</h3>
                            </div>
                            <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0 16px; font-family: monospace;">📅 2026-08-15 | 🕒 15:30</p>
                        </div>
                        <span class="toggle-icon" style="color: #38bdf8; font-size: 14px; font-weight: bold; transition: transform 0.3s;">▼</span>
                    </div>

                    <!-- Hidden Body (Expands on click) -->
                    <div class="noti-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease, margin-top 0.3s ease; border-top: 1px solid transparent;">
                        <div style="padding-top: 12px; margin-top: 10px; border-top: 1px dashed #334155; color: #cbd5e1; font-size: 13px; line-height: 1.5;">
                            <p style="margin: 0 0 8px 0;">⚡ <strong style="color: #38bdf8;">Status:</strong> Your profile registration payload has been successfully encrypted and dispatched to the mainframe.</p>
                            <p style="margin: 0;">🛡️ System verification in progress. Access protocols will be unlocked shortly.</p>
                        </div>
                    </div>

                </div>

                <!-- Cyber Notification Card 2 (Example 2) -->
                <div class="cyber-noti-card" style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border: 1px solid #c084fc; border-radius: 8px; padding: 16px; box-shadow: 0 0 15px rgba(192, 132, 252, 0.15); position: relative; overflow: hidden; cursor: pointer; transition: all 0.3s ease;">
                    
                    <div style="position: absolute; top: 0; left: 0; width: 6px; height: 6px; background-color: #c084fc;"></div>
                    <div style="position: absolute; bottom: 0; right: 0; width: 6px; height: 6px; background-color: #38bdf8;"></div>

                    <div class="noti-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="display: inline-block; width: 8px; height: 8px; background-color: #c084fc; border-radius: 50%; box-shadow: 0 0 8px #c084fc;"></span>
                                <h3 style="color: #f8fafc; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">Registration Submitted</h3>
                            </div>
                            <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0 16px; font-family: monospace;">📅 2026-08-14 | 🕒 20:15</p>
                        </div>
                        <span class="toggle-icon" style="color: #c084fc; font-size: 14px; font-weight: bold; transition: transform 0.3s;">▼</span>
                    </div>

                    <div class="noti-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease, margin-top 0.3s ease; border-top: 1px solid transparent;">
                        <div style="padding-top: 12px; margin-top: 10px; border-top: 1px dashed #334155; color: #cbd5e1; font-size: 13px; line-height: 1.5;">
                            <p style="margin: 0 0 8px 0;">🌌 <strong style="color: #c084fc;">Node Connected:</strong> Second device handshake established successfully.</p>
                            <p style="margin: 0;">🚀 Ready for grid deployment and tournament sync.</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    `;

    // Add Toggle Interaction Logic
    const cards = container.querySelectorAll('.cyber-noti-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const body = card.querySelector('.noti-body');
            const icon = card.querySelector('.toggle-icon');
            
            if (body.style.maxHeight && body.style.maxHeight !== '0px') {
                body.style.maxHeight = '0px';
                icon.style.transform = 'rotate(0deg)';
                card.style.boxShadow = card.style.borderColor.includes('38bdf8') 
                    ? '0 0 15px rgba(56, 189, 248, 0.15)' 
                    : '0 0 15px rgba(192, 132, 252, 0.15)';
            } else {
                body.style.maxHeight = body.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
                card.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.4)';
            }
        });
    });
}