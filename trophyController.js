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

    renderOriginalShowcase(containerId, (trophy, htmlContent) => {
        if (typeof onTrophyClick === 'function') {
            onTrophyClick(trophy, htmlContent);
        }
    });

    setTimeout(async () => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const trophyItems = container.querySelectorAll('.pure-trophy-item');
        
        // အားလုံးကို အရင်မှိန်ထားမည်
        trophyItems.forEach((item) => {
            item.classList.remove('trophy-unlocked');
        });

        // ၁။ ပုံမှန် Match History များကို စစ်ဆေးခြင်း
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
                        trophyItems.forEach((item, index) => {
                            const trophyObj = trophyDataList ? trophyDataList[index] : null;
                            const currentId = trophyObj ? Number(trophyObj.id) : (index + 1);

                            if (currentId === targetTrophyId) {
                                item.classList.add('trophy-unlocked');
                            }
                        });
                    }
                }
            });
        }

        // ၂။ Backend API မှတစ်ဆင့် tournaments/mainConfig ဒေတာကို ဆွဲထုတ်ခြင်း (404 Error များကို ကာကွယ်ရန်)
        try {
            const response = await fetch('/api/handler'); // သင့် Backend API route လိပ်စာအတိုင်း ထည့်ပါ
            const result = await response.json();
            
            if (result.success && result.data) {
                const configData = result.data;
                
                let allWinnerIds = [];
                const rawWinner1 = configData.winner_userid;
                const rawWinner2 = configData["winner-userid"];

                if (Array.isArray(rawWinner1)) allWinnerIds.push(...rawWinner1);
                else if (rawWinner1) allWinnerIds.push(rawWinner1);

                if (Array.isArray(rawWinner2)) allWinnerIds.push(...rawWinner2);
                else if (rawWinner2) allWinnerIds.push(rawWinner2);

                const isTournamentWinner = allWinnerIds.includes(currentUserId);

                if (isTournamentWinner) {
                    trophyItems.forEach((item, index) => {
                        const trophyObj = trophyDataList ? trophyDataList[index] : null;
                        const trophyName = trophyObj ? (trophyObj.name || '').toUpperCase() : '';
                        
                        if (trophyName.includes('CHAMPION') || trophyName.includes('M7') || index === 4 || index === 5 || trophyObj?.id === 6 || trophyObj?.id === '6') {
                            item.classList.add('trophy-unlocked');
                        }
                    });
                }
            }

        } catch (err) {
            console.error("Error fetching tournament winners from API:", err);
        }

    }, 100);
}