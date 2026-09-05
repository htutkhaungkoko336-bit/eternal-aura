import { renderMatchScreen } from './match.js';

export function renderRoomScreen(container, roomTitleText, userDocData = {}) {
    // 1. Room Title ကနေ Mode နဲ့ Key Type ကို ခွဲထုတ်ခြင်း (ဥပမာ: "5V5 - 5K ROOM" -> mode: "5v5", type: "5k")
    const upperTitle = roomTitleText.toUpperCase();
    let targetMode = '5v5';
    let targetKeyType = '5k';

    if (upperTitle.includes('1V1')) {
        targetMode = '1v1';
    } else if (upperTitle.includes('5V5')) {
        targetMode = '5v5';
    }

    // Key values တွေထဲက ညီမရဲ့ title ပုံစံအတိုင်း ရှာဖွေခြင်း
    const possibleTypes = ['5k', '10k', '15k', '25k', '50k'];
    for (let t of possibleTypes) {
        if (upperTitle.includes(t.toUpperCase())) {
            targetKeyType = t;
            break;
        }
    }

    // 2. User မှာ ဒီ key ပမာဏ ရှိမရှိ စစ်ဆေးခြင်း 
    // (Firebase document structure ထဲမှာ "5v5-5k" သို့မဟုတ် modes object ပုံစံ နှစ်မျိုးလုံးကို လိုက်ဖက်အောင် စစ်ပေးထားပါတယ်)
    let keyCount = 0;
    const directKeyField = `${targetMode}-${targetKeyType}`; // ဥပမာ: "5v5-5k"
    
    if (userDocData[directKeyField] !== undefined) {
        keyCount = userDocData[directKeyField];
    } else if (userDocData.modes && userDocData.modes[targetMode]) {
        keyCount = userDocData.modes[targetMode][targetKeyType] || 0;
    }

    const hasKey = keyCount > 0;

    container.innerHTML = `
        <style>
            /* Room Screen အတွက် Styles များ */
            .room-screen-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 100%;
                background: #040408;
                font-family: sans-serif;
                color: #fff;
                padding: 20px;
                box-sizing: border-box;
                user-select: none;
            }
            .room-title {
                font-size: 22px;
                font-weight: 800;
                color: #00f2ff;
                text-shadow: 0 0 10px rgba(0, 242, 255, 0.6);
                margin-top: 10px;
                letter-spacing: 1px;
                text-align: center;
            }
            .room-content-center {
                font-size: 14px;
                color: #a0a0c0;
                text-align: center;
            }
            .key-status-box {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid ${hasKey ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.4)'};
                padding: 10px 15px;
                border-radius: 12px;
                margin: 10px 0;
                text-align: center;
            }
            .room-bottom-actions {
                display: flex;
                gap: 15px;
                width: 100%;
                max-width: 300px;
                margin-bottom: 10px;
            }
            .room-btn {
                flex: 1;
                padding: 12px 0;
                border-radius: 8px;
                font-weight: 700;
                font-size: 14px;
                text-align: center;
                border: none;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .room-btn:not(:disabled):hover {
                transform: scale(1.03);
            }
            .btn-new-room {
                background: linear-gradient(135deg, #7c3aed, #2563eb);
                color: #fff;
                box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
            }
            .btn-cancel {
                background: #181824;
                color: #ff007f;
                border: 1px solid #ff007f66;
                box-shadow: 0 0 10px rgba(255, 0, 127, 0.2);
            }
        </style>

        <div class="room-screen-wrapper">
            <div class="room-title">${roomTitleText}</div>
            
            <div class="room-content-center">
                <div class="key-status-box">
                    <div style="font-size: 11px; color: #94a3b8;">Required Key: <span style="color: #fff; font-weight: bold;">${targetMode.toUpperCase()} (${targetKeyType.toUpperCase()})</span></div>
                    <div style="font-size: 12px; margin-top: 4px; color: ${hasKey ? '#38bdf8' : '#ef4444'};">
                        Your Balance: <b>${keyCount} pcs</b>
                    </div>
                </div>
                <p>${hasKey ? 'Room initialized successfully.<br>Ready to create a new room!' : '⚠️ ဒီ Room ကိုဖွင့်ရန် Key မလုံလောက်ပါ။'}</p>
            </div>

            <div class="room-bottom-actions">
                <button class="room-btn btn-new-room" id="newRoomBtn" ${!hasKey ? 'disabled' : ''} style="${!hasKey ? 'opacity: 0.4; cursor: not-allowed; filter: grayscale(50%);' : 'cursor: pointer;'}">New Room</button>
                <button class="room-btn btn-cancel" id="cancelBtn" style="cursor: pointer;">Cancel</button>
            </div>
        </div>
    `;

    // New Room ခလုတ်နှိပ်လျှင် လုပ်ဆောင်ရန်
    const newRoomBtn = container.querySelector('#newRoomBtn');
    if (newRoomBtn) {
        newRoomBtn.addEventListener('click', () => {
            if (!hasKey) {
                alert('Key မလုံလောက်ပါသဖြင့် Room အသစ်ဖန်တီး၍ မရပါ။');
                return;
            }
            alert('Creating a New Room...');
            // လိုအပ်တဲ့ Room creation logic ဆက်ထည့်ရန်
        });
    }

    // Cancel ခလုတ်နှိပ်လျှင် မူလ Match Screen သို့ ပြန်သွားရန်
    container.querySelector('#cancelBtn').addEventListener('click', () => {
        renderMatchScreen(container);
    });
}

