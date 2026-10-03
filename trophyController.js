import { renderTrophyShowcase as renderOriginalShowcase, trophyDataList } from './trophies.js';
// Firebase Firestore SDK ကို သင့်ပရောဂျက်ချိတ်ဆက်ထားသည့်အတိုင်း import လုပ်ပါ (ဥပမာ: firebase/firestore)
// ဥပမာ - import { db } from './firebaseConfig.js';
// ဥပမာ - import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js";

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
        }
        .pure-trophy-item.trophy-unlocked {
            filter: grayscale(0%) brightness(1) !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);
}

export async function renderTrophyShowcaseWithLogic(containerId, winnersData = [], currentUserId = '', onTrophyClick) {
    injectTrophyControllerStyles();

    // မူလ render function ကို ခေါ်ယူခြင်း
    renderOriginalShowcase(containerId, (trophy, htmlContent) => {
        if (typeof onTrophyClick === 'function') {
            onTrophyClick(trophy, htmlContent);
        }
    });

    setTimeout(async () => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const trophyItems = container.querySelectorAll('.pure-trophy-item');
        
        // ပထမဦးစွာ အားလုံးကို ပိတ်/မှိန်ထားမည်
        trophyItems.forEach((item) => {
            item.classList.remove('trophy-unlocked');
        });

        // ၁။ ပုံမှန် Match History (winnersData) များအတွက် စစ်ဆေးခြင်း
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

        // ၂. Firebase Firestore မှ tournaments/mainConfig ထဲရှိ manual ထည့်ထားသော winner_userid ကို စစ်ဆေးခြင်း
        try {
            const docRef = doc(db, "tournaments", "mainConfig");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const configData = docSnap.data();
                // Manual ထည့်ထားသော winner-userid သို့မဟုတ် winner_userid ကို ယူမည်
                const manualWinnerId = configData.winner_userid || configData["winner-userid"];

                if (manualWinnerId && manualWinnerId === currentUserId) {
                    // ဥပမာ - Tournament Winner အတွက် သတ်မှတ်ထားသော ID 6 (သို့မဟုတ် လိုချင်သည့် Trophy ID) ကို လင်းစေရန်
                    const tournamentTrophyId = 6; // သင်သတ်မှတ်လိုသော Trophy ID ထည့်ပါ
                    
                    trophyItems.forEach((item, index) => {
                        const trophyObj = trophyDataList ? trophyDataList[index] : null;
                        const currentId = trophyObj ? Number(trophyObj.id) : (index + 1);

                        if (currentId === tournamentTrophyId) {
                            item.classList.add('trophy-unlocked');
                        }
                    });
                }
            }
            
            
            // Backend API (သို့) Firebase SDK ဖြင့် တိုက်ရိုက် စစ်ဆေးချင်ပါက ဤနေရာတွင် ထည့်သွင်းနိုင်ပါသည်။
            // ဥပမာအနေဖြင့် LocalStorage သို့မဟုတ် passed လုပ်ထားသော data ထဲတွင် winner_userid ပါလာလျှင်လည်း စစ်ဆေးနိုင်သည်:
            if (window.manualTournamentWinnerId && window.manualTournamentWinnerId === currentUserId) {
                const tournamentTrophyId = 6; 
                trophyItems.forEach((item, index) => {
                    const trophyObj = trophyDataList ? trophyDataList[index] : null;
                    const currentId = trophyObj ? Number(trophyObj.id) : (index + 1);
                    if (currentId === tournamentTrophyId) {
                        item.classList.add('trophy-unlocked');
                    }
                });
            }

        } catch (err) {
            console.error("Error fetching tournament manual winner:", err);
        }

    }, 50);
}