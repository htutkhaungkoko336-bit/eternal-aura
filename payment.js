// payment.js
import { renderRegisterForm } from './register.js';
import { renderModeScreen } from './mode.js';

export function renderPaymentPage(appContent, formData) {
    let rawFee = formData.fee.toLowerCase().trim();
    let baseNum = parseInt(rawFee.replace('k', '')) * 1000;
    if (isNaN(baseNum)) baseNum = 25000;

    let selectFeeStr = baseNum.toLocaleString() + 'Ks';
    let commissionNum = baseNum * 0.1;
    let commissionStr = commissionNum.toLocaleString() + 'Ks';
    let totalNum = baseNum + commissionNum;
    let totalStr = totalNum.toLocaleString() + 'Ks';
    
    // Fee အလိုက် Winner Prize နှင့် Theme/Background ဒီဇိုင်း ၅ မျိုး သတ်မှတ်ခြင်း (ပိုများလေ ပိုလန်းလေ)
    let winnerPriceNum = baseNum * 2;
    let winnerPriceStr = winnerPriceNum.toLocaleString() + 'Ks';
    let matchFormat = (baseNum <= 15000) ? "BO1" : "BO3";

    let prizeBg = "";
    let prizeBorder = "";
    let prizeShadow = "";
    let titleColor = "";
    let amountColor = "";

    if (baseNum === 5000) {
        // 5k: Bronze / Clean Vibe
        prizeBg = "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)";
        prizeBorder = "#d97706";
        prizeShadow = "0 0 12px rgba(217, 119, 6, 0.3)";
        titleColor = "#fde68a";
        amountColor = "#fbbf24";
    } else if (baseNum === 10000) {
        // 10k: Emerald / Cyber Green
        prizeBg = "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)";
        prizeBorder = "#34d399";
        prizeShadow = "0 0 14px rgba(52, 211, 153, 0.35)";
        titleColor = "#a7f3d0";
        amountColor = "#6ee7b7";
    } else if (baseNum === 15000) {
        // 15k: Ocean Blue / Electric
        prizeBg = "linear-gradient(135deg, #082f49 0%, #0369a1 50%, #0284c7 100%)";
        prizeBorder = "#38bdf8";
        prizeShadow = "0 0 16px rgba(56, 189, 248, 0.4)";
        titleColor = "#bae6fd";
        amountColor = "#7dd3fc";
    } else if (baseNum === 25000) {
        // 25k: Royal Purple / Neon VIP
        prizeBg = "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)";
        prizeBorder = "#a855f7";
        prizeShadow = "0 0 18px rgba(168, 85, 247, 0.45)";
        titleColor = "#e9d5ff";
        amountColor = "#facc15";
    } else {
        // 50k: Supreme Fire / Ultra Gold & Crimson
        prizeBg = "linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)";
        prizeBorder = "#f87171";
        prizeShadow = "0 0 22px rgba(248, 113, 113, 0.6), inset 0 0 12px rgba(252, 211, 77, 0.3)";
        titleColor = "#fecaca";
        amountColor = "#fef08a";
    }

    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 12px 15px 12px; box-sizing: border-box; overflow-y: auto;">
            <h2 style="color: #f8fafc; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Payment Details</h2>
            
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 340px; padding-bottom: 25px;">
                
                <!-- Fee Breakdown Box -->
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

                <!-- Winner Prize Box (Fee အလိုက် ဒီဇိုင်းနှင့် အရောင် ၅ မျိုးပြောင်းလဲမှု) -->
                <div style="position: relative; background: ${prizeBg}; border: 1.5px solid ${prizeBorder}; border-radius: 10px; padding: 10px; text-align: center; box-shadow: ${prizeShadow};">
                    <span style="display: block; color: ${titleColor}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 2px; text-shadow: 0 0 8px rgba(255,255,255,0.4);">⚡ WINNER PRIZE ⚡</span>
                    <span style="display: block; color: ${amountColor}; font-size: 24px; font-weight: 900; text-shadow: 0 0 12px rgba(0,0,0,0.8);">${winnerPriceStr}</span>
                </div>

                <!-- Main Container for QR & Payment Slip -->
                <div style="background-color: #0f172a; border: 1.5px solid #334155; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
                    
                    <!-- QR Code & Payment Slip (ဘေးချင်းယှဉ်) -->
                    <div style="display: flex; gap: 8px; width: 100%;">
                        
                        <!-- QR Code Box (အမည်နှင့် ဖုန်းနံပါတ် အပေါ်အောက် တိကျစွာပါဝင်ခြင်း) -->
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #475569; border-radius: 8px; padding: 8px; box-sizing: border-box;">
                            <span style="color: #f8fafc; font-size: 10.5px; font-weight: 700; margin-bottom: 4px;">QR Code</span>
                            <div style="width: 100px; height: 85px; background-color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                <img src="QR.jpg" alt="QR" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <span style="display: none; color: #0f172a; font-size: 9px; font-weight: 700; text-align: center;">[ QR ]</span>
                            </div>
                            <span style="color: #38bdf8; font-size: 9.5px; font-weight: 700; margin-top: 4px; text-align: center;">09403633531</span>
                            <span style="color: #94a3b8; font-size: 8.5px; font-weight: 600; text-align: center;">Htut Khaung Ko Ko</span>
                        </div>

                        <!-- Payment Slip Box (QR နှင့် အရွယ်အစားတူညီပြီး SS တင်လျှင် အပြည့်ပေါ်စေရန်) -->
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #475569; border-radius: 8px; padding: 8px; box-sizing: border-box;">
                            <span style="color: #f8fafc; font-size: 10.5px; font-weight: 700; margin-bottom: 4px;">Payment Slip</span>
                            
                            <label for="ss-file-input" style="width: 100px; height: 85px; background-color: #0f172a; border: 1.5px dashed #475569; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;" id="ss-preview-box">
                                <span id="ss-text" style="color: #38bdf8; font-size: 10px; font-weight: 600; text-align: center; padding: 0 4px;">Upload SS</span>
                                <input type="file" id="ss-file-input" accept="image/*" style="display: none;">
                            </label>

                            <span style="color: #94a3b8; font-size: 9px; margin-top: 13px; text-align: center;">Required</span>
                        </div>
                    </div>

                    <!-- 5 vs 5 Mode Checkbox (BO များကို ဘေးနားတွင် ရှင်းလင်းစွာပြသခြင်း) -->
                    <div style="display: flex; align-items: center; justify-content: space-between; background-color: #1e293b; padding: 7px 10px; border-radius: 6px; border: 1px solid #475569;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="mode-checkbox" data-game-mode="5vs5" style="width: 15px; height: 15px; accent-color: #38bdf8; cursor: pointer;">
                            <label for="mode-checkbox" style="color: #f8fafc; font-size: 11.5px; font-weight: 600; cursor: pointer;">5 vs 5 Mode</label>
                        </div>
                        <span style="background-color: ${matchFormat === 'BO1' ? '#0ea5e9' : '#f43f5e'}; color: white; font-size: 9.5px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">${matchFormat} Match</span>
                    </div>

                    <!-- Buttons -->
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

    document.getElementById('pay-back-btn').addEventListener('click', () => {
        renderRegisterForm(appContent, formData);
    });

    confirmBtn.addEventListener('click', () => {
        if (confirmBtn.disabled) return;

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