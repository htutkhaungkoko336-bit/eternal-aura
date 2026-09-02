import { renderModeScreen } from './mode.js';

export function renderMatchScreen(container) {
    container.innerHTML = `
        <style>
            .setup-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                position: relative;
                width: 100%;
                height: 100%;
                background: #040408;
                font-family: sans-serif;
                user-select: none;
                box-sizing: border-box;
                overflow: hidden;
                flex-direction: column;
                padding: 10px;
            }

            .main-workspace {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                width: 100%;
                max-width: 380px;
            }

            .monitor-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                width: 100%;
            }

            /* ဖုန်း Screen နဲ့ အနေတော်ဖြစ်စေရန် မော်နီတာအရွယ်အစားကို သေးငယ်အောင် ပြင်ဆင်ထားသည် */
            .monitor {
                width: 100%;
                height: 210px;
                background: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%);
                border: 6px solid #181824;
                border-radius: 12px;
                box-shadow: 0 0 25px rgba(124, 58, 237, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: box-shadow 0.3s;
            }
            .monitor:hover {
                box-shadow: 0 0 40px rgba(124, 58, 237, 0.8);
            }
            .btn-text {
                color: #fff;
                font-weight: 800;
                font-size: 16px;
                letter-spacing: 1.5px;
                text-align: center;
                padding: 0 10px;
                text-shadow: 0 0 10px rgba(255,255,255,0.8);
                line-height: 1.4;
            }

            /* အကွက် ၁၀ ကွက် (Grid System) - ဖုန်းစခရင်အတွက် အနေတော် */
            .screen-grid {
                display: none;
                width: 100%;
                height: 100%;
                grid-template-columns: repeat(5, 1fr);
                grid-template-rows: repeat(2, 1fr);
                gap: 6px;
                padding: 8px;
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
                border-radius: 6px;
                display: flex;
                flex-direction: column; 
                justify-content: center;
                align-items: center;
                color: #fff;
                font-size: 11px;
                font-weight: bold;
                backdrop-filter: blur(4px);
                transition: background 0.2s, transform 0.2s;
                text-align: center;
                gap: 2px;
                cursor: pointer;
            }
            .grid-cell:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.03);
            }

            /* မော်နီတာခြေထောက် */
            .monitor-stand {
                width: 70px;
                height: 25px;
                background: #181824;
                border-radius: 4px;
                border: 1px solid #00f2ff44;
            }

            /* ကီးဘုတ်နှင့် မောက်စ် ဇုန် */
            .desk-accessories {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                perspective: 400px;
            }

            /* RGB Mechanical Keyboard */
            .keyboard {
                width: 260px;
                height: 60px;
                background: #111119;
                border-radius: 8px;
                border: 1.5px solid #00f2ff66;
                box-shadow: 0 8px 20px rgba(0,0,0,0.8), 0 0 15px rgba(0, 242, 255, 0.2);
                display: grid;
                grid-template-columns: repeat(14, 1fr);
                grid-template-rows: repeat(4, 1fr);
                gap: 2px;
                padding: 4px;
                transform: rotateX(25deg);
                position: relative;
            }
            .keyboard::after {
                content: '';
                position: absolute;
                bottom: -6px; left: 5%; width: 90%; height: 5px;
                background: linear-gradient(90deg, #ff007f, #7c3aed, #00f2ff);
                border-radius: 50%;
                filter: blur(4px);
                opacity: 0.8;
            }
            .key {
                background: #1e1e2d;
                border: 1px solid #33334d;
                border-radius: 2px;
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
                width: 24px;
                height: 40px;
                background: #111119;
                border-radius: 12px 12px 6px 6px;
                border: 1.5px solid #ff007f77;
                box-shadow: 0 8px 15px rgba(0,0,0,0.7), 0 0 10px rgba(255, 0, 127, 0.3);
                transform: rotateX(20deg) rotateY(-10deg);
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 4px;
                gap: 3px;
            }
            .mouse-wheel {
                width: 3px;
                height: 8px;
                background: #00f2ff;
                border-radius: 2px;
                box-shadow: 0 0 5px #00f2ff;
            }
            .mouse::after {
                content: '';
                position: absolute;
                bottom: -3px;
                width: 80%;
                height: 3px;
                background: linear-gradient(90deg, #00f2ff, #ff007f);
                border-radius: 50%;
                filter: blur(2px);
            }

            /* PC ပုံး (Fish Tank Style) - ဖုန်းစခရင်အတွက် ဘေးဘောင်အစား အောက်ဘက်တွင် သို့မဟုတ် သေးငယ်အောင် ပြုလုပ်နိုင်ရန် */
            .pc-tower {
                display: none; /* ဖုန်းစခရင်သေးငယ်၍ အလွန်ကြီးမားမှုကို ရှောင်ရှားရန် ဖယ်ထားသည် (သို့မဟုတ် အရွယ်အစားကို လျှော့ချသုံးနိုင်သည်) */
            }
        </style>

        <div class="setup-wrapper">
            <div class="main-workspace">
                <div class="monitor-group">
                    <div class="monitor" id="monitor">
                        <span class="btn-text" id="btnText">WELCOME FROM ETERNAL AURA<br><span style="font-size: 13px; font-weight: 600; letter-spacing: 1px;">CLICK HERE</span></span>
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
        </div>
    `;

    const monitor = container.querySelector('#monitor');
    const btnText = container.querySelector('#btnText');
    const screenGrid = container.querySelector('#screenGrid');
    let isGridOpen = false;

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

    const gridCells = container.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        cell.addEventListener('click', () => {
            const selectedValue = cell.getAttribute('data-value');
            alert(`Selected: ${selectedValue} (Match Finding Started...)`);
        });
    });
}