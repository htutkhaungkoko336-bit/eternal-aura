// trophyController.js - showcase နှင့် popup ပါ ဖလားအားလုံးကို အမြဲမှိန်ထားရန်

function injectTrophyControllerStyles() {
    if (document.getElementById('trophy-controller-styles')) return;

    const style = document.createElement('style');
    style.id = 'trophy-controller-styles';
    style.innerHTML = `
        /* ဖလား showcase ထဲရှိ ဖလားအားလုံးကို အမြဲတမ်း မှိန်ထားရန် */
        .pure-trophy-item {
            filter: grayscale(100%) brightness(0.4) !important;
            opacity: 0.35 !important;
            transition: filter 0.4s ease, opacity 0.4s ease, transform 0.25s ease;
        }

        /* Modal သို့မဟုတ် Zoom ပေါ်လာသည့် ကွန်တိန်နာအတွင်းရှိ ဖလားအစိတ်အပိုင်းအားလုံးကို မှိန်ရန် */
        .trophy-modal,
        .modal,
        .modal-content,
        .modal-body,
        div[class*="modal"],
        div[class*="popup"],
        div[class*="zoom"] {
            filter: grayscale(100%) brightness(0.4) !important;
            opacity: 0.4 !important;
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