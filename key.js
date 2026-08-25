export function initKeyManagement() {
    const keyCardBtn = document.getElementById('key-card-btn');
    if (!keyCardBtn) return;

    let keyData = JSON.parse(localStorage.getItem('user_key_inventory_v2')) || {
        modes: {
            '5v5': { '5k': 3, '10k': 1, '15k': 0, '25k': 0, '50k': 0 },
            '1v1': { '5k': 2, '10k': 0, '15k': 1, '25k': 0, '50k': 0 },
            'tournament': { 'pass': 1 }
        }
    };

    function getKeyValues(type) {
        switch(type) {
            case '5k': return 5000;
            case '10k': return 10000;
            case '15k': return 15000;
            case '25k': return 25000;
            case '50k': return 50000;
            default: return 0;
        }
    }

    function calculateTotalBalance(data) {
        let total = 0;
        ['5v5', '1v1'].forEach(mode => {
            for (let type in data.modes[mode]) {
                total += (data.modes[mode][type] || 0) * getKeyValues(type);
            }
        });
        return total;
    }

    const modalHTML = `
        <div class="key-modal-overlay" id="key-management-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            display: flex; align-items: center; justify-content: center; z-index: 10000;
            opacity: 0; visibility: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box;">
            
            <div class="key-modal-content" style="
                background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(56, 189, 248, 0.4);
                border-radius: 24px; padding: 18px; width: 94%; max-width: 390px;
                max-height: 94vh; overflow-y: auto; color: #f8fafc;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.25);
                transform: scale(0.85); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px;">
                    <div>
                        <h3 style="margin: 0; color: #38bdf8; font-size: 14px; letter-spacing: 0.5px; font-weight: 700;">KEY MANAGEMENT</h3>
                        <p style="margin: 2px 0 0 0; font-size: 9.5px; color: #94a3b8;">Cyber Secure Vault</p>
                    </div>
                    <div style="background: rgba(192, 132, 252, 0.15); border: 1px solid rgba(192, 132, 252, 0.4); padding: 5px 10px; border-radius: 10px; text-align: right;">
                        <div style="font-size: 8.5px; color: #d8b4fe; text-transform: uppercase; font-weight: 600;">Total Balance</div>
                        <div style="font-size: 12px; color: #f8fafc; font-weight: bold;" id="vault-total-balance">
                            ${calculateTotalBalance(keyData).toLocaleString()} Ks
                        </div>
                    </div>
                </div>

                <!-- 5v5 Mode Keys -->
                <div style="margin-bottom: 10px;">
                    <div style="font-size: 10px; font-weight: 600; color: #38bdf8; margin-bottom: 4px; letter-spacing: 0.5px;">5v5 MODE KEYS</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;" id="grid-5v5">
                        ${renderKeys('5v5', ['5k', '10k', '15k', '25k', '50k'], keyData)}
                    </div>
                </div>

                <!-- 1v1 Mode Keys -->
                <div style="margin-bottom: 10px;">
                    <div style="font-size: 10px; font-weight: 600; color: #38bdf8; margin-bottom: 4px; letter-spacing: 0.5px;">1v1 MODE KEYS</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;" id="grid-1v1">
                        ${renderKeys('1v1', ['5k', '10k', '15k', '25k', '50k'], keyData)}
                    </div>
                </div>

                <!-- Tournament Key -->
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 10px; font-weight: 600; color: #c084fc; margin-bottom: 4px; letter-spacing: 0.5px;">TOURNAMENT KEY</div>
                    <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 10px; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 9.5px; color: #94a3b8;">Tournament Pass</span>
                        <span style="font-size: 12px; font-weight: bold; color: #c084fc;">${keyData.modes.tournament.pass} pcs</span>
                    </div>
                </div>

                <!-- Refund System Box -->
                <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 16px; padding: 12px; margin-bottom: 12px;">
                    <div style="font-size: 11.5px; font-weight: bold; color: #38bdf8; margin-bottom: 8px;">Key Refund System</div>
                    
                    <!-- Dropdowns Selection -->
                    <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 10px;">
                        <select id="refund-key-select" style="
                            flex: 1.2; background: rgba(15, 23, 42, 0.95); border: 1px solid #334155;
                            border-radius: 10px; color: #f8fafc; padding: 8px; font-size: 10.5px; outline: none; cursor: pointer;">
                            <option value="" disabled selected style="color: #64748b;">Select key...</option>
                            ${generateDropdownOptions(keyData)}
                        </select>
                        
                        <select id="refund-qty-select" style="
                            flex: 0.8; background: rgba(15, 23, 42, 0.95); border: 1px solid #334155;
                            border-radius: 10px; color: #f8fafc; padding: 8px; font-size: 10.5px; outline: none; cursor: pointer;">
                            <option value="" disabled selected>Qty...</option>
                        </select>
                    </div>

                    <!-- Info Text (Larger & Clearer) -->
                    <div id="refund-info-text" style="font-size: 11.5px; color: #38bdf8; font-weight: bold; line-height: 1.4; min-height: 32px; margin-bottom: 10px; background: rgba(56, 189, 248, 0.12); border-left: 3px solid #38bdf8; padding: 8px 10px; border-radius: 0 8px 8px 0;">
                        Please select a key and quantity to view refund details.
                    </div>

                    <!-- KPay Inputs Container (Initially Hidden, appears after selecting key & qty) -->
                    <div id="kpay-inputs-container" style="display: none; flex-direction: column; gap: 8px; margin-bottom: 10px; background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3);">
                        <div style="font-size: 10.5px; font-weight: bold; color: #cbd5e1; margin-bottom: 2px;">Enter KPay Details to Proceed:</div>
                        <div>
                            <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">KPay Account Name</div>
                            <input type="text" id="kpay-name" placeholder="ဥပမာ - Mg Mg" style="
                                width: 100%; background: rgba(15, 23, 42, 0.95); border: 1px solid #334155;
                                border-radius: 8px; color: #f8fafc; padding: 8px 10px; font-size: 11px; outline: none; box-sizing: border-box;">
                        </div>
                        <div>
                            <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">KPay Phone Number</div>
                            <input type="text" id="kpay-phone" placeholder="ဥပမာ - 09xxxxxxxxx" style="
                                width: 100%; background: rgba(15, 23, 42, 0.95); border: 1px solid #334155;
                                border-radius: 8px; color: #f8fafc; padding: 8px 10px; font-size: 11px; outline: none; box-sizing: border-box;">
                        </div>
                    </div>

                    <button id="execute-refund-btn" style="
                        width: 100%; background: linear-gradient(135deg, #ef4444, #dc2626); border: none;
                        border-radius: 10px; color: white; padding: 10px; font-size: 12px;
                        font-weight: bold; cursor: pointer; box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);">
                        Confirm & Refund
                    </button>
                </div>

                <button id="close-key-modal" style="
                    width: 100%; background: linear-gradient(135deg, #0284c7, #9333ea);
                    border: none; border-radius: 12px; color: white; padding: 9px;
                    font-size: 11.5px; font-weight: bold; cursor: pointer;
                    box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);">Close</button>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('key-management-modal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalOverlay = document.getElementById('key-management-modal');
    const modalContent = modalOverlay.querySelector('.key-modal-content');
    const refundSelect = document.getElementById('refund-key-select');
    const qtySelect = document.getElementById('refund-qty-select');
    const refundInfoText = document.getElementById('refund-info-text');
    const kpayInputsContainer = document.getElementById('kpay-inputs-container');
    const kpayNameInput = document.getElementById('kpay-name');
    const kpayPhoneInput = document.getElementById('kpay-phone');

    keyCardBtn.addEventListener('click', () => {
        modalOverlay.style.opacity = '1';
        modalOverlay.style.visibility = 'visible';
        modalContent.style.transform = 'scale(1)';
    });

    const closeModal = () => {
        modalContent.style.transform = 'scale(0.85)';
        modalOverlay.style.opacity = '0';
        modalOverlay.style.visibility = 'hidden';
    };

    document.getElementById('close-key-modal').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    function generateDropdownOptions(data) {
        let options = '';
        ['5v5', '1v1'].forEach(mode => {
            for (let type in data.modes[mode]) {
                let count = data.modes[mode][type] || 0;
                if (count > 0) {
                    options += `<option value="${mode}_${type}">${mode.toUpperCase()} - ${type.toUpperCase()} (${count} pcs)</option>`;
                }
            }
        });
        return options;
    }

    refundSelect.addEventListener('change', () => {
        const val = refundSelect.value;
        if (!val) return;
        const [mode, type] = val.split('_');
        const maxCount = keyData.modes[mode][type];
        
        let qtyOptions = '<option value="" disabled selected>Qty...</option>';
        for (let i = 1; i <= maxCount; i++) {
            qtyOptions += `<option value="${i}">${i} pcs</option>`;
        }
        qtySelect.innerHTML = qtyOptions;
        kpayInputsContainer.style.display = 'none'; // Key ပြောင်းရင် KPay box ခဏပြန်ပိတ်မယ်
        updateInfoText();
    });

    qtySelect.addEventListener('change', () => {
        updateInfoText();
        if (refundSelect.value && qtySelect.value) {
            kpayInputsContainer.style.display = 'flex'; // Key နဲ့ Qty နှစ်ခုစလုံးရွေးပြီးမှ KPay box ပေါ်လာမည်
        } else {
            kpayInputsContainer.style.display = 'none';
        }
    });

    function updateInfoText() {
        const val = refundSelect.value;
        const qty = parseInt(qtySelect.value);
        if (!val || !qty) {
            refundInfoText.innerText = "Please select a key and quantity to view refund details.";
            return;
        }
        const [mode, type] = val.split('_');
        const unitVal = getKeyValues(type);
        const totalVal = (unitVal * qty).toLocaleString();
        refundInfoText.innerText = `${mode.toUpperCase()} (${type.toUpperCase()}) Key ${qty} ခု အတွက် ငွေကျပ် ${totalVal} ကို KPay ဖြင့် ထုတ်ယူမည်။`;
    }

    function renderKeys(mode, types, data) {
        return types.map(type => {
            let count = data.modes[mode][type] || 0;
            return `
                <div style="
                    background: rgba(2, 6, 23, 0.5); 
                    border: 1px solid ${count > 0 ? 'rgba(56, 189, 248, 0.5)' : 'rgba(51, 65, 85, 0.5)'}; 
                    border-radius: 8px; padding: 5px 2px; text-align: center; box-sizing: border-box;">
                    <div style="font-size: 8px; color: #94a3b8; margin-bottom: 2px;">${type.toUpperCase()}</div>
                    <div style="font-size: 11.5px; font-weight: bold; color: ${count > 0 ? '#38bdf8' : '#64748b'};">
                        ${count} <span style="font-size: 7px; font-weight: normal;">pcs</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    const executeRefundBtn = document.getElementById('execute-refund-btn');

    executeRefundBtn.addEventListener('click', () => {
        const selectedVal = refundSelect.value;
        const qty = parseInt(qtySelect.value);
        const kpayName = kpayNameInput.value.trim();
        const kpayPhone = kpayPhoneInput.value.trim();

        if (!selectedVal || !qty) {
            alert('ကျေးဇူးပြု၍ Refund လုပ်မည့် Key နှင့် အရေအတွက်ကို အရင်ရွေးချယ်ပါ။');
            return;
        }

        if (!kpayName || !kpayPhone) {
            alert('ကျေးဇူးပြု၍ KPay အမည်နှင့် ဖုန်းနံပါတ်ကို ဖြည့်စွက်ပေးပါ။');
            return;
        }

        const [mode, type] = selectedVal.split('_');
        const unitVal = getKeyValues(type);
        const totalVal = unitVal * qty;

        const isConfirmed = confirm(`အတည်ပြုမည် - ${mode.toUpperCase()} ${type.toUpperCase()} Key (${qty} pcs) အတွက် ငွေကျပ် ${totalVal.toLocaleString()} ကို ${kpayName} (${kpayPhone}) သို့ KPay ဖြင့် လွှဲပေးရန် တောင်းဆိုမည်မှာ သေချာပါသလား?`);
        if (!isConfirmed) return;

        if (keyData.modes[mode] && keyData.modes[mode][type] >= qty) {
            keyData.modes[mode][type] -= qty;
            localStorage.setItem('user_key_inventory_v2', JSON.stringify(keyData));
            updateUI(keyData);
            alert(`အောင်မြင်ပါသည်! ${qty} pcs Refund တောင်းဆိုမှု တင်ပြီးပါပြီ။`);
        } else {
            alert('အရေအတွက် မလုံလောက်ပါ။');
        }
    });

    function updateUI(data) {
        document.getElementById('vault-total-balance').innerText = calculateTotalBalance(data).toLocaleString() + ' Ks';
        document.getElementById('grid-5v5').innerHTML = renderKeys('5v5', ['5k', '10k', '15k', '25k', '50k'], data);
        document.getElementById('grid-1v1').innerHTML = renderKeys('1v1', ['5k', '10k', '15k', '25k', '50k'], data);
        refundSelect.innerHTML = `<option value="" disabled selected style="color: #64748b;">Select key...</option>` + generateDropdownOptions(data);
        qtySelect.innerHTML = `<option value="" disabled selected>Qty...</option>`;
        refundInfoText.innerText = "Please select a key and quantity to view refund details.";
        kpayInputsContainer.style.display = 'none';
        kpayNameInput.value = '';
        kpayPhoneInput.value = '';
    }
}