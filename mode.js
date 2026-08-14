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
    
    const appContent = document.getElementById('app-content');

    switch(mode) {
        case '5vs5':
            appContent.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 14px 10px 14px; box-sizing: border-box; overflow-y: auto;">
                    <h2 style="color: #f8fafc; font-size: 16px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">5 vs 5 Registration</h2>
                    
                    <form id="reg-form" style="display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 340px; padding-bottom: 30px;">
                        
                        <!-- Top Row: Logo & Squad Name -->
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div style="display: flex; flex-direction: column; gap: 2px; width: 35%;">
                                <label style="color: #94a3b8; font-size: 10px; font-weight: 600;">Logo</label>
                                <input type="file" id="sq-logo" accept="image/*" required style="width: 100%; padding: 4px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #94a3b8; font-size: 10px; outline: none; box-sizing: border-box;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 2px; width: 65%;">
                                <label style="color: #94a3b8; font-size: 10px; font-weight: 600;">Squad Name</label>
                                <input type="text" id="sq-name" placeholder="Squad Name" required style="width: 100%; padding: 6px 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                            </div>
                        </div>

                        <!-- Players Lineup (Roam, Exp, Gold, Mid, Jungle) -->
                        <div style="display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #334155; border-bottom: 1px solid #334155; padding: 6px 0;">
                            <span style="color: #38bdf8; font-size: 11px; font-weight: 700;">Player Lineup (Name & ID)</span>
                            
                            <!-- Roam -->
                            <div style="display: flex; gap: 4px;">
                                <input type="text" placeholder="Roam Name" required style="width: 55%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                                <input type="text" placeholder="Roam ID" required style="width: 45%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                            </div>

                            <!-- Exp -->
                            <div style="display: flex; gap: 4px;">
                                <input type="text" placeholder="Exp Name" required style="width: 55%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                                <input type="text" placeholder="Exp ID" required style="width: 45%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                            </div>

                            <!-- Gold -->
                            <div style="display: flex; gap: 4px;">
                                <input type="text" placeholder="Gold Name" required style="width: 55%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                                <input type="text" placeholder="Gold ID" required style="width: 45%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                            </div>

                            <!-- Mid -->
                            <div style="display: flex; gap: 4px;">
                                <input type="text" placeholder="Mid Name" required style="width: 55%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                                <input type="text" placeholder="Mid ID" required style="width: 45%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                            </div>

                            <!-- Jungle -->
                            <div style="display: flex; gap: 4px;">
                                <input type="text" placeholder="Jungle Name" required style="width: 55%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                                <input type="text" placeholder="Jungle ID" required style="width: 45%; padding: 5px 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                            </div>
                        </div>

                        <!-- Payment & Contact Info (KPay Name, Ph-No, Contact, Fee) -->
                        <div style="display: flex; gap: 6px;">
                            <div style="display: flex; flex-direction: column; gap: 2px; width: 50%;">
                                <label style="color: #94a3b8; font-size: 10px; font-weight: 600;">KPay Name</label>
                                <input type="text" id="kpay-name" placeholder="KPay Name" required style="width: 100%; padding: 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 2px; width: 50%;">
                                <label style="color: #94a3b8; font-size: 10px; font-weight: 600;">KPay Ph No</label>
                                <input type="tel" id="kpay-ph" placeholder="KPay Ph No" required style="width: 100%; padding: 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                            </div>
                        </div>

                        <div style="display: flex; gap: 6px;">
                            <div style="display: flex; flex-direction: column; gap: 2px; width: 50%;">
                                <label style="color: #94a3b8; font-size: 10px; font-weight: 600;">Contact Ph</label>
                                <input type="tel" id="contact-ph" placeholder="Contact Ph" required style="width: 100%; padding: 6px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 11px; outline: none; box-sizing: border-box;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 2px; width: 50%;">
                                <label style="color: #94a3b8; font-size: 10px; font-weight: 600;">Entry Fee</label>
                                <input type="text" id="fee" value="Free / Paid" disabled style="width: 100%; padding: 6px; background-color: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #94a3b8; font-size: 11px; outline: none; box-sizing: border-box; text-align: center;">
                            </div>
                        </div>

                        <!-- Back & Next Buttons -->
                        <div style="display: flex; gap: 8px; margin-top: 4px;">
                            <button type="button" id="back-btn" onclick="renderModeScreen(document.getElementById('app-content'))" style="width: 50%; padding: 8px; background-color: #334155; color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">Back</button>
                            <button type="submit" style="width: 50%; padding: 8px; background-color: #38bdf8; color: #0f172a; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">Next</button>
                        </div>
                    </form>
                </div>
            `;
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