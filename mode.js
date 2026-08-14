// Mode ရွေးချယ်သည့် မျက်နှာပြင်နှင့် လုပ်ဆောင်ချက်များကို ကိုင်တွယ်ရန်
export function renderModeScreen(container) {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 14px; width: 100%; height: 100%; padding: 15px 20px; box-sizing: border-box; overflow: hidden;">
            <h2 style="color: white; font-size: 20px; margin: 0 0 5px 0;">Select Game Mode</h2>
            
            <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 320px;">
                
                <!-- 5vs5 Mode Card -->
                <div class="mode-card" data-mode="5vs5" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 14px; overflow: hidden; cursor: pointer; padding-bottom: 8px; transition: 0.2s;">
                    <img src="5vs5modeEA.jpg" alt="5v5" style="width: 100%; height: 98px; object-fit: cover;">
                    <span style="color: white; font-size: 14px; font-weight: 600; margin-top: 6px;">5 vs 5 Match</span>
                </div>

                <!-- 1vs1 Mode Card -->
                <div class="mode-card" data-mode="1vs1" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 14px; overflow: hidden; cursor: pointer; padding-bottom: 8px; transition: 0.2s;">
                    <img src="1vs1modeEA.jpg" alt="1v1" style="width: 100%; height: 98px; object-fit: cover;">
                    <span style="color: white; font-size: 14px; font-weight: 600; margin-top: 6px;">1 vs 1 Battle</span>
                </div>

                <!-- Tournament Mode Card -->
                <div class="mode-card" data-mode="tournament" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 14px; overflow: hidden; cursor: pointer; padding-bottom: 8px; transition: 0.2s;">
                    <img src="tournmentEA.jpg" alt="Tournament" style="width: 100%; height: 98px; object-fit: cover;">
                    <span style="color: white; font-size: 14px; font-weight: 600; margin-top: 6px;">Tournament</span>
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