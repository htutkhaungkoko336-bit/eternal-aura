// Mode ရွေးချယ်သည့် မျက်နှာပြင်နှင့် လုပ်ဆောင်ချက်များကို ကိုင်တွယ်ရန်
export function renderModeScreen(container) {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 30px; width: 100%; height: 100%; padding: 2px 20px 10px 20px; box-sizing: border-box; overflow: hidden;">
            <h2 style="color: #f8fafc; font-size: 22px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Eternal Aura</h2>
            
            <div style="display: flex; flex-direction: column; gap: 30px; width: 100%; max-width: 320px;">
                
                <!-- 5vs5 Mode Card -->
                <div class="mode-card" data-mode="5vs5" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; cursor: pointer; padding-bottom: 6px; transition: 0.2s;">
                    <img src="5vs5modeEA.jpg" alt="5v5" style="width: 100%; height: 135px; object-fit: cover;">
                    <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 6px; background: linear-gradient(to right, #38bdf8, #e0f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">5 vs 5 Match</span>
                </div>

                <!-- 1vs1 Mode Card -->
                <div class="mode-card" data-mode="1vs1" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; cursor: pointer; padding-bottom: 6px; transition: 0.2s;">
                    <img src="1vs1modeEA.jpg" alt="1v1" style="width: 100%; height: 135px; object-fit: cover;">
                    <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 6px; background: linear-gradient(to right, #38bdf8, #e0f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">1 vs 1 Battle</span>
                </div>

                <!-- Tournament Mode Card -->
                <div class="mode-card" data-mode="tournament" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; cursor: pointer; padding-bottom: 6px; transition: 0.2s;">
                    <img src="tournmentEA.jpg" alt="Tournament" style="width: 100%; height: 135px; object-fit: cover;">
                    <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 6px; background: linear-gradient(to right, #38bdf8, #e0f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Tournament</span>
                </div>

            </div>
        </div>
    `;

    // ကတ်များကို နှိပ်သည့်အခါ လုပ်ဆောင်ချက်များ
    const modeCards = container.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const selectedMode = e.currentTarget.getAttribute('data-mode');
            handleModeSelection(selectedMode);
        });
    });
}

function handleModeSelection(mode) {
    console.log(`Selected Mode: ${mode}`);
    
    switch(mode) {
        case '5vs5':
            alert("You selected 5 vs 5 Mode!");
            break;
        case '1vs1':
            alert("You selected 1 vs 1 Mode!");
            break;
        case 'tournament':
            alert("You selected Tournament Mode!");
            break;
        default:
            break;
    }
}