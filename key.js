export function initKeyManagement() {
    const keyCardBtn = document.getElementById('key-card-btn');
    if (!keyCardBtn) return;

    let keyData = JSON.parse(localStorage.getItem('user_key_inventory')) || {
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
            default: return 0; // Tournament pass ကို 0 ပေးထား၍ Balance ထဲမပါဝင်ပါ
        }
    }

    // Tournament Key ကို ဖယ်ထုတ်ပြီး 5v5 နဲ့ 1v1 ကိုသာ Balance ထဲ ထည့်တွက်မည်
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
            background: rgba(2, 6, 23, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            display: flex; align-items: center; justify-content: center; z-index: 10000;
            opacity: 0; visibility: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box;">
            
            <div class="key-modal-content" style="
                background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(56, 189, 248, 0.4);
                border-radius: 24px; padding: 22px; width: 92%; max-width: 390px;
                max-height: 90vh; overflow-y: auto; color: #f8fafc;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.25);
                transform: scale(0.85); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 12px;">
                    <div>
                        <h3 style="margin: 0; color: #38bdf8; font-size: 15px; letter-spacing: 0.5px; font-weight: 700;">KEY MANAGEMENT</h3>
                        <p style="margin: 2px 0 0 0; font-size: 10px; color: #94a3b8;">Cyber & iOS Secure Vault</p>
                    </div>
                    <div style="background: rgba(192, 132, 252, 0.15); border: 1px solid rgba(192, 132, 252, 0.4); padding: 6px 12px; border-radius: 12px; text-align: right;">
                        <div style="font-size: 9px; color: #d8b4fe; text-transform: uppercase; font-weight: 600;">Total Balance</div>
                        <div style="font-size: 13px; color: #f8fafc; font-weight: bold;" id="vault-total-balance">
                            ${calculateTotalBalance(keyData).toLocaleString()} Ks
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 14px;">
                    <div style="font-size: 11px; font-weight: 600; color: #38bdf8; margin-bottom: 6px; letter-spacing: 0.5px;">5v5 MODE KEYS</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;" id="grid-5v5">
                        ${renderKeys('5v5', ['5k', '10k', '15k', '25k', '50k'], keyData)}
                    </div>
                </div>

                <div style="margin-bottom: 14px;">
                    <div style="font-size: 11px; font-weight: 600; color: #38bdf8; margin-bottom: 6px; letter-spacing: 0.5px;">1v1 MODE KEYS</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;" id="grid-1v1">
                        ${renderKeys('1v1', ['5k', '10k', '15k', '25k', '50k'], keyData)}
                    </div>
                </div>

                <div style="margin-bottom: 18px;">
                    <div style="font-size: 11px; font-weight: 600; color: #c084fc; margin-bottom: 6px; letter-spacing: 0.5px;">TOURNAMENT KEY</div>
                    <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 12px; padding: 10px; text-align: center;">
                        <div style="font-size: 10px; color: #94a3b8;">Tournament Pass</div>
                        <div style="font-size: 15px; font-weight: bold; color: #c084fc; margin-top: 2px;">
                            ${keyData.modes.tournament.pass} <span style="font-size: 10px; font-weight: normal;">pcs</span>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 12px; margin-bottom: 16px;">
                    <div style="font-size: 11px; font-weight: 600; color: #f8fafc; margin-bottom: 8px;">Key Refund System</div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <select id="refund-key-select" style="
                            flex: 1; background: rgba(15, 23, 42, 0.95); border: 1px solid #334155;
                            border-radius: 10px; color: #f8fafc; padding: 8px 10px; font-size: 11px; outline: none; cursor: pointer;">
                            <option value="" disabled selected style="color: #64748b;">Select key to refund...</option>
                            ${generateDropdownOptions(keyData)}
                        </select>
                        <button id="execute-refund-btn" style="
                            background: linear-gradient(135deg, #ef4444, #dc2626); border: none;
                            border-radius: 10px; color: white; padding: 8px 14px; font-size: 11px;
                            font-weight: bold; cursor: pointer; box-shadow: 0 0 12px rgba(239, 68, 68, 0.4); white-space: nowrap;">
                            Refund
                        </button>
                    </div>
                </div>

                <button id="close-key-modal" style="
                    width: 100%; background: linear-gradient(135deg, #0284c7, #9333ea);
                    border: none; border-radius: 12px; color: white; padding: 10px;
                    font-size: 12px; font-weight: bold; cursor: pointer;
                    box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);">Close</button>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('key-management-modal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalOverlay = document.getElementById('key-management-modal');
    const modalContent = modalOverlay.querySelector('.key-modal-content');

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
                    options += `<option value="${mode}_${type}">${mode.toUpperCase()} - ${type.toUpperCase()} Key (${count} pcs)</option>`;
                }
            }
        });
        return options;
    }

    function renderKeys(mode, types, data) {
        return types.map(type => {
            let count = data.modes[mode][type] || 0;
            return `
                <div style="
                    background: rgba(2, 6, 23, 0.5); 
                    border: 1px solid ${count > 0 ? 'rgba(56, 189, 248, 0.5)' : 'rgba(51, 65, 85, 0.5)'}; 
                    border-radius: 10px; padding: 7px 4px; text-align: center; box-sizing: border-box;">
                    <div style="font-size: 9px; color: #94a3b8; margin-bottom: 2px;">${type.toUpperCase()}</div>
                    <div style="font-size: 13px; font-weight: bold; color: ${count > 0 ? '#38bdf8' : '#64748b'};">
                        ${count} <span style="font-size: 8px; font-weight: normal;">pcs</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    const executeRefundBtn = document.getElementById('execute-refund-btn');
    const refundSelect = document.getElementById('refund-key-select');

    executeRefundBtn.addEventListener('click', () => {
        const selectedVal = refundSelect.value;
        if (!selectedVal) {
            alert('Please select a key type to refund.');
            return;
        }

        const [mode, type] = selectedVal.split('_');

        if (keyData.modes[mode] && keyData.modes[mode][type] > 0) {
            keyData.modes[mode][type] -= 1;
            localStorage.setItem('user_key_inventory', JSON.stringify(keyData));
            updateUI(keyData);
            alert(`Successfully refunded one ${mode.toUpperCase()} (${type.toUpperCase()}) key.`);
        }
    });

    function updateUI(data) {
        document.getElementById('vault-total-balance').innerText = calculateTotalBalance(data).toLocaleString() + ' Ks';
        document.getElementById('grid-5v5').innerHTML = renderKeys('5v5', ['5k', '10k', '15k', '25k', '50k'], data);
        document.getElementById('grid-1v1').innerHTML = renderKeys('1v1', ['5k', '10k', '15k', '25k', '50k'], data);
        refundSelect.innerHTML = `<option value="" disabled selected style="color: #64748b;">Select key to refund...</option>` + generateDropdownOptions(data);
    }
}