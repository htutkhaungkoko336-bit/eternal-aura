// trophyController.js - ဖလားအားလုံးကို အမြဲမှိန်ထားရန်

function injectTrophyControllerStyles() {
    if (document.getElementById('trophy-controller-styles')) return;

    const style = document.createElement('style');
    style.id = 'trophy-controller-styles';
    style.innerHTML = `
        /* ဖလားအားလုံးကို အမြဲတမ်း မှိန်ထားရန် */
        .pure-trophy-item {
            filter: grayscale(100%) brightness(0.4);
            opacity: 0.35;
            transition: filter 0.4s ease, opacity 0.4s ease, transform 0.25s ease;
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
            // လိုအပ်ပါက click လုပ်ဆောင်ချက်ကို ဆက်လက်လုပ်ဆောင်နိုင်သည်
            onTrophyClick(trophy, htmlContent);
        }
    });

    // ဖလားများအားလုံးကို ခြွင်းချက်မရှိ အမြဲမှိန်နေစေရန် (unlocked class များကို ဖယ်ရှားခြင်း)
    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const trophyItems = container.querySelectorAll('.pure-trophy-item');
        trophyItems.forEach((item) => {
            item.classList.remove('trophy-unlocked');
        });
    }, 50);
}