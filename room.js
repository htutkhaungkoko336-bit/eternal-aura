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
                border-radius: 8px;
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
                background: linear-gradient(135deg, #7c3aed, #2563eb);
                color: #fff;
                box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
            }
            .btn-cancel {
                background: #181824;
                color: #ff007f;
                border: 1px solid #ff007f66;
                box-shadow: 0 0 10px rgba(255, 0, 127, 0.2);
            }
        </style>

        <div class="room-screen-wrapper">
            <div class="room-title">${roomTitleText}</div>
            
            <div class="room-content-center">
                <p>Required Key: <span style="color: #00f2ff; font-weight: bold;">${targetMode.toUpperCase()} - ${targetKeyType.toUpperCase()}</span></p>
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

                // (Optional) Server ဘက်ကို Room ဖန်တီးဖို့ API လှမ်းခေါ်တဲ့နေရာ
                // const response = await fetch('/api/create-room', { ... });

                // 2. Room အောင်မြင်စွာဆောက်ပြီးပါက Store ထဲက Key ကို တစ်ခု နှုတ်ပေးခြင်း
                deductKey(targetMode, targetKeyType);

                alert(`Successfully created room for ${roomTitleText}! (Key successfully deducted)`);
                
                // Room ထဲရောက်သွားသည့်အခါ လုပ်ဆောင်ရမည့် နောက်ထပ် Screen သို့ပြောင်းရန်
                // renderMatchScreen(container, userDocData);
                
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