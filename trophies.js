// trophies.js - Cyber Vortex Phoenix Trophy at the 4th position in the top row

const trophyDataList = [
    { id: 1, title: "ANGELIC ASCENT", subtitle: "ANGELIC ASCENT", date: "2026-01-15", desc: "Eternal Aura Angelic Halo Trophy.", isCustom: true, styleType: 'angelic-large' },
    { id: 2, title: "CYBER BLADE SHIELD", subtitle: "CYBER BLADE CHAMPION", date: "2026-02-10", desc: "Eternal Aura Cyber Blade Trophy. The Ultimate Cyber Shield." },
    { id: 3, title: "PHOENIX PROTOCOL", subtitle: "PHOENIX PROTOCOL", date: "2026-03-05", desc: "Eternal Aura Phoenix Shield Trophy.", isCustom: true, styleType: 'phoenix' },
    
    // စတုတ္ထနေရာမှာ အစားထိုးလိုက်သော Cyber Vortex Phoenix Trophy (id: 4)
    { id: 4, title: "VORTEX PROTOCOL", subtitle: "VORTEX PROTOCOL", date: "2026-03-20", desc: "Eternal Aura Cyber Vortex Phoenix Trophy.", isCustom: true, styleType: 'vortex' },

    { id: 5, title: "ANGELIC ASCENT", subtitle: "Neon Striker Elite", date: "2026-04-12", desc: "Achieved maximum tactical score in seasonal event." },
    
    // အလယ်အကြီးစား ၁ လုံး (မူလအတိုင်း)
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
                gap: 14px;
                align-items: center;
                width: 100%;
                padding: 4px 0;
            }

            .trophy-row {
                display: flex;
                justify-content: center;
                gap: 10px;
                width: 100%;
                flex-wrap: nowrap;
                overflow-x: auto;
                padding-bottom: 6px;
            }

            .center-highlight-row {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin: 4px 0;
            }

            .pure-trophy-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transition: transform 0.25s ease, filter 0.25s ease;
                padding: 4px;
                flex-shrink: 0;
            }

            .pure-trophy-item:hover {
                transform: scale(1.08) translateY(-4px);
                filter: drop-shadow(0 0 10px #00f0ff);
            }

            /* --- ပထမဆုံး Trophy (Angelic Large) --- */
            .crystal-trophy-wrapper-first {
                width: 52px;
                height: 72px;
                background: transparent;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                flex-shrink: 0;
            }

            .crystal-trophy-container-large {
                width: 52px;
                height: 72px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 2px 0;
            }

            .celestial-head-large {
                position: relative;
                width: 38px;
                height: 26px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .angel-halo-large {
                position: absolute;
                top: -1px;
                width: 12px;
                height: 5px;
                border: 1.2px solid #facc15;
                border-radius: 50%;
                box-shadow: 0 0 6px #facc15, 0 0 10px #38bdf8;
                z-index: 4;
                animation: pulseHalo 2s ease-in-out infinite alternate;
            }

            @keyframes pulseHalo {
                0% { transform: scale(0.9); opacity: 0.8; }
                100% { transform: scale(1.15); opacity: 1; }
            }

            .angel-wing-large {
                position: absolute;
                width: 15px;
                height: 20px;
                background: linear-gradient(135deg, rgba(56, 189, 248, 0.35) 0%, rgba(250, 204, 21, 0.3) 100%);
            }

            .left-wing-large {
                left: 1px;
                top: 3px;
                clip-path: polygon(20% 0%, 100% 30%, 80% 100%, 0% 70%);
                transform: rotate(-5deg);
            }

            .right-wing-large {
                right: 1px;
                top: 3px;
                clip-path: polygon(0% 30%, 80% 0%, 100% 70%, 20% 100%);
                transform: rotate(5deg);
            }

            .central-hologram-large {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3;
            }

            .angel-core-large {
                width: 6px;
                height: 6px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 6px #38bdf8, 0 0 10px #facc15;
            }

            .celestial-pillar-large {
                position: relative;
                width: 10px;
                height: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .pillar-beam-large {
                width: 1.2px;
                height: 100%;
                background: linear-gradient(180deg, #facc15 0%, #38bdf8 100%);
                box-shadow: 0 0 5px #38bdf8;
            }

            .celestial-base-large {
                position: relative;
                width: 48px;
                height: 11px;
                background: rgba(15, 23, 42, 0.6);
                border: 0.6px solid rgba(56, 189, 248, 0.4);
                border-top: 1.2px solid #facc15;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .base-glow-rim-large {
                position: absolute;
                top: 1px;
                width: 32px;
                height: 0.6px;
                background: #facc15;
            }

            .base-title-large {
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

            /* --- ဒုတိယနေရာ (Cyber Blade Trophy Small) --- */
            .crystal-trophy-wrapper-cyber-small {
                width: 52px;
                height: 72px;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 1) 100%);
                border: 1px solid #06b6d4;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
                overflow: hidden;
                flex-shrink: 0;
            }

            .crystal-trophy-container-cyber-small {
                width: 48px;
                height: 68px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 2px 0;
            }

            .celestial-head-cyber-small {
                position: relative;
                width: 38px;
                height: 28px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .blade-tip-small {
                position: absolute;
                top: 0px;
                width: 6px;
                height: 10px;
                background: linear-gradient(180deg, #ffffff 0%, #06b6d4 100%);
                clip-path: polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%);
                box-shadow: 0 0 6px #06b6d4;
                z-index: 4;
            }

            .cyber-shield-wing-small {
                position: absolute;
                width: 15px;
                height: 22px;
                background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(56, 189, 248, 0.35) 100%);
                border: 0.5px solid #06b6d4;
            }

            .cyber-shield-wing-small.left-wing {
                left: 2px;
                top: 4px;
                clip-path: polygon(0 0%, 100% 15%, 85% 100%, 0% 85%);
            }

            .cyber-shield-wing-small.right-wing {
                right: 2px;
                top: 4px;
                clip-path: polygon(0 15%, 100% 0%, 100% 85%, 15% 100%);
            }

            .energy-core-pulse-small {
                width: 8px;
                height: 8px;
                background: radial-gradient(circle, #ffffff 0%, #06b6d4 60%, transparent 100%);
                border-radius: 50%;
                box-shadow: 0 0 6px #06b6d4;
                animation: pulseCoreSmall 1.5s ease-in-out infinite alternate;
                z-index: 3;
            }

            @keyframes pulseCoreSmall {
                0% { transform: scale(0.85); opacity: 0.7; }
                100% { transform: scale(1.15); opacity: 1; }
            }

            .celestial-pillar-cyber-small {
                position: relative;
                width: 10px;
                height: 18px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.5px solid #06b6d4;
                border-radius: 2px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .pillar-laser-line-small {
                width: 1.5px;
                height: 100%;
                background: #38bdf8;
                box-shadow: 0 0 5px #06b6d4;
            }

            .celestial-base-cyber-small {
                position: relative;
                width: 46px;
                height: 11px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.5px solid #06b6d4;
                border-top: 1px solid #38bdf8;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .base-title-cyber-small {
                color: #38bdf8;
                font-size: 3px;
                font-weight: 900;
                letter-spacing: 0.3px;
                z-index: 2;
                text-shadow: 0 0 2px #06b6d4;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 42px;
            }

            /* --- တတိယနေရာ (Phoenix Protocol Small) --- */
            .crystal-trophy-wrapper-phoenix-small {
                width: 52px;
                height: 72px;
                background: transparent;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                flex-shrink: 0;
            }

            .crystal-trophy-container-phoenix-small {
                width: 48px;
                height: 68px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 2px 0;
            }

            .celestial-head-phoenix-small {
                position: relative;
                width: 38px;
                height: 28px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .phoenix-core-gem-small {
                position: absolute;
                top: 2px;
                width: 6px;
                height: 6px;
                background: linear-gradient(135deg, #ffffff 0%, #ec4899 100%);
                transform: rotate(45deg);
                box-shadow: 0 0 6px #ec4899, 0 0 10px #38bdf8;
                z-index: 4;
            }

            .phoenix-wing-small {
                position: absolute;
                width: 15px;
                height: 22px;
                background: linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(56, 189, 248, 0.35) 100%);
                border: 0.5px solid #ec4899;
            }

            .phoenix-wing-small.left-wing {
                left: 2px;
                top: 4px;
                clip-path: polygon(10% 0%, 100% 20%, 80% 100%, 0% 70%);
            }

            .phoenix-wing-small.right-wing {
                right: 2px;
                top: 4px;
                clip-path: polygon(0% 20%, 90% 0%, 100% 70%, 20% 100%);
            }

            .central-hologram-phoenix-small {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3;
            }

            .pulse-ring-small {
                width: 10px;
                height: 10px;
                border: 1.2px solid #38bdf8;
                border-radius: 50%;
                box-shadow: 0 0 5px #38bdf8, inset 0 0 5px #ec4899;
                animation: pulseRingSmall 1.8s ease-in-out infinite alternate;
            }

            @keyframes pulseRingSmall {
                0% { transform: scale(0.8); opacity: 0.6; }
                100% { transform: scale(1.2); opacity: 1; }
            }

            .celestial-pillar-phoenix-small {
                position: relative;
                width: 10px;
                height: 18px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.5px solid #ec4899;
                border-radius: 2px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 2px;
            }

            .rail-line-small {
                width: 1px;
                height: 80%;
                background: #ec4899;
                box-shadow: 0 0 4px #ec4899;
            }

            .rail-core-small {
                width: 2px;
                height: 100%;
                background: linear-gradient(180deg, #38bdf8 0%, #ec4899 100%);
                box-shadow: 0 0 5px #38bdf8;
                border-radius: 1px;
            }

            .celestial-base-phoenix-small {
                position: relative;
                width: 46px;
                height: 11px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.5px solid #ec4899;
                border-top: 1px solid #38bdf8;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .base-glow-rim-small {
                position: absolute;
                top: 1px;
                width: 32px;
                height: 0.8px;
                background: #38bdf8;
                box-shadow: 0 0 4px #38bdf8;
            }

            .base-title-phoenix-small {
                color: #38bdf8;
                font-size: 3px;
                font-weight: 900;
                letter-spacing: 0.3px;
                z-index: 2;
                text-shadow: 0 0 2px #ec4899;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 42px;
            }

            /* --- စတုတ္ထနေရာ (Cyber Vortex Phoenix Small - Border နှင့် Floating မပါ၊ အထဲက animation သက်သက်) --- */
            .crystal-trophy-wrapper-vortex-small {
                width: 52px;
                height: 72px;
                background: transparent;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                flex-shrink: 0;
            }

            .crystal-trophy-container-vortex-small {
                width: 48px;
                height: 68px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 2px 0;
            }

            .celestial-head-vortex-small {
                position: relative;
                width: 38px;
                height: 28px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .vortex-core-gem-small {
                position: absolute;
                top: 0px;
                width: 6px;
                height: 6px;
                background: linear-gradient(135deg, #ffffff 0%, #00f0ff 100%);
                transform: rotate(45deg);
                box-shadow: 0 0 6px #00f0ff, 0 0 10px #8b5cf6;
                z-index: 4;
            }

            .vortex-wing-small {
                position: absolute;
                width: 15px;
                height: 22px;
                background: linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(139, 92, 246, 0.35) 100%);
                border: 0.5px solid #00f0ff;
            }

            .vortex-wing-small.left-wing {
                left: 2px;
                top: 4px;
                clip-path: polygon(0% 15%, 100% 0%, 75% 100%, 15% 85%);
            }

            .vortex-wing-small.right-wing {
                right: 2px;
                top: 4px;
                clip-path: polygon(100% 15%, 0% 0%, 25% 100%, 85% 85%);
            }

            .central-hologram-vortex-small {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3;
            }

            .pulse-ring-vortex-small {
                width: 8px;
                height: 8px;
                border: 1.2px solid #8b5cf6;
                border-radius: 50%;
                box-shadow: 0 0 5px #8b5cf6, inset 0 0 5px #00f0ff;
                animation: pulseRingVortexSmall 1.6s ease-in-out infinite alternate;
            }

            @keyframes pulseRingVortexSmall {
                0% { transform: scale(0.75); opacity: 0.5; }
                100% { transform: scale(1.25); opacity: 1; }
            }

            .celestial-pillar-vortex-small {
                position: relative;
                width: 10px;
                height: 18px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.5px solid #00f0ff;
                border-radius: 2px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 2px;
            }

            .rail-line-vortex-small {
                width: 1px;
                height: 80%;
                background: #8b5cf6;
                box-shadow: 0 0 4px #8b5cf6;
            }

            .rail-core-vortex-small {
                width: 2px;
                height: 100%;
                background: linear-gradient(180deg, #8b5cf6 0%, #00f0ff 100%);
                box-shadow: 0 0 5px #00f0ff;
                border-radius: 1px;
            }

            .celestial-base-vortex-small {
                position: relative;
                width: 46px;
                height: 11px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 0.5px solid #00f0ff;
                border-top: 1px solid #8b5cf6;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .base-glow-rim-vortex-small {
                position: absolute;
                top: 1px;
                width: 32px;
                height: 0.8px;
                background: #8b5cf6;
                box-shadow: 0 0 4px #8b5cf6;
            }

            .base-title-vortex-small {
                color: #8b5cf6;
                font-size: 3px;
                font-weight: 900;
                letter-spacing: 0.3px;
                z-index: 2;
                text-shadow: 0 0 2px #00f0ff;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 42px;
            }

            /* --- ပဉ္စမနေရာ (Standard Crystal Trophy) --- */
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
                box-shadow: 0 0 6px #facc15, 0 0 10px #38bdf8;
                z-index: 4;
            }

            .angel-wing {
                position: absolute;
                width: 15px;
                height: 20px;
                background: linear-gradient(135deg, rgba(56, 189, 248, 0.35) 0%, rgba(250, 204, 21, 0.3) 100%);
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
                box-shadow: 0 0 6px #38bdf8, 0 0 10px #facc15;
            }

            .celestial-pillar {
                position: relative;
                width: 10px;
                height: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .pillar-beam {
                width: 1.2px;
                height: 100%;
                background: linear-gradient(180deg, #facc15 0%, #38bdf8 100%);
                box-shadow: 0 0 5px #38bdf8;
            }

            .celestial-base {
                position: relative;
                width: 48px;
                height: 11px;
                background: rgba(15, 23, 42, 0.6);
                border: 0.6px solid rgba(56, 189, 248, 0.4);
                border-top: 1.2px solid #facc15;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
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

            /* --- မူလ အလယ်အကြီးစား Trophy (Cyber Angelic Shield) --- */
            .pure-trophy-item.center-shield-item {
                cursor: pointer;
                transition: transform 0.25s ease;
            }
            .pure-trophy-item.center-shield-item:hover {
                transform: scale(1.08);
            }

            .cyber-shield-wrapper-halo {
                width: 110px;
                height: 125px;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(3, 7, 18, 1));
                border: 1.5px solid #38bdf8;
                clip-path: polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 0 25px rgba(56, 189, 248, 0.5), inset 0 0 12px rgba(250, 204, 21, 0.3);
                flex-shrink: 0;
                animation: shieldFloatHalo 3s ease-in-out infinite;
            }

            @keyframes shieldFloatHalo {
                0%, 100% {
                    transform: translateY(0px);
                    box-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
                }
                50% {
                    transform: translateY(-6px);
                    box-shadow: 0 0 35px rgba(250, 204, 21, 0.7);
                }
            }

            .cybercity-trophy-container-halo {
                width: 92px;
                height: 104px;
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
                width: 26px;
                height: 10px;
                border: 2px solid #facc15;
                border-radius: 50%;
                box-shadow: 0 0 10px #facc15, 0 0 16px #38bdf8;
                z-index: 6;
                animation: pulseHaloCrown 2s ease-in-out infinite alternate;
            }

            @keyframes pulseHaloCrown {
                0% { transform: scale(0.9); opacity: 0.8; }
                100% { transform: scale(1.15); opacity: 1; }
            }

            .blade-wing {
                position: absolute;
                width: 30px;
                height: 52px;
                background: linear-gradient(135deg, #38bdf8 0%, #a855f7 100%);
                top: 16px;
                box-shadow: 0 0 10px #38bdf8;
            }
            .left-blade { left: 4px; clip-path: polygon(0% 0%, 100% 20%, 60% 100%, 10% 80%); }
            .right-blade { right: 4px; clip-path: polygon(0% 20%, 100% 0%, 90% 80%, 40% 100%); }

            .laser-beam {
                position: absolute;
                top: 10px;
                width: 2px;
                height: 55px;
                background: #ffffff;
                box-shadow: 0 0 8px #38bdf8, 0 0 14px #facc15;
                z-index: 4;
            }

            .cyber-cup-body-v2 {
                position: absolute;
                width: 24px;
                height: 40px;
                background: linear-gradient(180deg, rgba(168, 85, 247, 0.8) 0%, #0f172a 80%);
                border: 1px solid #38bdf8;
                top: 26px;
                clip-path: polygon(50% 0%, 100% 25%, 80% 100%, 20% 100%, 0% 25%);
                z-index: 3;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .glow-dot {
                width: 6px;
                height: 6px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 8px #38bdf8;
            }

            .cyber-base-v2 {
                position: absolute;
                bottom: 14px;
                width: 54px;
                height: 13px;
                background: #090d16;
                border: 1px solid #38bdf8;
                border-top: 1.5px solid #facc15;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 5;
                box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
            }

            .cyber-badge-text-v2 {
                color: #facc15;
                font-size: 4.5px;
                font-weight: 900;
                letter-spacing: 0.8px;
                text-shadow: 0 0 4px #38bdf8;
            }
        </style>

        <div class="layout-wrapper">
            <div class="trophy-row" id="top-row"></div>
            <div class="center-highlight-row" id="center-row"></div>
            <div class="trophy-row" id="bottom-row"></div>
        </div>
    `;

    const topRow = document.getElementById('top-row');
    const centerRow = document.getElementById('center-row');
    const bottomRow = document.getElementById('bottom-row');

    const createLargeAngelicElement = (trophy) => {
        const item = document.createElement('div');
        item.className = `pure-trophy-item`;
        item.title = `${trophy.subtitle} - နှိပ်၍ အသေးစိတ်ကြည့်ရန်`;
        item.innerHTML = `
            <div class="crystal-trophy-wrapper-first">
                <div class="crystal-trophy-container-large">
                    <div class="celestial-head-large">
                        <div class="angel-halo-large"></div>
                        <div class="angel-wing-large left-wing-large"></div>
                        <div class="angel-wing-large right-wing-large"></div>
                        <div class="central-hologram-large">
                            <div class="angel-core-large"></div>
                        </div>
                    </div>
                    <div class="celestial-pillar-large">
                        <div class="pillar-beam-large"></div>
                    </div>
                    <div class="celestial-base-large">
                        <div class="base-glow-rim-large"></div>
                        <span class="base-title-large">ANGELIC ASCENT</span>
                    </div>
                </div>
            </div>
        `;
        item.addEventListener('click', () => { if (typeof onTrophyClick === 'function') onTrophyClick(trophy, item.innerHTML); });
        return item;
    };

    const createCyberBladeSmallElement = (trophy) => {
        const item = document.createElement('div');
        item.className = `pure-trophy-item`;
        item.title = `${trophy.subtitle} - နှိပ်၍ အသေးစိတ်ကြည့်ရန်`;
        item.innerHTML = `
            <div class="crystal-trophy-wrapper-cyber-small">
                <div class="crystal-trophy-container-cyber-small">
                    <div class="celestial-head-cyber-small">
                        <div class="blade-tip-small"></div>
                        <div class="cyber-shield-wing-small left-wing"></div>
                        <div class="cyber-shield-wing-small right-wing"></div>
                        <div class="energy-core-pulse-small"></div>
                    </div>
                    <div class="celestial-pillar-cyber-small">
                        <div class="pillar-laser-line-small"></div>
                    </div>
                    <div class="celestial-base-cyber-small">
                        <span class="base-title-cyber-small">CYBER BLADE</span>
                    </div>
                </div>
            </div>
        `;
        item.addEventListener('click', () => { if (typeof onTrophyClick === 'function') onTrophyClick(trophy, item.innerHTML); });
        return item;
    };

    const createPhoenixProtocolSmallElement = (trophy) => {
        const item = document.createElement('div');
        item.className = `pure-trophy-item`;
        item.title = `${trophy.subtitle} - နှိပ်၍ အသေးစိတ်ကြည့်ရန်`;
        item.innerHTML = `
            <div class="crystal-trophy-wrapper-phoenix-small">
                <div class="crystal-trophy-container-phoenix-small">
                    <div class="celestial-head-phoenix-small">
                        <div class="phoenix-core-gem-small"></div>
                        <div class="phoenix-wing-small left-wing"></div>
                        <div class="phoenix-wing-small right-wing"></div>
                        <div class="central-hologram-phoenix-small">
                            <div class="pulse-ring-small"></div>
                        </div>
                    </div>
                    <div class="celestial-pillar-phoenix-small">
                        <div class="rail-line-small"></div>
                        <div class="rail-core-small"></div>
                        <div class="rail-line-small"></div>
                    </div>
                    <div class="celestial-base-phoenix-small">
                        <div class="base-glow-rim-small"></div>
                        <span class="base-title-phoenix-small">PHOENIX</span>
                    </div>
                </div>
            </div>
        `;
        item.addEventListener('click', () => { if (typeof onTrophyClick === 'function') onTrophyClick(trophy, item.innerHTML); });
        return item;
    };

    // စတုတ္ထနေရာအတွက် Border နှင့် Floating ဖြုတ်ထားသော Cyber Vortex Phoenix အသေးစား Element
    const createVortexProtocolSmallElement = (trophy) => {
        const item = document.createElement('div');
        item.className = `pure-trophy-item`;
        item.title = `${trophy.subtitle} - နှိပ်၍ အသေးစိတ်ကြည့်ရန်`;
        item.innerHTML = `
            <div class="crystal-trophy-wrapper-vortex-small">
                <div class="crystal-trophy-container-vortex-small">
                    <div class="celestial-head-vortex-small">
                        <div class="vortex-core-gem-small"></div>
                        <div class="vortex-wing-small left-wing"></div>
                        <div class="vortex-wing-small right-wing"></div>
                        <div class="central-hologram-vortex-small">
                            <div class="pulse-ring-vortex-small"></div>
                        </div>
                    </div>
                    <div class="celestial-pillar-vortex-small">
                        <div class="rail-line-vortex-small"></div>
                        <div class="rail-core-vortex-small"></div>
                        <div class="rail-line-vortex-small"></div>
                    </div>
                    <div class="celestial-base-vortex-small">
                        <div class="base-glow-rim-vortex-small"></div>
                        <span class="base-title-vortex-small">VORTEX</span>
                    </div>
                </div>
            </div>
        `;
        item.addEventListener('click', () => { if (typeof onTrophyClick === 'function') onTrophyClick(trophy, item.innerHTML); });
        return item;
    };

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
        item.addEventListener('click', () => { if (typeof onTrophyClick === 'function') onTrophyClick(trophy, item.innerHTML); });
        return item;
    };

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
        item.addEventListener('click', () => { if (typeof onTrophyClick === 'function') onTrophyClick(trophy, item.innerHTML); });
        return item;
    };

    // အပေါ်တန်း (Top Row) တွင် နေရာချခြင်း
    topRow.appendChild(createLargeAngelicElement(trophyDataList[0]));
    topRow.appendChild(createCyberBladeSmallElement(trophyDataList[1]));         // ဒုတိယနေရာ (Cyber Blade)
    topRow.appendChild(createPhoenixProtocolSmallElement(trophyDataList[2]));   // တတိယနေရာ (Phoenix Protocol)
    topRow.appendChild(createVortexProtocolSmallElement(trophyDataList[3]));    // စတုတ္ထနေရာ (Cyber Vortex Phoenix - Border နှင့် floating ဖြုတ်ပြီး အထဲက animation သက်သက်)
    topRow.appendChild(createStandardTrophyElement(trophyDataList[4]));         // ပဉ္စမနေရာ

    // အလယ်တန်း (Center Row)
    centerRow.appendChild(createShieldCenterElement(trophyDataList[5]));

    // အောက်တန်း (Bottom Row)
    for (let i = 6; i < 11; i++) {
        bottomRow.appendChild(createStandardTrophyElement(trophyDataList[i]));
    }
}