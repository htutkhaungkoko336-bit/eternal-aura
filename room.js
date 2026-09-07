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
    
    // User ID ကို ရှာယူခြင်း
    const userId = userDocData.userId || userDocData.id || localStorage.getItem('userId');

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
                    gap: 10px;
                    overflow-y: auto;
                }
                .ios-room-card {
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
                    border: 2px solid transparent;
                    border-image: linear-gradient(135deg, #38bdf8, #9333ea, #f43f5e) 1;
                    border-radius: 12px;
                    padding: 12px 16px;
                    width: 100%;
                    max-width: 330px;
                    box-shadow: 0 0 20px rgba(56, 189, 248, 0.2), inset 0 0 10px rgba(147, 51, 234, 0.1);
                    box-sizing: border-box;
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
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    border: 2px solid #38bdf8;
                    object-fit: cover;
                    background: #1e293b;
                }
                .player-name {
                    font-size: 11px;
                    font-weight: 600;
                    color: #f8fafc;
                    max-width: 75px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .vs-badge {
                    font-size: 10px;
                    font-weight: 900;
                    color: #f43f5e;
                    background: rgba(244, 63, 94, 0.15);
                    padding: 3px 6px;
                    border-radius: 6px;
                    border: 1px solid rgba(244, 63, 94, 0.3);
                }
                .right-action-group {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .card-cancel-btn {
                    background: rgba(244, 63, 94, 0.1);
                    color: #f43f5e;
                    border: 1px solid rgba(244, 63, 94, 0.5);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .card-cancel-btn:hover {
                    background: rgba(244, 63, 94, 0.25);
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
                    cursor: pointer;
                }
                .btn-new-room {
                    background: ${isCreated ? '#1e293b' : 'linear-gradient(135deg, #0284c7, #9333ea)'};
                    color: ${isCreated ? '#64748b' : '#fff'};
                    cursor: ${isCreated ? 'not-allowed' : 'pointer'};
                }
                .btn-cancel {
                    background: rgba(30, 41, 59, 0.9);
                    color: #f43f5e;
                    border: 1px solid rgba(244, 63, 94, 0.4);
                }
            </style>

            <div class="room-screen-wrapper">
                <div style="position: relative; border: 2px solid #38bdf8; border-radius: 6px; padding: 10px 14px; margin-top: 10px; background-color: rgba(15, 23, 42, 0.8); text-align: center; width: 100%; max-width: 330px; box-sizing: border-box;">
                    <h2 style="color: #f8fafc; font-size: 17px; font-weight: 800; margin: 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${displayTitle} (${boType})</h2>
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
                                        <button class="card-cancel-btn" data-hostid="${userId}">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div id="globalRoomsList" style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                            <p style="margin-bottom: 4px;">Required Key: <span style="color: #38bdf8; font-weight: bold;">${targetMode.toUpperCase()} - ${targetKeyType.toUpperCase()}</span></p>
                            <p style="font-size: 11.5px; color: ${hasKey ? '#10b981' : '#f43f5e'}; margin: 0 0 10px 0;">Available Keys: ${availableKeys}</p>
                            <div style="font-size: 11px; color: #38bdf8; margin-bottom: 4px; text-align: left; width: 100%;">Active Rooms:</div>
                            <div id="roomsContainer" style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                                <span style="color: #64748b; font-size: 11px;">Loading rooms...</span>
                            </div>
                        </div>
                    `}
                </div>

                <div class="room-bottom-actions">
                    <button class="room-btn btn-new-room" id="newRoomBtn" ${!hasKey || isCreated ? 'disabled' : ''}>
                        ${isCreated ? 'Room Created' : (hasKey ? 'Create Room' : 'No Key')}
                    </button>
                    <button class="room-btn btn-cancel" id="cancelBtn">Back</button>
                </div>
            </div>
        `;
    }

    // Global Active Rooms များကို Backend မှ ဆွဲထုတ်ပြသသည့် Function
    async function fetchAndRenderGlobalRooms() {
        const roomsContainer = container.querySelector('#roomsContainer');
        if (!roomsContainer) return;

        try {
            const response = await fetch(`/api/create-room?mode=${targetMode}&keyType=${targetKeyType}`);
            const data = await response.json();

            if (data.success && data.rooms && data.rooms.length > 0) {
                roomsContainer.innerHTML = data.rooms.map(room => `
                    <div class="ios-room-card" style="max-width: 100%;">
                        <div class="matchup-container">
                            <div class="player-side">
                                <img src="${room.teamLogo || 'FrontLogo.jpg'}" alt="Logo" class="player-avatar" onerror="this.src='FrontLogo.jpg'">
                                <span class="player-name">${room.teamName || 'Player'}</span>
                            </div>
                            <div class="vs-badge">VS</div>
                            <div class="player-side right">
                                <div class="right-action-group">
                                    <span class="player-name" style="color: #94a3b8;">Waiting...</span>
                                    ${room.hostId === userId ? `<button class="card-cancel-btn" data-hostid="${room.hostId}">Cancel</button>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');

                // Global list ထဲက Cancel ခလုတ်များအတွက် Event ချိတ်ပေးခြင်း
                roomsContainer.querySelectorAll('.card-cancel-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const hostIdToCancel = e.target.getAttribute('data-hostid');
                        await cancelRoomAPI(hostIdToCancel);
                    });
                });
            } else {
                roomsContainer.innerHTML = `<span style="color: #64748b; font-size: 11px;">Active room မရှိသေးပါ။ Room အသစ်ထောင်နိုင်ပါသည်။</span>`;
            }
        } catch (err) {
            console.error("Fetch rooms error:", err);
            roomsContainer.innerHTML = `<span style="color: #f43f5e; font-size: 11px;">Rooms များကို ဆွဲထုတ်၍ မရပါ။</span>`;
        }
    }

    // Room ဖျက်ရန် (DELETE API ခေါ်ရန်) Common Function
    async function cancelRoomAPI(targetHostId) {
        try {
            const response = await fetch('/api/create-room', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: targetHostId })
            });
            const result = await response.json();

            if (result.success) {
                // ကိုယ့် Room ကို Cancel လိုက်တာဖြစ်ရင် ပုံမှန် screen (Global list ပြတဲ့ screen) သို့ ပြန်သွားမည်
                if (targetHostId === userId) {
                    container.innerHTML = renderScreenHTML(false);
                    attachEventListeners();
                } else {
                    fetchAndRenderGlobalRooms();
                }
            } else {
                alert(result.message || 'Room ဖျက်၍ မရပါ။');
            }
        } catch (err) {
            console.error("Cancel room error:", err);
            alert('ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။');
        }
    }

    // ပထမအကြိမ် render လုပ်ခြင်း (လက်ရှိ User ထောင်ထားပြီးသား room ရှိမရှိ စစ်ဆေးနိုင်ရန် ချက်ချင်း GET ခေါ်မည်)
    async function initScreen() {
        try {
            const response = await fetch(`/api/create-room?mode=${targetMode}&keyType=${targetKeyType}`);
            const data = await response.json();
            
            let myExistingRoom = null;
            if (data.success && data.rooms) {
                myExistingRoom = data.rooms.find(r => r.hostId === userId);
            }

            if (myExistingRoom) {
                container.innerHTML = renderScreenHTML(true, myExistingRoom.teamName, myExistingRoom.teamLogo);
            } else {
                container.innerHTML = renderScreenHTML(false);
                fetchAndRenderGlobalRooms();
            }
            attachEventListeners();
        } catch (e) {
            container.innerHTML = renderScreenHTML(false);
            attachEventListeners();
        }
    }

    function attachEventListeners() {
        const newRoomBtn = container.querySelector('#newRoomBtn');
        if (newRoomBtn && hasKey) {
            newRoomBtn.addEventListener('click', async () => {
                try {
                    newRoomBtn.disabled = true;
                    newRoomBtn.textContent = 'Creating...';

                    if (!userId) {
                        alert('User ID မတွေ့ရှိရပါ။ ကျေးဇူးပြု၍ Login ပြန်ဝင်ပါ။');
                        newRoomBtn.disabled = false;
                        newRoomBtn.textContent = 'Create Room';
                        return;
                    }

                    const response = await fetch('/api/create-room', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: userId,
                            roomTitle: displayTitle,
                            targetMode: targetMode,
                            targetKeyType: targetKeyType,
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

                    // Local key ကို နှုတ်ပေးရန်
                    deductKey(targetMode, targetKeyType);

                    const finalTeamName = result.roomData?.teamName || defaultUserName;
                    const finalTeamLogo = result.roomData?.teamLogo || defaultUserAvatar;

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

        const cardCancelBtn = container.querySelector('.card-cancel-btn');
        if (cardCancelBtn) {
            cardCancelBtn.addEventListener('click', async () => {
                const hostIdToCancel = cardCancelBtn.getAttribute('data-hostid') || userId;
                await cancelRoomAPI(hostIdToCancel);
            });
        }
    }

    initScreen();
}