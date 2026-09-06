import { renderMatchScreen } from './match.js';

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
                <p>Ready to create your room!</p>
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
            
            try {
                newRoomBtn.disabled = true;
                newRoomBtn.textContent = 'Creating...';

                // လိုအပ်ပါက ဆာဗာသို့ အချက်အလက်ပို့ရန် (သို့) Room တည်ဆောက်သည့် Logic ထည့်ရန်
                alert(`Successfully created room for ${roomTitleText}!`);
                
                // Room ထဲရောက်သွားသည့်အခါ လုပ်ဆောင်ရမည့် နောက်ထပ် Screen သို့ပြောင်းရန်
                // ဥပမာ - renderMatchScreen(container, userDocData);
                
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









