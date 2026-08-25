export function initKeyManagement() {
    // ၁။ Modal အတွက် HTML နဲ့ CSS များကို DOM ထဲသို့ ထည့်သွင်းခြင်း
    if (!document.getElementById('key-modal-overlay')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
            <style>
                .key-modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(2, 6, 23, 0.85);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .key-modal-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }

                .key-modal-content {
                    background: rgba(15, 23, 42, 0.98);
                    border: 2px solid #c084fc;
                    border-radius: 20px;
                    padding: 24px 16px;
                    width: 90%;
                    max-width: 420px;
                    text-align: center;
                    box-shadow: 0 0 40px rgba(192, 132, 252, 0.5);
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .key-modal-content h3 {
                    color: #38bdf8;
                    margin-top: 0;
                    margin-bottom: 12px;
                    font-size: 16px;
                    letter-spacing: 1px;
                }

                .key-count-display {
                    background: rgba(30, 41, 59, 0.7);
                    border: 1px dashed #c084fc;
                    padding: 8px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    font-size: 13px;
                    color: #f1f5f9;
                }

                .section-label {
                    font-size: 12px;
                    color: #cbd5e1;
                    margin: 10px 0 6px 0;
                    text-align: left;
                    font-weight: bold;
                }

                .mode-btn-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 6px;
                    margin-bottom: 12px;
                }

                .mode-select-btn {
                    background: #0f172a;
                    border: 1px solid #475569;
                    color: #f8fafc;
                    padding: 8px 4px;
                    font-size: 11px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .mode-select-btn:hover, .mode-select-btn.selected {
                    background: #9333ea;
                    border-color: #38bdf8;
                    box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
                }

                .result-action-box {
                    background: #020617;
                    border: 1px solid #334155;
                    border-radius: 10px;
                    padding: 12px;
                    margin-top: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .result-text {
                    font-size: 12px;
                    color: #38bdf8;
                    text-align: left;
                    word-break: break-all;
                }

                .refund-action-btn {
                    background: linear-gradient(135deg, #ef4444, #f59e0b);
                    border: none;
                    color: white;
                    padding: 8px 14px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: bold;
                    cursor: pointer;
                    flex-shrink: 0;
                    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
                }

                .close-key-modal {
                    background: #334155;
                    border: none;
                    color: white;
                    padding: 8px 20px;
                    border-radius: 8px;
                    font-size: 12px;
                    cursor: pointer;
                    margin-top: 15px;
                    transition: background 0.2s;
                }

                .close-key-modal:hover {
                    background: #475569;
                }
            </style>

            <div class="key-modal-overlay" id="key-modal-overlay">
                <div class="key-modal-content">
                    <h3>KEY MANAGEMENT</h3>
                    <div class="key-count-display" id="key-count-text">ပိုင်ဆိုင်သော Key အရေအတွက်: <b id="key-num-val">12</b> ခု</div>

                    <div class="section-label">5vs5 Mode Keys</div>
                    <div class="mode-btn-grid" id="grid-5v5">
                        <button class="mode-select-btn" data-mode="5vs5" data-val="5k" data-amount="5000">5k</button>
                        <button class="mode-select-btn" data-mode="5vs5" data-val="10k" data-amount="10000">10k</button>
                        <button class="mode-select-btn" data-mode="5vs5" data-val="15k" data-amount="15000">15k</button>
                        <button class="mode-select-btn" data-mode="5vs5" data-val="25k" data-amount="25000">25k</button>
                        <button class="mode-select-btn" data-mode="5vs5" data-val="50k" data-amount="50000">50k</button>
                    </div>

                    <div class="section-label">1vs1 Mode Keys</div>
                    <div class="mode-btn-grid" id="grid-1v1">
                        <button class="mode-select-btn" data-mode="1vs1" data-val="5k" data-amount="5000">5k</button>
                        <button class="mode-select-btn" data-mode="1vs1" data-val="10k" data-amount="10000">10k</button>
                        <button class="mode-select-btn" data-mode="1vs1" data-val="15k" data-amount="15000">15k</button>
                        <button class="mode-select-btn" data-mode="1vs1" data-val="25k" data-amount="25000">25k</button>
                        <button class="mode-select-btn" data-mode="1vs1" data-val="50k" data-amount="50000">50k</button>
                    </div>

                    <div class="result-action-box" id="result-action-box" style="display: none;">
                        <div class="result-text" id="result-message-text">ကျေးဇူးပြု၍ Mode တစ်ခုကို ရွေးချယ်ပါ</div>
                        <button class="refund-action-btn" id="refund-btn">Refund</button>
                    </div>

                    <button class="close-key-modal" id="close-key-modal">ပိတ်မည်</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);
    }

    // ၂. Logic ပိုင်းဆိုင်ရာ လုပ်ဆောင်ချက်များ
    const keyCardBtn = document.getElementById('key-card-btn');
    const keyModalOverlay = document.getElementById('key-modal-overlay');
    const closeKeyModal = document.getElementById('close-key-modal');
    const modeSelectBtns = document.querySelectorAll('.mode-select-btn');
    const resultActionBox = document.getElementById('result-action-box');
    const resultMessageText = document.getElementById('result-message-text');
    const refundBtn = document.getElementById('refund-btn');
    const profileMainWrapper = document.getElementById('profile-main-wrapper');

    let selectedModeData = null;

    if (!keyCardBtn || !keyModalOverlay) return;

    // Key ကတ်ကို နှိပ်လျှင် Modal ပွင့်ရန်
    keyCardBtn.addEventListener('click', () => {
        if (profileMainWrapper && profileMainWrapper.classList.contains('trophy-active')) return;
        keyModalOverlay.classList.add('active');
    });

    // ပိတ်ရန် ခလုတ်နှိပ်လျှင်
    closeKeyModal.addEventListener('click', () => {
        keyModalOverlay.classList.remove('active');
    });

    // အပြင်ဘက်ကို နှိပ်လျှင် Modal ပိတ်ရန်
    keyModalOverlay.addEventListener('click', (e) => {
        if (e.target === keyModalOverlay) {
            keyModalOverlay.classList.remove('active');
        }
    });

    // Mode ရွေးချယ်မှု ခလုတ်များအတွက် Logic
    modeSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeSelectBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            const mode = btn.getAttribute('data-mode');
            const val = btn.getAttribute('data-val');
            const amount = btn.getAttribute('data-amount');

            selectedModeData = { mode, val, amount };

            resultMessageText.innerHTML = `${mode} mode ${val} အတွက် ငွေသား ${amount}ks ကို ပြန်လည်လွဲပေးပါမည်`;
            resultActionBox.style.display = 'flex';
        });
    });

    // Refund ခလုတ် နှိပ်လျှင်
    refundBtn.addEventListener('click', () => {
        if (!selectedModeData) return;

        alert(`အောင်မြင်ပါသည်! ${selectedModeData.mode} (${selectedModeData.val}) အတွက် ငွေပမာဏ ${selectedModeData.amount}ks ကို Refund ပြန်လည်ထုတ်ပေးပြီးပါပြီ။`);

        resultActionBox.style.display = 'none';
        modeSelectBtns.forEach(b => b.classList.remove('selected'));
        selectedModeData = null;
    });
}