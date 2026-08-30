// match.js
import { renderModeScreen } from './mode.js';

let currentMode = "5vs5"; // ပုံသေ 5vs5 စတင်မည်

export function renderMatchScreen(container) {
    container.innerHTML = `
        <div style="padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; height: 100%; justify-content: space-between; position: relative; background: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <!-- အပေါ်ပိုင်း အစိတ်အပိုင်းများ -->
            <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; margin-top: 5px;">
                
                <!-- iOS Style Header -->
                <div style="display: flex; justify-content: center; width: 100%;">
                    <div style="border: 1px solid #38bdf8; width: 100%; padding: 14px; border-radius: 14px; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(10px); box-shadow: 0 0 12px rgba(56, 189, 248, 0.25); text-align: center;">
                        <span style="color: #38bdf8; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-shadow: 0 0 8px rgba(56, 189, 248, 0.5);">SELECT MATCH MODE</span>
                    </div>
                </div>

                <!-- iOS Segmented Control Style Mode Switcher -->
                <div style="display: flex; gap: 10px; width: 100%; background: #0f172a; padding: 4px; border-radius: 14px; border: 1px solid rgba(56, 189, 248, 0.2); box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);">
                    <button id="mode-5v5-btn" class="match-mode-btn" data-mode="5vs5" style="flex: 1; padding: 12px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #38bdf8; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; text-align: center; text-shadow: 0 0 8px #38bdf8; box-shadow: 0 0 10px rgba(56, 189, 248, 0.2); transition: all 0.25s ease;">5 VS 5</button>
                    <button id="mode-1v1-btn" class="match-mode-btn" data-mode="1vs1" style="flex: 1; padding: 12px; background: transparent; color: #64748b; border: 1px solid transparent; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; text-align: center; transition: all 0.25s ease;">1 VS 1</button>
                </div>

            </div>

            <!-- အောက်ဆုံး Action ခလုတ်များ (iOS Style) -->
            <div style="display: flex; gap: 12px; width: 100%; margin-bottom: 0;">
                <button id="match-new-room-btn" style="flex: 1; padding: 14px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; text-align: center; box-shadow: 0 0 12px rgba(56, 189, 248, 0.25); text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s;">NEW ROOM</button>
                <button id="match-cancel-btn" style="flex: 1; padding: 14px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; font-weight: 600; font-size: 13px; cursor: pointer; text-align: center; text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s;">CANCEL</button>
            </div>

        </div>
    `;

    setupMatchEvents(container);
}

function setupMatchEvents(container) {
    const btn5v5 = document.getElementById('mode-5v5-btn');
    const btn1v1 = document.getElementById('mode-1v1-btn');
    
    const newRoomBtn = document.getElementById('match-new-room-btn');
    const cancelBtn = document.getElementById('match-cancel-btn');

    btn5v5.addEventListener('click', () => {
        currentMode = "5vs5";
        
        btn5v5.style.background = "rgba(56, 189, 248, 0.15)";
        btn5v5.style.color = "#38bdf8";
        btn5v5.style.border = "1px solid #38bdf8";
        btn5v5.style.textShadow = "0 0 8px #38bdf8";
        btn5v5.style.boxShadow = "0 0 10px rgba(56, 189, 248, 0.2)";

        btn1v1.style.background = "transparent";
        btn1v1.style.color = "#64748b";
        btn1v1.style.border = "1px solid transparent";
        btn1v1.style.textShadow = "none";
        btn1v1.style.boxShadow = "none";
    });

    btn1v1.addEventListener('click', () => {
        currentMode = "1vs1";
        
        btn1v1.style.background = "rgba(56, 189, 248, 0.15)";
        btn1v1.style.color = "#38bdf8";
        btn1v1.style.border = "1px solid #38bdf8";
        btn1v1.style.textShadow = "0 0 8px #38bdf8";
        btn1v1.style.boxShadow = "0 0 10px rgba(56, 189, 248, 0.2)";

        btn5v5.style.background = "transparent";
        btn5v5.style.color = "#64748b";
        btn5v5.style.border = "1px solid transparent";
        btn5v5.style.textShadow = "none";
        btn5v5.style.boxShadow = "none";
    });

    newRoomBtn.addEventListener('click', () => {
        alert(`Creating Room for ${currentMode}`);
    });

    cancelBtn.addEventListener('click', () => {
        alert("Action Cancelled");
    });
}