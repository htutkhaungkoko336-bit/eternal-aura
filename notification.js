// notification.js

// Notification အသစ်တစ်ခုကို သိမ်းဆည်းပြီး Render လုပ်ရန်
export function addNotification(title, message) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    const newNoti = { title, message, dateStr, timeStr };

    // localStorage ထဲမှာ အရင်ရှိပြီးသား တွေကို ယူမည်
    let notifications = JSON.parse(localStorage.getItem('app_notifications')) || [];
    
    // အသစ်ကို ထိပ်ဆုံးကနေ ထည့်မည်
    notifications.unshift(newNoti);
    
    // ပြန်သိမ်းမည်
    localStorage.setItem('app_notifications', JSON.stringify(notifications));

    // Screen ပေါ်မှာပါ ချက်ချင်းပေါ်လာအောင် လုပ်ခြင်း (container ရှိနေမှသာ)
    const listContainer = document.getElementById('notification-list-container');
    if (listContainer) {
        renderNotificationCards(listContainer, notifications);
    }
}

// Notification Screen ကို Render လုပ်ရန်
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
            <div id="notification-list-container" style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
            </div>
        </div>
    `;

    const listContainer = document.getElementById('notification-list-container');
    const notifications = JSON.parse(localStorage.getItem('app_notifications')) || [];
    
    renderNotificationCards(listContainer, notifications);
}

// Card များကို HTML ထဲ ထည့်သွင်းပေးသည့် Helper Function
function renderNotificationCards(container, notifications) {
    if (notifications.length === 0) {
        container.innerHTML = `<p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 30px;">No new notifications.</p>`;
        return;
    }

    container.innerHTML = '';
    notifications.forEach(noti => {
        const card = document.createElement('div');
        card.className = 'cyber-noti-card';
        card.style.cssText = 'background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border: 1px solid #38bdf8; border-radius: 8px; padding: 16px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.15); position: relative; overflow: hidden; cursor: pointer; transition: all 0.3s ease;';
        
        card.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 6px; height: 6px; background-color: #38bdf8;"></div>
            <div style="position: absolute; bottom: 0; right: 0; width: 6px; height: 6px; background-color: #f43f5e;"></div>

            <div class="noti-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; width: 8px; height: 8px; background-color: #38bdf8; border-radius: 50%; box-shadow: 0 0 8px #38bdf8;"></span>
                        <h3 style="color: #f8fafc; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">${noti.title}</h3>
                    </div>
                    <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0 16px; font-family: monospace;">📅 ${noti.dateStr} | 🕒 ${noti.timeStr}</p>
                </div>
                <span class="toggle-icon" style="color: #38bdf8; font-size: 14px; font-weight: bold; transition: transform 0.3s;">▼</span>
            </div>

            <div class="noti-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease, margin-top 0.3s ease; border-top: 1px solid transparent;">
                <div style="padding-top: 12px; margin-top: 10px; border-top: 1px dashed #334155; color: #cbd5e1; font-size: 13px; line-height: 1.5;">
                    <p style="margin: 0;">${noti.message}</p>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            const body = card.querySelector('.noti-body');
            const icon = card.querySelector('.toggle-icon');
            
            if (body.style.maxHeight && body.style.maxHeight !== '0px') {
                body.style.maxHeight = '0px';
                icon.style.transform = 'rotate(0deg)';
            } else {
                body.style.maxHeight = body.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });

        container.appendChild(card);
    });
}