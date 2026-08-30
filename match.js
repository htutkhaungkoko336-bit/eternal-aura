// match.js
import { renderModeScreen } from './mode.js';

let currentMode = "5vs5"; // ပုံသေ 5vs5 စတင်မည်

export function renderMatchScreen(container) {
    container.innerHTML = `
        <div style="padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; height: 100%; justify-content: space-between; position: relative; padding-bottom: 90px;">
            
            <!-- အပေါ်ဘက် Mode ရွေးချယ်ရန် ခလုတ်များ (5 vs 5 / 1 vs 1) -->
            <div style="display: flex; gap: 12px; width: 100%;">
                <button id="mode-5v5-btn" class="match-mode-btn" data-mode="5vs5" style="flex: 1; padding: 14px; background: #38bdf8; color: #0f172a; border: none; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; text-align: center;">5 vs 5</button>
                <button id="mode-1v1-btn" class="match-mode-btn" data-mode="1vs1" style="flex: 1; padding: 14px; background: #1e293b; color: #f8fafc; border: 1px solid #334155; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; text-align: center;">1 vs 1</button>
            </div>

            <!-- အလယ် Content နေရာ (Room စာရင်းများ သို့မဟုတ် လွတ်နေမည့်နေရာ) -->
            <div id="match-content-area" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #94a3b8; font-size: 13px; margin: 20px 0;">
                <div style="text-align: center;">Selected Mode: <span id="selected-mode-text" style="color: #38bdf8; font-weight: bold;">5 vs 5</span></div>
            </div>

            <!-- အောက်ခြေ Action ခလုတ်များ (New Room / Cancel) -->
            <div style="display: flex; gap: 12px; width: 100%; margin-top: auto;">
                <button id="match-new-room-btn" style="flex: 1; padding: 14px; background: #22c55e; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; text-align: center;">New Room</button>
                <button id="match-cancel-btn" style="flex: 1; padding: 14px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; text-align: center;">Cancel</button>
            </div>

        </div>
    `;

    setupMatchEvents(container);
}

function setupMatchEvents(container) {
    const btn5v5 = document.getElementById('mode-5v5-btn');
    const btn1v1 = document.getElementById('mode-1v1-btn');
    const modeText = document.getElementById('selected-mode-text');
    
    const newRoomBtn = document.getElementById('match-new-room-btn');
    const cancelBtn = document.getElementById('match-cancel-btn');

    // 5 vs 5 ခလုတ်ကို နှိပ်လျှင်
    btn5v5.addEventListener('click', () => {
        currentMode = "5vs5";
        btn5v5.style.background = "#38bdf8";
        btn5v5.style.color = "#0f172a";
        btn5v5.style.border = "none";

        btn1v1.style.background = "#1e293b";
        btn1v1.style.color = "#f8fafc";
        btn1v1.style.border = "1px solid #334155";

        if (modeText) modeText.textContent = "5 vs 5";
    });

    // 1 vs 1 ခလုတ်ကို နှိပ်လျှင်
    btn1v1.addEventListener('click', () => {
        currentMode = "1vs1";
        btn1v1.style.background = "#38bdf8";
        btn1v1.style.color = "#0f172a";
        btn1v1.style.border = "none";

        btn5v5.style.background = "#1e293b";
        btn5v5.style.color = "#f8fafc";
        btn5v5.style.border = "1px solid #334155";

        if (modeText) modeText.textContent = "1 vs 1";
    });

    // New Room ခလုတ်ကို နှိပ်လျှင် Form သို့မဟုတ် လုပ်ဆောင်ချက်ဆီ သွားရန်
    newRoomBtn.addEventListener('click', () => {
        alert(`Creating a new room for ${currentMode}`);
        // လိုအပ်ပါက register.js သို့မဟုတ် အခြား form သို့ ဒီနေရာတွင် ချိတ်နိုင်ပါသည်
    });

    // Cancel ခလုတ်ကို နှိပ်လျှင် Mode Screen ဆီ ပြန်သွားရန်
    cancelBtn.addEventListener('click', () => {
        renderModeScreen(container);
    });
}