// trophies.js - Custom Trophy Showcase Layout (Left 5, Center 1 Large, Right 5)

const trophyDataList = [
    // ဘယ်ဘက် ၅ လုံး
    { id: 1, title: "ANGELIC ASCENT", subtitle: "M7 World Championship", date: "2026-01-15", desc: "Elite Tier Global Tournament Winner Badge." },
    { id: 2, title: "ANGELIC ASCENT", subtitle: "Season 25 Glory", date: "2026-02-10", desc: "Mythical Glory Rank 1st Position Holder." },
    { id: 3, title: "ANGELIC ASCENT", subtitle: "Cyber Arena Master", date: "2026-03-05", desc: "Undefeated streak in 1v1 custom showdowns." },
    { id: 4, title: "ANGELIC ASCENT", subtitle: "Aura Cup Champion", date: "2026-03-20", desc: "Squad tournament grand finals MVP trophy." },
    { id: 5, title: "ANGELIC ASCENT", subtitle: "Neon Striker Elite", date: "2026-04-12", desc: "Achieved maximum tactical score in seasonal event." },
    
    // အလယ်အကြီးစား ၁ လုံး (Main Crown Trophy)
    { id: 6, title: "ETERNAL SUPREME", subtitle: "GOD OF AURA CHAMPION", date: "2026-08-23", desc: "The Ultimate Grandmaster Trophy. Undisputed king of all seasons." },

    // ညာဘက် ၅ လုံး
    { id: 7, title: "ANGELIC ASCENT", subtitle: "Celestial Conqueror", date: "2026-05-01", desc: "Conquered all regional qualifiers without a loss." },
    { id: 8, title: "ANGELIC ASCENT", subtitle: "Apex Legend Trophy", date: "2026-05-25", desc: "Top 10 leaderboard dominance recognition." },
    { id: 9, title: "ANGELIC ASCENT", subtitle: "Vector Vanguard", date: "2026-06-10", desc: "Special community event design & combat winner." },
    { id: 10, title: "ANGELIC ASCENT", subtitle: "Quantum Guardian", date: "2026-07-02", desc: "Secured base defense record in tactical matches." },
    { id: 11, title: "ANGELIC ASCENT", subtitle: "Eternal Champion", date: "2026-07-20", desc: "Anniversary championship grand trophy." }
];

