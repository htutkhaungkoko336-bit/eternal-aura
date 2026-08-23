// trophies.js - Top 4 Custom Cyber Trophies + 1 Standard, Center Shield Halo Layout, Bottom 5

const trophyDataList = [
    // အပေါ်ဘက် ၅ လုံး (ပထမ ၄ လုံးမှာ ပေးထားသော ဆိုင်ဘာ ဒီဇိုင်းအသစ်များ အစားထိုးထားသည်)
    { id: 1, title: "CYBER BLADE", subtitle: "CYBER BLADE SHIELD", date: "2026-01-15", desc: "Elite Tier Cyber Blade Shield Trophy.", isCustom: true, styleType: 'blade' },
    { id: 2, title: "PHOENIX PROTOCOL", subtitle: "PHOENIX PROTOCOL", date: "2026-02-10", desc: "Mythical Phoenix Wing Championship Trophy.", isCustom: true, styleType: 'phoenix' },
    { id: 3, title: "VORTEX PROTOCOL", subtitle: "VORTEX PROTOCOL", date: "2026-03-05", desc: "Undefeated Mecha Vortex Trophy.", isCustom: true, styleType: 'vortex' },
    { id: 4, title: "PRISM PROTOCOL", subtitle: "PRISM PROTOCOL", date: "2026-03-20", desc: "Matrix Crystal Prism Trophy MVP.", isCustom: true, styleType: 'prism' },
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

            /* --- Custom Small Mini Trophies (အပေါ်တန်းအတွက် သေးငယ်သော ပုံစံများ) --- */
            .mini-custom-trophy {
                width: 52px;
                height: 72px;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 1) 100%);
                border: 1px solid;
                border-radius: 6px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 3px 0;
                position: relative;
                box-shadow: 0 0 8px rgba(56, 189, 248, 0.3);
            }

            .mini-custom-trophy.blade { border-color: #06b6d4; }
            .mini-custom-trophy.phoenix { border-color: #ec4899; }
            .mini-custom-trophy.vortex { border-color: #00f0ff; }
            .mini-custom-trophy.prism { border-color: #a855f7; }

            .mini-head {
                position: relative;
                width: 40px;
                height: 28px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            /* Blade Mini parts */
            .mini-blade-tip {
                position: absolute;
                top: 0;
                width: 6px;
                height: 10px;
                background: linear-gradient(180deg, #ffffff, #06b6d4);
                clip-path: polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%);
            }
            .mini-blade-wing {
                position: absolute;
                width: 16px;
                height: 22px;
                background: linear-gradient(135deg, rgba(6,182,212,0.2), rgba(56,189,248,0.35));
                border: 0.5px solid #06b6d4;
            }
            .mini-blade-wing.left { left: 2px; top: 4px; clip-path: polygon(0 0%, 100% 15%, 85% 100%, 0% 85%); }
            .mini-blade-wing.right { right: 2px; top: 4px; clip-path: polygon(0 15%, 100% 0%, 100% 85%, 15% 100%); }

            /* Phoenix/Vortex Mini parts */
            .mini-gem {
                position: absolute;
                top: 2px;
                width: 8px;
                height: 8px;
                transform: rotate(45deg);
                z-index: 2;
            }
            .phoenix .mini-gem { background: #ec4899; box-shadow: 0 0 6px #ec4899; }
            .vortex .mini-gem { background: #00f0ff; box-shadow: 0 0 6px #00f0ff; }
            .prism .mini-gem { background: #a855f7; width: 9px; height: 9px; clip-path: polygon(50% 0%, 100% 100%, 0% 100%); transform: none; box-shadow: 0 0 6px #a855f7; }

            .mini-wing {
                position: absolute;
                width: 16px;
                height: 22px;
                border: 0.5px solid;
            }
            .phoenix .mini-wing { background: rgba(236,72,153,0.25); border-color: #ec4899; }
            .vortex .mini-wing { background: rgba(0,240,255,0.2); border-color: #00f0ff; }
            .prism .mini-wing { background: rgba(168,85,247,0.25); border-color: #a855f7; }

            .mini-wing.left { left: 2px; top: 4px; clip-path: polygon(10% 0%, 100% 20%, 80% 100%, 0% 70%); }
            .mini-wing.right { right: 2px; top: 4px; clip-path: polygon(0% 20%, 90% 0%, 100% 70%, 20% 100%); }
            .prism .mini-wing.left { clip-path: polygon(30% 0%, 100% 20%, 70% 100%, 0% 80%); }
            .prism .mini-wing.right { clip-path: polygon(0% 20%, 70% 0%, 100% 80%, 30% 100%); }

            .mini-pillar {
                width: 10px;
                height: 18px;
                background: linear-gradient(180deg, #0f172a, #020617);
                border: 0.5px solid;
                border-radius: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .blade .mini-pillar { border-color: #06b6d4; }
            .phoenix .mini-pillar { border-color: #ec4899; }
            .vortex .mini-pillar { border-color: #00f0ff; }
            .prism .mini-pillar { border-color: #a855f7; }

            .mini-pillar-line {
                width: 2px;
                height: 100%;
            }
            .blade .mini-pillar-line { background: #38bdf8; }
            .phoenix .mini-pillar-line { background: #ec4899; }
            .vortex .mini-pillar-line { background: #00f0ff; }
            .prism .mini-pillar-line { background: #a855f7; }

            .mini-base {
                position: relative;
                width: 46px;
                height: 11px;
                background: linear-gradient(180deg, #0f172a, #020617);
                border: 0.5px solid;
                border-top: 1px solid #38bdf8;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .blade .mini-base { border-color: #06b6d4; }
            .phoenix .mini-base { border-color: #ec4899; }
            .vortex .mini-base { border-color: #00f0ff; }
            .prism .mini-base { border-color: #a855f7; }

            .mini-base-title {
                font-size: 3.2px;
                font-weight: 900;
                letter-spacing: 0.3px;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 42px;
            }
            .blade .mini-base-title { color: #38bdf8; }
            .phoenix .mini-base-title { color: #38bdf8; }
            .vortex .mini-base-title { color: #8b5cf6; }
            .prism .mini-base-title { color: #38bdf8; }

            /* Standard Crystal Trophy (5th item in top row & bottom row) */
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
            }

            .angel-wing {
                position: absolute;
                width: 15px;
                height: 20px;
                background: linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(250, 204, 21, 0.2) 100%);
                border: 0.6px solid #38bdf8;
            }

            .left-wing { left: 1px; top: 3px; clip-path: polygon(20% 0%, 100% 30%, 80% 100%, 0% 70%); transform: rotate(-5deg); }
            .right-wing { right: 1px; top: 3px; clip-path: polygon(0% 30%, 80% 0%, 100% 70%, 20% 100%); transform: rotate(5deg); }

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
                0%, 100% { transform: translateY(0px); box-shadow: 0 0 18px rgba(56, 189, 248, 0.5); }
                50% { transform: translateY(-4px); box-shadow: 0 0 30px rgba(250, 204, 21, 0.7); }
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
            }

            .blade-wing {
                position: absolute;
                width: 26px;
                height: 44px;
                background: linear-gradient(135deg, #38bdf8 0%, #a855f7 100%);
                top: 14px;
            }
            .left-blade { left: 3px; clip-path: polygon(0% 0%, 100% 20%, 60% 100%, 10% 80%); }
            .right-blade { right: 3px; clip-path: polygon(0% 20%, 100% 0%, 90% 80%, 40% 100%); }

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

    // 1. Custom Mini Trophy ဖန်တီးရန် (ပထမ ၄ လုံးအတွက်)
    const createCustomMiniElement = (trophy) => {
        const item = document.createElement('div');
        item.className = `pure-trophy-item`;
        item.title = `${trophy.subtitle} - နှိပ်၍ အသေးစိတ်ကြည့်ရန်`;

        let headContent = '';
        if (trophy.styleType === 'blade') {
            headContent = `
                <div class="mini-blade-tip"></div>
                <div class="mini-blade-wing left"></div>
                <div class="mini-blade-wing right"></div>
            `;
        } else {
            headContent = `
                <div class="mini-gem"></div>
                <div class="mini-wing left"></div>
                <div class="mini-wing right"></div>
            `;
        }

        item.innerHTML = `
            <div class="mini-custom-trophy ${trophy.styleType}">
                <div class="mini-head">
                    ${headContent}
                </div>
                <div class="mini-pillar">
                    <div class="mini-pillar-line"></div>
                </div>
                <div class="mini-base">
                    <span class="mini-base-title">${trophy.subtitle}</span>
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

    // 2. သာမန်ဖလားများ ဖန်တီးရန် (အခြားနေရာများအတွက်)
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

    // 3. အလယ်က Shield Trophy ဖန်တီးရန်
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

    // ၁။ အပေါ်တန်း (ပထမ ၄ လုံး - Custom Trophies, ၅ လုံးမြောက် - Standard Trophy)
    for (let i = 0; i < 4; i++) {
        topRow.appendChild(createCustomMiniElement(trophyDataList[i]));
    }
    topRow.appendChild(createStandardTrophyElement(trophyDataList[4]));

    // ၂။ အလယ် (Cyber Angelic Shield Trophy ၁ လုံး)
    centerRow.appendChild(createShieldCenterElement(trophyDataList[5]));

    // ၃။ အောက်တန်း (၅ လုံး)
    for (let i = 6; i < 11; i++) {
        bottomRow.appendChild(createStandardTrophyElement(trophyDataList[i]));
    }
}