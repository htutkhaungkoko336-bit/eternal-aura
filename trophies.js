// trophies.js - Trophy Collection Component

// Trophy ၁၁ လုံးစာ Data စာရင်း (အချက်အလက်များကို လိုသလို ပြင်ဆင်နိုင်ပါတယ်)
const trophyDataList = [
    { id: 1, title: "ANGELIC ASCENT", subtitle: "M7 World Championship", date: "2026-01-15", desc: "Elite Tier Global Tournament Winner Badge." },
    { id: 2, title: "ANGELIC ASCENT", subtitle: "Season 25 Glory", date: "2026-02-10", desc: "Mythical Glory Rank 1st Position Holder." },
    { id: 3, title: "ANGELIC ASCENT", subtitle: "Cyber Arena Master", date: "2026-03-05", desc: "Undefeated streak in 1v1 custom showdowns." },
    { id: 4, title: "ANGELIC ASCENT", subtitle: "Aura Cup Champion", date: "2026-03-20", desc: "Squad tournament grand finals MVP trophy." },
    { id: 5, title: "ANGELIC ASCENT", subtitle: "Neon Striker Elite", date: "2026-04-12", desc: "Achieved maximum tactical score in seasonal event." },
    { id: 6, title: "ANGELIC ASCENT", subtitle: "Celestial Conqueror", date: "2026-05-01", desc: "Conquered all regional qualifiers without a loss." },
    { id: 7, title: "ANGELIC ASCENT", subtitle: "Apex Legend Trophy", date: "2026-05-25", desc: "Top 10 leaderboard dominance recognition." },
    { id: 8, title: "ANGELIC ASCENT", subtitle: "Vector Vanguard", date: "2026-06-10", desc: "Special community event design & combat winner." },
    { id: 9, title: "ANGELIC ASCENT", subtitle: "Quantum Guardian", date: "2026-07-02", desc: "Secured base defense record in tactical matches." },
    { id: 10, title: "ANGELIC ASCENT", subtitle: "Eternal Champion", date: "2026-07-20", desc: "Anniversary championship grand trophy." },
    { id: 11, title: "ANGELIC ASCENT", subtitle: "Ultimate God Badge", date: "2026-08-15", desc: "Maximum achievement unlock across all seasons." }
];

export function renderTrophyShowcase(containerId, onTrophyClick) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Trophy Grid Layout Styles and Elements
    container.innerHTML = `
        <style>
            .trophy-grid-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 16px;
                width: 100%;
                padding: 4px 0;
            }

            /* ညီမလေးပေးထားတဲ့ Crystal Trophy CSS Styles များကို ဒီမှာ ပေါင်းစပ်ပေးထားပါတယ် */
            .crystal-trophy-card {
                width: 100%;
                height: 230px;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 1) 100%);
                border: 1.5px solid #38bdf8;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 0 20px rgba(56, 189, 248, 0.25), inset 0 0 12px rgba(250, 204, 21, 0.15);
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                animation: floatTrophy 4s ease-in-out infinite;
                overflow: hidden;
                box-sizing: border-box;
            }

            .crystal-trophy-card:hover {
                transform: translateY(-5px);
                border-color: #facc15;
                box-shadow: 0 0 30px rgba(250, 204, 21, 0.5), inset 0 0 15px rgba(56, 189, 248, 0.4);
            }

            @keyframes floatTrophy {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-4px); }
            }

            .crystal-trophy-container {
                width: 140px;
                height: 195px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 6px 0;
            }

            .celestial-head {
                position: relative;
                width: 100px;
                height: 75px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .angel-halo {
                position: absolute;
                top: -2px;
                width: 30px;
                height: 12px;
                border: 2px solid #facc15;
                border-radius: 50%;
                box-shadow: 0 0 10px #facc15, 0 0 16px #38bdf8;
                z-index: 4;
                animation: pulseHalo 2s ease-in-out infinite alternate;
            }

            @keyframes pulseHalo {
                0% { transform: scale(0.9); opacity: 0.8; }
                100% { transform: scale(1.1); opacity: 1; }
            }

            .angel-wing {
                position: absolute;
                width: 42px;
                height: 60px;
                background: linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(250, 204, 21, 0.2) 100%);
                border: 1px solid #38bdf8;
            }

            .left-wing {
                left: 2px;
                top: 8px;
                clip-path: polygon(20% 0%, 100% 30%, 80% 100%, 0% 70%);
                transform: rotate(-5deg);
            }

            .right-wing {
                right: 2px;
                top: 8px;
                clip-path: polygon(0% 30%, 80% 0%, 100% 70%, 20% 100%);
                transform: rotate(5deg);
            }

            .central-hologram {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3;
            }

            .angel-core {
                width: 16px;
                height: 16px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 10px #38bdf8, 0 0 18px #facc15;
            }

            .celestial-pillar {
                position: relative;
                width: 24px;
                height: 45px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 1px solid #38bdf8;
                border-radius: 4px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .pillar-beam {
                width: 2.5px;
                height: 100%;
                background: linear-gradient(180deg, #facc15 0%, #38bdf8 100%);
                box-shadow: 0 0 8px #38bdf8;
                border-radius: 2px;
            }

            .celestial-base {
                position: relative;
                width: 130px;
                height: 30px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 1px solid #38bdf8;
                border-top: 2px solid #facc15;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
            }

            .base-glow-rim {
                position: absolute;
                top: 2px;
                width: 100px;
                height: 1px;
                background: #facc15;
                box-shadow: 0 0 6px #facc15;
            }

            .base-title {
                color: #facc15;
                font-size: 7px;
                font-weight: 900;
                letter-spacing: 1px;
                z-index: 2;
                text-shadow: 0 0 5px #38bdf8;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 120px;
            }
        </style>

        <div class="trophy-grid-container" id="trophy-cards-grid">
            <!-- Trophies will be injected dynamically -->
        </div>
    `;

    const gridEl = document.getElementById('trophy-cards-grid');
    
    // Trophy ၁၁ လုံးစလုံးကို Loop ပတ်ပြီး ထည့်သွင်းခြင်း
    trophyDataList.forEach((trophy) => {
        const card = document.createElement('div');
        card.className = 'crystal-trophy-card';
        card.title = `${trophy.subtitle} - နှိပ်၍ အသေးစိတ်ကြည့်ရန်`;
        
        card.innerHTML = `
            <div class="crystal-trophy-container">
                <div class="celestial-head">
                    <div class="angel-halo"></div>
                    <div class="angel-wing left-wing"></div>
                    <div class="angel-wing right-wing"></div>
                    <div class="central-hologram">
                        <div class="angel-core"></div>
                    </div>
                </div>
                <div class="celestial-pillar">
                    <div class="pillar-beam"></div>
                </div>
                <div class="celestial-base">
                    <div class="base-glow-rim"></div>
                    <span class="base-title">${trophy.subtitle}</span>
                </div>
            </div>
        `;

        // Trophy တစ်ခုချင်းစီကို နှိပ်လိုက်ရင် သက်ဆိုင်ရာ Details တွေ ပြသမည့် Event Listener
        card.addEventListener('click', () => {
            if (typeof onTrophyClick === 'function') {
                onTrophyClick(trophy);
            }
        });

        gridEl.appendChild(card);
    });
}