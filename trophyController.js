import { renderTrophyShowcase as renderOriginalShowcase, trophyDataList } from './trophies.js';

function injectTrophyControllerStyles() {
    if (document.getElementById('trophy-controller-styles')) return;

    const style = document.createElement('style');
    style.id = 'trophy-controller-styles';
    style.innerHTML = `
        .pure-trophy-item {
            filter: grayscale(100%) brightness(0.5) !important;
            opacity: 0.4 !important;
            transition: filter 0.4s ease, opacity 0.4s ease, transform 0.25s ease;
            pointer-events: none !important;
            position: relative;
        }
        .pure-trophy-item.trophy-unlocked {
            filter: grayscale(0%) brightness(1) !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }

        /* ID 6 (အလယ်က အကြီးဆုံးဖလား) အတွက် မူလ badge ပုံစံအတိုင်း ထားရှိရန် */
        .pure-trophy-item.is-main-trophy .trophy-count-badge,
        .pure-trophy-item[data-trophy-id="6"] .trophy-count-badge {
            position: absolute;
            bottom: -15px;
            right: 50%;
            transform: translateX(50%);
            background: rgba(15, 23, 42, 0.95);
            color: #38bdf8;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 6px;
            border: 1px solid rgba(56, 189, 248, 0.4);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            z-index: 10;
        }
    `;
    document.head.appendChild(style);
}

