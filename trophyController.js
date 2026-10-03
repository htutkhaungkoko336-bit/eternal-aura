// trophyController.js - Match History ကိုအခြေခံ၍ သက်ဆိုင်ရာ ဖလားများကို အလိုအလျောက် လင်းစေရန်

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
            pointer-events: none !important; /* မူလက ပိတ်ထားသည် */
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

export function renderTrophyShowcaseWithLogic(containerId, winnersData = [], onTrophyClick) {
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
                // match တစ်ခုချင်းစီတွင် နိုင်ပွဲဖြစ်မဖြစ် စစ်ဆေးရန် (Backend မှလာသော myResult သို့မဟုတ် winnerId ကိုသုံးသည်)
                const isWinner = match.myResult === 'Win' || (match.winnerId && match.winnerId === match.currentUserId);
                
                if (isWinner && match.status === 'completed') {
                    let targetTrophyId = null;
                    const mode = (match.mode || '').toLowerCase();
                    const keyType = (match.keyType || '').toLowerCase(); // ဥပမာ: '5k', '10k', '15k', '25k', '50k'

                    // Key Type အလိုက် Index (0 မှ 4 ထိ) သတ်မှတ်ခြင်း
                    let keyIndex = -1;
                    if (keyType.includes('50k')) keyIndex = 4;
                    else if (keyType.includes('25k')) keyIndex = 3;
                    else if (keyType.includes('15k')) keyIndex = 2;
                    else if (keyType.includes('10k')) keyIndex = 1;
                    else if (keyType.includes('5k')) keyIndex = 0;

                    if (keyIndex !== -1) {
                        if (mode.includes('1v1')) {
                            // 1v1 အတွက် Trophy ID 1 မှ 5 ထိ (Index 0 ถึง 4 => ID 1 ถึง 5)
                            targetTrophyId = keyIndex + 1;
                        } else if (mode.includes('5v5')) {
                            // 5v5 အတွက် Trophy ID 7 မှ 11 ထိ (Index 0 ถึง 4 => ID 7 ถึง 11)
                            targetTrophyId = keyIndex + 7;
                        }
                    }

                    // သက်ဆိုင်ရာ Trophy Element ကို ရှာပြီး .trophy-unlocked ထည့်ပေးခြင်း
                    if (targetTrophyId) {
                        trophyItems.forEach((item, index) => {
                            // ဥပမာ - trophyDataList သို့မဟုတ် index ကိုအသုံးပြု၍ ID တိုက်စစ်ခြင်း
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