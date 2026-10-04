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
        /* Professional ဆန်တဲ့ Counter Badge ပုံစံအသစ် */
        .trophy-count-badge {
            position: absolute;
            bottom: 4px; /* အောက်ဘက်သို့ ရွှေ့လိုက်သည် */
            right: 4px;  /* ညာဘက်ထောင့်စွန်းသို့ ကပ်လိုက်သည် */
            background: rgba(15, 23, 42, 0.85); /* Dark Glass Background */
            color: #38bdf8; /* Modern Blue/Cyan Accent */
            font-size: 10px;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 6px;
            border: 1px solid rgba(56, 189, 248, 0.3);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            z-index: 10;
            letter-spacing: 0.5px;
        }
    `;
    document.head.appendChild(style);
}
export async function renderTrophyShowcaseWithLogic(containerId, winnersData = [], currentUserId = '', onTrophyClick) {
    injectTrophyControllerStyles();

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

        // Trophy တစ်ခုချင်းစီအတွက် နိုင်တဲ့အကြိမ်ရေ (Count) တွေကို သိမ်းဆည်းရန် Map သို့မဟုတ် Object သုံးမည်
        const trophyWinCounts = {};

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
                        // နိုင်တဲ့အကြိမ်ရေကို 1 ပေါင်းထည့်သွားမည်
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

                // API ထဲမှာပါတဲ့ Winner ထဲမှာ ဒီ User ပါရင် ဥပမာ ID 6 ကို 1 ခلာ တိုးပေးနိုင်သည်
                const matchCount = allWinnerIds.filter(id => id === currentUserId).length;
                if (matchCount > 0) {
                    trophyWinCounts[6] = (trophyWinCounts[6] || 0) + matchCount;
                }
            }
        } catch (err) {
            console.error("Error fetching tournament winners from API:", err);
        }

        // ၃။ တွက်ချက်ထားသော Count များအပေါ် မူတည်၍ UI တွင် Trophy များကို ပုံဖော်ခြင်း
        trophyItems.forEach((item, index) => {
            const trophyObj = trophyDataList ? trophyDataList[index] : null;
            const currentId = trophyObj ? Number(trophyObj.id) : (index + 1);

            const winCount = trophyWinCounts[currentId] || 0;

            if (winCount > 0) {
                item.classList.add('trophy-unlocked');
                
                // အကယ်၍ ၂ ခါ သို့မဟုတ် ထို့ထက်ပို၍ နိုင်ထားပါက Badge လေး ထည့်ပေးမည်
                if (winCount > 1) {
                    const badge = document.createElement('span');
                    badge.className = 'trophy-count-badge';
                    badge.innerText = `x${winCount}`;
                    item.appendChild(badge);
                }
            }
        });
    }, 100);
}