// payment.js
import { renderRegisterForm } from './register.js';
import { renderModeScreen } from './mode.js';

export function renderPaymentPage(appContent, formData) {
    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 14px 10px 14px; box-sizing: border-box; overflow-y: auto;">
            <h2 style="color: #f8fafc; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 0 0 10px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Payment Details</h2>
            
            <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 340px; padding-bottom: 30px;">
                
                <div style="background-color: #1e293b; border: 1px solid #10b981; border-radius: 8px; padding: 12px; text-align: center;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px 0;">Selected Fee: <span style="color: white; font-weight: bold;">${formData.fee}</span> ( + 10% )</p>
                    <p style="color: #10b981; font-size: 16px; font-weight: 800; margin: 0;">စုစုပေါင်းလွှဲရမည့်ငွေ - ${formData.totalVal}</p>
                </div>

                <div style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px;">
                    <span style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 8px;">KBZPay QR Code</span>
                    <div style="width: 120px; height: 120px; background-color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="qr-placeholder.png" alt="QR Code" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <span style="display: none; color: #0f172a; font-size: 10px; font-weight: 700; text-align: center;">[ Insert QR Here ]</span>
                    </div>
                    <span style="color: #94a3b8; font-size: 11px; margin-top: 6px;">Acc Name: Ko Ko / Ph: 09987654321</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">ငွေလွှဲပြီး Screenshot (SS) တင်ရန် <span style="color: #ef4444;">*</span></label>
                    <label for="ss-file-input" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 120px; background-color: #1e293b; border: 1.5px dashed #475569; border-radius: 8px; cursor: pointer; color: #38bdf8; font-size: 12px; font-weight: 600; overflow: hidden; position: relative;" id="ss-preview-box">
                        <span id="ss-text">📷 Click to Upload SS</span>
                        <input type="file" id="ss-file-input" accept="image/*" style="display: none;">
                    </label>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <button type="button" id="pay-back-btn" style="width: 50%; height: 42px; background-color: #334155; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Back</button>
                    <button type="button" id="confirm-btn" style="width: 50%; height: 42px; background-color: #22c55e; color: #0f172a; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Confirm</button>
                </div>
            </div>
        </div>
    `;

    const ssInput = document.getElementById('ss-file-input');
    const ssBox = document.getElementById('ss-preview-box');
    const ssText = document.getElementById('ss-text');
    let ssUploaded = false;

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
                ssBox.style.borderColor = '#10b981';
                ssText.style.display = 'none';
                ssUploaded = true;
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('pay-back-btn').addEventListener('click', () => {
        renderRegisterForm(appContent, formData);
    });

    document.getElementById('confirm-btn').addEventListener('click', () => {
        if (!ssUploaded) {
            alert("ကျေးဇူးပြု၍ ငွေလွှဲထားသော Screenshot (SS) အရင်တင်ပေးပါရှင့်။");
            return;
        }
        alert("Registration Successful! အချက်အလက်များ အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။");
        renderModeScreen(appContent);
    });
}