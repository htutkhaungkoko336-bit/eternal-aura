// Mode ရွေးချယ်သည့် မျက်နှာပြင်နှင့် လုပ်ဆောင်ချက်များကို ကိုင်တွယ်ရန်
export function renderModeScreen(container) {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; width: 100%; padding: 20px;">
            <h2 style="color: white; font-size: 22px; margin-bottom: 5px;">Select Game Mode</h2>
            
            <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 340px;">
                
                <!-- 5vs5 Mode Card -->
                <div class="mode-card" data-mode="5vs5" style="position: relative; width: 100%; height: 110px; border-radius: 16px; overflow: hidden; cursor: pointer; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s;">
                    <img src="5vs5modeEA.jpg" alt="5v5" style="position: absolute; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);">
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent); display: flex; justify-content: space-between; align-items: flex-end;">
                        <span style="color: white; font-size: 18px; font-weight: bold;">5 vs 5 Match</span>
                        <span style="color: #38bdf8; font-size: 14px; font-weight: 500;">Select &rarr;</span>
                    </div>
                </div>

                <!-- 1vs1 Mode Card -->
                <div class="mode-card" data-mode="1vs1" style="position: relative; width: 100%; height: 110px; border-radius: 16px; overflow: hidden; cursor: pointer; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s;">
                    <img src="1vs1modeEA.jpg" alt="1v1" style="position: absolute; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);">
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent); display: flex; justify-content: space-between; align-items: flex-end;">
                        <span style="color: white; font-size: 18px; font-weight: bold;">1 vs 1 Battle</span>
                        <span style="color: #38bdf8; font-size: 14px; font-weight: 500;">Select &rarr;</span>
                    </div>
                </div>

                <!-- Tournament Mode Card -->
                <div class="mode-card" data-mode="tournament" style="position: relative; width: 100%; height: 110px; border-radius: 16px; overflow: hidden; cursor: pointer; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s;">
                    <img src="tournmentEA.jpg" alt="Tournament" style="position: absolute; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);">
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent); display: flex; justify-content: space-between; align-items: flex-end;">
                        <span style="color: white; font-size: 18px; font-weight: bold;">Tournament</span>
                        <span style="color: #38bdf8; font-size: 14px; font-weight: 500;">Select &rarr;</span>
                    </div>
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