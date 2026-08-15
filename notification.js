// notification.js

// Notification အသစ်တစ်ခုကို သိမ်းဆည်းပြီး Render လုပ်ရန်
export function addNotification(title, message) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    // 12-hour format (AM/PM) အဖြစ် ပြောင်းလဲခြင်း (ဥပမာ - 4:05 PM)
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const timeStr = `${hours}:${minutes} ${ampm}`;

    const newNoti = { title, message, dateStr, timeStr };

    let notifications = JSON.parse(localStorage.getItem('app_notifications')) || [];
    notifications.unshift(newNoti);
    localStorage.setItem('app_notifications', JSON.stringify(notifications));

    const listContainer = document.getElementById('notification-list-container');
    if (listContainer) {
        renderNotificationCards(listContainer, notifications);
    }
}

export function renderNotificationScreen(container) {
    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; padding: 20px 20px 90px 20px; box-sizing: border-box; overflow-y: auto; background-color: #0b0f19;">
            
            <!-- Header -->
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="font-size: 22px; font-weight: 800; background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 1px; margin: 0;">
                        SYSTEM NOTIFICATIONS
                    </h2>
                    <p style="color: #64748b; font-size: 12px; margin-top: 4px;">SECURE CYBER COMMUNICATIONS</p>
                </div>
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
// Card များကို HTML ထဲ ထည့်သွင်းပေးသည့် Helper Function (Clear ပါဝင်သည် - Blue Theme)
function renderNotificationCards(container, notifications) {
    if (notifications.length === 0) {
        container.innerHTML = `<p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 30px;">No new notifications.</p>`;
        return;
    }

    container.innerHTML = '';
    notifications.forEach((noti, index) => {
        const card = document.createElement('div');
        card.className = 'cyber-noti-card';
        card.style.cssText = 'background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border: 1px solid #38bdf8; border-radius: 8px; padding: 16px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.15); position: relative; overflow: hidden; transition: all 0.3s ease;';
        
        card.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 6px; height: 6px; background-color: #38bdf8;"></div>
            <div style="position: absolute; bottom: 0; right: 0; width: 6px; height: 6px; background-color: #38bdf8;"></div>

            <div class="noti-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; cursor: pointer;">
                <div style="flex-grow: 1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; width: 8px; height: 8px; background-color: #38bdf8; border-radius: 50%; box-shadow: 0 0 8px #38bdf8;"></span>
                        <h3 style="color: #f8fafc; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">${noti.title}</h3>
                    </div>
                    <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0 16px; font-family: monospace;">📅 ${noti.dateStr} | 🕒 ${noti.timeStr}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="delete-btn" title="Clear Notification" style="background: rgba(56, 189, 248, 0.1); border: 1px solid #38bdf8; color: #38bdf8; cursor: pointer; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 4px; transition: all 0.2s; letter-spacing: 0.5px;">CLEAR</button>
                    <span class="toggle-icon" style="color: #38bdf8; font-size: 14px; font-weight: bold; transition: transform 0.3s;">▼</span>
                </div>
            </div>

            <div class="noti-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease, margin-top 0.3s ease; border-top: 1px solid transparent;">
                <div style="padding-top: 12px; margin-top: 10px; border-top: 1px dashed #334155; color: #cbd5e1; font-size: 13px; line-height: 1.5;">
                    <p style="margin: 0;">${noti.message}</p>
                </div>
            </div>
        `;

        // Card ကို နှိပ်ရင် အောက်သို့ ဆင်းပြီး ဖြန့်ထွက်ရန် (Clear ခလုတ်ကို နှိပ်လျှင် မပါစေရန်)
        const headerEl = card.querySelector('.noti-header');
        headerEl.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) return;
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

        // Delete လုပ်သည့် Function (CLEAR ခလုတ် - Blue Hover Effect)
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('mouseenter', () => {
            deleteBtn.style.backgroundColor = '#38bdf8';
            deleteBtn.style.color = '#0b0f19';
        });
        deleteBtn.addEventListener('mouseleave', () => {
            deleteBtn.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
            deleteBtn.style.color = '#38bdf8';
        });

        deleteBtn.addEventListener('click', () => {
            let currentNotis = JSON.parse(localStorage.getItem('app_notifications')) || [];
            currentNotis.splice(index, 1);
            localStorage.setItem('app_notifications', JSON.stringify(currentNotis));
            renderNotificationCards(container, currentNotis);
        });

        container.appendChild(card);
    });
}