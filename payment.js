// payment.js
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
    
    // Tournament Champion Prize 
    let championPriceStr = "400,000Ks";
    
    // Slot နံပါတ်ကို နှစ်ဘက်လုံးက လာတာလက်ခံနိုင်အောင် ချိတ်ပေးထားသည်
    let slotNum = formData.slot || (formData.selectedSlot ? formData.selectedSlot.replace('Slot ', '') : "1");

    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 12px 15px 12px; box-sizing: border-box; overflow-y: auto; position: relative;">
            <h2 style="color: #f8fafc; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Tournament Payment</h2>
            
            <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 340px; padding-bottom: 25px;">
                
                <!-- Fee Breakdown Box -->
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

                <!-- Champion Prize Box -->
                <div style="background: linear-gradient(135deg, #3f2f04 0%, #714f09 50%, #b45309 100%); border: 1.5px solid #fbbf24; border-radius: 10px; padding: 10px; text-align: center; box-shadow: 0 0 25px rgba(251, 191, 36, 0.5);">
                    <span style="display: block; color: #fef08a; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 2px;">⚡ CHAMPION PRIZE ⚡</span>
                    <span style="display: block; color: #fde047; font-size: 24px; font-weight: 900;">${championPriceStr}</span>
                </div>

                <!-- Main Container for QR & Payment Slip -->
                <div style="background-color: #0f172a; border: 1.5px solid #334155; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
                    
                    <!-- QR Code & Payment Slip Boxes -->
                    <div style="display: flex; gap: 10px; width: 100%;">
                        
                        <!-- QR Code Box -->
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #475569; border-radius: 8px; padding: 10px; box-sizing: border-box;">
                            <span style="color: #f8fafc; font-size: 11px; font-weight: 700; margin-bottom: 6px;">QR Code</span>
                            <div id="qr-container-box" style="width: 115px; height: 105px; background-color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; position: relative;" title="နှိပ်၍ ပုံအကြီးကြည့်ရန်">
                                <img id="qr-img-element" src="QR.jpg" alt="QR" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <span style="display: none; color: #0f172a; font-size: 10px; font-weight: 700; text-align: center;">[ QR ]</span>
                            </div>
                            <span style="color: #38bdf8; font-size: 10px; font-weight: 700; margin-top: 6px; text-align: center;">09403633531</span>
                            <span style="color: #94a3b8; font-size: 9px; font-weight: 600; text-align: center;">Htut Khaung Ko Ko</span>
                        </div>

                        <!-- Payment Slip Box -->
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #475569; border-radius: 8px; padding: 10px; box-sizing: border-box;">
                            <span style="color: #f8fafc; font-size: 11px; font-weight: 700; margin-bottom: 6px;">Payment Slip</span>
                            
                            <label for="ss-file-input" style="width: 115px; height: 105px; background-color: #0f172a; border: 1.5px dashed #475569; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;" id="ss-preview-box">
                                <span id="ss-text" style="color: #38bdf8; font-size: 11px; font-weight: 600; text-align: center; padding: 0 4px;">Upload SS</span>
                                <input type="file" id="ss-file-input" accept="image/*" style="display: none;">
                            </label>

                            <span style="color: #94a3b8; font-size: 9.5px; margin-top: 15px; text-align: center;">Required</span>
                        </div>
                    </div>

                    <!-- Mode Checkbox Section -->
                    <div style="display: flex; align-items: center; justify-content: center; background-color: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid #475569;">
                        <input type="checkbox" id="mode-checkbox" style="width: 17px; height: 17px; accent-color: #38bdf8; cursor: pointer; margin-right: 10px;">
                        <label for="mode-checkbox" style="color: #f8fafc; font-size: 13px; font-weight: 700; cursor: pointer;">Confirm Tournament Mode</label>
                    </div>

                    <!-- Buttons -->
                    <div style="display: flex; gap: 8px; margin-top: 4px;">
                        <button type="button" id="pay-back-btn" style="width: 50%; height: 40px; background-color: #334155; color: white; border: none; border-radius: 7px; font-size: 13px; font-weight: 700; cursor: pointer;">Back</button>
                        <button type="button" id="confirm-btn" disabled style="width: 50%; height: 40px; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; border: none; border-radius: 7px; font-size: 13px; font-weight: 700; cursor: not-allowed; opacity: 0.4; transition: 0.2s; box-shadow: 0 0 10px rgba(14, 165, 233, 0.3);">Confirm</button>
                    </div>

                </div>

            </div>
        </div>

        <!-- QR Zoom Modal -->
        <div id="qr-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.85); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
            <div style="position: relative; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center;">
                <button id="close-qr-modal" style="position: absolute; top: -35px; right: 0; background: none; border: none; color: white; font-size: 24px; font-weight: bold; cursor: pointer;">&times;</button>
                <img id="modal-qr-img" src="QR.jpg" alt="Zoomed QR" style="max-width: 280px; max-height: 280px; border-radius: 8px; border: 2px solid #38bdf8; background: white; object-fit: contain;">
                <span style="color: #38bdf8; font-size: 12px; font-weight: 700; margin-top: 10px;">09403633531 (Htut Khaung Ko Ko)</span>
            </div>
        </div>
    `;

    // QR Modal Logic
    const qrContainerBox = document.getElementById('qr-container-box');
    const qrModal = document.getElementById('qr-modal');
    const closeQrModal = document.getElementById('close-qr-modal');

    qrContainerBox.addEventListener('click', () => {
        qrModal.style.display = 'flex';
    });

    closeQrModal.addEventListener('click', () => {
        qrModal.style.display = 'none';
    });

    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.style.display = 'none';
        }
    });

    const ssInput = document.getElementById('ss-file-input');
    const ssBox = document.getElementById('ss-preview-box');
    const ssText = document.getElementById('ss-text');
    const modeCheckbox = document.getElementById('mode-checkbox');
    const confirmBtn = document.getElementById('confirm-btn');
    const backBtn = document.getElementById('pay-back-btn');
    
    let base64SS = formData.ssBase64 || null;
    let ssUploaded = false;

    // အကယ်၍ အရင် upload တင်ထားပြီးသား SS ရှိရင် ပြန်ဖော်ပြပေးရန်
    if (base64SS) {
        ssBox.style.backgroundImage = `url(${base64SS})`;
        ssBox.style.backgroundSize = 'cover';
        ssBox.style.backgroundPosition = 'center';
        ssBox.style.backgroundRepeat = 'no-repeat';
        ssBox.style.borderStyle = 'solid';
        ssBox.style.borderColor = '#38bdf8';
        ssText.style.display = 'none';
        ssUploaded = true;
    }

    function updateConfirmButtonState() {
        if (ssUploaded && modeCheckbox.checked) {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.style.cursor = 'pointer';
        } else {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.4';
            confirmBtn.style.cursor = 'not-allowed';
        }
    }

    updateConfirmButtonState();

    // SS File Change Event
    ssInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                base64SS = event.target.result;
                ssBox.style.backgroundImage = `url(${base64SS})`;
                ssBox.style.backgroundSize = 'cover';
                ssBox.style.backgroundPosition = 'center';
                ssBox.style.backgroundRepeat = 'no-repeat';
                ssBox.style.borderStyle = 'solid';
                ssBox.style.borderColor = '#38bdf8';
                ssText.style.display = 'none';
                ssUploaded = true;
                updateConfirmButtonState();
            }
            reader.readAsDataURL(file);
        }
    });

    modeCheckbox.addEventListener('change', () => {
        updateConfirmButtonState();
    });

    // Back Button (Back သွားရင် ဖြည့်ထားတဲ့ formData နဲ့ ssBase64 တွေ မပျောက်အောင် ပြန်ပေးသည်)
    backBtn.addEventListener('click', () => {
        const updatedDataForBack = {
            ...formData,
            slot: slotNum,
            ssBase64: base64SS
        };
        renderRegisterForm(appContent, updatedDataForBack);
    });  

    // Confirm Button
    confirmBtn.addEventListener('click', () => {
        if (confirmBtn.disabled) return;

        const finalPayload = {
            ...formData,
            slot: slotNum,
            ssBase64: base64SS,
            totalFee: totalStr,
            championPrice: championPriceStr
        };

        console.log("Tournament Backend Payload Ready:", finalPayload);

        const notiTitle = `Tournament Slot ${slotNum} Registration Submitted`;
        const notiMessage = `Tournament fee ${totalStr} အတွက် register တင်ထားပါသည်။ Admin မှ စစ်ဆေးပြီးလျှင် noti ပြန်တက်မည်။`;
        
        addNotification(notiTitle, notiMessage);

        renderModeScreen(appContent);
    });
}