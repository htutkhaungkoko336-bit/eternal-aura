export function initKeyManagement(userDataFromBackend) {
    const keyCardBtn = document.getElementById('key-card-btn');
    if (!keyCardBtn) return;

    // Backend ကနေ ဝင်လာတဲ့ user ရဲ့ keys များကို ယူသုံးမည် (မရှိလျှင် 0 ဖြင့် A စဉ်မည်)
    let userKeys = userDataFromBackend?.keys || {
        "1vs1-5k": 0, "1vs1-10k": 0, "1vs1-15k": 0, "1vs1-25k": 0, "1vs1-50k": 0,
        "5vs5-5k": 0, "5vs5-10k": 0, "5vs5-15k": 0, "5vs5-25k": 0, "5vs5-50k": 0,
        "tournament": 0
    };

    function getKeyValues(keyName) {
        if (keyName.includes('5k')) return 5000;
        if (keyName.includes('10k')) return 10000;
        if (keyName.includes('15k')) return 15000;
        if (keyName.includes('25k')) return 25000;
        if (keyName.includes('50k')) return 50000;
        return 0;
    }

    function calculateTotalBalance(keysObj) {
        let total = 0;
        for (let key in keysObj) {
            if (key === 'tournament') continue;
            total += (keysObj[key] || 0) * getKeyValues(key);
        }
        return total;
    }

    // Keys များကို 1vs1 နှင့် 5vs5 ဟူ၍ အလိုအလျောက် ခွဲထုတ်ရန်
    const keys1vs1 = Object.keys(userKeys).filter(k => k.startsWith('1vs1'));
    const keys5vs5 = Object.keys(userKeys).filter(k => k.startsWith('5vs5'));
    const tournamentCount = userKeys['tournament'] || 0;

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
                
                <style>
                    .custom-dropdown-option:hover {
                        background-color: #334155 !important;
                        color: #38bdf8 !important;
                    }
                </style>

                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px;">
                    <div>
                        <h3 style="margin: 0; color: #38bdf8; font-size: 14px; letter-spacing: 0.5px; font-weight: 700;">KEY MANAGEMENT</h3>
                        <p style="margin: 2px 0 0 0; font-size: 9.5px; color: #94a3b8;">Cyber & iOS Secure Vault</p>
                    </div>
                    <div style="background: rgba(192, 132, 252, 0.15); border: 1px solid rgba(192, 132, 252, 0.4); padding: 5px 10px; border-radius: 10px; text-align: right;">
                        <div style="font-size: 8.5px; color: #d8b4fe; text-transform: uppercase; font-weight: 600;">TOTAL BALANCE</div>
                        <div style="font-size: 12px; color: #f8fafc; font-weight: bold;" id="vault-total-balance">
                            ${calculateTotalBalance(userKeys).toLocaleString()} Ks
                        </div>
                    </div>
                </div>

                <!-- 1v1 Mode Keys -->
                <div style="margin-bottom: 10px;">
                    <div style="font-size: 10px; font-weight: 600; color: #38bdf8; margin-bottom: 4px; letter-spacing: 0.5px;">1v1 MODE KEYS</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;" id="grid-1v1">
                        ${renderKeys(keys1vs1, userKeys)}
                    </div>
                </div>

                <!-- 5v5 Mode Keys -->
                <div style="margin-bottom: 10px;">
                    <div style="font-size: 10px; font-weight: 600; color: #38bdf8; margin-bottom: 4px; letter-spacing: 0.5px;">5v5 MODE KEYS</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;" id="grid-5v5">
                        ${renderKeys(keys5vs5, userKeys)}
                    </div>
                </div>

                <!-- Tournament Key -->
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 10px; font-weight: 600; color: #c084fc; margin-bottom: 4px; letter-spacing: 0.5px;">TOURNAMENT KEY</div>
                    <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 10px; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 9.5px; color: #94a3b8;">Tournament Pass</span>
                        <span style="font-size: 12px; font-weight: bold; color: #c084fc;" id="tournament-val-display">${tournamentCount} pcs</span>
                    </div>
                </div>

                <!-- Key Refund System Card -->
                <div id="refund-card-container" style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 16px; padding: 12px; margin-bottom: 12px;">
                    <div style="font-size: 11px; font-weight: bold; color: #38bdf8; margin-bottom: 8px;">Key Refund System</div>
                    
                    <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 8px;">
                        
                        <!-- State A: Custom Dropdowns Area -->
                        <div id="dropdowns-group" style="display: flex; gap: 6px; flex: 1;">
                            
                            <!-- 1. Key Select Custom Dropdown -->
                            <div style="flex: 1.3; position: relative;">
                                <div id="refund-key-btn" style="
                                    display: flex; align-items: center; justify-content: space-between;
                                    background: rgba(15, 23, 42, 0.95); border: 1px solid #334155;
                                    border-radius: 8px; color: #f8fafc; padding: 7px 8px; font-size: 10px; cursor: pointer; box-sizing: border-box; height: 32px;">
                                    <span id="refund-key-text" style="color: #64748b;">Select key...</span>
                                    <span style="font-size: 8px; color: #94a3b8;">▼</span>
                                </div>
                                <div id="refund-key-modal" style="
                                    display: none; position: absolute; bottom: 38px; left: 0; width: 100%;
                                    background: #0f172a; border: 1px solid #334155; border-radius: 8px;
                                    box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 100; max-height: 150px; overflow-y: auto;">
                                    <div style="padding: 6px 8px; font-size: 9.5px; font-weight: 600; color: #94a3b8; border-bottom: 1px solid #1e293b;">Select key</div>
                                    <div id="refund-key-options-container">
                                        ${generateCustomDropdownOptions(userKeys)}
                                    </div>
                                </div>
                                <input type="hidden" id="refund-key-value">
                            </div>

                            <!-- 2. Qty Select Custom Dropdown -->
                            <div style="flex: 0.7; position: relative;">
                                <div id="refund-qty-btn" style="
                                    display: flex; align-items: center; justify-content: space-between;
                                    background: rgba(15, 23, 42, 0.95); border: 1px solid #334155;
                                    border-radius: 8px; color: #f8fafc; padding: 7px 8px; font-size: 10px; cursor: pointer; box-sizing: border-box; height: 32px;">
                                    <span id="refund-qty-text" style="color: #64748b;">Qty...</span>
                                    <span style="font-size: 8px; color: #94a3b8;">▼</span>
                                </div>
                                <div id="refund-qty-modal" style="
                                    display: none; position: absolute; bottom: 38px; left: 0; width: 100%;
                                    background: #0f172a; border: 1px solid #334155; border-radius: 8px;
                                    box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 100; max-height: 130px; overflow-y: auto;">
                                    <div style="padding: 6px 8px; font-size: 9.5px; font-weight: 600; color: #94a3b8; border-bottom: 1px solid #1e293b;">Qty</div>
                                    <div id="refund-qty-options-container">
                                        <div style="padding: 6px 8px; font-size: 10px; color: #64748b;">Qty...</div>
                                    </div>
                                </div>
                                <input type="hidden" id="refund-qty-value">
                            </div>

                        </div>

                        <!-- State B: KPay Inputs Area -->
                        <div id="kpay-inputs-group" style="display: none; gap: 5px; flex: 1;">
                            <input type="text" id="kpay-name" lang="en" placeholder="KPay Name (Eng)" style="
                                flex: 1; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(56, 189, 248, 0.6);
                                border-radius: 8px; color: #f8fafc; padding: 7px 8px; font-size: 10px; outline: none; box-sizing: border-box; height: 32px;">
                            <input type="tel" id="kpay-phone" pattern="[0-9]*" inputmode="numeric" placeholder="KPay Phone (Digits)" style="
                                flex: 1; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(56, 189, 248, 0.6);
                                border-radius: 8px; color: #f8fafc; padding: 7px 8px; font-size: 10px; outline: none; box-sizing: border-box; height: 32px;">
                        </div>

                        <!-- Refund Button -->
                        <button id="execute-refund-btn" style="
                            background: linear-gradient(135deg, #ef4444, #dc2626); border: none;
                            border-radius: 8px; color: white; padding: 7px 14px; font-size: 11px;
                            font-weight: bold; cursor: pointer; white-space: nowrap; height: 32px;
                            box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);">
                            Refund
                        </button>
                    </div>

                    <!-- Info Banner -->
                    <div id="refund-info-text" style="font-size: 10px; color: #94a3b8; line-height: 1.3;">
                        Please select a key and quantity to view refund details.
                    </div>
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
    const dropdownsGroup = document.getElementById('dropdowns-group');
    const kpayInputsGroup = document.getElementById('kpay-inputs-group');
    
    const refundKeyBtn = document.getElementById('refund-key-btn');
    const refundKeyModal = document.getElementById('refund-key-modal');
    const refundKeyText = document.getElementById('refund-key-text');
    const refundKeyValue = document.getElementById('refund-key-value');
    const refundKeyOptionsContainer = document.getElementById('refund-key-options-container');

    const refundQtyBtn = document.getElementById('refund-qty-btn');
    const refundQtyModal = document.getElementById('refund-qty-modal');
    const refundQtyText = document.getElementById('refund-qty-text');
    const refundQtyValue = document.getElementById('refund-qty-value');
    const refundQtyOptionsContainer = document.getElementById('refund-qty-options-container');

    const refundInfoText = document.getElementById('refund-info-text');
    const kpayNameInput = document.getElementById('kpay-name');
    const kpayPhoneInput = document.getElementById('kpay-phone');

    keyCardBtn.addEventListener('click', () => {
        modalOverlay.style.opacity = '1';
        modalOverlay.style.visibility = 'visible';
        modalContent.style.transform = 'scale(1)';
        resetToDropdownState();
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

    refundKeyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        refundQtyModal.style.display = 'none';
        refundKeyModal.style.display = refundKeyModal.style.display === 'block' ? 'none' : 'block';
    });

    refundQtyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        refundKeyModal.style.display = 'none';
        if (refundKeyValue.value) {
            refundQtyModal.style.display = refundQtyModal.style.display === 'block' ? 'none' : 'block';
        }
    });

    document.addEventListener('click', () => {
        refundKeyModal.style.display = 'none';
        refundQtyModal.style.display = 'none';
    });

    function generateCustomDropdownOptions(keysObj) {
        let options = '';
        for (let key in keysObj) {
            if (key === 'tournament') continue;
            let count = keysObj[key] || 0;
            if (count > 0) {
                options += `<div class="custom-dropdown-option" data-value="${key}" style="padding: 7px 10px; font-size: 10px; color: white; cursor: pointer;">${key.toUpperCase()} (${count} pcs)</div>`;
            }
        }
        return options || `<div style="padding: 7px 10px; font-size: 10px; color: #64748b;">No keys available</div>`;
    }

    refundKeyOptionsContainer.addEventListener('click', (e) => {
        const option = e.target.closest('.custom-dropdown-option');
        if (!option) return;
        const keyName = option.getAttribute('data-value');
        refundKeyValue.value = keyName;
        refundKeyText.textContent = option.textContent;
        refundKeyText.style.color = '#f8fafc';
        refundKeyModal.style.display = 'none';

        const maxCount = userKeys[keyName] || 0;
        let qtyOptions = '';
        for (let i = 1; i <= maxCount; i++) {
            qtyOptions += `<div class="custom-dropdown-option" data-value="${i}" style="padding: 7px 10px; font-size: 10px; color: white; cursor: pointer;">${i} pcs</div>`;
        }
        refundQtyOptionsContainer.innerHTML = qtyOptions;
        
        refundQtyValue.value = '';
        refundQtyText.textContent = 'Qty...';
        refundQtyText.style.color = '#64748b';

        updateInfoText();
    });

    refundQtyOptionsContainer.addEventListener('click', (e) => {
        const option = e.target.closest('.custom-dropdown-option');
        if (!option) return;
        const val = option.getAttribute('data-value');
        refundQtyValue.value = val;
        refundQtyText.textContent = option.textContent;
        refundQtyText.style.color = '#f8fafc';
        refundQtyModal.style.display = 'none';

        updateInfoText();
        if (refundKeyValue.value && refundQtyValue.value) {
            dropdownsGroup.style.display = 'none';
            kpayInputsGroup.style.display = 'flex';
            kpayNameInput.focus();
        }
    });

    kpayPhoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    kpayNameInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    });

    function resetToDropdownState() {
        dropdownsGroup.style.display = 'flex';
        kpayInputsGroup.style.display = 'none';
        kpayNameInput.value = '';
        kpayPhoneInput.value = '';
        refundKeyValue.value = "";
        refundKeyText.textContent = "Select key...";
        refundKeyText.style.color = '#64748b';
        refundQtyValue.value = "";
        refundQtyText.textContent = "Qty...";
        refundQtyText.style.color = '#64748b';
        refundQtyOptionsContainer.innerHTML = `<div style="padding: 6px 8px; font-size: 10px; color: #64748b;">Qty...</div>`;
        refundInfoText.innerText = "Please select a key and quantity to view refund details.";
    }

    function updateInfoText() {
        const keyName = refundKeyValue.value;
        const qty = parseInt(refundQtyValue.value);
        if (!keyName || !qty) {
            refundInfoText.innerText = "Please select a key and quantity to view refund details.";
            return;
        }
        const unitVal = getKeyValues(keyName);
        const totalVal = (unitVal * qty).toLocaleString();
        refundInfoText.innerText = `${keyName.toUpperCase()} Key ${qty} pcs for ${totalVal} Ks.`;
    }

    function renderKeys(keyList, keysObj) {
        return keyList.map(keyName => {
            let count = keysObj[keyName] || 0;
            let label = keyName.split('-')[1] || keyName.split('_')[1] || keyName;
            return `
                <div style="
                    background: rgba(2, 6, 23, 0.5); 
                    border: 1px solid ${count > 0 ? 'rgba(56, 189, 248, 0.5)' : 'rgba(51, 65, 85, 0.5)'}; 
                    border-radius: 8px; padding: 5px 2px; text-align: center; box-sizing: border-box;">
                    <div style="font-size: 8px; color: #94a3b8; margin-bottom: 2px;">${label.toUpperCase()}</div>
                    <div style="font-size: 11.5px; font-weight: bold; color: ${count > 0 ? '#38bdf8' : '#64748b'};">
                        ${count} <span style="font-size: 7px; font-weight: normal;">pcs</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    const executeRefundBtn = document.getElementById('execute-refund-btn');

    executeRefundBtn.addEventListener('click', () => {
        const keyName = refundKeyValue.value;
        const qty = parseInt(refundQtyValue.value);
        const kpayName = kpayNameInput.value.trim();
        const kpayPhone = kpayPhoneInput.value.trim();

        if (!keyName || !qty) {
            alert('ကျေးဇူးပြု၍ Key နှင့် အရေအတွက်ကို အရင်ရွေးချယ်ပါ။');
            return;
        }

        if (!kpayName || !kpayPhone) {
            alert('ကျေးဇူးပြု၍ KPay အမည် (English) နှင့် ဖုန်းနံပါတ် (Digits) ကို မှန်ကန်စွာ ဖြည့်စွက်ပေးပါ။');
            return;
        }

        const unitVal = getKeyValues(keyName);
        const totalVal = unitVal * qty;

        const isConfirmed = confirm(`Confirm Refund - ${keyName.toUpperCase()} Key (${qty} pcs) for ${totalVal.toLocaleString()} Ks to ${kpayName} (${kpayPhone}) via KPay.`);
        if (!isConfirmed) return;

        if (userKeys[keyName] && userKeys[keyName] >= qty) {
            userKeys[keyName] -= qty;
            
            // Local storage သို့မဟုတ် Firebase သို့ အချက်အလက်အသစ် ပြန်သိမ်းရန် ဤနေရာတွင် ဆက်လုပ်နိုင်ပါသည်
            // (ဥပမာ - localStorage.setItem('user_key_inventory_v2', JSON.stringify(userKeys)));
            
            updateUI(userKeys);
            alert(`Refund request submitted successfully!`);
        } else {
            alert('အရေအတွက် မလုံလောက်ပါ။');
        }
    });

    function updateUI(keysObj) {
        document.getElementById('vault-total-balance').innerText = calculateTotalBalance(keysObj).toLocaleString() + ' Ks';
        document.getElementById('grid-1v1').innerHTML = renderKeys(keys1vs1, keysObj);
        document.getElementById('grid-5v5').innerHTML = renderKeys(keys5vs5, keysObj);
        document.getElementById('tournament-val-display').innerText = `${keysObj['tournament'] || 0} pcs`;
        refundKeyOptionsContainer.innerHTML = generateCustomDropdownOptions(keysObj);
        resetToDropdownState();
    }
}