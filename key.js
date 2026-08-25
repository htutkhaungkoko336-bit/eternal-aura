export function initKeyManagement() {
    const keyCardBtn = document.getElementById('key-card-btn');
    if (!keyCardBtn) return;

    // ပုံမှန် LocalStorage ထဲက Key အချက်အလက်များကို စီမံရန် (မရှိရင် 0 သို့မဟုတ် default ထည့်ရန်)
    let keyData = JSON.parse(localStorage.getItem('user_key_inventory')) || {
        balance: 15000, // လက်ရှိ ငွေလက်ကျန် (Refund လုပ်ရင် ပိုက်ဆံတက်လာရန်)
        totalKeys: 12,
        modes: {
            '5v5': { '5k': 3, '10k': 1, '15k': 0, '25k': 0, '50k': 0 },
            '1v1': { '5k': 2, '10k': 0, '15k': 1, '25k': 0, '50k': 0 },
            'tournament': { 'pass': 1 } // Tournament Key သီးသန့် (ပေါင်း ၁၁ ခုမြောက်)
        }
    };

    // Key Management Modal ဖန်တီးခြင်း
    const modalHTML = `
        <div class="key-modal-overlay" id="key-management-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(8px);
            display: flex; align-items: center; justify-content: center; z-index: 10000;
            opacity: 0; visibility: hidden; transition: all 0.3s ease; box-sizing: border-box;">
            
            <div class="key-modal-content" style="
                background: rgba(15, 23, 42, 0.95); border: 2px solid #38bdf8;
                border-radius: 20px; padding: 24px; width: 92%; max-width: 420px;
                max-height: 90vh; overflow-y: auto; color: #f8fafc;
                box-shadow: 0 0 35px rgba(56, 189, 248, 0.4);
                transform: scale(0.8); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #334155; padding-bottom: 10px;">
                    <h3 style="margin: 0; color: #38bdf8; font-size: 16px; letter-spacing: 1px;">KEY MANAGEMENT & REFUND</h3>
                    <div style="font-size: 13px; color: #c084fc; font-weight: bold; background: rgba(192, 132, 252, 0.15); padding: 4px 10px; border-radius: 8px;">
                        Balance: <span id="user-wallet-balance">${keyData.balance.toLocaleString()}</span> Ks
                    </div>
                </div>

                <div style="background: rgba(30, 41, 59, 0.7); border: 1px dashed #38bdf8; border-radius: 12px; padding: 10px; text-align: center; margin-bottom: 16px;">
                    <span style="font-size: 12px; color: #94a3b8;">ပိုင်ဆိုင်သော စုစုပေါင်း Key အရေအတွက်:</span>
                    <div style="font-size: 18px; font-weight: bold; color: #38bdf8; margin-top: 2px;" id="total-key-counter">
                        ${calculateTotalKeys(keyData)} ခု
                    </div>
                </div>

                <!-- 5v5 Mode Keys -->
                <div style="margin-bottom: 14px;">
                    <div style="font-size: 12px; font-weight: bold; color: #d8b4fe; margin-bottom: 6px;">5v5 Mode Keys</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;" id="keys-grid-5v5">
                        ${renderKeyItems('5v5', ['5k', '10k', '15k', '25k', '50k'], keyData)}
                    </div>
                </div>

                <!-- 1v1 Mode Keys -->
                <div style="margin-bottom: 14px;">
                    <div style="font-size: 12px; font-weight: bold; color: #d8b4fe; margin-bottom: 6px;">1v1 Mode Keys</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;" id="keys-grid-1v1">
                        ${renderKeyItems('1v1', ['5k', '10k', '15k', '25k', '50k'], keyData)}
                    </div>
                </div>

                <!-- Tournament Key (သီးသန့် ၁၁ ခုမြောက်) -->
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 12px; font-weight: bold; color: #d8b4fe; margin-bottom: 6px;">Tournament Key</div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 6px;" id="keys-grid-tournament">
                        ${renderKeyItems('tournament', ['pass'], keyData)}
                    </div>
                </div>

                <button id="close-key-modal" style="
                    width: 100%; background: linear-gradient(135deg, #0284c7, #9333ea);
                    border: none; border-radius: 10px; color: white; padding: 10px;
                    font-size: 13px; font-weight: bold; cursor: pointer;
                    box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);">ပိတ်မည်</button>
            </div>
        </div>
    `;

    // DOM ထဲသို့ Modal ထည့်ခြင်း
    const existingModal = document.getElementById('key-management-modal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalOverlay = document.getElementById('key-management-modal');
    const modalContent = modalOverlay.querySelector('.key-modal-content');

    // ဖွင့်ရန် Event
    keyCardBtn.addEventListener('click', () => {
        modalOverlay.style.opacity = '1';
        modalOverlay.style.visibility = 'visible';
        modalContent.style.transform = 'scale(1)';
    });

    // ပိတ်ရန် Event
    const closeModal = () => {
        modalContent.style.transform = 'scale(0.8)';
        modalOverlay.style.opacity = '0';
        modalOverlay.style.visibility = 'hidden';
    };

    document.getElementById('close-key-modal').addEventListener('click', closeModal);
    modalOverlay.style.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Refund ပြုလုပ်ခြင်း Logic (Key ကိုနှိပ်၍ ငွေပြန်ထုတ်ခြင်း)
    modalOverlay.addEventListener('click', (e) => {
        const refundBtn = e.target.closest('.refund-key-btn');
        if (!refundBtn) return;

        const mode = refundBtn.dataset.mode;
        const type = refundBtn.dataset.type;

        if (keyData.modes[mode] && keyData.modes[mode][type] > 0) {
            keyData.modes[mode][type] -= 1;
            
            // တန်ဖိုးအလိုက် ငွေပြန်ထည့်ပေးရန် (ဥပမာ - 5k key ဆိုရင် 5000 ကျပ်၊ tournament pass ဆိုရင် 10000 ကျပ်)
            let refundValue = getRefundValue(type);
            keyData.balance += refundValue;

            // LocalStorage သို့ သိမ်းဆည်းရန်
            localStorage.setItem('user_key_inventory', JSON.stringify(keyData));

            // UI ကို Update ပြန်လုပ်ရန်
            updateModalUI(keyData);
        }
    });
}

function calculateTotalKeys(data) {
    let total = 0;
    for (let mode in data.modes) {
        for (let type in data.modes[mode]) {
            total += data.modes[mode][type];
        }
    }
    return total;
}

function getRefundValue(type) {
    if (type === '5k') return 5000;
    if (type === '10k') return 10000;
    if (type === '15k') return 15000;
    if (type === '25k') return 25000;
    if (type === '50k') return 50000;
    if (type === 'pass') return 10000; // Tournament Pass တန်ဖိုး
    return 1000;
}

function renderKeyItems(mode, types, data) {
    return types.map(type => {
        let count = data.modes[mode][type] || 0;
        let displayName = type === 'pass' ? 'Tournament Pass' : type.toUpperCase();
        
        return `
            <div style="
                background: rgba(2, 6, 23, 0.6); 
                border: 1px solid ${count > 0 ? '#38bdf8' : '#334155'}; 
                border-radius: 10px; padding: 8px; text-align: center;
                position: relative; box-sizing: border-box;">
                <div style="font-size: 10px; color: #94a3b8; margin-bottom: 2px;">${displayName}</div>
                <div style="font-size: 14px; font-weight: bold; color: ${count > 0 ? '#38bdf8' : '#64748b'};">
                    ${count} <span style="font-size: 9px; font-weight: normal;">ခု</span>
                </div>
                ${count > 0 ? `
                    <button class="refund-key-btn" data-mode="${mode}" data-type="${type}" title="ငွေပြန်လဲမည်" style="
                        margin-top: 4px; width: 100%; background: rgba(239, 68, 68, 0.2);
                        border: 1px solid #ef4444; border-radius: 6px; color: #fca5a5;
                        font-size: 9px; padding: 2px 0; cursor: pointer; font-weight: bold;">
                        Refund
                    </button>
                ` : `
                    <div style="font-size: 9px; color: #475569; margin-top: 4px;">မရှိပါ</div>
                `}
            </div>
        `;
    }).join('');
}

function updateModalUI(keyData) {
    document.getElementById('user-wallet-balance').innerText = keyData.balance.toLocaleString();
    document.getElementById('total-key-counter').innerText = calculateTotalKeys(keyData) + ' ခု';
    
    document.getElementById('keys-grid-5v5').innerHTML = renderKeyItems('5v5', ['5k', '10k', '15k', '25k', '50k'], keyData);
    document.getElementById('keys-grid-1v1').innerHTML = renderKeyItems('1v1', ['5k', '10k', '15k', '25k', '50k'], keyData);
    document.getElementById('keys-grid-tournament').innerHTML = renderKeyItems('tournament', ['pass'], keyData);
}