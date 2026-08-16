// register-1v1.js

export function renderRegister1v1Form(appContent, savedData = {}) {
    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 14px 10px 14px; box-sizing: border-box; overflow-y: auto;">
            
            <!-- Header box with exact blue matching corner cut accents -->
            <div style="position: relative; border: 2px solid #38bdf8; border-radius: 4px; padding: 8px 16px; margin-bottom: 12px; background-color: rgba(15, 23, 42, 0.8); text-align: center; width: 100%; max-width: 340px; box-sizing: border-box; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                <!-- Corner cut accents using the same blue accent color (#38bdf8) -->
                <div style="position: absolute; top: -3px; left: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                <div style="position: absolute; bottom: -3px; right: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                
                <h2 style="color: #f8fafc; font-size: 16px; font-weight: 800; letter-spacing: 1px; margin: 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">1 vs 1 Registration</h2>
            </div>
            
            <form id="reg-1v1-form" style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 340px; padding-bottom: 30px;">
                
                <style>
                    .reg-1v1-input:focus, .reg-1v1-logo-box:hover {
                        border-color: #38bdf8 !important;
                        box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
                    }
                    .fee-1v1-option:hover {
                        background-color: #334155 !important;
                        color: #38bdf8 !important;
                    }
                </style>

                <!-- Center Logo Section -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%;">
                    <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Logo <span style="color: #ef4444;">*</span></label>
                    <label for="1v1-logo-input" class="reg-1v1-logo-box" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 80px; height: 80px; background-color: #1e293b; border: 1.5px dashed #475569; border-radius: 8px; cursor: pointer; overflow: hidden; position: relative; transition: 0.2s;" id="logo-1v1-preview-box">
                        <span id="logo-1v1-text" style="color: #94a3b8; font-size: 11px; font-weight: 600;">Upload</span>
                        <input type="file" id="1v1-logo-input" accept="image/*" style="display: none;">
                    </label>
                </div>

                <!-- Game Name & ID Side by Side -->
                <div style="display: flex; gap: 8px; width: 100%;">
                    <div style="display: flex; flex-direction: column; gap: 3px; flex-grow: 1;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Game Name</label>
                        <input type="text" id="p1-game-name" class="reg-1v1-input" placeholder="Game Name" value="${savedData.gameName || ''}" required style="width: 100%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 110px; flex-shrink: 0;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">ID</label>
                        <input type="number" id="p1-id" class="reg-1v1-input" placeholder="ID" value="${savedData.playerId || ''}" required style="width: 100%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Hero Name Section -->
                <div style="display: flex; flex-direction: column; gap: 3px;">
                    <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Hero Name</label>
                    <input type="text" id="hero-name" class="reg-1v1-input" placeholder="Enter Hero Name (e.g., Gusion, Fanny)" value="${savedData.heroName || ''}" required style="width: 100%; height: 38px; padding: 0 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                </div>

                <!-- Payment & Contact Info -->
                <div style="display: flex; gap: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">KPay Name</label>
                        <input type="text" id="kpay-name-1v1" class="reg-1v1-input" placeholder="KPay Name" value="${savedData.kpayName || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">KPay Phone Number</label>
                        <input type="tel" inputmode="numeric" pattern="[0-9]*" id="kpay-phone-1v1" class="reg-1v1-input" placeholder="09..." value="${savedData.kpayPhoneNumber || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                </div>

                <div style="display: flex; gap: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Contact Phone Number</label>
                        <input type="tel" inputmode="numeric" pattern="[0-9]*" id="contact-phone-1v1" class="reg-1v1-input" placeholder="09..." value="${savedData.contactPhoneNumber || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                    
                    <!-- Entry Fee -->
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%; position: relative;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Entry Fee</label>
                        <div id="fee-1v1-dropdown-btn" class="reg-1v1-input" style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 40px; padding: 0 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #38bdf8; font-size: 12px; font-weight: 700; cursor: pointer; box-sizing: border-box;">
                            <span id="selected-1v1-fee-text">${savedData.fee || 'Select Fee'}</span>
                            <span style="font-size: 10px; color: #94a3b8;">▼</span>
                        </div>

                        <div id="fee-1v1-modal" style="display: none; position: absolute; bottom: 50px; left: 0; width: 100%; background-color: #0f172a; border: 1px solid #334155; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 100; overflow: hidden;">
                            <div style="padding: 8px 10px; font-size: 11px; font-weight: 600; color: #94a3b8; border-bottom: 1px solid #1e293b;">Select Fee</div>
                            <div class="fee-1v1-option" data-value="5k" style="padding: 8px 12px; font-size: 12px; color: white; cursor: pointer;">5k</div>
                            <div class="fee-1v1-option" data-value="10k" style="padding: 8px 12px; font-size: 12px; color: white; cursor: pointer;">10k</div>
                            <div class="fee-1v1-option" data-value="15k" style="padding: 8px 12px; font-size: 12px; color: white; cursor: pointer;">15k</div>
                            <div class="fee-1v1-option" data-value="25k" style="padding: 8px 12px; font-size: 12px; color: white; cursor: pointer;">25k</div>
                            <div class="fee-1v1-option" data-value="50k" style="padding: 8px 12px; font-size: 12px; color: white; cursor: pointer;">50k</div>
                        </div>
                        <input type="hidden" id="fee-1v1-value" value="${savedData.fee || ''}" required>
                    </div>
                </div>

                <!-- Buttons -->
                <div style="display: flex; gap: 8px; margin-top: 6px;">
                    <button type="button" id="back-1v1-btn" style="width: 50%; height: 42px; background-color: #334155; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Back</button>
                    <button type="submit" style="width: 50%; height: 42px; background-color: #38bdf8; color: #0f172a; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Next</button>
                </div>
            </form>
        </div>
    `;

    const logoInput = document.getElementById('1v1-logo-input');
    const logoBox = document.getElementById('logo-1v1-preview-box');
    let base64Logo = savedData.logoBase64 || null;

    if (base64Logo) {
        logoBox.style.backgroundImage = `url(${base64Logo})`;
        logoBox.style.backgroundSize = 'cover';
        logoBox.style.backgroundPosition = 'center';
        logoBox.style.borderStyle = 'solid';
        document.getElementById('logo-1v1-text').style.display = 'none';
    }
    
    logoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                base64Logo = event.target.result;
                logoBox.style.backgroundImage = `url(${base64Logo})`;
                logoBox.style.backgroundSize = 'cover';
                logoBox.style.backgroundPosition = 'center';
                logoBox.style.borderStyle = 'solid';
                document.getElementById('logo-1v1-text').style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    const feeBtn = document.getElementById('fee-1v1-dropdown-btn');
    const feeModal = document.getElementById('fee-1v1-modal');
    const feeText = document.getElementById('selected-1v1-fee-text');
    const feeHiddenInput = document.getElementById('fee-1v1-value');

    feeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        feeModal.style.display = feeModal.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('.fee-1v1-option').forEach(option => {
        option.addEventListener('click', function() {
            const val = this.getAttribute('data-value');
            feeText.textContent = val;
            feeHiddenInput.value = val;
            feeModal.style.display = 'none';
        });
    });

    document.addEventListener('click', () => {
        feeModal.style.display = 'none';
    });

    document.getElementById('reg-1v1-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!base64Logo) {
            alert("ကျေးဇူးပြု၍ သင့် Logo ပုံကို တင်ပေးပါရှင့်။");
            return;
        }

        if (!feeHiddenInput.value) {
            alert("ကျေးဇူးပြု၍ Entry Fee တစ်ခု ရွေးချယ်ပေးပါရှင့်။");
            return;
        }

        const formData = {
            mode: '1vs1',
            logoBase64: base64Logo,
            gameName: document.getElementById('p1-game-name').value,
            playerId: document.getElementById('p1-id').value,
            heroName: document.getElementById('hero-name').value,
            kpayName: document.getElementById('kpay-name-1v1').value,
            kpayPhoneNumber: document.getElementById('kpay-phone-1v1').value,
            contactPhoneNumber: document.getElementById('contact-phone-1v1').value,
            fee: feeHiddenInput.value
        };

        import('./payment.js').then(module => {
            module.renderPaymentPage(appContent, formData);
        });
    });

    document.getElementById('back-1v1-btn').addEventListener('click', () => {
        import('./mode.js').then(module => {
            module.renderModeScreen(appContent);
        });
    });
}