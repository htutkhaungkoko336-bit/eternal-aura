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
        }
        .pure-trophy-item.trophy-unlocked {
            filter: grayscale(0%) brightness(1) !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);
}

export async function renderTrophyShowcaseWithLogic(containerId, winnersData = [], currentUserId = '', onTrophyClick) {
    injectTrophyControllerStyles();

    // Trophy Win Counts တွေကို သိမ်းဆည်းရန် Scope တစ်ခုတည်းတွင် ထားရှိခြင်း
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
        
        // အားလုံးကို အရင်မှိန်ထားမည် ပြီးရင် Counter တွေ ရှင်းထုတ်မည်
        trophyItems.forEach((item) => {
            item.classList.remove('trophy-unlocked');
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

        // ၂။ Backend API မှ Data များကိုလည်း စစ်ဆေးရန် (လိုအပ်ပါက)
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

        // ၃။ တွက်ချက်ထားသော Count များအပေါ် မူတည်၍ Trophy များကို ပုံဖော်ခြင်း (Main Page တွင် နာမည်ဘေး၌ ထပ်မထည့်တော့ပါ)
        trophyItems.forEach((item, index) => {
            const trophyObj = trophyDataList ? trophyDataList[index] : null;
            const currentId = trophyObj ? Number(trophyObj.id) : (index + 1);

            const winCount = trophyWinCounts[currentId] || 0;

            if (winCount > 0) {
                item.classList.add('trophy-unlocked');
            }
        });

        // ၄။ Trophy တစ်ခုချင်းစီကို နှိပ်လိုက်တဲ့အခါ Modal ပွင့်လာပြီး OK ခလုတ်တွင် Count ပြမည့် Click Event ထည့်သွင်းခြင်း
        trophyItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const trophyObj = trophyDataList ? trophyDataList[index] : null;
                const currentId = trophyObj ? Number(trophyObj.id) : (index + 1);
                const winCount = trophyWinCounts[currentId] || 0;

                // Modal ပွင့်လာတာကို စောင့်ပြီးမှ OK ခလုတ်နေရာတွင် Count ထည့်ရန် 
                setTimeout(() => {
                    const modalElement = document.querySelector('.trophy-modal, .modal-content, div[id*="modal"]');
                    if (modalElement) {
                        // Modal ထဲမှာရှိတဲ့ OK ခလုတ်ကို ရှာမည်
                        const okButton = modalElement.querySelector('button, .ok-btn, [class*="btn"]');
                        
                        if (okButton) {
                            // အကယ်၍ ခလုတ်ထဲမှာ count မပါသေးရင် နှင့် winCount ရှိရင် ပေါင်းထည့်မည်
                            if (!okButton.querySelector('.modal-count-badge') && winCount > 0) {
                                if (winCount > 1) {
                                    okButton.innerHTML = `OK <span class="modal-count-badge" style="color: #38bdf8; margin-left: 4px;">(x${winCount})</span>`;
                                }
                            }
                        }
                    }
                }, 50); // Modal DOM Render ဖြစ်ရန် ခဏစောင့်ရန်
            });
        });

    }, 100);
}