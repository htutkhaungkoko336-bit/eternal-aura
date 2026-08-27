// ==========================================
// 1. Notification Database Sync & Render
// ==========================================

// Notification အသစ်တစ်ခုကို Server (Database) ထဲ သိမ်းဆည်းရန်
export async function addNotification(userId, title, message) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}:${minutes} ${ampm}`;

    try {
        // Backend API ကို လှမ်းပို့ပြီး Database ထဲ သိမ်းမည်
        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, title, message, dateStr, timeStr })
        });
        const result = await response.json();

        if (result.success) {
            // သိမ်းပြီးတာနဲ့ Screen ပေါ်မှာ ပေါ်လာအောင် UI ကို Refresh လုပ်ပေးမယ်
            loadAndRenderNotifications(userId);
        }
    } catch (error) {
        console.error("Error adding notification:", error);
    }
}

// Database ထဲက Notification တွေကို လှမ်းဆွဲထုတ်ပြီး Screen ပေါ်ပြသရန်
export async function loadAndRenderNotifications(userId, container = null) {
    if (!userId) {
        console.error("User ID is missing!");
        return;
    }

    try {
        // Backtick (`) ကို အမှန်တကယ် သုံးပေးရန်
        const response = await fetch(`/api/notifications?userId=${userId}`);
        const result = await response.json();

        if (result.success) {
            const notifications = result.notifications;
            
            const unreadCount = notifications.filter(n => !n.isRead).length;
            updateNotificationBadge(unreadCount);

            const listContainer = container || document.getElementById('notification-list-container');
            if (listContainer) {
                renderNotificationCards(listContainer, notifications, userId);
            }
        }
    } catch (error) {
        console.error("Error loading notifications:", error);
    }
}
// Notification Screen ကို ဝင်ရောက်ကြည့်ရှုသည့်အခါ
export async function renderNotificationScreen(container, userId) {
    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background-color: #0b0f19; box-sizing: border-box; overflow: hidden;">
            <div style="flex-shrink: 0; background-color: #0b0f19; padding: 12px 16px 10px 16px; box-sizing: border-box; border-bottom: 1px solid #1e293b; z-index: 10; display: flex; justify-content: center; align-items: center;">
                <div style="position: relative; padding: 8px 20px; background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1)); border: 2px solid #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); text-align: center; border-radius: 4px;">
                    <h2 style="font-size: 15px; font-weight: 800; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">
                        System Notifications
                    </h2>
                </div>
            </div>
            <div id="notification-list-container" style="display: flex; flex-direction: column; gap: 15px; width: 100%; padding: 15px 20px 120px 20px; box-sizing: border-box; overflow-y: auto; flex-grow: 1; min-height: 0;">
            </div>
        </div>
    `;

    // Database ကနေ ဒေတာအလှမ်းခေါ်မယ် (userId သေချာပါမှ ခေါ်မည်)
    if (userId) {
        await loadAndRenderNotifications(userId, document.getElementById('notification-list-container'));
    } else {
        console.error("User ID is missing!");
        const listContainer = document.getElementById('notification-list-container');
        if (listContainer) {
            listContainer.innerHTML = `<p style="color: #ef4444; font-size: 13px; text-align: center; margin-top: 30px;">User ID not found. Please log in again.</p>`;
        }
    }
}

// Notification Bell Update
export function updateNotificationBadge(unreadCount) {
    const notiNavBtn = document.querySelector('.nav-item[data-tab="notification"]'); 
    
    if (notiNavBtn) {
        notiNavBtn.style.position = 'relative';
        let badgeEl = document.getElementById('notification-badge');
        
        if (!badgeEl) {
            badgeEl = document.createElement('span');
            badgeEl.id = 'notification-badge';
            badgeEl.style.cssText = 'position: absolute; top: -5px; right: 50%; transform: translateX(50%); background: #ef4444; color: white; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 10px; box-shadow: 0 0 8px rgba(239, 68, 68, 0.8); z-index: 20; display: none;';
            notiNavBtn.appendChild(badgeEl);
        }

        if (unreadCount > 0) {
            badgeEl.textContent = unreadCount;
            badgeEl.style.display = 'inline-block';
        } else {
            badgeEl.style.display = 'none';
        }
    }
}

// Card Render Helper
function renderNotificationCards(container, notifications, userId) {
    if (notifications.length === 0) {
        container.innerHTML = `<p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 30px;">No new notifications.</p>`;
        return;
    }

    container.innerHTML = '';
    notifications.forEach((noti) => {
        const card = document.createElement('div');
        card.className = 'cyber-noti-card';
        card.style.cssText = 'background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border: 1px solid #38bdf8; border-radius: 8px; padding: 16px 16px 24px 16px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.15); position: relative; transition: all 0.3s ease; flex-shrink: 0;';
        
        card.innerHTML = `
            <div class="noti-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; cursor: pointer;">
                <div style="flex-grow: 1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; width: 8px; height: 8px; background-color: #38bdf8; border-radius: 50%;"></span>
                        <h3 style="color: #f8fafc; font-size: 15px; font-weight: 700; margin: 0;">${noti.title}</h3>
                    </div>
                    <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0 16px; font-family: monospace;">${noti.dateStr} &bull; ${noti.timeStr}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="delete-btn" style="background: rgba(56, 189, 248, 0.1); border: 1px solid #38bdf8; color: #38bdf8; cursor: pointer; padding: 4px 10px; border-radius: 4px;">CLEAR</button>
                </div>
            </div>
            <div class="noti-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; border-top: 1px dashed #334155; margin-top: 10px;">
                <p style="color: #cbd5e1; font-size: 13px; padding-top: 10px;">${noti.message}</p>
            </div>
        `;

        card.querySelector('.noti-header').addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) return;
            const body = card.querySelector('.noti-body');
            body.style.maxHeight = body.style.maxHeight === '0px' || !body.style.maxHeight ? '1200px' : '0px';
        });

        card.querySelector('.delete-btn').addEventListener('click', async () => {
            card.remove();
        });

        container.appendChild(card);
    });
}