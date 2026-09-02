import { renderModeScreen } from './mode.js';

export function renderMatchScreen(container) {
    container.innerHTML = `
        <style>
            .setup-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 35px;
                position: relative;
                width: 100%;
                height: 100%;
                background: #040408;
                font-family: sans-serif;
                user-select: none;
                box-sizing: border-box;
                overflow: hidden;
            }

            .main-workspace {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            .monitor-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }

            /* မော်နီတာ */
            .monitor {
                width: 600px;
                height: 310px;
                background: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%);
                border: 8px solid #181824;
                border-radius: 16px;
                box-shadow: 0 0 40px rgba(124, 58, 237, 0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: box-shadow 0.3s;
            }
            .monitor:hover {
                box-shadow: 0 0 60px rgba(124, 58, 237, 0.9);
            }
            .btn-text {
                color: #fff;
                font-weight: 800;
                font-size: 20px;
                letter-spacing: 2px;
                text-align: center;
                padding: 0 20px;
                text-shadow: 0 0 12px rgba(255,255,255,0.8);
                line-height: 1.5;
            }

            /* အကွက် ၁၀ ကွက် (Grid System) */
            .screen-grid {
                display: none;
                width: 100%;
                height: 100%;
                grid-template-columns: repeat(5, 1fr);
                grid-template-rows: repeat(2, 1fr);
                gap: 10px;
                padding: 10px;
                box-sizing: border-box;
                background: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%);
                position: absolute;
                top: 0;
                left: 0;
            }
            .screen-grid.active {
                display: grid;
            }
            .grid-cell {
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.4);
                border-radius: 8px;
                display: flex;
                flex-direction: column; 
                justify-content: center;
                align-items: center;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                backdrop-filter: blur(4px);
                transition: background 0.2s, transform 0.2s;
                text-align: center;
                gap: 5px;
                cursor: pointer;
            }
            .grid-cell:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.03);
            }

            /* မော်နီတာခြေထောက် */
            .monitor-stand {
                width: 90px;
                height: 35px;
                background: #181824;
                border-radius: 6px;
                border: 1px solid #00f2ff44;
            }

            /* ကီးဘုတ်နှင့် မောက်စ် ဇုန် */
            .desk-accessories {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 30px;
                perspective: 400px;
                margin-top: 5px;
            }

            /* RGB Mechanical Keyboard */
            .keyboard {
                width: 320px;
                height: 75px;
                background: #111119;
                border-radius: 10px;
                border: 1.5px solid #00f2ff66;
                box-shadow: 0 12px 25px rgba(0,0,0,0.8), 0 0 20px rgba(0, 242, 255, 0.25);
                display: grid;
                grid-template-columns: repeat(14, 1fr);
                grid-template-rows: repeat(4, 1fr);
                gap: 3px;
                padding: 6px;
                transform: rotateX(25deg);
                position: relative;
            }
            .keyboard::after {
                content: '';
                position: absolute;
                bottom: -8px; left: 5%; width: 90%; height: 6px;
                background: linear-gradient(90deg, #ff007f, #7c3aed, #00f2ff);
                border-radius: 50%;
                filter: blur(5px);
                opacity: 0.8;
            }
            .key {
                background: #1e1e2d;
                border: 1px solid #33334d;
                border-radius: 3px;
            }
            .key.accent-pink {
                background: #ff007f33;
                border-color: #ff007f99;
            }
            .key.accent-blue {
                background: #00f2ff33;
                border-color: #00f2ff99;
            }

            /* RGB Gaming Mouse */
            .mouse {
                width: 30px;
                height: 50px;
                background: #111119;
                border-radius: 15px 15px 8px 8px;
                border: 1.5px solid #ff007f77;
                box-shadow: 0 10px 20px rgba(0,0,0,0.7), 0 0 15px rgba(255, 0, 127, 0.3);
                transform: rotateX(20deg) rotateY(-10deg);
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 5px;
                gap: 4px;
            }
            .mouse-wheel {
                width: 4px;
                height: 10px;
                background: #00f2ff;
                border-radius: 3px;
                box-shadow: 0 0 6px #00f2ff;
            }
            .mouse::after {
                content: '';
                position: absolute;
                bottom: -4px;
                width: 80%;
                height: 4px;
                background: linear-gradient(90deg, #00f2ff, #ff007f);
                border-radius: 50%;
                filter: blur(3px);
            }

            /* PC ပုံး (Fish Tank Style) */
            .pc-tower {
                width: 100px;
                height: 300px;
                background: #0c0c14;
                border: 2px solid #7c3aed66;
                border-radius: 8px;
                box-shadow: 0 0 30px rgba(124, 58, 237, 0.3), inset 0 0 20px rgba(0, 242, 255, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px 6px;
                gap: 10px;
            }
            .pc-fan-large {
                width: 65px;
                height: 65px;
                background: radial-gradient(circle, #08080f 30%, #151522 70%);
                border-radius: 50%;
                border: 3px solid transparent;
                background-image: linear-gradient(#08080f, #08080f), linear-gradient(135deg, #00f2ff, #ff007f);
                background-origin: border-box;
                background-clip: content-box, border-box;
                box-shadow: 0 0 15px rgba(0, 242, 255, 0.4);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .pc-fan-large::after {
                content: '';
                width: 20px; height: 20px;
                background: linear-gradient(135deg, #7c3aed, #00f2ff);
                border-radius: 50%;
                box-shadow: 0 0 10px #7c3aed;
            }
            .pc-bottom-panel {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 6px;
                margin-top: auto;
                border-top: 1px solid #202030;
                padding-top: 6px;
            }
            .power-circle {
                width: 12px; height: 12px;
                background: #00f2ff;
                border-radius: 50%;
                box-shadow: 0 0 8px #00f2ff;
            }
            .audio-jack {
                width: 7px; height: 7px;
                background: #ff007f;
                border-radius: 50%;
                box-shadow: 0 0 6px #ff007f;
            }
        </style>

        <div class="setup-wrapper">
            <div class="main-workspace">
                <div class="monitor-group">
                    <div class="monitor" id="monitor">
                        <span class="btn-text" id="btnText">WELCOME FROM ETERNAL AURA<br><span style="font-size: 15px; font-weight: 600; letter-spacing: 1px;">CLICK HERE</span></span>
                        <div class="screen-grid" id="screenGrid">
                            <div class="grid-cell" data-value="5vs5 - 5k"><span>5vs5</span><span>5k</span></div>
                            <div class="grid-cell" data-value="5vs5 - 10k"><span>5vs5</span><span>10k</span></div>
                            <div class="grid-cell" data-value="5vs5 - 15k"><span>5vs5</span><span>15k</span></div>
                            <div class="grid-cell" data-value="5vs5 - 25k"><span>5vs5</span><span>25k</span></div>
                            <div class="grid-cell" data-value="5vs5 - 50k"><span>5vs5</span><span>50k</span></div>
                            <div class="grid-cell" data-value="1vs1 - 5k"><span>1vs1</span><span>5k</span></div>
                            <div class="grid-cell" data-value="1vs1 - 10k"><span>1vs1</span><span>10k</span></div>
                            <div class="grid-cell" data-value="1vs1 - 15k"><span>1vs1</span><span>15k</span></div>
                            <div class="grid-cell" data-value="1vs1 - 25k"><span>1vs1</span><span>25k</span></div>
                            <div class="grid-cell" data-value="1vs1 - 50k"><span>1vs1</span><span>50k</span></div>
                        </div>
                    </div>
                    <div class="monitor-stand"></div>
                </div>

                <div class="desk-accessories">
                    <div class="keyboard">
                        <div class="key accent-pink" style="grid-column: span 2;"></div>
                        <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
                        <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
                        <div class="key"></div><div class="key"></div><div class="key"></div>
                        <div class="key accent-blue" style="grid-column: span 2;"></div>
                        <div class="key" style="grid-column: span 3;"></div>
                        <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key" style="grid-column: span 2;"></div>
                        <div class="key accent-blue" style="grid-column: span 3;"></div>
                        <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div><div class="key" style="grid-column: span 2;"></div>
                        <div class="key" style="grid-column: span 4;"></div>
                        <div class="key accent-pink" style="grid-column: span 6;"></div>
                        <div class="key" style="grid-column: span 4;"></div>
                    </div>
                    <div class="mouse">
                        <div class="mouse-wheel"></div>
                    </div>
                </div>
            </div>

            <div class="pc-tower">
                <div class="pc-fan-large"></div>
                <div class="pc-fan-large"></div>
                <div class="pc-fan-large"></div>
                <div class="pc-bottom-panel">
                    <div class="power-circle"></div>
                    <div class="audio-jack"></div>
                    <div class="audio-jack"></div>
                </div>
            </div>
        </div>
    `;

    const monitor = container.querySelector('#monitor');
    const btnText = container.querySelector('#btnText');
    const screenGrid = container.querySelector('#screenGrid');
    let isGridOpen = false;

    // မော်နီတာကို နှိပ်လျှင် အကွက်များ ပေါ်လာစေရန်/ဖျောက်ရန်
    monitor.addEventListener('click', (e) => {
        if (e.target.closest('.grid-cell')) return;

        isGridOpen = !isGridOpen;
        if (isGridOpen) {
            btnText.style.display = 'none';
            screenGrid.classList.add('active');
        } else {
            screenGrid.classList.remove('active');
            btnText.style.display = 'block';
        }
    });

    // Grid အကွက်တစ်ခုခုကို နှိပ်လိုက်သောအခါ
    const gridCells = container.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        cell.addEventListener('click', () => {
            const selectedValue = cell.getAttribute('data-value');
            
            // ဤနေရာတွင် Room Card အစား လိုချင်သည့် လုပ်ဆောင်ချက်ကို ထည့်ပါ
            alert(`Selected: ${selectedValue} (Match Finding Started...)`);
            
            // ဥပမာ - mode.js သို့ တန်းသွားချင်ပါက renderModeScreen(container) ကို ဤနေရာတွင် ခေါ်သုံးနိုင်ပါသည်။
        });
    });
}