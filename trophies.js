// trophies.js - Top 5, Bottom 5, Center Shield Halo Layout

const trophyDataList = [
    // အပေါ်ဘက် ၅ လုံး
    { id: 1, title: "ANGELIC ASCENT", subtitle: "M7 World Championship", date: "2026-01-15", desc: "Elite Tier Global Tournament Winner Badge." },
    { id: 2, title: "ANGELIC ASCENT", subtitle: "Season 25 Glory", date: "2026-02-10", desc: "Mythical Glory Rank 1st Position Holder." },
    { id: 3, title: "ANGELIC ASCENT", subtitle: "Cyber Arena Master", date: "2026-03-05", desc: "Undefeated streak in 1v1 custom showdowns." },
    { id: 4, title: "ANGELIC ASCENT", subtitle: "Aura Cup Champion", date: "2026-03-20", desc: "Squad tournament grand finals MVP trophy." },
    { id: 5, title: "ANGELIC ASCENT", subtitle: "Neon Striker Elite", date: "2026-04-12", desc: "Achieved maximum tactical score in seasonal event." },
    
    // အလယ်အကြီးစား ၁ လုံး (Cyber Angelic Shield Trophy)
    { id: 6, title: "ETERNAL SUPREME", subtitle: "M7 HALO CHAMPION", date: "2026-08-23", desc: "The Ultimate Cyber Angelic Shield Trophy. Undisputed king of all tournaments." },

    // အောက်ဘက် ၅ လုံး
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
            .layout-wrapper {
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: center;
                width: 100%;
                padding: 4px 0;
            }

            .trophy-row {
                display: flex;
                justify-content: center;
                gap: 6px;
                width: 100%;
                flex-wrap: nowrap;
                overflow-x: auto;
                padding-bottom: 4px;
            }

            .center-highlight-row {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin: 2px 0;
            }

            /* အပေါ်/အောက် သာမန်ဖလားများအတွက် စတိုင် */
            .pure-trophy-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transition: transform 0.2s ease, filter 0.2s ease;
                padding: 2px;
                flex-shrink: 0;
            }

            .pure-trophy-item:hover {
                transform: scale(1.08);
                filter: drop-shadow(0 0 8px #facc15);
            }

            /* Crystal Trophy Structural CSS များ (အပေါ်/အောက်အတွက်) */
            .crystal-trophy-container {
                width: 52px;
                height: 72px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 2px 0;
            }

            .celestial-head {
                position: relative;
                width: 38px;
                height: 26px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .angel-halo {
                position: absolute;
                top: -1px;
                width: 12px;
                height: 5px;
                border: 1.2px solid #facc15;
                border-radius: 50%;
                box-shadow: 0 0 5px #facc15, 0 0 8px #38bdf8;
                z-index: 4;
                animation: pulseHalo 2s ease-in-out infinite alternate;
            }

            @keyframes pulseHalo {
                0% { transform: scale(0.9); opacity: 0.8; }
                100% { transform: scale(1.1); opacity: 1; }
            }

            .angel-wing {
                position: absolute;
                width: 15px;
                height: 20px;
                background: linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(250, 204, 21, 0.2) 100%);
                border: 0.6px solid #38bdf8;
            }

            .left-wing {
                left: 1px;
                top: 3px;
                clip-path: polygon(20% 0%, 100% 30%, 80% 100%, 0% 70%);
                transform: rotate(-5deg);
            }

            .right-wing {
                right: 1px;
                top: 3px;
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
                width: 6px;
                height: 6px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 5px #38bdf8, 0 0 8px #facc15;
            }

            .celestial-pillar {
                position: relative;
                width: 10px;
                height: 15px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.6px solid #38bdf8;
                border-radius: 2px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .pillar-beam {
                width: 1.2px;
                height: 100%;
                background: linear-gradient(180deg, #facc15 0%, #38bdf8 100%);
                box-shadow: 0 0 4px #38bdf8;
            }

            .celestial-base {
                position: relative;
                width: 48px;
                height: 11px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.6px solid #38bdf8;
                border-top: 1.2px solid #facc15;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 5px rgba(56, 189, 248, 0.3);
            }

            .base-glow-rim {
                position: absolute;
                top: 1px;
                width: 32px;
                height: 0.6px;
                background: #facc15;
            }

            .base-title {
                color: #facc15;
                font-size: 3.6px;
                font-weight: 900;
                letter-spacing: 0.3px;
                z-index: 2;
                text-shadow: 0 0 2px #38bdf8;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 42px;
            }

            /* --- အလယ်က Cyber Angelic Shield Trophy CSS များ --- */
            .pure-trophy-item.center-shield-item {
                cursor: pointer;
                transition: transform 0.25s ease;
            }
            .pure-trophy-item.center-shield-item:hover {
                transform: scale(1.12);
            }

            .cyber-shield-wrapper-halo {
                width: 95px;
                height: 110px;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(3, 7, 18, 1));
                border: 1.5px solid #38bdf8;
                clip-path: polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 0 22px rgba(56, 189, 248, 0.5), inset 0 0 10px rgba(250, 204, 21, 0.3);
                flex-shrink: 0;
                animation: shieldFloatHalo 3s ease-in-out infinite;
            }

            @keyframes shieldFloatHalo {
                0%, 100% {
                    transform: translateY(0px);
                    box-shadow: 0 0 18px rgba(56, 189, 248, 0.5);
                }
                50% {
                    transform: translateY(-4px);
                    box-shadow: 0 0 30px rgba(250, 204, 21, 0.7);
                }
            }

            .cybercity-trophy-container-halo {
                width: 79px;
                height: 92px;
                background: radial-gradient(circle at center, #1e1b4b 0%, #020617 100%);
                border: 1px solid rgba(56, 189, 248, 0.5);
                clip-path: polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%);
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                z-index: 2;
            }

            .angel-halo-crown {
                position: absolute;
                top: 4px;
                width: 22px;
                height: 8px;
                border: 2px solid #facc15;
                border-radius: 50%;
                box-shadow: 0 0 8px #facc15, 0 0 12px #38bdf8;
                z-index: 6;
                animation: pulseHaloCrown 2s ease-in-out infinite alternate;
            }

            @keyframes pulseHaloCrown {
                0% { transform: scale(0.9); opacity: 0.8; }
                100% { transform: scale(1.15); opacity: 1; }
            }

            .blade-wing {
                position: absolute;
                width: 26px;
                height: 44px;
                background: linear-gradient(135deg, #38bdf8 0%, #a855f7 100%);
                top: 14px;
                box-shadow: 0 0 8px #38bdf8;
            }

            .left-blade {
                left: 3px;
                clip-path: polygon(0% 0%, 100% 20%, 60% 100%, 10% 80%);
            }

            .right-blade {
                right: 3px;
                clip-path: polygon(0% 20%, 100% 0%, 90% 80%, 40% 100%);
            }

            .laser-beam {
                position: absolute;
                top: 8px;
                width: 2px;
                height: 46px;
                background: #ffffff;
                box-shadow: 0 0 6px #38bdf8, 0 0 10px #facc15;
                z-index: 4;
            }

            .cyber-cup-body-v2 {
                position: absolute;
                width: 20px;
                height: 34px;
                background: linear-gradient(180deg, rgba(168, 85, 247, 0.8) 0%, #0f172a 80%);
                border: 1px solid #38bdf8;
                top: 22px;
                clip-path: polygon(50% 0%, 100% 25%, 80% 100%, 20% 100%, 0% 25%);
                z-index: 3;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .glow-dot {
                width: 5px;
                height: 5px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 6px #38bdf8;
            }

            .cyber-base-v2 {
                position: absolute;
                bottom: 12px;
                width: 46px;
                height: 11px;
                background: #090d16;
                border: 1px solid #38bdf8;
                border-top: 1.5px solid #facc15;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 5;
                box-shadow: 0 0 8px rgba(56, 189, 248, 0.5);
            }

            .cyber-badge-text-v2 {
                color: #facc15;
                font-size: 4px;
                font-weight: 900;
                letter-spacing: 0.6px;
                text-shadow: 0 0 3px #38bdf8;
            }
        </style>

        <div class="layout-wrapper">
            <!-- အပေါ်ဘက် တန်း (၅ လုံး) -->
            <div class="trophy-row" id="top-row"></div>

            <!-- အလယ်တည့်တည့် (Cyber Angelic Shield Trophy) -->
            <div class="center-highlight-row" id="center-row"></div>

            <!-- အောက်ဘက် တန်း (၅ လုံး) -->
            <div class="trophy-row" id="bottom-row"></div>
        </div>
    `;

    const topRow = document.getElementById('top-row');
    const centerRow = document.getElementById('center-row');
    const bottomRow = document.getElementById('bottom-row');

    // 1. သာမန်ဖလားများ ဖန်တီးရန် (အပေါ်/အောက် တန်းများအတွက်)
    const createStandardTrophyElement = (trophy) => {
        const item = document.createElement('div');
        item.className = `pure-trophy-item`;
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
                onTrophyClick(trophy, item.innerHTML);
            }
        });

        return item;
    };

    // 2. အလယ်က Shield Trophy ဖန်တီးရန်
    const createShieldCenterElement = (trophy) => {
        const item = document.createElement('div');
        item.className = `pure-trophy-item center-shield-item`;
        item.title = `${trophy.subtitle} - နှိပ်၍ အသေးစိတ်ကြည့်ရန်`;

        item.innerHTML = `
            <div class="cyber-shield-wrapper-halo">
                <div class="cybercity-trophy-container-halo">
                    <div class="angel-halo-crown"></div>
                    <div class="blade-wing left-blade"></div>
                    <div class="blade-wing right-blade"></div>
                    <div class="laser-beam"></div>
                    <div class="cyber-cup-body-v2">
                        <div class="glow-dot"></div>
                    </div>
                    <div class="cyber-base-v2">
                        <span class="cyber-badge-text-v2">M7 HALO CHAMPION</span>
                    </div>
                </div>
            </div>
        `;

        item.addEventListener('click', () => {
            if (typeof onTrophyClick === 'function') {
                onTrophyClick(trophy, item.innerHTML);
            }
        });

        return item;
    };

    // ၁။ အပေါ်တန်း (၅ လုံး)
    for (let i = 0; i < 5; i++) {
        topRow.appendChild(createStandardTrophyElement(trophyDataList[i]));
    }

    // ၂။ အလယ် (Cyber Angelic Shield Trophy ၁ လုံး)
    centerRow.appendChild(createShieldCenterElement(trophyDataList[5]));

    // ၃။ အောက်တန်း (၅ လုံး)
    for (let i = 6; i < 11; i++) {
        bottomRow.appendChild(createStandardTrophyElement(trophyDataList[i]));
    }
}