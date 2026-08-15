// notification.js

// Notification အသစ်တစ်ခုကို ထည့်သွင်းပေးမည့် Function
export function addNotification(notificationData) {
    let notifications = JSON.parse(localStorage.getItem('app_notifications')) || [];
    
    // အသစ်ပါလာမည့် Noti အချက်အလက်
    const newNoti = {
        id: Date.now(),
        title: notificationData.title || "Registration Pending",
        fee: notificationData.fee,
        mode: notificationData.mode,
        bo: notificationData.bo,
        message: `${notificationData.mode}အတွက် Fee ${notificationData.fee} ဖြင့် ${notificationData.bo} အတွက် registration တင်ထားပါသည်။ Admin မှ စစ်ဆေးပြီးလျှင် noti ပြန်တက်မည်။`,
        date: new Date().toLocaleDateString(),
        read: false
    };

    notifications.unshift(newNoti); // အသစ်ကို ထိပ်ဆုံးကနေ ထည့်မည်
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
}

// Notification Screen ကို Render လုပ်ရန်
export function renderNotificationScreen(container) {
    let notifications = JSON.parse(localStorage.getItem('app_notifications')) || [];

    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background-color: #0f172a; color: white; padding: 20px; box-sizing: border-box; overflow-y: auto;">
            <h2 style="font-size: 18px; margin-bottom: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">Notifications</h2>
            
            <div id="noti-list" style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
                ${notifications.length === 0 ? `
                    <div style="text-align: center; color: #64748b; margin-top: 50px;">Notification တစ်စုံတစ်ရာ မရှိသေးပါ။</div>
                ` : notifications.map(noti => `
                    <div class="noti-item" data-id="${noti.id}" style="background-color: #1e293b; border: 1px solid ${noti.read ? '#334155' : '#38bdf8'}; padding: 14px; border-radius: 12px; cursor: pointer; transition: 0.2s;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-weight: bold; font-size: 14px; color: ${noti.read ? '#cbd5e1' : '#38bdf8'};">${noti.title}</span>
                            <span style="font-size: 10px; color: #64748b;">${noti.date}</span>
                        </div>
                        <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                            ${noti.mode} • Fee: ${noti.fee} • ${noti.bo}
                        </p>
                        
                        <!-- နှိပ်မှ မြင်ရမည့် အသေးစိတ် Message -->
                        <div class="noti-details" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #334155; font-size: 12px; color: #e2e8f0; line-height: 1.4;">
                            ${noti.message}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Notification တစ်ခုချင်းစီကို နှိပ်တဲ့အခါ အသေးစိတ်စာသား ပေါ်လာစေရန်နဲ့ Read ဖြစ်သွားစေရန်
    const notiItems = container.querySelectorAll('.noti-item');
    notiItems.forEach(item => {
        item.addEventListener('click', () => {
            const details = item.querySelector('.noti-details');
            const id = item.getAttribute('data-id');
            
            // Toggle view details
            if (details.style.display === 'none') {
                details.style.display = 'block';
                item.style.borderColor = '#334155';
                
                // Read status update
                notifications = notifications.map(n => {
                    if (n.id == id) n.read = true;
                    return n;
                });
                localStorage.setItem('app_notifications', JSON.stringify(notifications));
                const titleSpan = item.querySelector('span');
                if(titleSpan) titleSpan.style.color = '#cbd5e1';
            } else {
                details.style.display = 'none';
            }
        });
    });
}