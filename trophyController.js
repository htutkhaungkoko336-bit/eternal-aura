// trophyController.js - Modal ပွင့်မှသာ နောက်ခံမှိန်သွားစေရန်နှင့် ခြားနားချက်များကို ပြင်ဆင်ခြင်း

function injectTrophyControllerStyles() {
    if (document.getElementById('trophy-controller-styles')) return;

    const style = document.createElement('style');
    style.id = 'trophy-controller-styles';
    style.innerHTML = `
        /* Modal ပွင့်လာသည့်အခါ အနောက်ဘက်ရှိ showcase ဖလားများအားလုံးကို အလိုအလျောက် မှိန်သွားစေရန် */
        body.trophy-modal-open .pure-trophy-item {
            filter: grayscale(80%) brightness(0.5) !important;
            opacity: 0.4 !important;
            transition: filter 0.3s ease, opacity 0.3s ease;
        }

        /* Modal / Zoom Popup ထဲတွင် ပေါ်လာမည့် ဖလားပြကွက်အတွက် သင့်တော်သော အမှိန်နှင့် အရောင်အသွေး */
        .trophy-modal .pure-trophy-item,
        .modal .pure-trophy-item,
        div[class*="modal"] .pure-trophy-item {
            filter: grayscale(20%) brightness(0.95) !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
}

import { renderTrophyShowcase as renderOriginalShowcase, trophyDataList } from './trophies.js';

export function renderTrophyShowcaseWithLogic(containerId, winnersData = [], onTrophyClick) {
    injectTrophyControllerStyles();

    // မူလ render function ကို ခေါ်ယူခြင်း
    renderOriginalShowcase(containerId, (trophy, htmlContent) => {
        // Modal ပွင့်လာပြီဖြစ်ကြောင်း body ကို class ထည့်ပေးခြင်း
        document.body.classList.add('trophy-modal-open');

        if (typeof onTrophyClick === 'function') {
            onTrophyClick(trophy, htmlContent);
        }
    });

    // Modal ပိတ်သွားသည့်အခါ (သို့မဟုတ် click ပြင်ပနေရာကို နှိပ်မိပါက) class ပြန်ဖြုတ်ရန် Logic ထည့်သွင်းခြင်း
    document.addEventListener('click', (e) => {
        if (e.target.matches('.trophy-modal, .modal, .modal-close, [data-dismiss="modal"]') || 
            (e.target.classList && Array.from(e.target.classList).some(c => c.includes('modal') && !c.includes('content')))) {
            document.body.classList.remove('trophy-modal-open');
        }
    });
}