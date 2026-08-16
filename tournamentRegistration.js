// tournamentRegistration.js

import { renderTournamentScreen } from './tournament.js';

export function renderRegisterForm(appContent, savedData = {}) {
    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 14px 10px 14px; box-sizing: border-box; overflow-y: auto;">
            
            <!-- Tournament Registration Header Box with Corner Accents -->
            <div style="position: relative; border: 2px solid #38bdf8; border-radius: 4px; padding: 8px 16px; margin-bottom: 12px; background-color: rgba(15, 23, 42, 0.8); text-align: center; width: 100%; max-width: 340px; box-sizing: border-box; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                <div style="position: absolute; top: -3px; left: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                <div style="position: absolute; bottom: -3px; right: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                
                <h2 style="color: #f8fafc; font-size: 16px; font-weight: 800; letter-spacing: 1px; margin: 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Tournament Registration</h2>
                ${savedData.selectedSlot ? `<div style="font-size: 10px; color: #38bdf8; margin-top: 2px; font-weight: bold;">Selected: ${savedData.selectedSlot}</div>` : ''}
            </div>
            
            <form id="reg-form" style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 340px; padding-bottom: 30px;">
                
                <style>
                    .reg-input:focus, .reg-logo-box:hover {
                        border-color: #38bdf8 !important;
                        box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
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
                    
                    <!-- ROAMER -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="roamer-name" class="reg-input" placeholder="ROAMER" value="${savedData.roamerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" id="roamer-id" class="reg-input" placeholder="ID" value="${savedData.roamerId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>

                    <!-- EXP LANER -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="exp-laner-name" class="reg-input" placeholder="EXP LANER" value="${savedData.expLanerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" id="exp-laner-id" class="reg-input" placeholder="ID" value="${savedData.expLanerId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>

                    <!-- GOLD LANER -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="gold-laner-name" class="reg-input" placeholder="GOLD LANER" value="${savedData.goldLanerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" id="gold-laner-id" class="reg-input" placeholder="ID" value="${savedData.goldLanerId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>

                    <!-- MID LANER -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="mid-laner-name" class="reg-input" placeholder="MID LANER" value="${savedData.midLanerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" id="mid-laner-id" class="reg-input" placeholder="ID" value="${savedData.midLanerId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>

                    <!-- JUNGLER -->
                    <div style="display: flex; gap: 6px;">
                        <input type="text" id="jungler-name" class="reg-input" placeholder="JUNGLER" value="${savedData.junglerName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
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
                        <input type="tel" inputmode="numeric" pattern="[0-9]*" id="kpay-phone-number" class="reg-input" placeholder="09..." value="${savedData.kpayPhoneNumber || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                </div>

                <div style="display: flex; gap: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Contact Phone Number</label>
                        <input type="tel" inputmode="numeric" pattern="[0-9]*" id="contact-phone-number" class="reg-input" placeholder="09..." value="${savedData.contactPhoneNumber || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                    
                    <!-- Entry Fee (Changed to 50,000ks) -->
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Entry Fee</label>
                        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 40px; padding: 0 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #38bdf8; font-size: 12px; font-weight: 700; box-sizing: border-box;">
                            <span>50,000ks</span>
                        </div>
                        <input type="hidden" id="fee-value" value="50,000ks">
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

    document.getElementById('reg-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!base64Logo) {
            alert("ကျေးဇူးပြု၍ သင့်အဖွဲ့၏ Logo ပုံကို တင်ပေးပါရှင်။");
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
            fee: "50,000ks",
            selectedSlot: savedData.selectedSlot || "Slot 1" // ဘယ် Slot ကနေလာတယ်ဆိုတာကိုပါ Payment ဆီ ပို့ပေးမည်
        };

        import('./payment.js').then(module => {
            module.renderPaymentPage(appContent, formData);
        }).catch(() => {
            alert("Payment module ကို မတွေ့ရှိပါ။");
        });
    });

    document.getElementById('back-btn').addEventListener('click', () => {
        renderTournamentScreen(appContent);
    });
}