// Mode ရွေးချယ်သည့် မျက်နှာပြင်နှင့် လုပ်ဆောင်ချက်များကို ကိုင်တွယ်ရန်
export function renderModeScreen(container) {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; width: 100%; padding: 20px;">
            <h2 style="color: white; font-size: 22px; margin-bottom: 10px;">Select Game Mode</h2>
            
            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 350px;">
                <!-- 5vs5 Mode -->
                <button class="mode-btn" data-mode="5vs5" style="background-color: #1e293b; color: white; border: 1px solid #334155; padding: 16px 20px; border-radius: 16px; font-size: 16px; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; transition: 0.3s;">
                    <span>⚔️ 5 vs 5 Match</span>
                    <span style="color: #94a3b8; font-size: 14px;">Select &rarr;</span>
                </button>

                <!-- 1vs1 Mode -->
                <button class="mode-btn" data-mode="1vs1" style="background-color: #1e293b; color: white; border: 1px solid #334155; padding: 16px 20px; border-radius: 16px; font-size: 16px; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; transition: 0.3s;">
                    <span>🛡️ 1 vs 1 Battle</span>
                    <span style="color: #94a3b8; font-size: 14px;">Select &rarr;</span>
                </button>

                <!-- Tournament Mode -->
                <button class="mode-btn" data-mode="tournament" style="background-color: #1e293b; color: white; border: 1px solid #334155; padding: 16px 20px; border-radius: 16px; font-size: 16px; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; transition: 0.3s;">
                    <span>🏆 Tournament</span>
                    <span style="color: #94a3b8; font-size: 14px;">Select &rarr;</span>
                </button>
            </div>
        </div>
    `;

    // ခလုတ်တစ်ခုချင်းစီအတွက် Event Listener များ ချိတ်ဆက်ခြင်း
    const modeButtons = container.querySelectorAll('.mode-btn');
    modeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedMode = e.currentTarget.getAttribute('data-mode');
            handleModeSelection(selectedMode);
        });
    });
}

// ရွေးချယ်လိုက်သော Mode အပေါ်မူတည်၍ ရှေ့ဆက် လုပ်ဆောင်မည့် အပိုင်း
function handleModeSelection(mode) {
    console.log(`Selected Mode: ${mode}`);
    
    switch(mode) {
        case '5vs5':
            alert("You selected 5 vs 5 Mode!");
            // 5vs5 ဆိုင်ရာ လုပ်ဆောင်ချက် သို့မဟုတ် မျက်နှာပြင်သို့ ပို့ရန်
            break;
        case '1vs1':
            alert("You selected 1 vs 1 Mode!");
            // 1vs1 ဆိုင်ရာ လုပ်ဆောင်ချက်သို့ ပို့ရန်
            break;
        case 'tournament':
            alert("You selected Tournament Mode!");
            // Tournament ဆိုင်ရာ လုပ်ဆောင်ချက်သို့ ပို့ရန်
            break;
        default:
            break;
    }
}