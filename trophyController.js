// trophyController.js - showcase နှင့် popup ပါ ဖလားအားလုံးကို အမြဲမှိန်ထားရန်

function injectTrophyControllerStyles() {
    if (document.getElementById('trophy-controller-styles')) return;

    const style = document.createElement('style');
    style.id = 'trophy-controller-styles';
    style.innerHTML = `
        /* Showcase ထဲရှိ ဖလားများကို သင့်တော်ရုံ အမှိန်အနေအထား ဖြစ်စေရန် (brightness နဲ့ opacity ကို မြှင့်ထားသည်) */
        .pure-trophy-item {
            filter: grayscale(80%) brightness(0.8) !important;
            opacity: 0.75 !important;
            transition: filter 0.4s ease, opacity 0.4s ease, transform 0.25s ease;
        }

        /* Modal / Zoom Popup ထဲရှိ ဖလားများအတွက်လည်း အလားတူ သင့်တော်ရုံ အမှိန်ပေးရန် */
        .trophy-modal,
        .modal,
        .modal-content,
        .modal-body,
        div[class*="modal"],
        div[class*="popup"],
        div[class*="zoom"] {
            filter: grayscale(80%) brightness(0.85) !important;
            opacity: 0.8 !important;
        }
    `;
    document.head.appendChild(style);
}import { renderTrophyShowcase as renderOriginalShowcase, trophyDataList } from './trophies.js';

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