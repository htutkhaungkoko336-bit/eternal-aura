// payment.js
import { renderRegisterForm } from './register.js';
import { renderModeScreen } from './mode.js';
import { addNotification } from './notification.js';

export function renderPaymentPage(appContent, formData) {
    let rawFee = formData.fee.toLowerCase().trim();
    let baseNum = parseInt(rawFee.replace('k', '').replace('ks', '').replace(',', '')) * 1000;
    if (isNaN(baseNum)) baseNum = 25000;

    let selectFeeStr = baseNum.toLocaleString() + 'Ks';
    let commissionNum = baseNum * 0.1;
    let commissionStr = commissionNum.toLocaleString() + 'Ks';
    let totalNum = baseNum + commissionNum;
    let totalStr = totalNum.toLocaleString() + 'Ks';
    
    // Tournament ဟုတ်မဟုတ် စစ်ဆေးခြင်း (formData ထဲမှာ isTournament ပါလာလျှင် သို့မဟုတ် mode က tournament ဖြစ်နေလျှင်)
    let isTournament = formData.isTournament || (formData.mode && formData.mode.toLowerCase().includes('slot'));

    let winnerPriceStr = "";
    let matchFormatOrSlot = "";
    let prizeBg = "";
    let prizeBorder = "";
    let prizeShadow = "";
    let titleColor = "";
    let amountColor = "";

    if (isTournament) {
        // Tournament အတွက် သီးသန့် သတ်မှတ်ချက်များ
        winnerPriceStr = "400,000Ks";
        matchFormatOrSlot = formData.mode || formData.gameMode || formData.slot || 'Slot 1';
        
        prizeBg = "linear-gradient(135deg, #3f2f04 0%, #714f09 50%, #b45309 100%)";
        prizeBorder = "#fbbf24";
        prizeShadow = "0 0 25px rgba(251, 191, 36, 0.5), inset 0 0 15px rgba(254, 240, 138, 0.4)";
        titleColor = "#fef08a";
        amountColor = "#fde047";
    } else {
        // ပုံမှန် 5vs5 / 1vs1 အတွက် မူလအတိုင်း
        let winnerPriceNum = baseNum * 2;
        winnerPriceStr = winnerPriceNum.toLocaleString() + 'Ks';
        
        let currentMode = formData.mode || formData.gameMode || '5vs5';
        matchFormatOrSlot = currentMode.toLowerCase().includes('1vs1') ? '1vs1' : '5vs5';
        
        if (baseNum === 5000) {
            prizeBg = "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)";
            prizeBorder = "#d97706";
            prizeShadow = "0 0 12px rgba(217, 119, 6, 0.3)";
            titleColor = "#fde68a";
            amountColor = "#fbbf24";
        } else if (baseNum === 10000) {
            prizeBg = "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)";
            prizeBorder = "#38bdf8";
            prizeShadow = "0 0 20px rgba(56, 189, 248, 0.45), inset 0 0 10px rgba(125, 211, 252, 0.3)";
            titleColor = "#e0f2fe";
            amountColor = "#38bdf8";
        } else if (baseNum === 15000) {
            prizeBg = "linear-gradient(135deg, #431407 0%, #7c2d12 50%, #c2410c 100%)";
            prizeBorder = "#fb923c";
            prizeShadow = "0 0 18px rgba(251, 146, 60, 0.45)";
            titleColor = "#ffedd5";
            amountColor = "#fdba74";
        } else if (baseNum === 25000) {
            prizeBg = "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)";
            prizeBorder = "#a855f7";
            prizeShadow = "0 0 18px rgba(168, 85, 247, 0.45)";
            titleColor = "#e9d5ff";
            amountColor = "#facc15";
        } else {
            prizeBg = "linear-gradient(135deg, #3f2f04 0%, #714f09 50%, #b45309 100%)";
            prizeBorder = "#fbbf24";
            prizeShadow = "0 0 25px rgba(251, 191, 36, 0.5), inset 0 0 15px rgba(254, 240, 138, 0.4)";
            titleColor = "#fef08a";
            amountColor = "#fde047";
        }
    }

    // Match format (BO1/BO3) ကို ပုံမှန်အတွက်သာ သုံးရန်
    let matchFormat = (baseNum <= 15000) ? "BO1" : "BO3";

    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 12px 15px 12px; box-sizing: border-box; overflow-y: auto; position: relative;">
            <h2 style="color: #f8fafc; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Payment Details</h2>
            
            <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 340px; padding-bottom: 25px;">
                
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

                <!-- Winner Prize Box -->
                <div style="position: relative; background: ${prizeBg}; border: 1.5px solid ${prizeBorder}; border-radius: 10px; padding: 10px; text-align: center; box-shadow: ${prizeShadow};">
                    <span style="display: block; color: ${titleColor}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 2px; text-shadow: 0 0 8px rgba(255,255,255,0.4);">${isTournament ? '⚡ CHAMPION PRIZE ⚡' : '⚡ WINNER PRIZE ⚡'}</span>
                    <span style="display: block; color: ${amountColor}; font-size: 24px; font-weight: 900; text-shadow: 0 0 12px rgba(0,0,0,0.8);">${winnerPriceStr}</span>
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

                    <!-- Mode / Slot Checkbox Section -->
                    <div style="display: flex; align-items: center; justify-content: space-between; background-color: #1e293b; padding: 10px 12px; border-radius: 8px; border: 1px solid #475569;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="mode-checkbox" data-game-mode="${matchFormatOrSlot}" style="width: 17px; height: 17px; accent-color: #38bdf8; cursor: pointer;">
                            <label for="mode-checkbox" style="color: #f8fafc; font-size: 12.5px; font-weight: 700; cursor: pointer;">${isTournament ? 'Confirm ' + matchFormatOrSlot : matchFormatOrSlot + ' Mode'}</label>
                        </div>
                        <span style="background: ${isTournament ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : (matchFormat === 'BO1' ? '#0ea5e9' : 'linear-gradient(135deg, #6366f1, #a855f7)')}; color: white; font-size: 10.5px; font-weight: 800; padding: 3px 10px; border-radius: 5px;">${isTournament ? 'Tournament' : matchFormat}</span>
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
    
    let base64SS = formData.ssBase64 || null;
    let ssUploaded = false;

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

    document.getElementById('pay-back-btn').addEventListener('click', () => {
        const updatedDataForBack = {
            ...formData,
            ssBase64: base64SS
        };
        renderRegisterForm(appContent, updatedDataForBack);
    });

    confirmBtn.addEventListener('click', () => {
        if (confirmBtn.disabled) return;

        const finalPayload = {
            ...formData,
            ssBase64: base64SS,
            totalFee: totalStr,
            winnerPrice: winnerPriceStr,
            matchFormat: isTournament ? 'Tournament' : matchFormat,
            selectedGameMode: matchFormatOrSlot
        };

        console.log("Backend Payload Ready:", finalPayload);

        const notiTitle = `${matchFormatOrSlot} Registration Submitted`;
        const notiMessage = `${matchFormatOrSlot} fee ${totalStr} အတွက် register တင်ထားပါသည်။ Admin မှ စစ်ဆေးပြီးလျှင် noti ပြန်တက်မည်။`;
        
        addNotification(notiTitle, notiMessage);

        renderModeScreen(appContent);
    });
}