// payment.js
import { renderRegisterForm } from './register.js';
import { renderModeScreen } from './mode.js';

export function renderPaymentPage(appContent, formData) {
    // တွက်ချက်မှုများ ပြုလုပ်ခြင်း
    let rawFee = formData.fee.toLowerCase().trim();
    let baseNum = parseInt(rawFee.replace('k', '')) * 1000;
    if (isNaN(baseNum)) baseNum = 25000;

    let selectFeeStr = baseNum.toLocaleString() + 'Ks';
    let commissionNum = baseNum * 0.1;
    let commissionStr = commissionNum.toLocaleString() + 'Ks';
    let totalNum = baseNum + commissionNum;
    let totalStr = totalNum.toLocaleString() + 'Ks';
    
    // Amount များလေ Winner Price ပိုမိုကြီးမားပြီး လန်းလေဖြစ်စေရန် တွက်ချက်ခြင်း
    let multiplier = 2;
    if (baseNum >= 50000) multiplier = 2.4;
    else if (baseNum >= 25000) multiplier = 2.2;
    
    let winnerPriceNum = baseNum * multiplier;
    let winnerPriceStr = winnerPriceNum.toLocaleString() + 'Ks';

    // BO1 သို့မဟုတ် BO3 သတ်မှတ်ချက် (5k, 10k, 15k ဆိုရင် BO1၊ ကျန်တာ BO3)
    let matchFormat = (baseNum <= 15000) ? "BO1" : "BO3";
    let badgeColor = (matchFormat === "BO1") ? "#38bdf8" : "#f43f5e";

    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 12px 15px 12px; box-sizing: border-box; overflow-y: auto;">
            <h2 style="color: #f8fafc; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Payment Details</h2>
            
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 340px; padding-bottom: 25px;">
                
                <!-- 1. Fee Breakdown Box (အပေါ်ဆုံး) -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid #334155; border-radius: 8px; padding: 8px 12px; display: flex; flex-direction: column; gap: 3px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
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

                <!-- 2. Cyberpunk / Sci-Fi Winner Prize Box (လန်းဆန်းကြီးမားသောဒီဇိုင်း) -->
                <div style="position: relative; background: linear-gradient(135deg, #090d16 0%, #171033 50%, #1e1b4b 100%); border: 1.5px solid #a855f7; border-radius: 10px; padding: 10px; text-align: center; box-shadow: 0 0 18px rgba(168, 85, 247, 0.4), inset 0 0 10px rgba(168, 85, 247, 0.15);">
                    <div style="position: absolute; top: 6px; right: 10px; background-color: ${badgeColor}; color: white; font-size: 9.5px; font-weight: 900; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px; box-shadow: 0 0 6px ${badgeColor};">${matchFormat}</div>
                    
                    <span style="display: block; color: #e9d5ff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 2px; text-shadow: 0 0 8px rgba(233, 213, 255, 0.6);">⚡ WINNER PRIZE ⚡</span>
                    <span style="display: block; color: #facc15; font-size: 24px; font-weight: 900; text-shadow: 0 0 12px rgba(250, 204, 21, 0.7), 0 2px 4px rgba(0,0,0,0.8);">${winnerPriceStr}</span>
                </div>

                <!-- 3. Outer Container for QR & Payment Slip (Sketch ပုံစံအတိုင်း အကွက်ကြီးတစ်ခုအတွင်း ထည့်သွင်းခြင်း) -->
                <div style="background-color: #0f172a; border: 1.5px solid #334155; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
                    
                    <!-- QR Code နှင့် Payment Slip ဘေးချင်းယှဉ် Layout -->
                    <div style="display: flex; gap: 8px; width: 100%;">
                        
                        <!-- QR Code Box (ဘယ်ဘက်) -->
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #475569; border-radius: 8px; padding: 8px;">
                            <span style="color: #f8fafc; font-size: 10.5px; font-weight: 700; margin-bottom: 4px;">QR Code</span>
                            <div style="width: 85px; height: 85px; background-color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                <img src="qr-placeholder.png" alt="QR" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <span style="display: none; color: #0f172a; font-size: 9px; font-weight: 700; text-align: center;">[ QR ]</span>
                            </div>
                            <span style="color: #94a3b8; font-size: 9px; margin-top: 3px; text-align: center;">09987654321</span>
                        </div>

                        <!-- Payment Slip Box (ညာဘက် ဒေါင်လိုက် Layout) -->
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 3px;">
                            <label style="color: #f8fafc; font-size: 10.5px; font-weight: 700;">Payment Slip</label>
                            <label for="ss-file-input" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 108px; background-color: #1e293b; border: 1.5px dashed #475569; border-radius: 8px; cursor: pointer; color: #38bdf8; font-size: 11px; font-weight: 600; overflow: hidden; position: relative;" id="ss-preview-box">
                                <span id="ss-text" style="text-align: center; padding: 0 4px;">📷 Upload SS</span>
                                <input type="file" id="ss-file-input" accept="image/*" style="display: none;">
                            </label>
                        </div>
                    </div>

                    <!-- 5 vs 5 Mode Checkbox -->
                    <div style="display: flex; align-items: center; gap: 8px; background-color: #1e293b; padding: 7px 10px; border-radius: 6px; border: 1px solid #475569;">
                        <input type="checkbox" id="mode-checkbox" data-game-mode="5vs5" style="width: 15px; height: 15px; accent-color: #38bdf8; cursor: pointer;">
                        <label for="mode-checkbox" style="color: #f8fafc; font-size: 11.5px; font-weight: 600; cursor: pointer;">5 vs 5 Mode</label>
                    </div>

                    <!-- Buttons (Back & Confirm) -->
                    <div style="display: flex; gap: 8px;">
                        <button type="button" id="pay-back-btn" style="width: 50%; height: 38px; background-color: #334155; color: white; border: none; border-radius: 6px; font-size: 12.5px; font-weight: 700; cursor: pointer;">Back</button>
                        <button type="button" id="confirm-btn" disabled style="width: 50%; height: 38px; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; border: none; border-radius: 6px; font-size: 12.5px; font-weight: 700; cursor: not-allowed; opacity: 0.4; transition: 0.2s; box-shadow: 0 0 10px rgba(14, 165, 233, 0.3);">Confirm</button>
                    </div>

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
            confirmBtn.style.opacity = '0.4';
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

        // Backend Payload (selectedGameMode, matchFormat, winnerPrice အားလုံးပါဝင်သည်)
        const finalPayload = {
            ...formData,
            totalFee: totalStr,
            winnerPrice: winnerPriceStr,
            matchFormat: matchFormat,
            selectedGameMode: modeCheckbox.getAttribute('data-game-mode')
        };

        console.log("Backend Payload Ready:", finalPayload);
        alert("Registration Successful! အချက်အလက်များ အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။");
        renderModeScreen(appContent);
    });
}