// Mode ရွေးချယ်သည့် မျက်နှာပြင်နှင့် လုပ်ဆောင်ချက်များကို ကိုင်တွယ်ရန်
export function renderModeScreen(container) {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 30px; width: 100%; height: 100%; padding: 2px 20px 10px 20px; box-sizing: border-box; overflow: hidden;">
            <h2 style="color: #f8fafc; font-size: 22px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Eternal Aura</h2>
            
            <div style="display: flex; flex-direction: column; gap: 30px; width: 100%; max-width: 320px;">
                
                <!-- 5vs5 Mode Card -->
                <div class="mode-card" data-mode="5vs5" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; cursor: pointer; padding-bottom: 6px; transition: 0.2s;">
                    <img src="5vs5modeEA.jpg" alt="5v5" style="width: 100%; height: 135px; object-fit: cover;">
                    <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 6px; background: linear-gradient(to right, #38bdf8, #e0f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">5 vs 5 Match</span>
                </div>

                <!-- 1vs1 Mode Card -->
                <div class="mode-card" data-mode="1vs1" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; cursor: pointer; padding-bottom: 6px; transition: 0.2s;">
                    <img src="1vs1modeEA.jpg" alt="1v1" style="width: 100%; height: 135px; object-fit: cover;">
                    <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 6px; background: linear-gradient(to right, #38bdf8, #e0f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">1 vs 1 Battle</span>
                </div>

                <!-- Tournament Mode Card -->
                <div class="mode-card" data-mode="tournament" style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; cursor: pointer; padding-bottom: 6px; transition: 0.2s;">
                    <img src="tournmentEA.jpg" alt="Tournament" style="width: 100%; height: 135px; object-fit: cover;">
                    <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 6px; background: linear-gradient(to right, #38bdf8, #e0f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Tournament</span>
                </div>

            </div>
        </div>
    `;

    // ကတ်များကို နှိပ်သည့်အခါ လုပ်ဆောင်ချက်များ
    const modeCards = container.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const selectedMode = e.currentTarget.getAttribute('data-mode');
            handleModeSelection(selectedMode);
        });
    });
}

function handleModeSelection(mode) {
    console.log(`Selected Mode: ${mode}`);
    
    const appContent = document.getElementById('app-content');

    switch(mode) {
        case '5vs5':
            renderRegisterForm(appContent);
            break;
        case '1vs1':
            alert("You selected 1 vs 1 Mode!");
            break;
        case 'tournament':
            alert("You selected Tournament Mode!");
            break;
        default:
            break;
    }
}

// ၁။ Registration Form မျက်နှာပြင်
function renderRegisterForm(appContent, savedData = {}) {
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

                <!-- Top Row: Square Logo Box & Squad Name Side by Side -->
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="display: flex; flex-direction: column; gap: 3px;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Logo</label>
                        <label for="sq-logo-input" class="reg-logo-box" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 65px; height: 65px; background-color: #1e293b; border: 1.5px dashed #475569; border-radius: 8px; cursor: pointer; overflow: hidden; position: relative; transition: 0.2s; flex-shrink: 0;" id="logo-preview-box">
                            <span id="logo-text" style="color: #94a3b8; font-size: 11px; font-weight: 600;">Upload</span>
                            <input type="file" id="sq-logo-input" accept="image/*" style="display: none;">
                        </label>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 3px; flex-grow: 1; justify-content: center; height: 100%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Squad Name</label>
                        <input type="text" id="sq-name" class="reg-input" placeholder="Squad Name" value="${savedData.sqName || ''}" required style="width: 100%; height: 42px; padding: 0 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; outline: none; box-sizing: border-box; transition: 0.2s;">
                    </div>
                </div>

                <!-- Players Lineup -->
                <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid #334155; border-bottom: 1px solid #334155; padding: 8px 0;">
                    <span style="color: #38bdf8; font-size: 12px; font-weight: 700;">Player Lineup (Name & ID)</span>
                    
                    <div style="display: flex; gap: 6px;">
                        <input type="text" class="reg-input" placeholder="Roam Name" value="${savedData.roamName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" class="reg-input" placeholder="ID" value="${savedData.roamId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <input type="text" class="reg-input" placeholder="Exp Name" value="${savedData.expName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" class="reg-input" placeholder="ID" value="${savedData.expId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <input type="text" class="reg-input" placeholder="Gold Name" value="${savedData.goldName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" class="reg-input" placeholder="ID" value="${savedData.goldId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <input type="text" class="reg-input" placeholder="Mid Name" value="${savedData.midName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" class="reg-input" placeholder="ID" value="${savedData.midId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <input type="text" class="reg-input" placeholder="Jungle Name" value="${savedData.jungleName || ''}" required style="width: 58%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                        <input type="number" class="reg-input" placeholder="ID" value="${savedData.jungleId || ''}" required style="width: 42%; height: 38px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                </div>

                <!-- Payment & Contact Info -->
                <div style="display: flex; gap: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">KPay Name</label>
                        <input type="text" id="kpay-name" class="reg-input" placeholder="KPay Name" value="${savedData.kpayName || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">KPay Ph No</label>
                        <input type="tel" id="kpay-ph" class="reg-input" placeholder="KPay Ph No" value="${savedData.kpayPh || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                </div>

                <div style="display: flex; gap: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Contact Ph</label>
                        <input type="tel" id="contact-ph" class="reg-input" placeholder="Contact Ph" value="${savedData.contactPh || ''}" required style="width: 100%; height: 40px; padding: 0 8px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 3px; width: 50%; position: relative;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">Entry Fee</label>
                        <div id="fee-dropdown-btn" class="reg-input" style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 40px; padding: 0 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #38bdf8; font-size: 12px; font-weight: 700; cursor: pointer; box-sizing: border-box;">
                            <span id="selected-fee-text">${savedData.fee || 'Select Fee'}</span>
                            <span style="font-size: 10px; color: #94a3b8;">▼</span>
                        </div>

                        <div id="fee-modal" style="display: none; position: absolute; bottom: 48px; left: 0; width: 100%; background-color: #0f172a; border: 1px solid #334155; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 100; overflow: hidden;">
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

                <!-- Back & Next Buttons -->
                <div style="display: flex; gap: 8px; margin-top: 6px;">
                    <button type="button" id="back-btn" style="width: 50%; height: 42px; background-color: #334155; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Back</button>
                    <button type="submit" style="width: 50%; height: 42px; background-color: #38bdf8; color: #0f172a; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Next</button>
                </div>
            </form>
        </div>
    `;

    // Dropdown Logic
    const feeBtn = document.getElementById('fee-dropdown-btn');
    const feeModal = document.getElementById('fee-modal');
    const feeText = document.getElementById('selected-fee-text');
    const feeHiddenInput = document.getElementById('fee-value');

    feeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        feeModal.style.display = feeModal.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('.fee-option').forEach(option => {
        option.addEventListener('click', function() {
            const val = this.getAttribute('data-value');
            feeText.textContent = val;
            feeHiddenInput.value = val;
            feeModal.style.display = 'none';
        });
    });

    document.addEventListener('click', () => {
        feeModal.style.display = 'none';
    });

    // Form Submit (Next Button) - အကုန်ဖြည့်ပြီးမှ နောက် Page သို့သွားမည်
    document.getElementById('reg-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (!feeHiddenInput.value) {
            alert("ကျေးဇူးပြု၍ Entry Fee တစ်ခု ရွေးချယ်ပေးပါရှင့်။");
            return;
        }

        // ဖြည့်ထားသော Data များကို သိမ်းဆည်းမည်
        const formData = {
            sqName: document.getElementById('sq-name').value,
            roamName: document.querySelectorAll('#reg-form input')[2].value,
            roamId: document.querySelectorAll('#reg-form input')[3].value,
            kpayName: document.getElementById('kpay-name').value,
            kpayPh: document.getElementById('kpay-ph').value,
            contactPh: document.getElementById('contact-ph').value,
            fee: feeHiddenInput.value
        };

        renderPaymentPage(appContent, formData);
    });

    document.getElementById('back-btn').addEventListener('click', () => {
        renderModeScreen(appContent);
    });
}

// ၂. QR ပုံနှင့် 10% ပိုလွှဲရန် ပါဝင်သော Payment Page
function renderPaymentPage(appContent, formData) {
    // Fee တန်ဖိုး (ဥပမာ 10k -> 10000) ကိုတွက်ချက်ပြီး 10% ပေါင်းမည်
    let baseFeeNum = parseInt(formData.fee.replace('k', '')) * 1000;
    let extraFee = baseFeeNum * 0.10;
    let totalPay = baseFeeNum + extraFee;
    let totalPayFormatted = (totalPay / 1000) + 'k';

    appContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; height: 100%; padding: 4px 14px 10px 14px; box-sizing: border-box; overflow-y: auto;">
            <h2 style="color: #f8fafc; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 0 0 6px 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Payment & QR Verification</h2>
            
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 340px; padding-bottom: 30px;">
                
                <!-- Notice Box for 10% Extra Fee -->
                <div style="background-color: #1e293b; border: 1px solid #38bdf8; border-radius: 8px; padding: 10px; text-align: center;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0 0 4px 0;">ရွေးချယ်ထားသောကြေး (${formData.fee}) ၏ 10% ပိုမိုလွှဲပေးရမည်ဖြစ်ပါသည်</p>
                    <p style="color: #38bdf8; font-size: 15px; font-weight: 800; margin: 0;">စုစုပေါင်းလွှဲရမည့်ငွေ: ${totalPayFormatted}</p>
                </div>

                <!-- QR Code Display Box -->
                <div style="display: flex; flex-direction: column; align-items: center; background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px;">
                    <span style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 8px;">KBZPay QR Code</span>
                    <div style="width: 120px; height: 120px; background-color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <!-- QR Image ထည့်ရန်နေရာ -->
                        <img src="qr-placeholder.png" alt="QR Code" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <span style="display: none; color: #0f172a; font-size: 10px; font-weight: 700; text-align: center;">[ QR Code Image ]</span>
                    </div>
                    <span style="color: #94a3b8; font-size: 11px; margin-top: 6px;">Acc Name: Ko Ko / Ph: 09987654321</span>
                </div>

                <!-- Screenshot (SS) Upload Section -->
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="color: #94a3b8; font-size: 11px; font-weight: 600;">ငွေလွှဲပြီး Screenshot (SS) တင်ရန်</label>
                    <label for="ss-file-input" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 42px; background-color: #1e293b; border: 1.5px dashed #475569; border-radius: 8px; cursor: pointer; color: #38bdf8; font-size: 12px; font-weight: 600;" id="ss-preview-box">
                        <span id="ss-text">📷 Choose SS Image</span>
                        <input type="file" id="ss-file-input" accept="image/*" style="display: none;" required>
                    </label>
                </div>

                <!-- Back & Confirm Buttons -->
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <button type="button" id="pay-back-btn" style="width: 50%; height: 42px; background-color: #334155; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Back</button>
                    <button type="button" id="confirm-btn" style="width: 50%; height: 42px; background-color: #22c55e; color: #0f172a; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;">Confirm</button>
                </div>
            </div>
        </div>
    `;

    // SS Upload preview logic
    const ssInput = document.getElementById('ss-file-input');
    const ssBox = document.getElementById('ss-preview-box');
    const ssText = document.getElementById('ss-text');

    ssInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            ssText.textContent = "✔ SS Uploaded: " + file.name;
            ssBox.style.borderColor = "#22c55e";
            ssBox.style.color = "#22c55e";
        }
    });

    // Back ခလုတ် (Form ဖြည့်လက်စ ချက်ချင်းပေါ်လာစေရန် Data များပြန်ထည့်ပေးသည်)
    document.getElementById('pay-back-btn').addEventListener('click', () => {
        renderRegisterForm(appContent, formData);
    });

    // Confirm ခလုတ်
    document.getElementById('confirm-btn').addEventListener('click', () => {
        if (!ssInput.files[0]) {
            alert("ကျေးဇူးပြု၍ ငွေလွှဲ Screenshot (SS) အရင်တင်ပေးပါရှင့်။");
            return;
        }
        alert("Registration Successful! အချက်အလက်များ အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။");
        renderModeScreen(appContent);
    });
}