export async function renderTrophyShowcaseWithLogic(containerId, winnersData = [], currentUserId = '', onTrophyClick) {
    injectTrophyControllerStyles();

    const trophyWinCounts = {};

    renderOriginalShowcase(containerId, (trophy, htmlContent) => {
        if (typeof onTrophyClick === 'function') {
            onTrophyClick(trophy, htmlContent);
        }
    });

    setTimeout(async () => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const trophyItems = container.querySelectorAll('.pure-trophy-item');
        
        // အားလုံးကို အရင်မှိန်ထားမည် ပြီးရင် Badge ဟောင်းများကို ရှင်းထုတ်မည်
        trophyItems.forEach((item, index) => {
            item.classList.remove('trophy-unlocked', 'is-main-trophy');
            const existingBadge = item.querySelector('.trophy-count-badge');
            if (existingBadge) existingBadge.remove();
        });

        // ၁။ ပုံမှန် Match History များကို စစ်ဆေးပြီး အကြိမ်ရေ ရေတွက်ခြင်း
        if (Array.isArray(winnersData) && winnersData.length > 0) {
            winnersData.forEach(match => {
                const matchWinnerId = match.winnerId || match.winner_id;
                const isWinner = matchWinnerId && matchWinnerId === currentUserId;
                
                if (isWinner) {
                    let targetTrophyId = null;
                    const mode = (match.mode || '').toLowerCase();
                    const keyType = (match.keyType || match.fee || '').toLowerCase();

                    let keyIndex = -1;
                    if (keyType.includes('50k')) keyIndex = 4;
                    else if (keyType.includes('25k')) keyIndex = 3;
                    else if (keyType.includes('15k')) keyIndex = 2;
                    else if (keyType.includes('10k')) keyIndex = 1;
                    else if (keyType.includes('5k')) keyIndex = 0;

                    if (keyIndex !== -1) {
                        if (mode.includes('1v1') || mode.includes('1vs1')) {
                            targetTrophyId = keyIndex + 1;
                        } else if (mode.includes('5v5') || mode.includes('5vs5')) {
                            targetTrophyId = keyIndex + 7;
                        }
                    }

                    if (targetTrophyId !== null) {
                        trophyWinCounts[targetTrophyId] = (trophyWinCounts[targetTrophyId] || 0) + 1;
                    }
                }
            });
        }

        // ၂။ Backend API မှ Data များကို စစ်ဆေးရန်
        try {
            const response = await fetch('/api/register'); 
            const result = await response.json();
            
            if (result.success && result.data) {
                const configData = result.data;
                let allWinnerIds = [];
                
                const possibleKeys = ['winner_userid', 'winner-userid', 'winnerUserId', 'winner_id', 'winnerId'];
                possibleKeys.forEach(key => {
                    const val = configData[key];
                    if (val) {
                        if (Array.isArray(val)) allWinnerIds.push(...val);
                        else allWinnerIds.push(val);
                    }
                });

                if (configData.champion && configData.champion.userId) {
                    allWinnerIds.push(configData.champion.userId);
                }

                const matchCount = allWinnerIds.filter(id => id === currentUserId).length;
                if (matchCount > 0) {
                    trophyWinCounts[6] = (trophyWinCounts[6] || 0) + matchCount;
                }
            }
        } catch (err) {
            console.error("Error fetching tournament winners from API:", err);
        }

        // ၃။ Trophy များကို ပုံဖော်ခြင်း (ID 6 အတွက်သာ အပြင်ဘက်တွင် Badge ထည့်မည်)
        trophyItems.forEach((item, index) => {
            const trophyObj = trophyDataList ? trophyDataList[index] : null;
            const currentId = trophyObj ? Number(trophyObj.id) : (index + 1);

            // Data attribute ထည့်ပေးခြင်းဖြင့် CSS ထိန်းချုပ်ရန် လွယ်ကူစေရန်
            item.setAttribute('data-trophy-id', currentId);

            const winCount = trophyWinCounts[currentId] || 0;

            if (winCount > 0) {
                item.classList.add('trophy-unlocked');

                // ID 6 (M7 Champion) ဖြစ်ပြီး နိုင်ပွဲရှိပါက အပြင်ဘက်တွင် Badge ထည့်မည်
                if (currentId === 6) {
                    item.classList.add('is-main-trophy');
                    if (!item.querySelector('.trophy-count-badge')) {
                        const badge = document.createElement('div');
                        badge.className = 'trophy-count-badge';
                        badge.innerText = `x${winCount}`;
                        item.appendChild(badge);
                    }
                }
            }
        });

        // ၄။ Trophy ကို နှိပ်လိုက်သည့်အခါ Modal ထဲရှိ OK ခလုတ်နေရာတွင် သက်ဆိုင်ရာ Trophy နာမည်နှင့် Count ပြရန်
        trophyItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const trophyObj = trophyDataList ? trophyDataList[index] : null;
                const currentId = trophyObj ? Number(trophyObj.id) : (index + 1);
                const winCount = trophyWinCounts[currentId] || 0;

                // ID 6 မဟုတ်သော အခြား Trophy များအတွက်သာ Modal ထဲတွင် နာမည်ပြောင်းမည်
                if (currentId !== 6) {
                    setTimeout(() => {
                        const modalElement = document.querySelector('.trophy-modal, .modal-content, div[id*="modal"]');
                        if (modalElement) {
                            const okButton = modalElement.querySelector('button, .ok-btn, [class*="btn"]');
                            
                            if (okButton) {
                                // Trophy ၏ နာမည်ကို ရှာယူခြင်း (သို့မဟုတ် trophyObj ထဲမှ နာမည်ကို ယူသုံးခြင်း)
                                const trophyName = trophyObj && (trophyObj.name || trophyObj.title) 
                                    ? (trophyObj.name || trophyObj.title) 
                                    : (item.querySelector('.trophy-name, .trophy-label')?.innerText || `Trophy #${currentId}`);

                                const countText = winCount > 1 ? ` (x${winCount})` : '';
                                
                                // OK စာသားအစား Trophy နာမည်နှင့် count ကို အစားထိုးခြင်း
                                okButton.innerHTML = `${trophyName}<span style="color: #38bdf8; margin-left: 4px; font-weight: bold;">${countText}</span>`;
                            }
                        }
                    }, 50);
                }
            });
        });

    }, 100);
}