export function renderTrophyShowcase(containerId, onTrophyClick) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <style>
            .custom-showcase-grid {
                display: grid;
                grid-template-columns: 1fr 1.2fr 1fr;
                gap: 8px;
                align-items: center;
                justify-items: center;
                width: 100%;
                padding: 6px 0;
            }

            .trophy-column {
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: 100%;
                align-items: center;
            }

            /* ဖလားသီးသန့် စတိုင် (အသေးစား - ဘယ်/ညာအတွက်) */
            .pure-trophy-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transition: transform 0.2s ease, filter 0.2s ease;
                padding: 4px;
            }

            .pure-trophy-item:hover {
                transform: scale(1.08);
                filter: drop-shadow(0 0 8px #facc15);
            }

            /* အလယ်က အကြီးစား ဖလားအတွက် စတိုင် */
            .pure-trophy-item.center-giant {
                transform: scale(1.35);
                margin: 10px 0;
            }
            .pure-trophy-item.center-giant:hover {
                transform: scale(1.45);
                filter: drop-shadow(0 0 14px #facc15);
            }

            /* ညီမလေးပေးထားသော Crystal Trophy ကို အသေးစားချုံ့ထားသော Structural CSS များ */
            .crystal-trophy-container {
                width: 70px;
                height: 90px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 2px 0;
            }

            /* အလယ်ကြီးအတွက်ဆို အရွယ်အစား အနည်းငယ်ပိုကြီးမည် */
            .center-giant .crystal-trophy-container {
                width: 95px;
                height: 120px;
            }

            .celestial-head {
                position: relative;
                width: 50px;
                height: 35px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .center-giant .celestial-head {
                width: 70px;
                height: 50px;
            }

            .angel-halo {
                position: absolute;
                top: -1px;
                width: 16px;
                height: 6px;
                border: 1.5px solid #facc15;
                border-radius: 50%;
                box-shadow: 0 0 6px #facc15, 0 0 10px #38bdf8;
                z-index: 4;
                animation: pulseHalo 2s ease-in-out infinite alternate;
            }
            .center-giant .angel-halo {
                width: 24px;
                height: 9px;
            }

            @keyframes pulseHalo {
                0% { transform: scale(0.9); opacity: 0.8; }
                100% { transform: scale(1.1); opacity: 1; }
            }

            .angel-wing {
                position: absolute;
                width: 20px;
                height: 28px;
                background: linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(250, 204, 21, 0.2) 100%);
                border: 0.8px solid #38bdf8;
            }
            .center-giant .angel-wing {
                width: 28px;
                height: 40px;
            }

            .left-wing {
                left: 1px;
                top: 4px;
                clip-path: polygon(20% 0%, 100% 30%, 80% 100%, 0% 70%);
                transform: rotate(-5deg);
            }

            .right-wing {
                right: 1px;
                top: 4px;
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
                width: 8px;
                height: 8px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 6px #38bdf8, 0 0 10px #facc15;
            }
            .center-giant .angel-core {
                width: 12px;
                height: 12px;
            }

            .celestial-pillar {
                position: relative;
                width: 12px;
                height: 20px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.8px solid #38bdf8;
                border-radius: 2px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .center-giant .celestial-pillar {
                width: 16px;
                height: 28px;
            }

            .pillar-beam {
                width: 1.5px;
                height: 100%;
                background: linear-gradient(180deg, #facc15 0%, #38bdf8 100%);
                box-shadow: 0 0 5px #38bdf8;
            }

            .celestial-base {
                position: relative;
                width: 60px;
                height: 14px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.8px solid #38bdf8;
                border-top: 1.5px solid #facc15;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 6px rgba(56, 189, 248, 0.3);
            }
            .center-giant .celestial-base {
                width: 85px;
                height: 18px;
            }

            .base-glow-rim {
                position: absolute;
                top: 1px;
                width: 45px;
                height: 0.8px;
                background: #facc15;
            }
            .center-giant .base-glow-rim {
                width: 65px;
            }

            .base-title {
                color: #facc15;
                font-size: 4.5px;
                font-weight: 900;
                letter-spacing: 0.5px;
                z-index: 2;
                text-shadow: 0 0 3px #38bdf8;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 54px;
            }
            .center-giant .base-title {
                font-size: 6px;
                max-width: 78px;
            }
        </style>

        <div class="custom-showcase-grid">
            <!-- ဘယ်ဘက် ကော်လံ (၅ လုံး) -->
            <div class="trophy-column" id="left-trophies-col"></div>

            <!-- အလယ် ကော်လံ (အဓိက အကြီးစား ၁ လုံး) -->
            <div class="trophy-column" id="center-trophy-col"></div>

            <!-- ညာဘက် ကော်လံ (၅ လုံး) -->
            <div class="trophy-column" id="right-trophies-col"></div>
        </div>
    `;

    const leftCol = document.getElementById('left-trophies-col');
    const centerCol = document.getElementById('center-trophy-col');
    const rightCol = document.getElementById('right-trophies-col');

    // Trophy Element တည်ဆောက်ပေးသည့် Helper Function
    const createTrophyElement = (trophy, isGiant = false) => {
        const item = document.createElement('div');
        item.className = `pure-trophy-item ${isGiant ? 'center-giant' : ''}`;
        item.title = `${trophy.subtitle} - နှိပ်၍ အသေးစိတ်ကြည့်ရန်`;

        item.innerHTML = `
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

        item.addEventListener('click', () => {
            if (typeof onTrophyClick === 'function') {
                onTrophyClick(trophy);
            }
        });

        return item;
    };

    // ၁။ ဘယ်ဘက် (အညွှန်း ၀ မှ ၄ ထိ - ၅ လုံး)
    for (let i = 0; i < 5; i++) {
        leftCol.appendChild(createTrophyElement(trophyDataList[i]));
    }

    // ၂။ အလယ် (အညွှန်း ၅ - အကြီးစား ၁ လုံး)
    centerCol.appendChild(createTrophyElement(trophyDataList[5], true));

    // ၃။ ညာဘက် (အညွှန်း ၆ မှ ၁၀ ထိ - ၅ လုံး)
    for (let i = 6; i < 11; i++) {
        rightCol.appendChild(createTrophyElement(trophyDataList[i]));
    }
}