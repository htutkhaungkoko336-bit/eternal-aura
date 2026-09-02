import { renderModeScreen } from './mode.js';

export function renderMatchScreen(container) {
    container.innerHTML = `
        <style>
            .setup-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                position: relative;
                width: 100%;
                height: 100%;
                background: #040408;
                font-family: sans-serif;
                user-select: none;
                box-sizing: border-box;
                overflow: hidden;
                padding: 5px;
            }

            .main-workspace {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .monitor-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
            }

            /* ဖုန်းစခရင်မှာ အနေတော်ဆံ့မည့် မော်နီတာအရွယ်အစား */
            .monitor {
                width: 250px;
                height: 150px;
                background: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%);
                border: 5px solid #181824;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: box-shadow 0.3s;
            }
            .monitor:hover {
                box-shadow: 0 0 30px rgba(124, 58, 237, 0.8);
            }
            .btn-text {
                color: #fff;
                font-weight: 800;
                font-size: 13px;
                letter-spacing: 1px;
                text-align: center;
                padding: 0 5px;
                text-shadow: 0 0 8px rgba(255,255,255,0.8);
                line-height: 1.3;
            }

            /* Grid System (မော်နီတာအတွင်း) */
            .screen-grid {
                display: none;
                width: 100%;
                height: 100%;
                grid-template-columns: repeat(5, 1fr);
                grid-template-rows: repeat(2, 1fr);
                gap: 4px;
                padding: 6px;
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
                border-radius: 4px;
                display: flex;
                flex-direction: column; 
                justify-content: center;
                align-items: center;
                color: #fff;
                font-size: 9px;
                font-weight: bold;
                backdrop-filter: blur(4px);
                transition: background 0.2s, transform 0.2s;
                text-align: center;
                gap: 1px;
                cursor: pointer;
            }
            .grid-cell:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.03);
            }

            /* မော်နီတာခြေထောက် */
            .monitor-stand {
                width: 50px;
                height: 20px;
                background: #181824;
                border-radius: 4px;
                border: 1px solid #00f2ff44;
            }

            /* ကီးဘုတ်နှင့် မောက်စ် ဇုန် */
            .desk-accessories {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 12px;
                perspective: 300px;
            }

            /* RGB Mechanical Keyboard */
            .keyboard {
                width: 190px;
                height: 48px;
                background: #111119;
                border-radius: 6px;
                border: 1px solid #00f2ff66;
                box-shadow: 0 6px 15px rgba(0,0,0,0.8), 0 0 10px rgba(0, 242, 255, 0.2);
                display: grid;
                grid-template-columns: repeat(14, 1fr);
                grid-template-rows: repeat(4, 1fr);
                gap: 2px;
                padding: 3px;
                transform: rotateX(20deg);
                position: relative;
            }
            .keyboard::after {
                content: '';
                position: absolute;
                bottom: -4px; left: 5%; width: 90%; height: 4px;
                background: linear-gradient(90deg, #ff007f, #7c3aed, #00f2ff);
                border-radius: 50%;
                filter: blur(3px);
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
                width: 18px;
                height: 32px;
                background: #111119;
                border-radius: 9px 9px 4px 4px;
                border: 1px solid #ff007f77;
                box-shadow: 0 6px 10px rgba(0,0,0,0.7), 0 0 8px rgba(255, 0, 127, 0.3);
                transform: rotateX(15deg) rotateY(-10deg);
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 3px;
                gap: 2px;
            }
            .mouse-wheel {
                width: 2px;
                height: 6px;
                background: #00f2ff;
                border-radius: 2px;
                box-shadow: 0 0 4px #00f2ff;
            }
            .mouse::after {
                content: '';
                position: absolute;
                bottom: -2px;
                width: 80%;
                height: 2px;
                background: linear-gradient(90deg, #00f2ff, #ff007f);
                border-radius: 50%;
                filter: blur(2px);
            }

            /* ဖုန်းစခရင်မှာ ဆံ့ဝင်စေရန် အနေတော် ပြင်ဆင်ထားသော PC ပုံး (Fish Tank Style) */
            .pc-tower {
                display: flex;
                width: 70px;
                height: 210px;
                background: #0c0c14;
                border: 1.5px solid #7c3aed66;
                border-radius: 6px;
                box-shadow: 0 0 15px rgba(124, 58, 237, 0.3), inset 0 0 10px rgba(0, 242, 255, 0.1);
                flex-direction: column;
                align-items: center;
                padding: 6px 3px;
                gap: 8px;
                position: relative;
            }
            .pc-fan-large {
                width: 45px;
                height: 45px;
                background: radial-gradient(circle, #08080f 30%, #151522 70%);
                border-radius: 50%;
                border: 2px solid transparent;
                background-image: linear-gradient(#08080f, #08080f), linear-gradient(135deg, #00f2ff, #ff007f);
                background-origin: border-box;
                background-clip: content-box, border-box;
                box-shadow: 0 0 10px rgba(0, 242, 255, 0.4);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .pc-fan-large::after {
                content: '';
                width: 14px; height: 14px;
                background: linear-gradient(135deg, #7c3aed, #00f2ff);
                border-radius: 50%;
                box-shadow: 0 0 6px #7c3aed;
            }
            .pc-bottom-panel {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 5px;
                margin-top: auto;
                border-top: 1px solid #202030;
                padding-top: 5px;
            }
            .power-circle {
                width: 9px; height: 9px;
                background: #00f2ff;
                border-radius: 50%;
                box-shadow: 0 0 5px #00f2ff;
            }
            .audio-jack {
                width: 5px; height: 5px;
                background: #ff007f;
                border-radius: 50%;
                box-shadow: 0 0 4px #ff007f;
            }
        </style>

        <div class="setup-wrapper">
            <div class="main-workspace">
                <div class="monitor-group">
                    <div class="monitor" id="monitor">
                        <span class="btn-text" id="btnText">WELCOME FROM<br>ETERNAL AURA<br><span style="font-size: 10px; font-weight: 600;">CLICK HERE</span></span>
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