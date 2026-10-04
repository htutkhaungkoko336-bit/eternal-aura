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

        /* အောက်ခံ Modal Card ကို အလွန်အမင်း မကြီးစေဘဲ သင့်တောရုံ အလျား/အနံနှင့် padding မျှတစေရန် */
        .trophy-modal, 
        .modal-content, 
        div[id*="modal"] {
            padding-bottom: 24px !important;
            min-height: unset !important;
            height: auto !important;
        }

        /* ခလုတ်ကို အောက်ခံဘောင်အတွင်း လှပသပ်ရပ်စွာ နေရာချခြင်း */
        .trophy-modal button, 
        .modal-content button, 
        div[id*="modal"] button,
        .trophy-modal .ok-btn,
        .modal-content .ok-btn {
            font-size: 12px !important;
            padding: 6px 14px !important;
            margin-top: 12px !important;
            position: relative !important;
            z-index: 5 !important;
            white-space: nowrap !important;
            display: inline-block !important;
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
        
        trophyItems.forEach((item) => {
            item.classList.remove('trophy-unlocked');
            const existingBadge = item.querySelector('.trophy-count-badge');
            if (existingBadge) existingBadge.remove();
        });

        // ၁။ Match History များကို စစ်ဆေးပြီး အကြိမ်ရေ ရေတွက်ခြင်း
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

        // ၂။ Firebase Backend API မှ tournaments/mainConfig ရှိ winner-userid များကို ဆွဲထုတ်စစ်ဆေးရန်
        try {
            const response = await fetch('/api/register'); 
            const result = await response.json();
            
            if (result.success && result.data) {
                const configData = result.data;
                let tournamentWinnerIds = [];
                
                const rawWinner = configData['winner-userid'] || configData['winner_userid'] || configData['winnerUserId'];
                
                if (rawWinner) {
                    if (Array.isArray(rawWinner)) {
                        tournamentWinnerIds.push(...rawWinner);
                    } else if (typeof rawWinner === 'string') {
                        tournamentWinnerIds.push(...rawWinner.split(/[,,\s]+/).map(id => id.trim()).filter(Boolean));
                    }
                }

                if (configData.champion) {
                    if (configData.champion.userId) tournamentWinnerIds.push(configData.champion.userId);
                    if (configData.champion.user_id) tournamentWinnerIds.push(configData.champion.user_id);
                }

                const championMatchCount = tournamentWinnerIds.filter(id => id === currentUserId).length;
                if (championMatchCount > 0) {
                    trophyWinCounts[6] = (trophyWinCounts[6] || 0) + championMatchCount;
                }
            }
        } catch (err) {
            console.error("Error fetching tournament winners from API:", err);
        }

        // ၃။ Trophy များကို ပုံဖော်ခြင်း
        trophyItems.forEach((item, index) => {
            const trophyObj = trophyDataList ? trophyDataList[index] : null;
            const currentId = trophyObj ? Number(trophyObj.id) : (index + 1);

            item.setAttribute('data-trophy-id', currentId);
            const winCount = trophyWinCounts[currentId] || 0;

            if (winCount > 0) {
                item.classList.add('trophy-unlocked');
            }
        });

        // ၄။ Trophy ID အလိုက် အမည်များ သတ်မှတ်ခြင်း
        const customTrophyNames = {
            1: "1v1 5k Trophy",
            2: "1v1 10k Trophy",
            3: "1v1 15k Trophy",
            4: "1v1 25k Trophy",
            5: "1v1 50k Trophy",
            6: "Champion Trophy",
            7: "5v5 5k Trophy",
            8: "5v5 10k Trophy",
            9: "5v5 15k Trophy",
            10: "5v5 25k Trophy",
            11: "5v5 50k Trophy"
        };

        // ၅။ Trophy ကို နှိပ်လိုက်သည့်အခါ Modal ကတ်ပြားအတွင်း ခလုတ်နှင့် စာသားအဖြူရောင် လှပစွာ ပေါ်စေရန်
        trophyItems.forEach((item, index) => {
            const currentTrophyObj = trophyDataList ? trophyDataList[index] : null;
            const currentId = currentTrophyObj ? Number(currentTrophyObj.id) : (index + 1);
            const winCount = trophyWinCounts[currentId] || 0;

            item.addEventListener('click', () => {
                setTimeout(() => {
                    const modalElement = document.querySelector('.trophy-modal, .modal-content, div[id*="modal"]');
                    if (modalElement) {
                        const okButton = modalElement.querySelector('button, .ok-btn, [class*="btn"]');
                        
                        if (okButton) {
                            let trophyName = customTrophyNames[currentId] || (currentTrophyObj ? (currentTrophyObj.name || currentTrophyObj.title) : `Trophy #${currentId}`);

                            if (winCount > 0) {
                                okButton.innerHTML = `<span style="color: #ffffff; font-weight: bold; font-size: 12px; display: inline-block;">${trophyName} x${winCount}</span>`;
                            } else {
                                okButton.innerHTML = `<span style="color: #ffffff; font-weight: bold; font-size: 12px; display: inline-block;">${trophyName}</span>`;
                            }
                        }
                    }
                }, 50);
            });
        });

    }, 100);
}