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

    let boType = 'BO1';
    if (targetKeyType === '25k' || targetKeyType === '50k') {
        boType = 'BO3';
    }

    const currentStoreData = getKeyData();
    const availableKeys = currentStoreData.modes[targetMode]?.[targetKeyType] || 0;
    const hasKey = availableKeys > 0;

    const userName = userDocData.userName || userDocData.name || 'Player';
    const userAvatar = userDocData.photoURL || userDocData.avatar || 'FrontLogo.jpg';

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
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #fff;
                padding: 20px;
                box-sizing: border-box;
                user-select: none;
            }
            .room-content-center {
                font-size: 13px;
                color: #94a3b8;
                text-align: center;
                width: 100%;
                max-width: 320px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex: 1;
            }
            /* သေးငယ်ပြီး ရိုးရှင်းတဲ့ iOS ပုံစံ Room Card */
            .ios-room-card {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid rgba(56, 189, 248, 0.25);
                border-radius: 14px;
                padding: 12px 14px;
                width: 100%;
                max-width: 280px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                animation: fadeIn 0.25s ease-in-out;
                box-sizing: border-box;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.96); }
                to { opacity: 1; transform: scale(1); }
            }
            .matchup-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
            }
            .player-side {
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
            }
            .player-side.right {
                flex-direction: row-reverse;
                text-align: right;
            }
            .player-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 1.5px solid #38bdf8;
                object-fit: cover;
                background: #1e293b;
            }
            .mystery-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 1.5px dashed rgba(148, 163, 184, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-weight: bold;
                color: #94a3b8;
                background: rgba(30, 41, 59, 0.5);
            }
            .player-name {
                font-size: 11.5px;
                font-weight: 600;
                color: #f8fafc;
                max-width: 75px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .vs-badge {
                font-size: 11px;
                font-weight: 800;
                color: #f43f5e;
                background: rgba(244, 63, 94, 0.1);
                padding: 4px 6px;
                border-radius: 6px;
                border: 1px solid rgba(244, 63, 94, 0.2);
            }
            .room-bottom-actions {
                display: flex;
                gap: 12px;
                width: 100%;
                max-width: 320px;
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
                transform: scale(1.02);
            }
            .btn-new-room {
                background: linear-gradient(135deg, #0284c7, #9333ea);
                color: #fff;
                box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
            }
            .btn-new-room:disabled {
                background: #1e293b;
                color: #64748b;
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
            <!-- Header Box -->
            <div style="position: relative; border: 2px solid #38bdf8; border-radius: 6px; padding: 10px 14px; margin-top: 10px; background-color: rgba(15, 23, 42, 0.8); text-align: center; width: 100%; max-width: 320px; box-sizing: border-box; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                <div style="position: absolute; top: -3px; left: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                <div style="position: absolute; bottom: -3px; right: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                <h2 style="color: #f8fafc; font-size: 17px; font-weight: 800; letter-spacing: 1px; margin: 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${displayTitle} (${boType})</h2>
            </div>
            
            <div class="room-content-center" id="roomContentArea">
                <p style="margin-bottom: 6px;">Required Key: <span style="color: #38bdf8; font-weight: bold;">${targetMode.toUpperCase()} - ${targetKeyType.toUpperCase()}</span></p>
                <p style="font-size: 11.5px; color: ${hasKey ? '#10b981' : '#f43f5e'}; margin: 0;">
                    Available Keys: ${availableKeys}
                </p>
            </div>

            <div class="room-bottom-actions">
                <button class="room-btn btn-new-room" id="newRoomBtn" ${!hasKey ? 'disabled' : ''}>
                    ${hasKey ? 'Create Room' : 'No Key'}
                </button>
                <button class="room-btn btn-cancel" id="cancelBtn">Cancel</button>
            </div>
        </div>
    `;

    const newRoomBtn = container.querySelector('#newRoomBtn');
    const roomContentArea = container.querySelector('#roomContentArea');

    if (newRoomBtn && hasKey) {
        newRoomBtn.addEventListener('click', async () => {
            try {
                newRoomBtn.disabled = true;
                newRoomBtn.textContent = 'Creating...';

                deductKey(targetMode, targetKeyType);

                // သေးငယ်ပြီး ရိုးရှင်းတဲ့ ရလဒ် Card လေး
                roomContentArea.innerHTML = `
                    <div class="ios-room-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 11px;">
                            <span style="color: #38bdf8; font-weight: bold;">${displayTitle}</span>
                            <span style="color: #10b981;">● Active (${boType})</span>
                        </div>
                        <div class="matchup-container">
                            <div class="player-side">
                                <img src="${userAvatar}" alt="Logo" class="player-avatar" onerror="this.src='FrontLogo.jpg'">
                                <span class="player-name">${userName}</span>
                            </div>
                            <div class="vs-badge">VS</div>
                            <div class="player-side right">
                                <span class="player-name" style="color: #94a3b8;">Waiting...</span>
                                <div class="mystery-avatar">?</div>
                            </div>
                        </div>
                    </div>
                `;

                newRoomBtn.textContent = 'Room Created';
                
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