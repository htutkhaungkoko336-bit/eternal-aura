import { renderMatchScreen } from './match.js';
import { getKeyData, deductKey } from './keysStore.js';

export function renderRoomScreen(container, roomTitleText, userDocData = {}) {
    const upperTitle = roomTitleText.toUpperCase();
    
    let displayTitle = upperTitle;
    if (!displayTitle.includes('ROOM')) {
        displayTitle = `${displayTitle} ROOM`;
    }

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

    // လက်ရှိ Key ရှိမရှိ စစ်ဆေးခြင်း
    const currentStoreData = getKeyData();
    const availableKeys = currentStoreData.modes[targetMode]?.[targetKeyType] || 0;
    const hasKey = availableKeys > 0;

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
            /* Room အောင်မြင်စွာဆောက်ပြီးပါက ပေါ်လာမည့် Room Card လေး */
            .created-room-card {
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
                border: 2px solid #10b981;
                border-radius: 12px;
                padding: 15px;
                width: 100%;
                max-width: 300px;
                text-align: center;
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
                margin-top: 15px;
                animation: fadeIn 0.3s ease-in-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
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
            .room-btn:hover:not(:disabled) {
                transform: scale(1.03);
            }
            .btn-new-room {
                background: linear-gradient(135deg, #0284c7, #9333ea);
                color: #fff;
                box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
            }
            /* Key မရှိရင် ခလုတ်ကို မှိုင်းသွားစေရန်နှင့် နှိပ်မရအောင် */
            .btn-new-room:disabled {
                background: #334155;
                color: #94a3b8;
                cursor: not-allowed;
                box-shadow: none;
                transform: none;
            }
            .btn-cancel {
                background: rgba(30, 41, 59, 0.8);
                color: #f43f5e;
                border: 1px solid rgba(244, 63, 94, 0.4);
                box-shadow: 0 4px 15px rgba(244, 63, 94, 0.15);
            }
        </style>

        <div class="room-screen-wrapper">
            <!-- အပေါ်က ခေါင်းစဉ် Box -->
            <div style="position: relative; border: 2px solid #38bdf8; border-radius: 4px; padding: 12px 16px; margin-top: 10px; background-color: rgba(15, 23, 42, 0.8); text-align: center; width: 100%; max-width: 320px; box-sizing: border-box; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                <div style="position: absolute; top: -3px; left: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                <div style="position: absolute; bottom: -3px; right: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                <h2 style="color: #f8fafc; font-size: 20px; font-weight: 800; letter-spacing: 1px; margin: 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${displayTitle}</h2>
            </div>
            
            <div class="room-content-center" id="roomContentArea">
                <p>Required Key: <span style="color: #38bdf8; font-weight: bold;">${targetMode.toUpperCase()} - ${targetKeyType.toUpperCase()}</span></p>
                <p style="font-size: 12px; color: ${hasKey ? '#10b981' : '#f43f5e'}; margin-top: 5px;">
                    Available Keys: ${availableKeys}
                </p>
            </div>

            <div class="room-bottom-actions">
                <!-- Key မရှိရင် disabled ဖြစ်နေပါမယ် -->
                <button class="room-btn btn-new-room" id="newRoomBtn" ${!hasKey ? 'disabled' : ''}>
                    ${hasKey ? 'Create Room' : 'No Key'}
                </button>
                <button class="room-btn btn-cancel" id="cancelBtn">Cancel</button>
            </div>
        </div>
    `;

    // Create Room ခလုတ်ကို နှိပ်တဲ့အခါ
    const newRoomBtn = container.querySelector('#newRoomBtn');
    const roomContentArea = container.querySelector('#roomContentArea');

    if (newRoomBtn && hasKey) {
        newRoomBtn.addEventListener('click', async () => {
            try {
                newRoomBtn.disabled = true;
                newRoomBtn.textContent = 'Creating...';

                // Key နှုတ်ယူခြင်း
                deductKey(targetMode, targetKeyType);

                // နှိပ်ပြီးပါက အလယ်ဗဟိုမှာ Room Card လေး ပေါ်လာစေရန်
                roomContentArea.innerHTML = `
                    <div class="created-room-card">
                        <h3 style="color: #10b981; margin: 0 0 8px 0; font-size: 16px;">🎮 Room Created Successfully!</h3>
                        <p style="color: #f8fafc; margin: 4px 0; font-weight: bold;">${displayTitle}</p>
                        <p style="color: #94a3b8; font-size: 12px; margin: 4px 0;">Status: Waiting for players...</p>
                    </div>
                `;

                newRoomBtn.textContent = 'Room Active';
                
            } catch (err) {
                console.error("Room create error:", err);
                alert('ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။');
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