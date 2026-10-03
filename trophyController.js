// trophyController.js - ဖလားများကို ကလစ်နှိပ်၍ Zoom ကြည့်မရအောင် ပိတ်ထားရန်

function injectTrophyControllerStyles() {
    if (document.getElementById('trophy-controller-styles')) return;

    const style = document.createElement('style');
    style.id = 'trophy-controller-styles';
    style.innerHTML = `
        /* ဖလား showcase ထဲရှိ ဖလားများကို အမြဲတမ်း အမှိန်နှင့် အဖြူအမဲ ဖြစ်စေရန် */
        .pure-trophy-item {
            filter: grayscale(100%) brightness(0.5) !important;
            opacity: 0.4 !important;
            transition: filter 0.4s ease, opacity 0.4s ease, transform 0.25s ease;
        }

        /* ဖလားများကို ကလစ်နှိပ်၍ မရတော့စေရန် (Pointer Events ပိတ်ခြင်း) */
        .pure-trophy-item {
            pointer-events: none !important;
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

    // ဖလားများအားလုံးကို အမြဲမှိန်နေစေရန်
    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const trophyItems = container.querySelectorAll('.pure-trophy-item');
        trophyItems.forEach((item) => {
            item.classList.remove('trophy-unlocked');
        });
    }, 50);
}