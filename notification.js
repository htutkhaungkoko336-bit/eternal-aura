// ==========================================
// 1. Notification Local Storage & Render (Sync မပါတော့ပါ)
// ==========================================

// Notification အသစ်တစ်ခုကို LocalStorage ထဲ သိမ်းဆည်းပြီး Render လုပ်ရန်
export function addNotification(title, message) {
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

    const newNoti = { title, message, dateStr, timeStr };

    let notifications = JSON.parse(localStorage.getItem('app_notifications')) || [];
    notifications.unshift(newNoti);
    localStorage.setItem('app_notifications', JSON.stringify(notifications));

    let unreadCount = parseInt(localStorage.getItem('app_unread_count') || '0', 10);
    unreadCount += 1;
    localStorage.setItem('app_unread_count', unreadCount.toString());
    updateNotificationBadge();

    const listContainer = document.getElementById('notification-list-container');
    if (listContainer) {
        renderNotificationCards(listContainer, notifications);
    }
}

// Notification Screen ကို ဝင်ရောက်ကြည့်ရှုသည့်အခါ Badge ကို ရှင်းလင်းပေးရန်
export function renderNotificationScreen(container) {
    localStorage.setItem('app_unread_count', '0');
    updateNotificationBadge();

    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background-color: #0b0f19; box-sizing: border-box; overflow: hidden;">
            <div style="flex-shrink: 0; background-color: #0b0f19; padding: 12px 16px 10px 16px; box-sizing: border-box; border-bottom: 1px solid #1e293b; z-index: 10; display: flex; justify-content: center; align-items: center;">
                <div style="position: relative; padding: 8px 20px; background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1)); border: 2px solid #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); text-align: center; border-radius: 4px;">
                    <div style="position: absolute; top: -2px; left: -2px; width: 6px; height: 6px; background: #38bdf8;"></div>
                    <div style="position: absolute; bottom: -2px; right: -2px; width: 6px; height: 6px; background: #818cf8;"></div>
                    <h2 style="font-size: 15px; font-weight: 800; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">
                        System Notifications
                    </h2>
                </div>
            </div>
            <div id="notification-list-container" style="display: flex; flex-direction: column; gap: 15px; width: 100%; padding: 15px 20px 120px 20px; box-sizing: border-box; overflow-y: auto; flex-grow: 1; min-height: 0;">
            </div>
        </div>
    `;

    const listContainer = document.getElementById('notification-list-container');
    const notifications = JSON.parse(localStorage.getItem('app_notifications')) || [];
    renderNotificationCards(listContainer, notifications);
}

// Notification Bell Update
export function updateNotificationBadge() {
    const unreadCount = parseInt(localStorage.getItem('app_unread_count') || '0', 10);
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
function renderNotificationCards(container, notifications) {
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
            <div style="position: absolute; top: 0; left: 0; width: 6px; height: 6px; background-color: #38bdf8;"></div>
            <div style="position: absolute; bottom: 0; right: 0; width: 6px; height: 6px; background-color: #38bdf8;"></div>
            <div class="noti-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; cursor: pointer;">
                <div style="flex-grow: 1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; width: 8px; height: 8px; background-color: #38bdf8; border-radius: 50%; box-shadow: 0 0 8px #38bdf8;"></span>
                        <h3 style="color: #f8fafc; font-size: 15px; font-weight: 700; margin: 0;">${noti.title}</h3>
                    </div>
                    <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0 16px; font-family: monospace;">${noti.dateStr} &bull; ${noti.timeStr}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="delete-btn" style="background: rgba(56, 189, 248, 0.1); border: 1px solid #38bdf8; color: #38bdf8; cursor: pointer; padding: 4px 10px; border-radius: 4px;">CLEAR</button>
                    <span class="toggle-icon" style="color: #38bdf8;">▼</span>
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

        card.querySelector('.delete-btn').addEventListener('click', () => {
            let currentNotis = JSON.parse(localStorage.getItem('app_notifications')) || [];
            currentNotis = currentNotis.filter(n => n.title !== noti.title || n.timeStr !== noti.timeStr);
            localStorage.setItem('app_notifications', JSON.stringify(currentNotis));
            renderNotificationCards(container, currentNotis);
        });

        container.appendChild(card);
    });
}


// ==========================================
// 2. Status Polling (5 စက္ကန့်တစ်ကြိမ် လှမ်းစစ်ပေးမည့် Function)
// ==========================================
export function startCheckingStatus(registrationId, userId, mode) {
    localStorage.setItem('active_polling', JSON.stringify({ registrationId, userId, mode }));

    const intervalTime = 5000; // ၅ စက္ကန့်တစ်ကြိမ်

    const timer = setInterval(async () => {
        try {
            const response = await fetch(`/api/check-status?registrationId=${registrationId}&userId=${userId}&mode=${mode}`);
            const result = await response.json();

            if (result.success) {
                if (result.status === 'CONFIRMED') {
                    addNotification("Registration Confirmed! 🎉", "Admin က မင်းရဲ့ Register ကို Confirm ပေးလိုက်ပါပြီ။ Key ရရှိသွားပါပြီ။");
                    clearInterval(timer); 
                    localStorage.removeItem('active_polling'); // ပြီးဆုံးပါက ဖယ်ရှားမည်
                } else if (result.status === 'REJECTED') {
                    const reason = result.rejectionReason || "အခြားအကြောင်းပြချက်ဖြင့် ပယ်ချပါသည်";
                    addNotification("Registration Rejected ❌", `တောင်းပန်ပါတယ်၊ မင်းရဲ့ Register ကို Reject လိုက်ပါတယ်။\n\n📝 အကြောင်းရင်း: ${reason}`);
                    clearInterval(timer); 
                    localStorage.removeItem('active_polling'); // ပြီးဆုံးပါက ဖယ်ရှားမည်
                }
            }
        } catch (error) {
            console.error("Polling error:", error);
        }
    }, intervalTime);

    // Tab ပြောင်းသွားခြင်း (Visibility Change) သို့မဟုတ် Screen ပြန်ဖွင့်လာသည့်အခါ ချက်ချင်း တစ်ခါ API လှမ်းခေါ်စစ်ဆေးရန်
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
            console.log("Tab is active again, checking status immediately...");
            // ချက်ချင်း တစ်ခါ စစ်ဆေးမည်
            try {
                const response = await fetch(`/api/check-status?registrationId=${registrationId}&userId=${userId}&mode=${mode}`);
                const result = await response.json();
                if (result.success && (result.status === 'CONFIRMED' || result.status === 'REJECTED')) {
                    if (result.status === 'CONFIRMED') {
                        addNotification("Registration Confirmed! 🎉", "Admin က မင်းရဲ့ Register ကို Confirm ပေးလိုက်ပါပြီ။ Key ရရှိသွားပါပြီ။");
                    } else {
                        const reason = result.rejectionReason || "အခြားအကြောင်းပြချက်ဖြင့် ပယ်ချပါသည်";
                        addNotification("Registration Rejected ❌", `တောင်းပန်ပါတယ်၊ မင်းရဲ့ Register ကို Reject လိုက်ပါတယ်။\n\n📝 အကြောင်းရင်း: ${reason}`);
                    }
                    clearInterval(timer);
                    localStorage.removeItem('active_polling');
                }
            } catch (err) {
                console.error("Visibility change check error:", err);
            }
        }
    });
}
// ==========================================
// 3. Registration Submission 
// ==========================================
export async function submitUserRegistration(mode, formData, currentUserId, feedbackElement = null) {
    formData.userId = currentUserId; 
    
    if (feedbackElement) {
        feedbackElement.textContent = "Processing...";
        feedbackElement.style.color = "#38bdf8";
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode, data: formData })
        });
        const result = await response.json();

        // Server က ဘာ Response ပို့လိုက်လဲ Console မှာ အရင်စစ်မယ်
        console.log("API Register Response:", result);

        if (result.success) {
            if (feedbackElement) {
                feedbackElement.textContent = "Registration successful! Waiting for admin...";
                feedbackElement.style.color = "#22c55e"; 
            }
            
            // ချက်ချင်း Noti တက်ခိုင်းမည်
            addNotification(
                `${mode.toUpperCase()} Registration Submitted`, 
                "မင်းရဲ့ Register တင်ထားမှု အောင်မြင်ပါတယ်။ Admin ဘက်က အတည်ပြုပေးသည်အထိ ခေတ္တစောင့်ဆိုင်းပေးပါ။"
            );

            // Registration ID သေချာပါလာမလာ စစ်မယ် (Server က registrationId ပို့ပေးသလို တချို့နေရာမှာ id ဖြစ်နေရင်လည်း ယူလို့ရအောင်)
            const regId = result.registrationId || result.id;
            console.log("Extracted Registration ID:", regId);

            if (regId) {
                console.log("Starting Polling Function...");
                startCheckingStatus(regId, currentUserId, mode);
            } else {
                console.error("Error: Registration ID is missing from API response!");
            }

        } else {
            if (feedbackElement) {
                feedbackElement.textContent = "Error: " + (result.message || "Registration failed");
                feedbackElement.style.color = "#ef4444"; 
            }
        }
    } catch (error) {
        console.error("Submit Error:", error);
        if (feedbackElement) {
            feedbackElement.textContent = "Network error occurred.";
            feedbackElement.style.color = "#ef4444";
        }
    }
}