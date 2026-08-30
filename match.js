// match.js
import { renderModeScreen } from './mode.js';

let currentMode = "5vs5"; // ပုံသေ 5vs5 စတင်မည်

export function renderMatchScreen(container) {
    container.innerHTML = `
        <div style="padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; height: 100%; justify-content: space-between; position: relative; padding-bottom: 90px; background: #0b0f19;">
            
            <!-- အပေါ်ဆုံး ခေါင်းစဉ် ဘောက်စ် (SYSTEM NOTIFICATIONS ပုံစံကဲ့သို့) -->
            <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                <div style="border: 1px solid #38bdf8; padding: 8px 24px; border-radius: 4px; background: rgba(15, 23, 42, 0.8); box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                    <span style="color: #38bdf8; font-weight: 900; font-size: 13px; letter-spacing: 1.5px; text-shadow: 0 0 8px rgba(56, 189, 248, 0.5);">SELECT MATCH MODE</span>
                </div>
            </div>

            <!-- အပေါ်ဘက် Cyber Mode ရွေးချယ်ရန် ခလုတ်များ (5 vs 5 / 1 vs 1) -->
            <div style="display: flex; gap: 12px; width: 100%; position: relative; z-index: 2; margin-bottom: 15px;">
                <button id="mode-5v5-btn" class="match-mode-btn" data-mode="5vs5" style="flex: 1; padding: 14px; background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(56, 189, 248, 0.3)); color: #38bdf8; border: 1px solid #38bdf8; border-radius: 6px; font-weight: 900; font-size: 14px; cursor: pointer; text-align: center; text-shadow: 0 0 8px #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.2); transition: all 0.3s;">⚡ 5 VS 5</button>
                <button id="mode-1v1-btn" class="match-mode-btn" data-mode="1vs1" style="flex: 1; padding: 14px; background: #0f172a; color: #64748b; border: 1px solid #1e293b; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer; text-align: center; transition: all 0.3s;">⚡ 1 VS 1</button>
            </div>

            <!-- အလယ် Content နေရာ (ပုံပါ Card ပုံစံ Cyber Box များနှင့်) -->
            <div id="match-content-area" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #94a3b8; font-size: 13px; margin-bottom: 15px;">
                
                <div style="width: 100%; border: 1px solid #1e3a8a; border-radius: 8px; background: #0f172a; padding: 14px 16px; box-shadow: inset 0 0 15px rgba(30, 58, 138, 0.2), 0 0 10px rgba(0, 0, 0, 0.5); display: flex; justify-content: space-between; align-items: center; position: relative;">
                    
                    <!-- ဘယ်ဘက် အချက်အလက် -->
                    <div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="width: 6px; height: 6px; background: #38bdf8; border-radius: 50%; box-shadow: 0 0 6px #38bdf8;"></span>
                            <span style="color: #f8fafc; font-weight: bold; font-size: 13px;">Active Protocol: <span id="selected-mode-text" style="color: #38bdf8;">5 VS 5</span></span>
                        </div>
                        <div style="font-size: 10px; color: #64748b; margin-top: 4px; margin-left: 12px;">STATUS: READY FOR DEPLOYMENT</div>
                    </div>

                    <!-- ညာဘက် ခလုတ်ပုံစံ (Clear ပုံစံ Card Action) -->
                    <div style="border: 1px solid #38bdf8; padding: 4px 12px; border-radius: 4px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; font-size: 10px; font-weight: bold; letter-spacing: 1px;">
                        SYNCED
                    </div>

                </div>

            </div>

            <!-- အောက်ခြေ Action ခလုတ်များ (New Room / Cancel) -->
            <div style="display: flex; gap: 12px; width: 100%; margin-top: auto; position: relative; z-index: 2;">
                <button id="match-new-room-btn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: 1px solid #34d399; border-radius: 6px; font-weight: 900; font-size: 14px; cursor: pointer; text-align: center; box-shadow: 0 0 15px rgba(16, 185, 129, 0.3); text-transform: uppercase; letter-spacing: 1px;">+ New Room</button>
                <button id="match-cancel-btn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: 1px solid #f87171; border-radius: 6px; font-weight: 900; font-size: 14px; cursor: pointer; text-align: center; box-shadow: 0 0 15px rgba(239, 68, 68, 0.3); text-transform: uppercase; letter-spacing: 1px;">[ X ] Cancel</button>
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
        
        btn5v5.style.background = "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(56, 189, 248, 0.3))";
        btn5v5.style.color = "#38bdf8";
        btn5v5.style.border = "1px solid #38bdf8";
        btn5v5.style.textShadow = "0 0 8px #38bdf8";
        btn5v5.style.boxShadow = "0 0 12px rgba(56, 189, 248, 0.2)";

        btn1v1.style.background = "#0f172a";
        btn1v1.style.color = "#64748b";
        btn1v1.style.border = "1px solid #1e293b";
        btn1v1.style.textShadow = "none";
        btn1v1.style.boxShadow = "none";

        if (modeText) modeText.textContent = "5 VS 5";
    });

    // 1 vs 1 ခလုတ်ကို နှိပ်လျှင်
    btn1v1.addEventListener('click', () => {
        currentMode = "1vs1";
        
        btn1v1.style.background = "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(56, 189, 248, 0.3))";
        btn1v1.style.color = "#38bdf8";
        btn1v1.style.border = "1px solid #38bdf8";
        btn1v1.style.textShadow = "0 0 8px #38bdf8";
        btn1v1.style.boxShadow = "0 0 12px rgba(56, 189, 248, 0.2)";

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