// match.js
import { renderModeScreen } from './mode.js';

export function renderMatchScreen(container) {
    container.innerHTML = `
        <div id="floating-arena" style="position: relative; width: 100%; height: 100%; background: #0b0f19; overflow: hidden; box-sizing: border-box; display: flex; align-items: center; justify-content: center;">
            
            <div style="position: absolute; width: 250px; height: 250px; background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(11,15,25,0) 70%); border-radius: 50%; pointer-events: none;"></div>

            <div style="position: absolute; top: 25px; width: 100%; text-align: center; pointer-events: none; z-index: 5;">
                <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #64748b; text-transform: uppercase;">TAP A CYBER SHIP TO ENTER</span>
            </div>

            <div id="orbit-container" style="position: relative; width: 100%; height: 100%;"></div>

        </div>
    `;

    initSpaceshipNodes(container);
}

function initSpaceshipNodes(container) {
    const orbitContainer = container.querySelector('#orbit-container');

    // မတူညီသော အရောင် (၁၀) မျိုးဖြင့် 10 ခု (Modes နဲ့ Fees များ)
    const items = [
        { label: "5 VS 5", color: "#38bdf8" }, // Cyan
        { label: "1 VS 1", color: "#f43f5e" }, // Rose Red
        { label: "5K", color: "#a855f7" },     // Purple
        { label: "10K", color: "#10b981" },    // Emerald Green
        { label: "15K", color: "#f59e0b" },    // Amber Gold
        { label: "25K", color: "#ec4899" },    // Pink
        { label: "50K", color: "#6366f1" },    // Indigo
        { label: "5 VS 5", color: "#14b8a6" }, // Teal
        { label: "10K", color: "#eab308" },    // Yellow
        { label: "25K", color: "#8b5cf6" }     // Violet
    ];

    const nodes = [];
    const width = orbitContainer.clientWidth || 380;
    const height = orbitContainer.clientHeight || 700;

    items.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'cyber-ship-node';
        el.textContent = item.label;
        
        // Spaceship / Cyber Node Styling (Hexagonal / Shield Shape with Unique Colors)
        el.style.position = 'absolute';
        el.style.padding = '10px 14px';
        el.style.background = 'rgba(15, 23, 42, 0.9)';
        el.style.border = `2px solid ${item.color}`;
        el.style.borderRadius = '12px 4px 12px 4px'; // Spaceship aerodynamic look
        el.style.color = item.color;
        el.style.fontSize = '12px';
        el.style.fontWeight = '800';
        el.style.cursor = 'pointer';
        el.style.textAlign = 'center';
        el.style.boxShadow = `0 0 12px ${item.color}55`;
        el.style.textShadow = `0 0 8px ${item.color}`;
        el.style.userSelect = 'none';
        el.style.transition = 'transform 0.15s ease, background 0.2s ease';

        // Spaceship တောင်ပံအသေးစားလေးများ (Corner Thrusters)
        const thruster1 = document.createElement('div');
        thruster1.style.cssText = `position: absolute; top: 4px; left: -4px; width: 3px; height: 3px; background: ${item.color}; box-shadow: 0 0 5px ${item.color};`;
        const thruster2 = document.createElement('div');
        thruster2.style.cssText = `position: absolute; bottom: 4px; right: -4px; width: 3px; height: 3px; background: ${item.color}; box-shadow: 0 0 5px ${item.color};`;
        el.appendChild(thruster1);
        el.appendChild(thruster2);

        // ကျပန်း နေရာစတင်ချထားခြင်း
        let x = Math.random() * (width - 90);
        let y = Math.random() * (height - 180) + 60;
        let vx = (Math.random() - 0.5) * 1.3;
        let vy = (Math.random() - 0.5) * 1.3;

        orbitContainer.appendChild(el);
        nodes.push({ el, x, y, vx, vy, label: item.label });

        // Node တစ်ခုကို နှိပ်လိုက်ပါက Room Card နေရာသို့ရောက်ရန်
        el.addEventListener('click', () => {
            enterRoomCreation(container, item.label);
        });

        el.addEventListener('mouseenter', () => {
            el.style.background = `${item.color}25`;
            el.style.transform = 'scale(1.15) rotate(3deg)';
        });
        el.addEventListener('mouseleave', () => {
            el.style.background = 'rgba(15, 23, 42, 0.9)';
            el.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // မျက်နှာပြင်တစ်လျှောက် လေထဲမျောလွင့်နေမည့် Physics Animation Loop
    let animationFrameId;
    function animate() {
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x <= 10 || node.x >= width - 90) node.vx *= -1;
            if (node.y <= 60 || node.y >= height - 100) node.vy *= -1;

            node.el.style.transform = `translate(${node.x}px, ${node.y}px)`;
        });
        animationFrameId = requestAnimationFrame(animate);
    }
    animate();
}

// Room Card တည်ဆောက်မည့် မျက်နှာပြင်
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