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
                    <h2 style="color: #f8fafc; font-size: 20px; font-weight: 800; letter-spacing: 1px; margin: 0 0 10px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">5 vs 5 Registration</h2>
                    
                    <form id="reg-form" style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 340px; padding-bottom: 30px;">
                        
                        <style>
                            .reg-input:focus, .reg-logo-box:hover {
                                border-color: #38bdf8 !important;
                                box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
                            }
                            .fee-option:hover {
                                background-color: #334155 !important;
                                color: #38bdf8 !important;
                            }
                        </style>

                        <!-- Top Row: Square Logo Box & Squad Name Side by Side -->
                        <div style="display: flex; gap: 12px; align-items: center;">
                            
                            <!-- Square Logo Box (Big & Square) -->
                            <div style="display: flex; flex-direction: column; gap: 3px;">
                                <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Logo</label>
                                <label for="sq-logo-input" class="reg-logo-box" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 65px; height: 65px; background-color: #1e293b; border: 1.5px dashed #475569; border-radius: 8px; cursor: pointer; overflow: hidden; position: relative; transition: 0.2s; flex-shrink: 0;" id="logo-preview-box">
                                    <span id="logo-text" style="color: #94a3b8; font-size: 11px; font-weight: 600;">Upload</span>
                                    <input type="file" id="sq-logo-input" accept="image/*" style="display: none;">
                                </label>
                            </div>

                            <!-- Squad Name -->
                            <div style="display: flex; flex-direction: column; gap: 3px; flex-grow: 1; justify-content: center; height: 100%;">
                                <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Squad Name</label>
                                <input type="text" id="sq-name" class="reg-input" placeholder="Squad Name" required style="width: 100%; height: 42px; padding: 0 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; outline: none; box-sizing: border-box; transition: 0.2s;">
                            </div>
                        </div>

                        <!-- Players Lineup (Roam, Exp, Gold, Mid, Jungle) -->
                        <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid #334155; border-bottom: 1px solid #334155; padding: 8px 0;">
                            <span style="color: #38bdf8; font-size: 12px; font-weight: 700;">Player Lineup (Name & ID)</span>
                            
                            <!-- Roam -->
                            <div style="display: flex; gap: 6px;">
                                <input type="text" class="reg-input" placeholder="Roamer" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                                <input type="number" class="reg-input" placeholder="ID" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                            </div>

                            <!-- Exp -->
                            <div style="display: flex; gap: 6px;">
                                <input type="text" class="reg-input" placeholder="Exp laner" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                                <input type="number" class="reg-input" placeholder="ID" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                            </div>

                            <!-- Gold -->
                            <div style="display: flex; gap: 6px;">
                                <input type="text" class="reg-input" placeholder="Gold laner" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                                <input type="number" class="reg-input" placeholder="ID" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                            </div>

                            <!-- Mid -->
                            <div style="display: flex; gap: 6px;">
                                <input type="text" class="reg-input" placeholder="Mid laner" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                                <input type="number" class="reg-input" placeholder="ID" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                            </div>

                            <!-- Jungle -->
                            <div style="display: flex; gap: 6px;">
                                <input type="text" class="reg-input" placeholder="Jungler" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                                <input type="number" class="reg-input" placeholder="ID" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                            </div>
                        </div>

                        <!-- Payment & Contact Info -->
                        <div style="display: flex; gap: 8px;">
                            <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                                <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">KPay Name</label>
                                <input type="text" id="kpay-name" class="reg-input" placeholder="KPay Name" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                                <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">KPay Ph Number</label>
                                <input type="tel" id="kpay-ph" class="reg-input" placeholder="KPay Ph Number" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                            </div>
                        </div>

                        <div style="display: flex; gap: 8px;">
                            <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                                <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Contact Ph Number</label>
                                <input type="tel" id="contact-ph" class="reg-input" placeholder="Contact Ph Number" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box; transition: 0.2s;">
                            </div>
                            
                            <!-- Modern Custom Entry Fee Trigger -->
                            <div style="display: flex; flex-direction: column; gap: 3px; width: 50%; position: relative;">
                                <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Entry Fee</label>
                                <div id="fee-dropdown-btn" class="reg-input" style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 40px; padding: 0 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #38bdf8; font-size: 12px; font-weight: 700; cursor: pointer; box-sizing: border-box; transition: 0.2s;">
                                    <span id="selected-fee-text">Select Fee</span>
                                    <span style="font-size: 10px; color: #94a3b8;">▼</span>
                                </div>

                                <!-- Custom Modern Popup Modal / Dropdown Menu -->
                                <div id="fee-modal" style="display: none; position: absolute; bottom: 48px; left: 0; width: 100%; background-color: #0f172a; border: 1px solid #334155; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 100; overflow: hidden; animation: fadeIn 0.2s ease;">
                                    <div style="padding: 8px 10px; font-size: 11px; font-weight: 600; color: #94a3b8; border-bottom: 1px solid #1e293b;">Select Fee</div>
                                    <div class="fee-option" data-value="5k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer; transition: 0.15s;">5k</div>
                                    <div class="fee-option" data-value="10k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer; transition: 0.15s;">10k</div>
                                    <div class="fee-option" data-value="15k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer; transition: 0.15s;">15k</div>
                                    <div class="fee-option" data-value="25k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer; transition: 0.15s;">25k</div>
                                    <div class="fee-option" data-value="50k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer; transition: 0.15s;">50k</div>
                                </div>
                                <input type="hidden" id="fee-value" required>
                            </div>
                        </div>

                        <!-- Back & Next Buttons -->
                        <div style="display: flex; gap: 8px; margin-top: 6px;">
                            <button type="button" id="back-btn" style="width: 50%; height: 42px; background-color: #334155; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Back</button>
                            <button type="submit" style="width: 50%; height: 42px; background-color: #38bdf8; color: #0f172a; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Next</button>
                        </div>
                    </form>
                </div>
            `;

            // Logo ပုံတင်ရန် JavaScript Logic
            const logoInput = document.getElementById('sq-logo-input');
            const logoBox = document.getElementById('logo-preview-box');
            
            logoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        logoBox.style.backgroundImage = `url(${event.target.result})`;
                        logoBox.style.backgroundSize = 'cover';
                        logoBox.style.backgroundPosition = 'center';
                        logoBox.style.borderStyle = 'solid';
                        document.getElementById('logo-text').style.display = 'none';
                    }
                    reader.readAsDataURL(file);
                }
            });

            // Modern Fee Dropdown Logic
            const feeBtn = document.getElementById('fee-dropdown-btn');
            const feeModal = document.getElementById('fee-modal');
            const feeText = document.getElementById('selected-fee-text');
            const feeHiddenInput = document.getElementById('fee-value');

            feeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                feeModal.style.display = feeModal.style.display === 'block' ? 'none' : 'block';
            });

            document.querySelectorAll('.fee-option').forEach(option => {
                option.addEventListener('click', function() {
                    const val = this.getAttribute('data-value');
                    feeText.textContent = val;
                    feeHiddenInput.value = val;
                    feeModal.style.display = 'none';
                });
            });

            // နေရာလပ်နှိပ်ပါက Dropdown ပိတ်သွားရန်
            document.addEventListener('click', () => {
                feeModal.style.display = 'none';
            });

            // Back ခလုတ်နှိပ်ပါက မူလ Mode မျက်နှာပြင်သို့ ပြန်သွားရန်
            document.getElementById('back-btn').addEventListener('click', () => {
                renderModeScreen(appContent);
            });
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