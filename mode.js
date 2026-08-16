// mode.js
import { renderRegisterForm } from './register.js';
import { renderRegister1v1Form } from './register-1v1.js'; // 1v1 ဖိုင်ကို import လုပ်ခြင်း

export function renderModeScreen(container) {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 20px; width: 100%; height: 100%; padding: 4px 20px 10px 20px; box-sizing: border-box; overflow-y: auto;">
            
            <!-- Eternal Aura Header Box with Corner Accents -->
            <div style="position: relative; border: 2px solid #38bdf8; border-radius: 4px; padding: 8px 16px; margin-bottom: 6px; background-color: rgba(15, 23, 42, 0.8); text-align: center; width: 100%; max-width: 320px; box-sizing: border-box; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                <!-- Corner cut accents using the same blue accent color (#38bdf8) -->
                <div style="position: absolute; top: -3px; left: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                <div style="position: absolute; bottom: -3px; right: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                
                <h2 style="color: #f8fafc; font-size: 20px; font-weight: 800; letter-spacing: 1px; margin: 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Eternal Aura</h2>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 320px; padding-bottom: 20px;">
                
                <div class="mode-card" data-mode="5vs5" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; cursor: pointer; padding-bottom: 6px; transition: 0.2s;">
                    <img src="5vs5modeEA.jpg" alt="5v5" style="width: 100%; height: 135px; object-fit: cover;">
                    <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 6px; background: linear-gradient(to right, #38bdf8, #e0f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">5 vs 5 Match</span>
                </div>

                <div class="mode-card" data-mode="1vs1" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; cursor: pointer; padding-bottom: 6px; transition: 0.2s;">
                    <img src="1vs1modeEA.jpg" alt="1v1" style="width: 100%; height: 135px; object-fit: cover;">
                    <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 6px; background: linear-gradient(to right, #38bdf8, #e0f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">1 vs 1 Battle</span>
                </div>

                <div class="mode-card" data-mode="tournament" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; cursor: pointer; padding-bottom: 6px; transition: 0.2s;">
                    <img src="tournmentEA.jpg" alt="Tournament" style="width: 100%; height: 135px; object-fit: cover;">
                    <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 6px; background: linear-gradient(to right, #38bdf8, #e0f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Tournament</span>
                </div>

            </div>
        </div>
    `;

    const modeCards = container.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const selectedMode = e.currentTarget.getAttribute('data-mode');
            handleModeSelection(selectedMode, container);
        });
    });
}

function handleModeSelection(mode, container) {
    switch(mode) {
        case '5vs5':
            renderRegisterForm(container);
            break;
        case '1vs1':
            renderRegister1v1Form(container); // 1vs1 Form ဖိုင်ဆီသို့ တိုက်ရိုက်ချိတ်ဆက်ပေးလိုက်ပါပြီ
            break;
        case 'tournament':
            alert("You selected Tournament Mode!");
            break;
    }
}