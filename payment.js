// payment.js
import { renderRegisterForm as renderTournamentRegister } from './tournamentRegistration.js';
import { renderRegisterForm as renderNormalRegister } from './register.js';
import { renderModeScreen } from './mode.js';
import { addNotification } from './notification.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

export function renderPaymentPage(appContent, formData) {
    let isTournament = !!(formData.selectedSlot || formData.slot);

    let rawFee = isTournament ? '50000' : (formData.fee ? formData.fee.toLowerCase().trim() : '5000');
    
    let baseNum = parseInt(rawFee.replace('k', '').replace('ks', '').replace(',', '')) * (rawFee.includes('k') ? 1000 : 1);
    
    if (isTournament) {
        baseNum = 50000;
    } else if (isNaN(baseNum)) {
        baseNum = 5000;
    }

    let selectFeeStr = baseNum.toLocaleString() + 'Ks';
    let commissionNum = baseNum * 0.1;
    let commissionStr = commissionNum.toLocaleString() + 'Ks';
    let totalNum = baseNum + commissionNum;
    let totalStr = totalNum.toLocaleString() + 'Ks';

    let slotNum = formData.slot || (formData.selectedSlot ? formData.selectedSlot.replace('Slot ', '') : "1");
    let prizeTitle = "⚡ WINNER PRIZE ⚡";
    let prizeAmount = "";
    let prizeBg = "";
    let prizeBorder = "";
    let prizeShadow = "";
    let titleColor = "";
    let amountColor = "";

    if (isTournament) {
        prizeTitle = "🏆 CHAMPION PRIZE 🏆";
        prizeAmount = "400,000Ks";
        prizeBg = "linear-gradient(135deg, #3f2f04 0%, #714f09 50%, #b45309 100%)";
        prizeBorder = "#fbbf24";
        prizeShadow = "0 0 25px rgba(251, 191, 36, 0.5)";
        titleColor = "#fef08a";
        amountColor = "#fde047";
    } else {
        let winnerPriceNum = baseNum * 2;
        prizeAmount = winnerPriceNum.toLocaleString() + 'Ks';
        
        if (baseNum === 5000) {
            prizeBg = "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)";
            prizeBorder = "#d97706";
            prizeShadow = "0 0 12px rgba(217, 119, 6, 0.3)";
            titleColor = "#fde68a";
            amountColor = "#fbbf24";
        } else if (baseNum === 10000) {
            prizeBg = "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)";
            prizeBorder = "#38bdf8";
            prizeShadow = "0 0 20px rgba(56, 189, 248, 0.45)";
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
            prizeShadow = "0 0 25px rgba(251, 191, 36, 0.5)";
            titleColor = "#fef08a";
            amountColor = "#fde047";
        }
    }

    let currentMode = formData.mode || formData.gameMode || '5vs5';
    let displayModeText = isTournament ? `Tournament Slot ${slotNum}` : (currentMode.toLowerCase().includes('1vs1') ? '1vs1 Mode' : '5vs5 Mode');
    let badgeText = isTournament ? "TOUR" : ((baseNum <= 15000) ? "BO1" : "BO3");

    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 12px 15px 12px; box-sizing: border-box; overflow-y: auto; position: relative;">
            <h2 style="color: #f8fafc; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Payment Details</h2>
            
            <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 340px; padding-bottom: 25px;">
                
                <!-- Fee Breakdown Box -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid #334155; border-radius: 8px; padding: 8px 12px; display: flex; flex-direction: column; gap: 3px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                    ${isTournament ? `
                    <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: #94a3b8;">
                        <span>Slot :</span>
                        <span style="color: #fbbf24; font-weight: 700;">Slot ${slotNum}</span>
                    </div>` : ''}
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

                <!-- Prize Box -->
                <div style="position: relative; background: ${prizeBg}; border: 1.5px solid ${prizeBorder}; border-radius: 10px; padding: 10px; text-align: center; box-shadow: ${prizeShadow};">
                    <span style="display: block; color: ${titleColor}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 2px; text-shadow: 0 0 8px rgba(255,255,255,0.4);">${prizeTitle}</span>
                    <span style="display: block; color: ${amountColor}; font-size: 24px; font-weight: 900; text-shadow: 0 0 12px rgba(0,0,0,0.8);">${prizeAmount}</span>
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
                    <div style="display: flex; align-items: center; justify-content: space-between; background-color: #1e293b; padding: 10px 12px; border-radius: 8px; border: 1px solid #475569;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="mode-checkbox" style="width: 17px; height: 17px; accent-color: #38bdf8; cursor: pointer;">
                            <label for="mode-checkbox" style="color: #f8fafc; font-size: 12.5px; font-weight: 700; cursor: pointer;">Confirm ${displayModeText}</label>
                        </div>
                        <span style="background: #334155; color: white; font-size: 10.5px; font-weight: 800; padding: 3px 10px; border-radius: 5px;">${badgeText}</span>
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
            slot: slotNum,
            selectedSlot: isTournament ? `Slot ${slotNum}` : formData.selectedSlot,
            ssBase64: base64SS
        };

        if (isTournament) {
            renderTournamentRegister(appContent, updatedDataForBack);
        } else {
            renderNormalRegister(appContent, updatedDataForBack);
        }
    });  

    confirmBtn.addEventListener('click', async () => {
        if (confirmBtn.disabled) return;

        let modeType = '5vs5'; 
        if (isTournament) {
            modeType = 'tournament';
        } else if (currentMode.toLowerCase().includes('1vs1')) {
            modeType = '1vs1';
        }

        const currentUserId = localStorage.getItem('userId') || localStorage.getItem('activeUserId') || formData.userId || 'guest_user';
        
        const requestBody = {
            mode: modeType,
            data: {
                ...formData,
                userId: currentUserId,
                logo: formData.logoBase64 || formData.teamLogo || formData.logo || '',
                paymentSlip: base64SS || formData.paymentSlip || '',
                teamLogo: formData.teamLogo || formData.logoBase64 || formData.logo || '',
                paymentSlipUrl: base64SS || formData.paymentSlipUrl || '',
                slot: slotNum,
                totalFee: totalStr,
                matchFormat: badgeText,
                selectedGameMode: displayModeText
            }
        };

        confirmBtn.disabled = true;
        confirmBtn.textContent = "Submitting...";

        console.log("🚀 Submitting Register Request...", requestBody);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();
            console.log("📥 Register Response Result:", result);

            if (result.success) {
                const notiTitle = `${displayModeText} Registration Submitted`;
                const notiMessage = `${displayModeText} fee ${totalStr} အတွက် register တင်ထားပါသည်။ Admin မှ စစ်ဆေးပြီးလျှင် noti ပြန်တက်မည်။`;
                
                addNotification(currentUserId, notiTitle, notiMessage);
                alert("စာရင်းပေးသွင်းခြင်း အောင်မြင်ပါသည်ရှင့်!");

                const regId = result.registrationId || result.id;
                console.log("🆔 Registration ID ရရှိပါပြီ:", regId);

                if (regId) {
                    console.log("⏳ Real-time Status Listener (`onSnapshot`) စတင်ပါပြီ...");
                    
                    let collectionName = '5vs5_registrations';
                    if (isTournament) {
                        collectionName = 'tournament_registrations';
                    } else if (modeType === '1vs1') {
                        collectionName = '1vs1_registrations';
                    }

                    const docRef = doc(db, collectionName, regId);
                    const unsubscribe = onSnapshot(docRef, (docSnap) => {
                        if (docSnap.exists()) {
                            const checkData = docSnap.data();
                            console.log("📊 Real-time Status Update:", checkData.status);

                            if (checkData.status === 'CONFIRMED') {
                                console.log("✅ Admin အတည်ပြုပြီးပါပြီ!");
                                const confTitle = `${displayModeText} Confirmed! 🎉`;
                                const confMessage = `${displayModeText} fee ${totalStr} အတွက် register တင်ပြမှုကို Admin မှ အတည်ပြုပေးလိုက်ပါပြီရှင့်။`;
                                
                                addNotification(currentUserId, confTitle, confMessage);
                                unsubscribe();
                            } else if (checkData.status === 'REJECTED') {
                                console.log("❌ Registration ပယ်ချခံရပါသည်!");
                                const rejTitle = `${displayModeText} Rejected ❌`;
                                const reason = checkData.rejectionReason || "အခြားအကြောင်းပြချက်ဖြင့် ပယ်ချပါသည်";
                                const rejMessage = `${displayModeText} fee ${totalStr} အတွက် Register ကို ပယ်ချလိုက်ပါသည်။\n\n📝 အကြောင်းရင်း: ${reason}`;
                                
                                addNotification(currentUserId, rejTitle, rejMessage);
                                unsubscribe();
                            }
                        }
                    }, (error) => {
                        console.error("⚠️ Snapshot Error ဖြစ်နေပါသည်:", error);
                    });

                } else {
                    console.warn("⚠️ Registration ID မပါလာပါ။");
                }

            } else {
                alert("အမှားအယွင်းရှိပါသည်: " + (result.message || "Unknown error"));
                confirmBtn.disabled = false;
                confirmBtn.textContent = "Confirm";
            }
        } catch (error) {
            console.error("❌ Submission Error:", error);
            alert("Logo ပြောင်းတင်ပေးပါ");
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Confirm";
        }
    });
}

async function handleNotificationClick(notificationId) {
    try {
        await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });

        updateNotificationBadge(); 
    } catch (err) {
        console.error("Failed to mark notification as read", err);
    }
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read && !n.isRead).length;
    const badgeElement = document.getElementById('notification-badge'); 

    if (badgeElement) {
        if (unreadCount > 0) {
            badgeElement.textContent = unreadCount;
            badgeElement.style.display = 'inline-block'; 
        } else {
            badgeElement.textContent = '';
            badgeElement.style.display = 'none'; 
        }
    }
}