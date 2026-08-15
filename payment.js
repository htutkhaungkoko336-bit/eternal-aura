// payment.js
import { renderRegisterForm } from './register.js';
import { renderModeScreen } from './mode.js';

export function renderPaymentPage(appContent, formData) {
    // တွက်ချက်မှုများ ပြုလုပ်ခြင်း (ဥပမာ - 25k ဆိုလျှင်)
    let rawFee = formData.fee.toLowerCase().trim();
    let baseNum = parseInt(rawFee.replace('k', '')) * 1000;
    if (isNaN(baseNum)) baseNum = 25000;

    let selectFeeStr = baseNum.toLocaleString() + 'Ks';
    let commissionNum = baseNum * 0.1;
    let commissionStr = commissionNum.toLocaleString() + 'Ks';
    let totalNum = baseNum + commissionNum;
    let totalStr = totalNum.toLocaleString() + 'Ks';
    
    // Winner Price ကို Fee ပေါ်မူတည်၍ အလိုအလျောက် (သို့မဟုတ် သတ်မှတ်ချက်အတိုင်း) တွက်ရန်
    let winnerPriceStr = (baseNum * 2).toLocaleString() + 'Ks'; // ဥပမာ - 25k လျှင် 50,000Ks

    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 14px 15px 14px; box-sizing: border-box; overflow-y: auto;">
            <h2 style="color: #f8fafc; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 0 0 8px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Payment Details</h2>
            
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 340px; padding-bottom: 25px;">
                
                <!-- Fee Breakdown Box -->
                <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid #334155; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8;">
                        <span>Select Fee:</span>
                        <span style="color: #f8fafc; font-weight: 600;">${selectFeeStr}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; border-bottom: 1px solid #1e293b; padding-bottom: 4px;">
                        <span>Entry Fee 10%:</span>
                        <span style="color: #f8fafc; font-weight: 600;">(${commissionStr})</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; color: #38bdf8; font-weight: 700; padding-top: 2px;">
                        <span>Total Fee:</span>
                        <span>${totalStr}</span>
                    </div>
                </div>

                <!-- Winner Price Highlight Box -->
                <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); border: 1.5px solid #818cf8; border-radius: 10px; padding: 10px; text-align: center; box-shadow: 0 0 15px rgba(129, 140, 248, 0.25);">
                    <span style="display: block; color: #c7d2fe; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">🏆 Winner Prize</span>
                    <span style="display: block; color: #facc15; font-size: 22px; font-weight: 900; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">${winnerPriceStr}</span>
                </div>

                <!-- QR Code Section -->
                <div style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px;">
                    <span style="color: white; font-size: 11px; font-weight: 700; margin-bottom: 6px;">KBZPay QR Code</span>
                    <div style="width: 100px; height: 100px; background-color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="qr-placeholder.png" alt="QR Code" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <span style="display: none; color: #0f172a; font-size: 10px; font-weight: 700; text-align: center;">[ QR Code ]</span>
                    </div>
                    <span style="color: #94a3b8; font-size: 10.5px; margin-top: 4px;">Acc Name: Ko Ko / Ph: 09987654321</span>
                </div>

                <!-- Payment Screenshot (Vertical Layout Optimized) -->
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">ငွေလွှဲပြီး Screenshot (SS) တင်ရန် <span style="color: #ef4444;">*</span></label>
                    <label for="ss-file-input" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100px; background-color: #1e293b; border: 1.5px dashed #475569; border-radius: 8px; cursor: pointer; color: #38bdf8; font-size: 12px; font-weight: 600; overflow: hidden; position: relative;" id="ss-preview-box">
                        <span id="ss-text">📷 Click to Upload SS</span>
                        <input type="file" id="ss-file-input" accept="image/*" style="display: none;">
                    </label>
                </div>

                <!-- 5 vs 5 Mode Checkbox (Backend payload prepared) -->
                <div style="display: flex; align-items: center; gap: 8px; background-color: #1e293b; padding: 8px 10px; border-radius: 6px; border: 1px solid #334155;">
                    <input type="checkbox" id="mode-checkbox" data-game-mode="5vs5" style="width: 16px; height: 16px; accent-color: #38bdf8; cursor: pointer;">
                    <label for="mode-checkbox" style="color: #f8fafc; font-size: 12px; font-weight: 600; cursor: pointer;">I confirm this registration is for 5 vs 5 Mode</label>
                </div>

                <!-- Buttons -->
                <div style="display: flex; gap: 8px; margin-top: 4px;">
                    <button type="button" id="pay-back-btn" style="width: 50%; height: 40px; background-color: #334155; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;">Back</button>
                    <button type="button" id="confirm-btn" disabled style="width: 50%; height: 40px; background: linear-gradient(135deg, #0ea5e9, #2563eb); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: not-allowed; opacity: 0.5; transition: 0.2s;">Confirm</button>
                </div>
            </div>
        </div>
    `;

    const ssInput = document.getElementById('ss-file-input');
    const ssBox = document.getElementById('ss-preview-box');
    const ssText = document.getElementById('ss-text');
    const modeCheckbox = document.getElementById('mode-checkbox');
    const confirmBtn = document.getElementById('confirm-btn');
    
    let ssUploaded = false;

    function updateConfirmButtonState() {
        if (ssUploaded && modeCheckbox.checked) {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.style.cursor = 'pointer';
        } else {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.cursor = 'not-allowed';
        }
    }

    ssInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                ssBox.style.backgroundImage = `url(${event.target.result})`;
                ssBox.style.backgroundSize = 'contain';
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

    document.getElementById('pay-back-btn').addEventListener('click', () => {
        renderRegisterForm(appContent, formData);
    });

    confirmBtn.addEventListener('click', () => {
        if (confirmBtn.disabled) return;

        // Backend သို့ ပို့မည့် အချက်အလက်အစုံ (selectedGameMode ပါဝင်သည်)
        const finalPayload = {
            ...formData,
            totalFee: totalStr,
            winnerPrice: winnerPriceStr,
            selectedGameMode: modeCheckbox.getAttribute('data-game-mode')
        };

        console.log("Backend Payload Ready:", finalPayload);
        alert("Registration Successful! အချက်အလက်များ အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။");
        renderModeScreen(appContent);
    });
}