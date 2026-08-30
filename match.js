// match.js
import { renderModeScreen } from './mode.js';

let currentMode = "5vs5"; // ပုံသေ 5vs5 စတင်မည်

export function renderMatchScreen(container) {
    container.innerHTML = `
        <div style="padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; height: 100%; justify-content: space-between; position: relative; padding-bottom: 90px; background: radial-gradient(circle at center, #090d16 0%, #030712 100%);">
            
            <!-- Cyber Header Accent Line -->
            <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 60%; height: 2px; background: linear-gradient(90deg, transparent, #00f3ff, transparent); box-shadow: 0 0 10px #00f3ff;"></div>

            <!-- အပေါ်ဘက် Cyber Mode ရွေးချယ်ရန် ခလုတ်များ (5 vs 5 / 1 vs 1) -->
            <div style="display: flex; gap: 12px; width: 100%; position: relative; z-index: 2;">
                <button id="mode-5v5-btn" class="match-mode-btn" data-mode="5vs5" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #00f3ff22, #00f3ff44); color: #00f3ff; border: 1px solid #00f3ff; border-radius: 4px; font-weight: 900; font-size: 14px; cursor: pointer; text-align: center; text-shadow: 0 0 8px #00f3ff; box-shadow: 0 0 15px rgba(0, 243, 255, 0.2); transition: all 0.3s;">⚡ 5 VS 5</button>
                <button id="mode-1v1-btn" class="match-mode-btn" data-mode="1vs1" style="flex: 1; padding: 14px; background: #0f172a; color: #64748b; border: 1px solid #1e293b; border-radius: 4px; font-weight: bold; font-size: 14px; cursor: pointer; text-align: center; transition: all 0.3s;">⚡ 1 VS 1</button>
            </div>

            <!-- အလယ် Cyber Grid Content နေရာ -->
            <div id="match-content-area" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #94a3b8; font-size: 13px; margin: 20px 0; border: 1px dashed #1e293b; border-radius: 8px; background: rgba(15, 23, 42, 0.4); position: relative; overflow: hidden;">
                
                <!-- Cyber Corner Decors -->
                <div style="position: absolute; top: 5px; left: 5px; width: 8px; height: 8px; border-top: 2px solid #00f3ff; border-left: 2px solid #00f3ff;"></div>
                <div style="position: absolute; top: 5px; right: 5px; width: 8px; height: 8px; border-top: 2px solid #00f3ff; border-right: 2px solid #00f3ff;"></div>
                <div style="position: absolute; bottom: 5px; left: 5px; width: 8px; height: 8px; border-bottom: 2px solid #00f3ff; border-left: 2px solid #00f3ff;"></div>
                <div style="position: absolute; bottom: 5px; right: 5px; width: 8px; height: 8px; border-bottom: 2px solid #00f3ff; border-right: 2px solid #00f3ff;"></div>

                <div style="text-align: center; letter-spacing: 1px;">ACTIVE PROTOCOL: <span id="selected-mode-text" style="color: #00f3ff; font-weight: bold; text-shadow: 0 0 5px #00f3ff;">5 VS 5</span></div>
                <div style="font-size: 10px; color: #475569; margin-top: 5px;">AWAITING NETWORK SYNC...</div>
            </div>

            <!-- အောက်ခြေ Cyber Action ခလုတ်များ (New Room / Cancel) -->
            <div style="display: flex; gap: 12px; width: 100%; margin-top: auto; position: relative; z-index: 2;">
                <button id="match-new-room-btn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: 1px solid #34d399; border-radius: 4px; font-weight: 900; font-size: 14px; cursor: pointer; text-align: center; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); text-transform: uppercase; letter-spacing: 1px;">+ New Room</button>
                <button id="match-cancel-btn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: 1px solid #f87171; border-radius: 4px; font-weight: 900; font-size: 14px; cursor: pointer; text-align: center; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); text-transform: uppercase; letter-spacing: 1px;">[ X ] Cancel</button>
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

    // 5 vs 5 ခလုတ်ကို နှိပ်လျှင် (Cyber Neon Active Style)
    btn5v5.addEventListener('click', () => {
        currentMode = "5vs5";
        
        btn5v5.style.background = "linear-gradient(135deg, #00f3ff22, #00f3ff44)";
        btn5v5.style.color = "#00f3ff";
        btn5v5.style.border = "1px solid #00f3ff";
        btn5v5.style.textShadow = "0 0 8px #00f3ff";
        btn5v5.style.boxShadow = "0 0 15px rgba(0, 243, 255, 0.2)";

        btn1v1.style.background = "#0f172a";
        btn1v1.style.color = "#64748b";
        btn1v1.style.border = "1px solid #1e293b";
        btn1v1.style.textShadow = "none";
        btn1v1.style.boxShadow = "none";

        if (modeText) modeText.textContent = "5 VS 5";
    });

    // 1 vs 1 ခလုတ်ကို နှိပ်လျှင် (Cyber Neon Active Style)
    btn1v1.addEventListener('click', () => {
        currentMode = "1vs1";
        
        btn1v1.style.background = "linear-gradient(135deg, #00f3ff22, #00f3ff44)";
        btn1v1.style.color = "#00f3ff";
        btn1v1.style.border = "1px solid #00f3ff";
        btn1v1.style.textShadow = "0 0 8px #00f3ff";
        btn1v1.style.boxShadow = "0 0 15px rgba(0, 243, 255, 0.2)";

        btn5v5.style.background = "#0f172a";
        btn5v5.style.color = "#64748b";
        btn5v5.style.border = "1px solid #1e293b";
        btn5v5.style.textShadow = "none";
        btn5v5.style.boxShadow = "none";

        if (modeText) modeText.textContent = "1 VS 1";
    });

    newRoomBtn.addEventListener('click', () => {
        alert(`Initializing Cyber Room for ${currentMode}...`);
    });

    cancelBtn.addEventListener('click', () => {
        renderModeScreen(container);
    });
}