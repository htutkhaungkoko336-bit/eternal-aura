// match.js
import { renderModeScreen } from './mode.js';

let currentMode = "5vs5"; // ပုံသေ 5vs5 စတင်မည်

export function renderMatchScreen(container) {
    container.innerHTML = `
        <div style="padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; height: 100%; justify-content: space-between; position: relative; padding-bottom: 90px; background: #0b0f19;">
            
            <!-- Header Section (Cyan Glowing Border) -->
            <div style="display: flex; justify-content: center; width: 100%; margin-bottom: 16px;">
                <div style="border: 1px solid #38bdf8; width: 100%; padding: 12px; border-radius: 12px; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(10px); box-shadow: 0 0 12px rgba(56, 189, 248, 0.25); text-align: center;">
                    <span style="color: #38bdf8; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-shadow: 0 0 8px rgba(56, 189, 248, 0.5);">SELECT MATCH MODE</span>
                </div>
            </div>

            <!-- iOS Segmented Control Style Mode Switcher -->
            <div style="display: flex; gap: 10px; width: 100%; background: #0f172a; padding: 4px; border-radius: 14px; border: 1px solid rgba(56, 189, 248, 0.2); box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);">
                <button id="mode-5v5-btn" class="match-mode-btn" data-mode="5vs5" style="flex: 1; padding: 12px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #38bdf8; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; text-align: center; text-shadow: 0 0 8px #38bdf8; box-shadow: 0 0 10px rgba(56, 189, 248, 0.2); transition: all 0.25s ease;">⚡ 5 VS 5</button>
                <button id="mode-1v1-btn" class="match-mode-btn" data-mode="1vs1" style="flex: 1; padding: 12px; background: transparent; color: #64748b; border: 1px solid transparent; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; text-align: center; transition: all 0.25s ease;">⚡ 1 VS 1</button>
            </div>

            <!-- Content Card (Matching Cyan Glow Card) -->
            <div id="match-content-area" style="flex: 1; display: flex; flex-direction: column; justify-content: center; margin: 16px 0;">
                <div style="width: 100%; border: 1px solid #38bdf8; border-radius: 14px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); padding: 16px; box-sizing: border-box; box-shadow: 0 0 15px rgba(56, 189, 248, 0.15), inset 0 0 15px rgba(56, 189, 248, 0.05); display: flex; justify-content: space-between; align-items: center;">
                    
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="width: 8px; height: 8px; background: #38bdf8; border-radius: 50%; box-shadow: 0 0 8px #38bdf8;"></span>
                            <span style="color: #f8fafc; font-weight: 600; font-size: 13px;">Active Mode: <span id="selected-mode-text" style="color: #38bdf8; font-weight: 700;">5 VS 5</span></span>
                        </div>
                        <div style="font-size: 11px; color: #64748b; margin-top: 6px; margin-left: 16px; letter-spacing: 0.5px;">STATUS: READY FOR MATCHMAKING</div>
                    </div>

                    <div style="border: 1px solid #38bdf8; padding: 6px 14px; border-radius: 8px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; font-size: 11px; font-weight: 700; letter-spacing: 1px; box-shadow: 0 0 8px rgba(56, 189, 248, 0.2);">
                        SYNCED
                    </div>

                </div>
            </div>

            <!-- iOS Dual Action Buttons (Pure Cyan Blue Palette) -->
            <div style="display: flex; gap: 12px; width: 100%; margin-top: auto;">
                <button id="match-new-room-btn" style="flex: 1; padding: 14px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; text-align: center; box-shadow: 0 0 12px rgba(56, 189, 248, 0.25); text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s;">+ New Room</button>
                <button id="match-cancel-btn" style="flex: 1; padding: 14px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; font-weight: 600; font-size: 13px; cursor: pointer; text-align: center; text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s;">Cancel</button>
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

        if (modeText) modeText.textContent = "5 VS 5";
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

        if (modeText) modeText.textContent = "1 VS 1";
    });

    newRoomBtn.addEventListener('click', () => {
        alert(`Creating Room for ${currentMode}`);
    });

    cancelBtn.addEventListener('click', () => {
        renderModeScreen(container);
    });
}