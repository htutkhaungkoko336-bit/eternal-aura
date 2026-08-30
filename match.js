// match.js
import { renderModeScreen } from './mode.js';

let currentMode = "5vs5"; // ပုံသေ 5vs5 စတင်မည်

export function renderMatchScreen(container) {
    container.innerHTML = `
        <div style="padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; height: 100%; justify-content: space-between; position: relative; background: #0b0f19;">
            
            <!-- အပေါ်ပိုင်း အစိတ်အပိုင်းများ -->
            <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; margin-top: 5px;">
                
                <!-- Eternal Aura ပုံစံတူ Cyber City Style Header Box -->
                <div style="position: relative; border: 2px solid #38bdf8; border-radius: 4px; padding: 12px 16px; background-color: rgba(15, 23, 42, 0.8); text-align: center; width: 100%; box-sizing: border-box; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                    <div style="position: absolute; top: -3px; left: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                    <div style="position: absolute; bottom: -3px; right: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                    <span style="font-size: 15px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: block;">SELECT MATCH MODE</span>
                </div>

                <!-- Mode Switcher (Cyber City Style) -->
                <div style="display: flex; gap: 10px; width: 100%; background: #0f172a; padding: 4px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3); box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);">
                    <button id="mode-5v5-btn" class="match-mode-btn" data-mode="5vs5" style="flex: 1; padding: 12px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8; border-radius: 6px; font-weight: 800; font-size: 13px; cursor: pointer; text-align: center; text-shadow: 0 0 8px rgba(56, 189, 248, 0.6); box-shadow: 0 0 10px rgba(56, 189, 248, 0.25); transition: all 0.25s ease;">5 VS 5</button>
                    <button id="mode-1v1-btn" class="match-mode-btn" data-mode="1vs1" style="flex: 1; padding: 12px; background: transparent; color: #64748b; border: 1px solid #334155; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer; text-align: center; transition: all 0.25s ease;">1 VS 1</button>
                </div>

            </div>

            <!-- အောက်ဆုံး Action ခလုတ်များ (Cyber City ပုံစံတူ) -->
            <div style="display: flex; gap: 12px; width: 100%; margin-bottom: 0;">
                <button id="match-new-room-btn" style="flex: 1; position: relative; padding: 14px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; text-align: center; box-shadow: 0 0 12px rgba(56, 189, 248, 0.25); text-transform: uppercase; letter-spacing: 1.5px; transition: all 0.2s;">NEW ROOM</button>
                <button id="match-cancel-btn" style="flex: 1; position: relative; padding: 14px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; text-align: center; text-transform: uppercase; letter-spacing: 1.5px; transition: all 0.2s;">CANCEL</button>
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
        
        btn5v5.style.background = "rgba(56, 189, 248, 0.2)";
        btn5v5.style.color = "#38bdf8";
        btn5v5.style.border = "1px solid #38bdf8";
        btn5v5.style.textShadow = "0 0 8px rgba(56, 189, 248, 0.6)";
        btn5v5.style.boxShadow = "0 0 10px rgba(56, 189, 248, 0.25)";

        btn1v1.style.background = "transparent";
        btn1v1.style.color = "#64748b";
        btn1v1.style.border = "1px solid #334155";
        btn1v1.style.textShadow = "none";
        btn1v1.style.boxShadow = "none";
    });

    btn1v1.addEventListener('click', () => {
        currentMode = "1vs1";
        
        btn1v1.style.background = "rgba(56, 189, 248, 0.2)";
        btn1v1.style.color = "#38bdf8";
        btn1v1.style.border = "1px solid #38bdf8";
        btn1v1.style.textShadow = "0 0 8px rgba(56, 189, 248, 0.6)";
        btn1v1.style.boxShadow = "0 0 10px rgba(56, 189, 248, 0.25)";

        btn5v5.style.background = "transparent";
        btn5v5.style.color = "#64748b";
        btn5v5.style.border = "1px solid #334155";
        btn5v5.style.textShadow = "none";
        btn5v5.style.boxShadow = "none";
    });

    newRoomBtn.addEventListener('click', () => {
        alert(`Creating Room for ${currentMode}`);
    });

    cancelBtn.addEventListener('click', () => {
        renderModeScreen(container);
    });
}