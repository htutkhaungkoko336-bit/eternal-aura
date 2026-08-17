// tournamentpayment.js
import { renderRegisterForm } from './tournamentRegistration.js';
import { renderModeScreen } from './mode.js';
import { addNotification } from './notification.js';

export function renderPaymentPage(appContent, formData) {
    let rawFee = formData.fee ? formData.fee.toLowerCase().trim() : '5000';
    let baseNum = parseInt(rawFee.replace('k', '').replace('ks', '').replace(',', '')) * 1000;
    if (isNaN(baseNum)) baseNum = 5000;

    let selectFeeStr = baseNum.toLocaleString() + 'Ks';
    let commissionNum = baseNum * 0.1;
    let commissionStr = commissionNum.toLocaleString() + 'Ks';
    let totalNum = baseNum + commissionNum;
    let totalStr = totalNum.toLocaleString() + 'Ks';
    
    let championPriceStr = "400,000Ks";
    
    // Slot နံပါတ်ကို နှစ်ဘက်လုံးက လာတာလက်ခံနိုင်အောင် ချိတ်ပေးထားသည်
    let slotNum = formData.slot || (formData.selectedSlot ? formData.selectedSlot.replace('Slot ', '') : "1");

    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 12px 15px 12px; box-sizing: border-box; overflow-y: auto; position: relative;">
            <h2 style="color: #f8fafc; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Tournament Payment</h2>
            
            <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 340px; padding-bottom: 25px;">
                
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid #334155; border-radius: 8px; padding: 8px 12px; display: flex; flex-direction: column; gap: 3px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                    <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: #94a3b8;">
                        <span>Slot :</span>
                        <span style="color: #fbbf24; font-weight: 700;">Slot ${slotNum}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: #94a3b8;">
                        <span>Select Fee :</span>
                        <span style="color: #f8fafc; font-weight: 600;">${selectFeeStr}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: #94a3b8; border-bottom: 1px solid #1e293b; padding-bottom: 3px;">
                        <span>Entry Fee 10% :</span>
                        <span style="color: #f8fafc; font-weight: 600;">${commissionStr}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12.5px; color: #38bdf8; font-weight: 700; padding-top: 1px;">
                        <span>Total Fee :</span>
                        <span>${totalStr}</span>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #3f2f04 0%, #714f09 50%, #b45309 100%); border: 1.5px solid #fbbf24; border-radius: 10px; padding: 10px; text-align: center; box-shadow: 0 0 25px rgba(251, 191, 36, 0.5);">
                    <span style="display: block; color: #fef08a; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 2px;">⚡ CHAMPION PRIZE ⚡</span>
                    <span style="display: block; color: #fde047; font-size: 24px; font-weight: 900;">${championPriceStr}</span>
                </div>

                <div style="background-color: #0f172a; border: 1.5px solid #334155; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; gap: 10px; width: 100%;">
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #475569; border-radius: 8px; padding: 10px;">
                            <span style="color: #f8fafc; font-size: 11px; font-weight: 700; margin-bottom: 6px;">QR Code</span>
                            <div id="qr-container-box" style="width: 115px; height: 105px; background-color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                <img src="QR.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #475569; border-radius: 8px; padding: 10px;">
                            <span style="color: #f8fafc; font-size: 11px; font-weight: 700; margin-bottom: 6px;">Payment Slip</span>
                            <label for="ss-file-input" id="ss-preview-box" style="width: 115px; height: 105px; background-color: #0f172a; border: 1.5px dashed #475569; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                <span id="ss-text" style="color: #38bdf8; font-size: 11px;">Upload SS</span>
                                <input type="file" id="ss-file-input" accept="image/*" style="display: none;">
                            </label>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: center; background-color: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid #475569;">
                        <input type="checkbox" id="mode-checkbox" style="width: 17px; height: 17px; accent-color: #38bdf8; cursor: pointer; margin-right: 10px;">
                        <label for="mode-checkbox" style="color: #f8fafc; font-size: 13px; font-weight: 700; cursor: pointer;">Confirm Tournament Mode</label>
                    </div>

                    <div style="display: flex; gap: 8px;">
                        <button type="button" id="pay-back-btn" style="width: 50%; height: 40px; background-color: #334155; color: white; border: none; border-radius: 7px; font-weight: 700; cursor: pointer;">Back</button>
                        <button type="button" id="confirm-btn" disabled style="width: 50%; height: 40px; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; border: none; border-radius: 7px; font-weight: 700; cursor: not-allowed; opacity: 0.4;">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Event Listeners
    const ssInput = document.getElementById('ss-file-input');
    const ssPreview = document.getElementById('ss-preview-box');
    const ssText = document.getElementById('ss-text');
    const modeCheckbox = document.getElementById('mode-checkbox');
    const confirmBtn = document.getElementById('confirm-btn');
    const backBtn = document.getElementById('pay-back-btn');
    const qrBox = document.getElementById('qr-container-box');

    // SS Upload Preview
    ssInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                ssPreview.style.backgroundImage = `url(${event.target.result})`;
                ssPreview.style.backgroundSize = 'cover';
                ssPreview.style.backgroundPosition = 'center';
                ssText.style.display = 'none';
                checkButtonState();
            };
            reader.readAsDataURL(file);
        }
    });

    // Check button status
    function checkButtonState() {
        if (modeCheckbox.checked && ssInput.files.length > 0) {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.style.cursor = 'pointer';
        } else {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.4';
            confirmBtn.style.cursor = 'not-allowed';
        }
    }

    modeCheckbox.addEventListener('change', checkButtonState);

    // QR Modal logic
    qrBox.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';
        modal.innerHTML = `<img src="QR.jpg" style="max-width: 90%; max-height: 90%; border-radius: 10px;">`;
        modal.addEventListener('click', () => modal.remove());
        document.body.appendChild(modal);
    });

    // Back Button (Back သွားရင် ဖြည့်ထားတဲ့ formData တွေ မပျောက်အောင် ပြန်ပေးထားသည်)
    backBtn.addEventListener('click', () => {
        renderRegisterForm(appContent, formData);
    });

    // Confirm Button
    confirmBtn.addEventListener('click', () => {
        addNotification("Registration Successful! Please wait for approval.");
        renderModeScreen(appContent);
    });
}