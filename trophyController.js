// trophyController.js - Match History ထဲရှိ winnerId ကို အခြေခံ၍ ဖလားများ လင်းစေရန်

function injectTrophyControllerStyles() {
    if (document.getElementById('trophy-controller-styles')) return;

    const style = document.createElement('style');
    style.id = 'trophy-controller-styles';
    style.innerHTML = `
        /* ဖလား showcase ထဲရှိ ဖလားများကို မူလအခြေအနေတွင် အမှိန်နှင့် အဖြူအမဲ ဖြစ်စေရန် */
        .pure-trophy-item {
            filter: grayscale(100%) brightness(0.5) !important;
            opacity: 0.4 !important;
            transition: filter 0.4s ease, opacity 0.4s ease, transform 0.25s ease;
            pointer-events: none !important;
        }

        /* နိုင်ထားသည့် ဖလားများ (Unlocked ဖြစ်လာပါက) လင်းလာစေရန်နှင့် ကလစ်နှိပ်၍ Zoom ကြည့်နိုင်ရန် */
        .pure-trophy-item.trophy-unlocked {
            filter: grayscale(0%) brightness(1) !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);
}

import { renderTrophyShowcase as renderOriginalShowcase, trophyDataList } from './trophies.js';

export function renderTrophyShowcaseWithLogic(containerId, winnersData = [], currentUserId = '', onTrophyClick) {
    injectTrophyControllerStyles();

    // မူလ render function ကို ခေါ်ယူခြင်း
    renderOriginalShowcase(containerId, (trophy, htmlContent) => {
        if (typeof onTrophyClick === 'function') {
            onTrophyClick(trophy, htmlContent);
        }
    });

    // Match History (`winnersData`) ကို အခြေခံ၍ သက်ဆိုင်ရာ ဖလားများကို တွက်ချက်ပြီး Unlock လုပ်ရန်
    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const trophyItems = container.querySelectorAll('.pure-trophy-item');
        
        // ပထမဦးစွာ အားလုံးကို ပိတ်/မှိန်ထားမည်
        trophyItems.forEach((item) => {
            item.classList.remove('trophy-unlocked');
        });

        // ဝင်လာသော Match History စာရင်းကို စစ်ဆေးခြင်း
        if (Array.isArray(winnersData) && winnersData.length > 0) {
            winnersData.forEach(match => {
                // ကိုယ့် ID မဟုတ်ဘဲ မိတ်ဆွေပြောတဲ့အတိုင်း 'winnerId' က ကိုယ်နဲ့ တူရဲ့လား (သို့မဟုတ် winnerId အစစ်အမှန် ရှိနေသလား) ဆိုတာကို စစ်ဆေးခြင်း
                const matchWinnerId = match.winnerId || match.winner_id;
                
                // အကယ်၍ match ထဲက winnerId သည် လက်ရှိဝင်ထားသော currentUserId နှင့် တိုက်ဆိုင်နေလျှင် (သို့မဟုတ် နိုင်သူအဖြစ် သတ်မှတ်ထားလျှင်)
                const isWinner = matchWinnerId && matchWinnerId === currentUserId;
                
                if (isWinner) {
                    let targetTrophyId = null;
                    const mode = (match.mode || '').toLowerCase();
                    const keyType = (match.keyType || match.fee || '').toLowerCase();

                    // Key Type အလိုက် Index (0 မှ 4 ထိ) သတ်မှတ်ခြင်း
                    let keyIndex = -1;
                    if (keyType.includes('50k')) keyIndex = 4;
                    else if (keyType.includes('25k')) keyIndex = 3;
                    else if (keyType.includes('15k')) keyIndex = 2;
                    else if (keyType.includes('10k')) keyIndex = 1;
                    else if (keyType.includes('5k')) keyIndex = 0;

                    if (keyIndex !== -1) {
                        if (mode.includes('1v1') || mode.includes('1vs1')) {
                            targetTrophyId = keyIndex + 1; // ID 1 မှ 5 ထိ (1vs1: 5k, 10k, 15k, 25k, 50k)
                        } else if (mode.includes('5v5') || mode.includes('5vs5')) {
                            targetTrophyId = keyIndex + 7; // ID 7 မှ 11 ထိ (5vs5: 5k, 10k, 15k, 25k, 50k)
                        }
                    }

                    // သက်ဆိုင်ရာ Trophy Element ကို ရှာပြီး .trophy-unlocked ထည့်ပေးခြင်း (ID 6 ကို ကျော်သွားမည်)
                    if (targetTrophyId !== null && targetTrophyId !== 6) {
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
    }, 50);
}