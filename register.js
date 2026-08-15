// register.js

export function renderRegisterForm(appContent, savedData = {}) {
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

                <!-- Top Row: Logo & Squad Name -->
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="display: flex; flex-direction: column; gap: 3px;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Logo <span style="color: #ef4444;">*</span></label>
                        <label for="sq-logo-input" class="reg-logo-box" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 65px; height: 65px; background-color: #1e293b; border: 1.5px dashed #475569; border-radius: 8px; cursor: pointer; overflow: hidden; position: relative; transition: 0.2s; flex-shrink: 0;" id="logo-preview-box">
                            <span id="logo-text" style="color: #94a3b8; font-size: 11px; font-weight: 600;">Upload</span>
                            <input type="file" id="sq-logo-input" accept="image/*" style="display: none;">
                        </label>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 3px; flex-grow: 1; justify-content: center; height: 100%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Squad Name</label>
                        <input type="text" id="sq-name" class="reg-input" placeholder="Squad Name" value="${savedData.sqName || ''}" required style="width: 100%; height: 42px; padding: 0 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; outline: none; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Players Lineup -->
                <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid #334155; border-bottom: 1px solid #334155; padding: 8px 0;">
                    <span style="color: #38bdf8; font-size: 12px; font-weight: 700;">Player Lineup (Name & ID)</span>
                    
                    <!-- Roamer -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="roamer-name" class="reg-input" placeholder="roamer" value="${savedData.roamerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" id="roamer-id" class="reg-input" placeholder="ID" value="${savedData.roamerId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>

                    <!-- Exp Laner -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="exp-laner-name" class="reg-input" placeholder="exp-laner" value="${savedData.expLanerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" id="exp-laner-id" class="reg-input" placeholder="ID" value="${savedData.expLanerId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>

                    <!-- Gold Laner -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="gold-laner-name" class="reg-input" placeholder="gold-laner" value="${savedData.goldLanerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" id="gold-laner-id" class="reg-input" placeholder="ID" value="${savedData.goldLanerId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>

                    <!-- Mid Laner -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="mid-laner-name" class="reg-input" placeholder="mid-laner" value="${savedData.midLanerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" id="mid-laner-id" class="reg-input" placeholder="ID" value="${savedData.midLanerId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>

                    <!-- Jungler -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="jungler-name" class="reg-input" placeholder="jungler" value="${savedData.junglerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" id="jungler-id" class="reg-input" placeholder="ID" value="${savedData.junglerId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Payment & Contact Info -->
                <div style="display: flex; gap: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">KPay Name</label>
                        <input type="text" id="kpay-name" class="reg-input" placeholder="KPay Name" value="${savedData.kpayName || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">KPay Phone Number</label>
                        <input type="tel" id="kpay-phone-number" class="reg-input" placeholder="09..." value="${savedData.kpayPhoneNumber || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                </div>

                <div style="display: flex; gap: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Contact Phone Number</label>
                        <input type="tel" id="contact-phone-number" class="reg-input" placeholder="09..." value="${savedData.contactPhoneNumber || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    
                    <!-- Entry Fee -->
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%; position: relative;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Entry Fee</label>
                        <div id="fee-dropdown-btn" class="reg-input" style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 40px; padding: 0 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #38bdf8; font-size: 12px; font-weight: 700; cursor: pointer; box-sizing: border-box;">
                            <span id="selected-fee-text">${savedData.fee || 'Select Fee'}</span>
                            <span style="font-size: 10px; color: #94a3b8;">▼</span>
                        </div>
                        <div id="fee-calc-hint" style="font-size: 10.5px; color: #10b981; margin-top: 2px; font-weight: 600; display: ${savedData.totalVal ? 'block' : 'none'};">
                            Total: ${savedData.totalVal || ''} (10% အပါ)
                        </div>

                        <div id="fee-modal" style="display: none; position: absolute; bottom: 60px; left: 0; width: 100%; background-color: #0f172a; border: 1px solid #334155; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 100; overflow: hidden;">
                            <div style="padding: 8px 10px; font-size: 11px; font-weight: 600; color: #94a3b8; border-bottom: 1px solid #1e293b;">Select Fee</div>
                            <div class="fee-option" data-value="5k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer;">5k</div>
                            <div class="fee-option" data-value="10k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer;">10k</div>
                            <div class="fee-option" data-value="15k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer;">15k</div>
                            <div class="fee-option" data-value="25k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer;">25k</div>
                            <div class="fee-option" data-value="50k" style="padding: 10px 12px; font-size: 13px; color: white; cursor: pointer;">50k</div>
                        </div>
                        <input type="hidden" id="fee-value" value="${savedData.fee || ''}" required>
                    </div>
                </div>

                <!-- Buttons -->
                <div style="display: flex; gap: 8px; margin-top: 6px;">
                    <button type="button" id="back-btn" style="width: 50%; height: 42px; background-color: #334155; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Back</button>
                    <button type="submit" style="width: 50%; height: 42px; background-color: #38bdf8; color: #0f172a; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Next</button>
                </div>
            </form>
        </div>
    `;

    const logoInput = document.getElementById('sq-logo-input');
    const logoBox = document.getElementById('logo-preview-box');
    let base64Logo = savedData.logoBase64 || null;

    if (base64Logo) {
        logoBox.style.backgroundImage = `url(${base64Logo})`;
        logoBox.style.backgroundSize = 'cover';
        logoBox.style.backgroundPosition = 'center';
        logoBox.style.borderStyle = 'solid';
        document.getElementById('logo-text').style.display = 'none';
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
                document.getElementById('logo-text').style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    const feeBtn = document.getElementById('fee-dropdown-btn');
    const feeModal = document.getElementById('fee-modal');
    const feeText = document.getElementById('selected-fee-text');
    const feeHiddenInput = document.getElementById('fee-value');
    const feeCalcHint = document.getElementById('fee-calc-hint');
    let calculatedTotalVal = savedData.totalVal || '';

    feeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        feeModal.style.display = feeModal.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('.fee-option').forEach(option => {
        option.addEventListener('click', function() {
            const val = this.getAttribute('data-value');
            feeText.textContent = val;
            feeHiddenInput.value = val;
            
            let baseNum = parseInt(val.replace('k', '')) * 1000;
            let totalWithCommission = baseNum + (baseNum * 0.1);
            calculatedTotalVal = (totalWithCommission / 1000) + 'k';
            
            feeCalcHint.textContent = `Total: ${calculatedTotalVal} (10% အပါ)`;
            feeCalcHint.style.display = 'block';

            feeModal.style.display = 'none';
        });
    });

    document.addEventListener('click', () => {
        feeModal.style.display = 'none';
    });

    document.getElementById('reg-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!base64Logo) {
            alert("ကျေးဇူးပြု၍ သင့်အဖွဲ့၏ Logo ပုံကို တင်ပေးပါရှင့်။");
            return;
        }

        if (!feeHiddenInput.value) {
            alert("ကျေးဇူးပြု၍ Entry Fee တစ်ခု ရွေးချယ်ပေးပါရှင့်။");
            return;
        }

        const formData = {
            logoBase64: base64Logo,
            sqName: document.getElementById('sq-name').value,
            roamerName: document.getElementById('roamer-name').value,
            roamerId: document.getElementById('roamer-id').value,
            expLanerName: document.getElementById('exp-laner-name').value,
            expLanerId: document.getElementById('exp-laner-id').value,
            goldLanerName: document.getElementById('gold-laner-name').value,
            goldLanerId: document.getElementById('gold-laner-id').value,
            midLanerName: document.getElementById('mid-laner-name').value,
            midLanerId: document.getElementById('mid-laner-id').value,
            junglerName: document.getElementById('jungler-name').value,
            junglerId: document.getElementById('jungler-id').value,
            kpayName: document.getElementById('kpay-name').value,
            kpayPhoneNumber: document.getElementById('kpay-phone-number').value,
            contactPhoneNumber: document.getElementById('contact-phone-number').value,
            fee: feeHiddenInput.value,
            totalVal: calculatedTotalVal
        };

        // Payment Page သို့ Import လုပ်ပြီး ခေါ်သုံးမည်
        import('./payment.js').then(module => {
            module.renderPaymentPage(appContent, formData);
        });
    });

    document.getElementById('back-btn').addEventListener('click', () => {
        import('./mode.js').then(module => {
            module.renderModeScreen(appContent);
        });
    });
}