// notification.js

import { db } from './firebase.js'; // (ညီမလေးရဲ့ Project ထဲက firebase config နေရာအတိုင်း ချိန်ပေးပါ)
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js"; // သို့မဟုတ် ညီမလေးသုံးနေတဲ့ firebase import အတိုင်း

// Firebase Database မှ Noti အသစ်များကို လှမ်းဆွဲယူပြီး LocalStorage ထဲ ပေါင်းထည့်ရန်
export async function syncUserNotifications(userId) {
    if (!userId) return;
    try {
        const notiRef = collection(db, 'notifications');
        const q = query(notiRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        let dbNotis = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            dbNotis.push({
                title: data.title,
                message: data.message,
                dateStr: data.dateStr,
                timeStr: data.timeStr,
                createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()
            });
        });

        if (dbNotis.length > 0) {
            // LocalStorage ထဲရှိပြီးသား Noti များနှင့် Database မှ Noti များကို ပေါင်းစပ်ခြင်း (Duplicate ဖြစ်မှုကို ခေါင်းစဉ်နှင့် အချိန်ဖြင့် စစ်ဆေးခြင်း)
            let localNotis = JSON.parse(localStorage.getItem('app_notifications')) || [];
            
            dbNotis.forEach(dbNoti => {
                const exists = localNotis.some(local => 
                    local.title === dbNoti.title && local.message === dbNoti.message && local.dateStr === dbNoti.dateStr
                );
                if (!exists) {
                    localNotis.push(dbNoti);
                }
            });

            // နေ့စွဲအသစ်အရ အပေါ်ဆုံးသို့ ရောက်အောင် စီခြင်း (Sort by createdAt or date)
            localNotis.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

            localStorage.setItem('app_notifications', JSON.stringify(localNotis));
        }
    } catch (error) {
        console.error("Error syncing notifications:", error);
    }
}

// Notification အသစ်တစ်ခုကို သိမ်းဆည်းပြီး Render လုပ်ရန်
export function addNotification(title, message) {
    const now = new Date();
    
    // မြန်မာစံတော်ချိန် (Local Time) အရ နေ့စွဲ (YYYY-MM-DD) တိကျစွာ ထုတ်ယူရန်
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

    const newNoti = { title, message, dateStr, timeStr, createdAt: now.getTime() };

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

// Notification Screen ကို ဝင်ရောက်ကြည့်ရှုသည့်အခါ Firebase မှပါ sync လုပ်ပြီး Badge ရှင်းလင်းပေးရန်
export async function renderNotificationScreen(container) {
    const userId = localStorage.getItem('userId'); // ညီမလေး App ထဲမှာ User ID သိမ်းထားတဲ့ Key နာမည်နဲ့ ချိန်ပါ
    if (userId) {
        await syncUserNotifications(userId); // Database မှ Noti အသစ်များကို လှမ်းဆွဲယူမည်
    }

    localStorage.setItem('app_unread_count', '0');
    updateNotificationBadge();

    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background-color: #0b0f19; box-sizing: border-box; overflow: hidden;">
            
            <!-- Modern Tech Header -->
            <div style="flex-shrink: 0; background-color: #0b0f19; padding: 12px 16px 10px 16px; box-sizing: border-box; border-bottom: 1px solid #1e293b; z-index: 10; display: flex; justify-content: center; align-items: center;">
                <div style="position: relative; padding: 8px 20px; background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1)); border: 2px solid #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); text-align: center; border-radius: 4px;">
                    <div style="position: absolute; top: -2px; left: -2px; width: 6px; height: 6px; background: #38bdf8;"></div>
                    <div style="position: absolute; bottom: -2px; right: -2px; width: 6px; height: 6px; background: #818cf8;"></div>
                    <h2 style="font-size: 15px; font-weight: 800; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">
                        System Notifications
                    </h2>
                </div>
            </div>

            <!-- Notifications List Container -->
            <div id="notification-list-container" style="display: flex; flex-direction: column; gap: 15px; width: 100%; padding: 15px 20px 120px 20px; box-sizing: border-box; overflow-y: auto; flex-grow: 1; min-height: 0;">
            </div>
        </div>
    `;

    const listContainer = document.getElementById('notification-list-container');
    const notifications = JSON.parse(localStorage.getItem('app_notifications')) || [];
    
    renderNotificationCards(listContainer, notifications);
}

// Notification Bell လေးရဲ့ အပေါ်တည့်တည့်တွင် Badge ပြသရန် Function
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

// Card များကို HTML ထဲ ထည့်သွင်းပေးသည့် Helper Function
function renderNotificationCards(container, notifications) {
    if (notifications.length === 0) {
        container.innerHTML = `<p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 30px;">No new notifications.</p>`;
        return;
    }

    container.innerHTML = '';
    notifications.forEach((noti, index) => {
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
                        <h3 style="color: #f8fafc; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">${noti.title}</h3>
                    </div>
                    <!-- ရိုးရိုးရှင်းရှင်းနှင့် သပ်ရပ်သော နေ့စွဲနှင့် အချိန်ဖော်ပြချက် -->
                    <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0 16px; font-family: monospace; letter-spacing: 0.5px;">${noti.dateStr} &nbsp;&bull;&nbsp; ${noti.timeStr}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="delete-btn" title="Clear Notification" style="background: rgba(56, 189, 248, 0.1); border: 1px solid #38bdf8; color: #38bdf8; cursor: pointer; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 4px; transition: all 0.2s; letter-spacing: 0.5px;">CLEAR</button>
                    <span class="toggle-icon" style="color: #38bdf8; font-size: 14px; font-weight: bold; transition: transform 0.3s;">▼</span>
                </div>
            </div>

            <div class="noti-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease, margin-top 0.3s ease; border-top: 1px solid transparent;">
                <div style="padding-top: 12px; margin-top: 10px; border-top: 1px dashed #334155; color: #cbd5e1; font-size: 13px; line-height: 1.6; padding-bottom: 5px;">
                    <p style="margin: 0;">${noti.message}</p>
                </div>
            </div>
        `;

        const headerEl = card.querySelector('.noti-header');
        headerEl.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) return;
            const body = card.querySelector('.noti-body');
            const icon = card.querySelector('.toggle-icon');
            
            const isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
            
            if (isOpen) {
                body.style.maxHeight = '0px';
                icon.style.transform = 'rotate(0deg)';
            } else {
                body.style.maxHeight = '1200px'; 
                icon.style.transform = 'rotate(180deg)';
            }
        });

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

document.addEventListener('DOMContentLoaded', () => {
    updateNotificationBadge();
});