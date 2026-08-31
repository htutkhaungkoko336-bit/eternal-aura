// match.js
import { renderModeScreen } from './mode.js';

export function renderMatchScreen(container) {
    container.innerHTML = `
        <div id="floating-arena" style="position: relative; width: 100%; height: 100%; background: #0b0f19; overflow: hidden; box-sizing: border-box; display: flex; align-items: center; justify-content: center;">
            
            <!-- နောက်ခံ Glow အလှ -->
            <div style="position: absolute; width: 250px; height: 250px; background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(11,15,25,0) 70%); border-radius: 50%; pointer-events: none;"></div>

            <!-- ညွှန်ကြားချက် စာသားငယ် -->
            <div style="position: absolute; top: 20px; width: 100%; text-align: center; pointer-events: none;">
                <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #64748b; text-transform: uppercase;">TAP A FLOATING NODE TO ENTER</span>
            </div>

            <!-- မျောနေမယ့် Items ၁၀ ခု Container -->
            <div id="orbit-container" style="position: relative; width: 100%; height: 100%;"></div>

            <!-- အောက်ဆုံး Back/Cancel ခလုတ် (ဒီတိုင်းထားရန်) -->
            <div style="position: absolute; bottom: 16px; left: 16px; right: 16px; z-index: 10;">
                <button id="match-cancel-btn" style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.8); color: #94a3b8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; text-align: center; text-transform: uppercase; letter-spacing: 1.5px;">CANCEL</button>
            </div>

        </div>
    `;

    initFloatingNodes(container);
}

function initFloatingNodes(container) {
    const orbitContainer = container.querySelector('#orbit-container');
    const cancelBtn = container.querySelector('#match-cancel-btn');

    // လေထဲမျောမယ့် Item ၁၀ ခု (Modes နဲ့ Fees တွေ ရောနှောထားသည်)
    const items = [
        { label: "5 VS 5", type: "mode" },
        { label: "1 VS 1", type: "mode" },
        { label: "5K", type: "fee" },
        { label: "10K", type: "fee" },
        { label: "15K", type: "fee" },
        { label: "25K", type: "fee" },
        { label: "50K", type: "fee" },
        { label: "5 VS 5", type: "mode" },
        { label: "10K", type: "fee" },
        { label: "25K", type: "fee" }
    ];

    const nodes = [];
    const width = orbitContainer.clientWidth || 380;
    const height = orbitContainer.clientHeight || 700;

    // တစ်ခုချင်းစီအတွက် နေရာနှင့် လှုပ်ရှားမှု ပုံစံဖန်တီးခြင်း
    items.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'floating-node';
        el.textContent = item.label;
        
        // Cyber City Node Styling
        el.style.position = 'absolute';
        el.style.padding = '10px 16px';
        el.style.background = 'rgba(15, 23, 42, 0.85)';
        el.style.border = '2px solid #38bdf8';
        el.style.borderRadius = '6px';
        el.style.color = '#38bdf8';
        el.style.fontSize = '12px';
        el.style.fontWeight = '800';
        el.style.cursor = 'pointer';
        el.style.textAlign = 'center';
        el.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.3)';
        el.style.textShadow = '0 0 8px rgba(56, 189, 248, 0.5)';
        el.style.userSelect = 'none';
        el.style.transition = 'transform 0.1s ease, background 0.2s ease';

        // ထောင့်စွန်း pixel အစက်လေးများထည့်ရန်
        const corner1 = document.createElement('div');
        corner1.style.cssText = 'position: absolute; top: -2px; left: -2px; width: 4px; height: 4px; background: #38bdf8;';
        const corner2 = document.createElement('div');
        corner2.style.cssText = 'position: absolute; bottom: -2px; right: -2px; width: 4px; height: 4px; background: #38bdf8;';
        el.appendChild(corner1);
        el.appendChild(corner2);

        // ကျပန်း နေရာချထားခြင်း (Random Initial Positions & Velocities)
        let x = Math.random() * (width - 90);
        let y = Math.random() * (height - 180) + 60;
        let vx = (Math.random() - 0.5) * 1.2;
        let vy = (Math.random() - 0.5) * 1.2;

        orbitContainer.appendChild(el);

        nodes.push({ el, x, y, vx, vy, label: item.label });

        // Node တစ်ခုကို ထိလိုက်/နှိပ်လိုက်လျှင် Room Card ဖန်တီးသည့် နေရာသို့ရောက်ရန်
        el.addEventListener('click', () => {
            enterRoomCreation(container, item.label);
        });

        el.addEventListener('mouseenter', () => {
            el.style.background = 'rgba(56, 189, 248, 0.25)';
            el.style.transform = 'scale(1.1)';
        });
        el.addEventListener('mouseleave', () => {
            el.style.background = 'rgba(15, 23, 42, 0.85)';
            el.style.transform = 'scale(1)';
        });
    });

    // လေထဲမျောနေစေရန် Animation Loop
    let animationFrameId;
    function animate() {
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // နံရံနှင့်ထိပါက ပြန်ကန်ထွက်ရန် (Bounce off edges)
            if (node.x <= 10 || node.x >= width - 90) node.vx *= -1;
            if (node.y <= 60 || node.y >= height - 120) node.vy *= -1;

            node.el.style.transform = `translate(${node.x}px, ${node.y}px)`;
        });
        animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Cancel ခလုတ်အတွက် 
    cancelBtn.addEventListener('click', () => {
        cancelAnimationFrame(animationFrameId);
    });
}

// Node ကိုထိပြီးပါက Room Card ဖန်တီးမည့် မျက်နှာပြင်သို့ ကူးပြောင်းမည့် ပုံစံ
function enterRoomCreation(container, selectedValue) {
    container.innerHTML = `
        <div style="padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; height: 100%; justify-content: space-between; background: #0b0f19;">
            <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; margin-top: 5px;">
                <div style="position: relative; border: 2px solid #38bdf8; border-radius: 4px; padding: 12px 16px; background-color: rgba(15, 23, 42, 0.8); text-align: center; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                    <span style="font-size: 14px; font-weight: 800; letter-spacing: 1.5px; color: #38bdf8; text-transform: uppercase;">ROOM CARD: ${selectedValue}</span>
                </div>
                <div style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 40px;">
                    Room တည်ဆောက်ရန် နေရာ (Room Card Builder)
                </div>
            </div>
            <button id="back-to-orbit" style="width: 100%; padding: 14px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; text-transform: uppercase;">BACK</button>
        </div>
    `;

    container.querySelector('#back-to-orbit').addEventListener('click', () => {
        renderMatchScreen(container);
    });
}