// trophyController.js - Handles trophy dimming/lighting logic based on winners

/**
 * ဖလားများအတွက် မှိန်ထားခြင်း (Dim) သို့မဟုတ် လင်းလက်စေခြင်း (Lit) ပြုလုပ်ရန် CSS Styles ထည့်သွင်းခြင်း
 */
function injectTrophyControllerStyles() {
    if (document.getElementById('trophy-controller-styles')) return;

    const style = document.createElement('style');
    style.id = 'trophy-controller-styles';
    style.innerHTML = `
        /* ဖလားကို ပုံမှန်အခြေအနေတွင် မှိန်ထားရန် (Dim / Grayscale & Low Opacity) */
        .pure-trophy-item {
            filter: grayscale(100%) brightness(0.4);
            opacity: 0.35;
            transition: filter 0.4s ease, opacity 0.4s ease, transform 0.25s ease;
        }

        /* Winner ရှိလာ၍ Luminous (လင်းလက်သော) ဖြစ်သွားသည့်အခါ */
        .pure-trophy-item.trophy-unlocked {
            filter: grayscale(0%) brightness(1);
            opacity: 1;
            animation: trophyUnlockGlow 2s ease-in-out infinite alternate;
        }

        @keyframes trophyUnlockGlow {
            0% {
                filter: grayscale(0%) brightness(1) drop-shadow(0 0 6px rgba(56, 189, 248, 0.6));
            }
            100% {
                filter: grayscale(0%) brightness(1.2) drop-shadow(0 0 16px rgba(250, 204, 21, 0.9));
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * ဖလား ၁၁ လုံးကို ေဖာ်ပြခြင်းနှင့် winner စာရင်းအပေါ်မူတည်၍ လင်းစေ/မှိန်စေခြင်း
 * @param {string} containerId - ဖလားပြမည့် HTML container ၏ ID
 * @param {Array} winnersData - နိုင်ထားသည့် ဖလား ID များ သို့မဟုတ် winner data တွေပါတဲ့ Array (ဥပမာ - [1, 6])
 * @param {Function} onTrophyClick - ဖလားကို နှိပ်တဲ့အခါ လုပ်ဆောင်မည့် callback function
 */
import { renderTrophyShowcase as renderOriginalShowcase, trophyDataList } from './trophies.js';

export function renderTrophyShowcaseWithLogic(containerId, winnersData = [], onTrophyClick) {
    injectTrophyControllerStyles();

    // မူလ trophies.js ထဲက render function ကို ခေါ်ပြီး UI တည်ဆောက်သည်
    renderOriginalShowcase(containerId, (trophy, htmlContent) => {
        if (typeof onTrophyClick === 'function') {
            onTrophyClick(trophy, htmlContent);
        }
    });

    // တည်ဆောက်ပြီးသား ဖလား item တစ်ခုချင်းစီကို ID အလိုက် စစ်ဆေးပြီး winner ရှိရင် class ထည့်ပေးသည်
    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const trophyItems = container.querySelectorAll('.pure-trophy-item');
        
        trophyItems.forEach((item, index) => {
            const currentTrophy = trophyDataList[index];
            if (currentTrophy) {
                // winnersData ထဲမှာ ဒီ trophy ၏ id ပါဝင်နေရင် (သို့မဟုတ် နိုင်ထားတယ်ဆိုရင်) လင်းစေမည်
                const isWinner = winnersData.includes(currentTrophy.id) || winnersData.includes(String(currentTrophy.id));
                
                if (isWinner) {
                    item.classList.add('trophy-unlocked');
                } else {
                    item.classList.remove('trophy-unlocked');
                }
            }
        });
    }, 50);
}