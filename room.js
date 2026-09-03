import { renderMatchScreen } from './match.js';

export function renderRoomScreen(container, roomTitleText) {
    container.innerHTML = `
        <style>
            /* Room Screen အတွက် Styles များ */
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
                cursor: pointer;
                text-align: center;
                border: none;
                transition: transform 0.2s, box-shadow 0.2s;
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
                <p>Room initialized successfully.<br>Waiting for players or actions...</p>
            </div>

            <div class="room-bottom-actions">
                <button class="room-btn btn-new-room" id="newRoomBtn">New Room</button>
                <button class="room-btn btn-cancel" id="cancelBtn">Cancel</button>
            </div>
        </div>
    `;

    // New Room ခလုတ်နှိပ်လျှင် လုပ်ဆောင်ရန်
    container.querySelector('#newRoomBtn').addEventListener('click', () => {
        alert('Creating a New Room...');
    });

    // Cancel ခလုတ်နှိပ်လျှင် မူလ Match Screen သို့ ပြန်သွားရန်
    container.querySelector('#cancelBtn').addEventListener('click', () => {
        renderMatchScreen(container);
    });
}