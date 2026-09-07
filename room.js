import { renderMatchScreen } from './match.js';
import { getKeyData, deductKey } from './keysStore.js';

export function renderRoomScreen(container, roomTitleText, userDocData = {}) {
    const upperTitle = roomTitleText.toUpperCase();
    
    let displayTitle = upperTitle;
    if (!displayTitle.includes('ROOM')) {
        displayTitle = `${displayTitle} ROOM`;
    }

    // Dynamic ဖြစ်အောင် Title ထဲကနေ Mode (1v1 သို့မဟုတ် 5v5) ကို ရှာဖွေခြင်း
    let targetMode = '5v5';
    if (upperTitle.includes('1V1') || upperTitle.includes('1VS1')) {
        targetMode = '1v1';
    } else if (upperTitle.includes('5V5') || upperTitle.includes('5VS5')) {
        targetMode = '5v5';
    }

    // Dynamic ဖြစ်အောင် Key Type (50k, 25k, 15k, 10k, 5k) ကို ရှာဖွေခြင်း
    let targetKeyType = '5k';
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

    // Default user details
    const defaultUserName = userDocData.userName || userDocData.name || 'Player';
    const defaultUserAvatar = userDocData.photoURL || userDocData.avatar || 'FrontLogo.jpg';

    function renderScreenHTML(isCreated = false, currentUserName = defaultUserName, currentUserAvatar = defaultUserAvatar) {
        return `
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
                    max-width: 330px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                }
                .ios-room-card {
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
                    border: 2px solid transparent;
                    border-image: linear-gradient(135deg, #38bdf8, #9333ea, #f43f5e) 1;
                    border-radius: 12px;
                    padding: 16px 20px;
                    width: 100%;
                    max-width: 330px;
                    box-shadow: 0 0 20px rgba(56, 189, 248, 0.2), inset 0 0 10px rgba(147, 51, 234, 0.1);
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
                    gap: 10px;
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
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    border: 2px solid #38bdf8;
                    object-fit: cover;
                    background: #1e293b;
                    box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
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
                    font-weight: 900;
                    color: #f43f5e;
                    background: rgba(244, 63, 94, 0.15);
                    padding: 4px 6px;
                    border-radius: 6px;
                    border: 1px solid rgba(244, 63, 94, 0.3);
                }
                .right-action-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .card-cancel-btn {
                    background: rgba(56, 189, 248, 0.1);
                    color: #38bdf8;
                    border: 1px solid rgba(56, 189, 248, 0.5);
                    padding: 5px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s;
                    white-space: nowrap;
                }
                .card-cancel-btn:hover {
                    background: rgba(56, 189, 248, 0.25);
                }
                .room-bottom-actions {
                    display: flex;
                    gap: 12px;
                    width: 100%;
                    max-width: 330px;
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
                    background: ${isCreated ? '#1e293b' : 'linear-gradient(135deg, #0284c7, #9333ea)'};
                    color: ${isCreated ? '#64748b' : '#fff'};
                    box-shadow: ${isCreated ? 'none' : '0 4px 15px rgba(147, 51, 234, 0.4)'};
                    cursor: ${isCreated ? 'not-allowed' : 'pointer'};
                }
                .btn-cancel {
                    background: rgba(30, 41, 59, 0.9);
                    color: #f43f5e;
                    border: 1px solid rgba(244, 63, 94, 0.4);
                    box-shadow: 0 4px 15px rgba(244, 63, 94, 0.15);
                }
            </style>

            <div class="room-screen-wrapper">
                <div style="position: relative; border: 2px solid #38bdf8; border-radius: 6px; padding: 10px 14px; margin-top: 10px; background-color: rgba(15, 23, 42, 0.8); text-align: center; width: 100%; max-width: 330px; box-sizing: border-box; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                    <div style="position: absolute; top: -3px; left: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                    <div style="position: absolute; bottom: -3px; right: -3px; width: 6px; height: 6px; background-color: #38bdf8;"></div>
                    <h2 style="color: #f8fafc; font-size: 17px; font-weight: 800; letter-spacing: 1px; margin: 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${displayTitle} (${boType})</h2>
                </div>
                
                <div class="room-content-center" id="roomContentArea">
                    ${isCreated ? `
                        <div class="ios-room-card">
                            <div class="matchup-container">
                                <div class="player-side">
                                    <img src="${currentUserAvatar}" alt="Logo" class="player-avatar" onerror="this.src='FrontLogo.jpg'">
                                    <span class="player-name">${currentUserName}</span>
                                </div>
                                <div class="vs-badge">VS</div>
                                <div class="player-side right">
                                    <div class="right-action-group">
                                        <span class="player-name" style="color: #94a3b8;">Waiting...</span>
                                        <button class="card-cancel-btn" id="cardCancelBtn">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <p style="margin-bottom: 6px;">Required Key: <span style="color: #38bdf8; font-weight: bold;">${targetMode.toUpperCase()} - ${targetKeyType.toUpperCase()}</span></p>
                        <p style="font-size: 11.5px; color: ${hasKey ? '#10b981' : '#f43f5e'}; margin: 0;">
                            Available Keys: ${availableKeys}
                        </p>
                    `}
                </div>

                <div class="room-bottom-actions">
                    <button class="room-btn btn-new-room" id="newRoomBtn" ${!hasKey || isCreated ? 'disabled' : ''}>
                        ${isCreated ? 'Room Created' : (hasKey ? 'Create Room' : 'No Key')}
                    </button>
                    <button class="room-btn btn-cancel" id="cancelBtn">Cancel</button>
                </div>
            </div>
        `;
    }

    container.innerHTML = renderScreenHTML(false);

    function attachEventListeners() {
        const newRoomBtn = container.querySelector('#newRoomBtn');
        if (newRoomBtn && hasKey) {
            newRoomBtn.addEventListener('click', async () => {
                try {
                    newRoomBtn.disabled = true;
                    newRoomBtn.textContent = 'Creating...';

                    // Backend API သို့ Room ဖန်တီးရန် လှမ်းခေါ်ခြင်း (Registration ထဲက Logo နဲ့ Name ကို ယူမည်)
                    const userId = userDocData.userId || userDocData.id;
                    const response = await fetch('/api/create-room', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: userId,
                            roomTitle: displayTitle,
                            targetMode: targetMode,          // ဥပမာ - '5v5'
                            targetKeyType: targetKeyType,    // ဥပမာ - '50k'
                            boType: boType
                        })
                    });

                    const result = await response.json();

                    if (!result.success) {
                        alert(result.message || 'Room ဖန်တီး၍ မရပါ');
                        newRoomBtn.disabled = false;
                        newRoomBtn.textContent = 'Create Room';
                        return;
                    }

                    // Local key ကိုလည်း နှုတ်ပေးရန်
                    deductKey(targetMode, targetKeyType);

                    // Backend မှ ပြန်လာသော Registration ၏ Team Name နှင့် Logo ကို ယူသုံးမည်
                    const finalTeamName = result.roomData?.teamName || defaultUserName;
                    const finalTeamLogo = result.roomData?.teamLogo || defaultUserAvatar;

                    // Screen ကို Room Created ပုံစံသို့ ပြောင်းလဲပြသခြင်း
                    container.innerHTML = renderScreenHTML(true, finalTeamName, finalTeamLogo);
                    attachEventListeners();
                    
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

        const cardCancelBtn = container.querySelector('#cardCardCancelBtn') || container.querySelector('#cardCancelBtn');
        if (cardCancelBtn) {
            cardCancelBtn.addEventListener('click', () => {
                container.innerHTML = renderScreenHTML(false);
                attachEventListeners();
            });
        }
    }

    attachEventListeners();
}