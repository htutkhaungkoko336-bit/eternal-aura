// trophyController.js - Showcase နှင့် Modal (Zoom) ပါ ဖလားများအားလုံးကို အဖြူအမဲနှင့် မှိန်ထားရန်

function injectTrophyControllerStyles() {
    if (document.getElementById('trophy-controller-styles')) return;

    const style = document.createElement('style');
    style.id = 'trophy-controller-styles';
    style.innerHTML = `
        /* ဖလား showcase ထဲရှိ ဖလားအားလုံးကို အမြဲတမ်း အမှိန်နှင့် အဖြူအမဲ ဖြစ်စေရန် */
        .pure-trophy-item {
            filter: grayscale(100%) brightness(0.5) !important;
            opacity: 0.4 !important;
            transition: filter 0.4s ease, opacity 0.4s ease, transform 0.25s ease;
        }

        /* Modal / Zoom Popup ထဲတွင် ပေါ်လာမည့် ဖလားနှင့် အစိတ်အပိုင်း အားလုံးကိုပါ အရောင်ဖယ်ရှားပြီး အမှိန်ဖြစ်စေရန် */
        .trophy-modal *,
        .modal *,
        .modal-content *,
        div[class*="modal"] *,
        div[class*="popup"] * {
            filter: grayscale(100%) brightness(0.6) !important;
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