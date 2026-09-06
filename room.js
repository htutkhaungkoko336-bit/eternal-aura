import { renderMatchScreen } from './match.js';
import { getKeyData, deductKey } from './keysStore.js';

export function renderRoomScreen(container, roomTitleText, userDocData = {}) {
    const upperTitle = roomTitleText.toUpperCase();
    
    let targetMode = '5v5';
    let targetKeyType = '5k';

    if (upperTitle.includes('1V1') || upperTitle.includes('1VS1')) {
        targetMode = '1v1';
    } else if (upperTitle.includes('5V5') || upperTitle.includes('5VS5')) {
        targetMode = '5v5';
    }

    const possibleTypes = ['50k', '25k', '15k', '10k', '5k'];
    for (let t of possibleTypes) {
        if (upperTitle.includes(t.toUpperCase())) {
            targetKeyType = t;
            break;
        }
    }

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
            /* ခေါင်းစဉ်အတွက် Button ပုံစံ လန်းလန်းလေး */
            .room-title-card {
                width: 100%;
                max-width: 320px;
                padding: 14px 20px;
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
                border: 1px solid rgba(56, 189, 248, 0.4);
                border-radius: 14px;
                text-align: center;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.2);
                margin-top: 15px;
            }
            .room-title {
                font-size: 18px;
                font-weight: 800;
                background: linear-gradient(135deg, #38bdf8, #818cf8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                letter-spacing: 1px;
                margin: 0;
            }
            .room-content-center {
                font-size: 13.5px;
                color: #94a3b8;
                text-align: center;
                width: 100%;
                max-width: 300px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex: 1;
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
                border-radius: 12px;
                font-weight: 700;
                font-size: 14px;
                text-align: center;
                border: none;
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: pointer;
            }
            .room-btn:hover {
                transform: scale(1.03);
            }
            .btn-new-room {
                background: linear-gradient(135deg, #0284c7, #9333ea);
                color: #fff;
                box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
            }
            .btn-cancel {
                background: rgba(30, 41, 59, 0.8);
                color: #f43f5e;
                border: 1px solid rgba(244, 63, 94, 0.4);
                box-shadow: 0 4px 15px rgba(244, 63, 94, 0.15);
            }
        </style>

        <div class="room-screen-wrapper">
            <!-- အပေါ်က ခေါင်းစဉ်ကို Button ပုံစံ ကတ်ပြားလေးအဖြစ် ပြောင်းထားသည် -->
            <div class="room-title-card">
                <h2 class="room-title">${roomTitleText}</h2>
            </div>
            
            <div class="room-content-center">
                <p>Required Key: <span style="color: #38bdf8; font-weight: bold;">${targetMode.toUpperCase()} - ${targetKeyType.toUpperCase()}</span></p>
            </div>

            <div class="room-bottom-actions">
                <button class="room-btn btn-new-room" id="newRoomBtn">Create Room</button>
                <button class="room-btn btn-cancel" id="cancelBtn">Cancel</button>
            </div>
        </div>
    `;

    // Create Room ခလုတ်ကို နှိပ်တဲ့အခါ
    const newRoomBtn = container.querySelector('#newRoomBtn');
    if (newRoomBtn) {
        newRoomBtn.addEventListener('click', async () => {
            const userId = localStorage.getItem('user_id') || userDocData.userId || 'current_user_id';
            
            // 1. Store ထဲကနေ လက်ရှိ Key လုံလောက်မှုရှိမရှိ စစ်ဆေးခြင်း
            const currentStoreData = getKeyData();
            const availableKeys = currentStoreData.modes[targetMode]?.[targetKeyType] || 0;

            if (availableKeys <= 0) {
                alert(`⚠️ ဒီ Room ဖွင့်ဖို့အတွက် ${targetMode.toUpperCase()} (${targetKeyType.toUpperCase()}) Key လက်ကျန် မလုံလောက်ပါ။`);
                return;
            }

            try {
                newRoomBtn.disabled = true;
                newRoomBtn.textContent = 'Creating...';

                // 2. Room အောင်မြင်စွာဆောက်ပြီးပါက Store ထဲက Key ကို တစ်ခု နှုတ်ပေးခြင်း
                deductKey(targetMode, targetKeyType);

                alert(`Successfully created room for ${roomTitleText}! (Key successfully deducted)`);
                
            } catch (err) {
                console.error("Room create error:", err);
                alert('ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။');
            } finally {
                newRoomBtn.disabled = false;
                newRoomBtn.textContent = 'Create Room';
            }
        });
    }

    const cancelBtn = container.querySelector('#cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            renderMatchScreen(container, userDocData);
        });
    }
}