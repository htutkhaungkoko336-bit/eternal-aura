import { renderMatchScreen } from './match.js';

export function renderRoomScreen(container, roomTitleText, userDocData = {}) {
    // Room Title ကနေ Mode နဲ့ Key Type ကို ခွဲထုတ်ခြင်း
    const upperTitle = roomTitleText.toUpperCase();
    let targetMode = '5v5';
    let targetKeyType = '5k';

    if (upperTitle.includes('1V1')) {
        targetMode = '1v1';
    } else if (upperTitle.includes('5V5')) {
        targetMode = '5v5';
    }

    const possibleTypes = ['5k', '10k', '15k', '25k', '50k'];
    for (let t of possibleTypes) {
        if (upperTitle.includes(t.toUpperCase())) {
            targetKeyType = t;
            break;
        }
    }

    // User မှာ ဒီ key ပမာဏ ရှိမရှိ စစ်ဆေးခြင်း
    let keyCount = 0;
    const directKeyField = `${targetMode}-${targetKeyType}`;
    
    if (userDocData[directKeyField] !== undefined) {
        keyCount = userDocData[directKeyField];
    } else if (userDocData.modes && userDocData.modes[targetMode]) {
        keyCount = userDocData.modes[targetMode][targetKeyType] || 0;
    }

    const hasKey = keyCount > 0;

    container.innerHTML = `
        <style>
            .room-screen-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 100%;
                background: #040408;
                font-family: sans-serif;
                color: #fff;
                padding: 20px;
                box-sizing: border-box;
                user-select: none;
            }
            .room-title {
                font-size: 22px;
                font-weight: 800;
                color: #00f2ff;
                text-shadow: 0 0 10px rgba(0, 242, 255, 0.6);
                margin-top: 10px;
                letter-spacing: 1px;
                text-align: center;
            }
            .room-content-center {
                font-size: 14px;
                color: #a0a0c0;
                text-align: center;
            }
            .key-status-box {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid ${hasKey ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.4)'};
                padding: 10px 15px;
                border-radius: 12px;
                margin: 10px 0;
                text-align: center;
            }
            .room-bottom-actions {
                display: flex;
                gap: 15px;
                width: 100%;
                max-width: 300px;
                margin-bottom: 10px;
            }
            .room-btn {
                flex: 1;
                padding: 12px 0;
                border-radius: 8px;
                font-weight: 700;
                font-size: 14px;
                text-align: center;
                border: none;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .room-btn:not(:disabled):hover {
                transform: scale(1.03);
            }
            .btn-new-room {
                background: linear-gradient(135deg, #7c3aed, #2563eb);
                color: #fff;
                box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
            }
            .btn-cancel {
                background: #181824;
                color: #ff007f;
                border: 1px solid #ff007f66;
                box-shadow: 0 0 10px rgba(255, 0, 127, 0.2);
                cursor: pointer;
            }
        </style>

        <div class="room-screen-wrapper">
            <div class="room-title">${roomTitleText}</div>
            
            <div class="room-content-center">
                <div class="key-status-box">
                    <div style="font-size: 11px; color: #94a3b8;">Required Key: <span style="color: #fff; font-weight: bold;">${targetMode.toUpperCase()} (${targetKeyType.toUpperCase()})</span></div>
                    <div style="font-size: 12px; margin-top: 4px; color: ${hasKey ? '#38bdf8' : '#ef4444'};">
                        Your Balance: <b>${keyCount} pcs</b>
                    </div>
                </div>
                <p>${hasKey ? 'Room initialized successfully.<br>Ready to create a new room!' : '⚠️ ဒီ Room ကိုဖွင့်ရန် Key မလုံလောက်ပါ။'}</p>
            </div>

            <div class="room-bottom-actions">
                <button class="room-btn btn-new-room" id="newRoomBtn" ${!hasKey ? 'disabled' : ''} style="${!hasKey ? 'opacity: 0.35; cursor: not-allowed; filter: grayscale(80%); box-shadow: none;' : 'cursor: pointer;'}">New Room</button>
                <button class="room-btn btn-cancel" id="cancelBtn">Cancel</button>
            </div>
        </div>
    `;

    // New Room ခလုတ် Event
    const newRoomBtn = container.querySelector('#newRoomBtn');
    if (newRoomBtn) {
        newRoomBtn.addEventListener('click', () => {
            if (!hasKey) {
                alert('Key မလုံလောက်ပါသဖြင့် Room အသစ်ဖန်တီး၍ မရပါ။');
                return;
            }
            alert('Creating a New Room...');
        });
    }

    // Cancel ခလုတ် Event (ပုံမှန်အတိုင်း အလုပ်လုပ်မည်)
    container.querySelector('#cancelBtn').addEventListener('click', () => {
        renderMatchScreen(container);
    });
}