// ==========================================
// KEY MANAGEMENT MODAL SYSTEM
// ==========================================
export async function initKeyManagement() {
    const keyCardBtn = document.getElementById('key-card-btn');
    if (!keyCardBtn) return;

    const userId = localStorage.getItem('user_id') || 'current_user_id'; 

    let keyData = {
        modes: {
            '5v5': { '5k': 0, '10k': 0, '15k': 0, '25k': 0, '50k': 0 },
            '1v1': { '5k': 0, '10k': 0, '15k': 0, '25k': 0, '50k': 0 },
            'tournament': { 'pass': 0 }
        }
    };

    // Backend API ကနေ Key ဒေတာများကို လှမ်းဆွဲခြင်း
    try {
        const response = await fetch(`/api/get-keys?userId=${userId}`);
        const result = await response.json();
        if (result.success && result.keys) {
            keyData.modes = result.keys.modes || keyData.modes;
        }
    } catch (error) {
        console.error("Failed to fetch keys from server:", error);
    }

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
            if (data.modes[mode]) {
                for (let type in data.modes[mode]) {
                    total += (data.modes[mode][type] || 0) * getKeyValues(type);
                }
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
                        <p style="margin: 2px 0 0 0; font-size: 9.5px; color: #94a3b8;">Cyber Secure Vault</p>
                    </div>
                    <div style="background: rgba(192, 132, 252, 0.15); border: 1px solid rgba(192, 132, 252, 0.4); padding: 5px 10px; border-radius: 10px; text-align: right;">
                        <div style="font-size: 8.5px; color: #d8b4fe; text-transform: uppercase; font-weight: 600;">TOTAL BALANCE</div>
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
                        <span style="font-size: 12px; font-weight: bold; color: #c084fc;" id="tournament-pass-count">${keyData.modes.tournament?.pass || 0} pcs</span>
                    </div>
                </div>

                <!-- Key Refund System Card -->
                <div id="refund-card-container" style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 16px; padding: 12px; margin-bottom: 12px;">
                    <div style="font-size: 11px; font-weight: bold; color: #38bdf8; margin-bottom: 8px;">Key Refund System</div>
                    
                    <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 8px;">
                        <div id="dropdowns-group" style="display: flex; gap: 6px; flex: 1;">
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
                                        ${generateCustomDropdownOptions(keyData)}
                                    </div>
                                </div>
                                <input type="hidden" id="refund-key-value">
                            </div>

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

                        <div id="kpay-inputs-group" style="display: none; gap: 5px; flex: 1;">
                            <input type="text" id="kpay-name" lang="en" placeholder="KPay Name (Eng)" style="
                                flex: 1; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(56, 189, 248, 0.6);
                                border-radius: 8px; color: #f8fafc; padding: 7px 8px; font-size: 10px; outline: none; box-sizing: border-box; height: 32px;">
                            <input type="tel" id="kpay-phone" pattern="[0-9]*" inputmode="numeric" placeholder="KPay Phone (Digits)" style="
                                flex: 1; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(56, 189, 248, 0.6);
                                border-radius: 8px; color: #f8fafc; padding: 7px 8px; font-size: 10px; outline: none; box-sizing: border-box; height: 32px;">
                        </div>

                        <button id="execute-refund-btn" style="
                            background: linear-gradient(135deg, #ef4444, #dc2626); border: none;
                            border-radius: 8px; color: white; padding: 7px 14px; font-size: 11px;
                            font-weight: bold; cursor: pointer; white-space: nowrap; height: 32px;
                            box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);">
                            Refund
                        </button>
                    </div>

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

    keyCardBtn.addEventListener('click', async () => {
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

    function generateCustomDropdownOptions(data) {
        let options = '';
        ['5v5', '1v1'].forEach(mode => {
            if (data.modes[mode]) {
                for (let type in data.modes[mode]) {
                    let count = data.modes[mode][type] || 0;
                    if (count > 0) {
                        options += `<div class="custom-dropdown-option" data-value="${mode}_${type}" style="padding: 7px 10px; font-size: 10px; color: white; cursor: pointer;">${mode.toUpperCase()} - ${type.toUpperCase()} (${count} pcs)</div>`;
                    }
                }
            }
        });
        return options || `<div style="padding: 7px 10px; font-size: 10px; color: #64748b;">No keys available</div>`;
    }

    refundKeyOptionsContainer.addEventListener('click', (e) => {
        const option = e.target.closest('.custom-dropdown-option');
        if (!option) return;
        const val = option.getAttribute('data-value');
        refundKeyValue.value = val;
        refundKeyText.textContent = option.textContent;
        refundKeyText.style.color = '#f8fafc';
        refundKeyModal.style.display = 'none';

        const [mode, type] = val.split('_');
        const maxCount = keyData.modes[mode][type];
        
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
        const val = refundKeyValue.value;
        const qty = parseInt(refundQtyValue.value);
        if (!val || !qty) {
            refundInfoText.innerText = "Please select a key and quantity to view refund details.";
            return;
        }
        const [mode, type] = val.split('_');
        const unitVal = getKeyValues(type);
        const totalVal = (unitVal * qty).toLocaleString();
        refundInfoText.innerText = `${mode.toUpperCase()} (${type.toUpperCase()}) Key ${qty} pcs for ${totalVal} Ks.`;
    }

    function renderKeys(mode, types, data) {
        return types.map(type => {
            let count = data.modes[mode]?.[type] || 0;
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

    executeRefundBtn.addEventListener('click', async () => {
        const selectedVal = refundKeyValue.value;
        const qty = parseInt(refundQtyValue.value);
        const kpayName = kpayNameInput.value.trim();
        const kpayPhone = kpayPhoneInput.value.trim();

        if (!selectedVal || !qty) {
            alert('ကျေးဇူးပြု၍ Key နှင့် အရေအတွက်ကို အရင်ရွေးချယ်ပါ။');
            return;
        }

        if (!kpayName || !kpayPhone) {
            alert('ကျေးဇူးပြု၍ KPay အမည် (English) နှင့် ဖုန်းနံပါတ် (Digits) ကို မှန်ကန်စွာ ဖြည့်စွက်ပေးပါ။');
            return;
        }

        const [mode, type] = selectedVal.split('_');
        const unitVal = getKeyValues(type);
        const totalVal = unitVal * qty;

        const isConfirmed = confirm(`Confirm Refund - ${mode.toUpperCase()} ${type.toUpperCase()} Key (${qty} pcs) for ${totalVal.toLocaleString()} Ks to ${kpayName} (${kpayPhone}) via KPay.`);
        if (!isConfirmed) return;

        if (keyData.modes[mode] && keyData.modes[mode][type] >= qty) {
            try {
                executeRefundBtn.disabled = true;
                executeRefundBtn.textContent = 'Sending...';

                const response = await fetch('/api/request-refund', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        mode: mode,
                        type: type,
                        qty: qty,
                        totalVal: totalVal,
                        kpayName: kpayName,
                        kpayPhone: kpayPhone
                    })
                });

                const result = await response.json();

                if (result.success) {
                    keyData.modes[mode][type] -= qty;
                    updateUI(keyData);
                    alert(`Refund request submitted successfully! Telegram သို့ ပို့လိုက်ပါပြီ။`);
                } else {
                    alert(`Error: ${result.message || 'Refund တောင်းဆိုမှု မအောင်မြင်ပါ။'}`);
                }
            } catch (err) {
                console.error("Refund submission error:", err);
                alert('ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။ ကျေးဇူးပြု၍ ခဏနေ ထပ်ကြိုးစားပါ။');
            } finally {
                executeRefundBtn.disabled = false;
                executeRefundBtn.textContent = 'Refund';
            }
        } else {
            alert('အရေအတွက် မလုံလောက်ပါ။');
        }
    });

    function updateUI(data) {
        document.getElementById('vault-total-balance').innerText = calculateTotalBalance(data).toLocaleString() + ' Ks';
        document.getElementById('grid-5v5').innerHTML = renderKeys('5v5', ['5k', '10k', '15k', '25k', '50k'], data);
        document.getElementById('grid-1v1').innerHTML = renderKeys('1v1', ['5k', '10k', '15k', '25k', '50k'], data);
        const tournamentPassElem = document.getElementById('tournament-pass-count');
        if (tournamentPassElem) {
            tournamentPassElem.innerText = `${data.modes.tournament?.pass || 0} pcs`;
        }
        refundKeyOptionsContainer.innerHTML = generateCustomDropdownOptions(data);
        resetToDropdownState();
    }
}