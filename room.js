import { renderMatchScreen } from './match.js';
import { getKeyData, deductKey } from './keysStore.js';
import { showRoomDetailsPopup, showRewardCodePopup } from './roomPopup.js';

export function renderRoomScreen(container, roomTitleText, userDocData = {}) {
    const upperTitle = roomTitleText.toUpperCase();
    
    let displayTitle = upperTitle;
    if (!displayTitle.includes('ROOM')) {
        displayTitle = `${displayTitle} ROOM`;
    }

    let targetMode = '5v5';
    if (upperTitle.includes('1V1') || upperTitle.includes('1VS1')) {
        targetMode = '1v1';
    } else if (upperTitle.includes('5V5') || upperTitle.includes('5VS5')) {
        targetMode = '5v5';
    }

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

    const defaultUserAvatar = userDocData.photoURL || userDocData.avatar || 'FrontLogo.jpg';
    const userId = userDocData.userId || userDocData.id || localStorage.getItem('userId');

    function renderScreenHTML() {
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
                    align-items: center;
                    flex: 1;
                    gap: 10px;
                    overflow-y: auto;
                    margin-top: 10px;
                }
                .ios-room-card {
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
                    border: 2px solid transparent;
                    border-image: linear-gradient(135deg, #0284c7, #9333ea) 1;
                    border-radius: 12px;
                    padding: 12px 16px;
                    width: 100%;
                    max-width: 330px;
                    box-shadow: 0 0 15px rgba(147, 51, 234, 0.25);
                    box-sizing: border-box;
                    cursor: pointer;
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
                .center-vs-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                .vs-badge {
                    font-size: 10px;
                    font-weight: 900;
                    color: #38bdf8;
                    background: rgba(56, 189, 248, 0.15);
                    padding: 3px 6px;
                    border-radius: 6px;
                    border: 1px solid rgba(56, 189, 248, 0.4);
                }
                .matched-badge {
                    font-size: 10px;
                    font-weight: 800;
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.15);
                    padding: 3px 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(16, 185, 129, 0.4);
                    white-space: nowrap;
                }
                .right-action-group {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .card-join-btn {
                    background: linear-gradient(135deg, #0284c7, #9333ea);
                    color: #fff;
                    border: none;
                    padding: 5px 12px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
                    white-space: nowrap;
                }
                .card-join-btn:hover {
                    opacity: 0.9;
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
                    background: ${hasKey ? 'linear-gradient(135deg, #0284c7, #9333ea)' : '#1e293b'};
                    color: ${hasKey ? '#fff' : '#64748b'};
                    cursor: ${hasKey ? 'pointer' : 'not-allowed'};
                }
                .btn-cancel {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
                    color: #38bdf8;
                    border: 1px solid rgba(56, 189, 248, 0.4);
                }
                .btn-cancel:hover {
                    background: rgba(2, 132, 199, 0.15);
                    border-color: rgba(56, 189, 248, 0.7);
                }
            </style>

            <div class="room-screen-wrapper">
                <div style="position: relative; border: 2px solid #38bdf8; border-radius: 6px; padding: 10px 14px; margin-top: 10px; background-color: rgba(15, 23, 42, 0.8); text-align: center; width: 100%; max-width: 330px; box-sizing: border-box;">
                    <h2 style="color: #f8fafc; font-size: 17px; font-weight: 800; margin: 0; text-transform: uppercase; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${displayTitle} (${boType})</h2>
                </div>
                
                <div class="room-content-center" id="roomContentArea">
                    <div style="width: 100%; display: flex; justify-content: space-between; font-size: 11.5px; padding: 0 4px; box-sizing: border-box;">
                        <span>Req Key: <b style="color: #38bdf8;">${targetMode.toUpperCase()} - ${targetKeyType.toUpperCase()}</b></span>
                        <span style="color: ${hasKey ? '#10b981' : '#f43f5e'};">Keys: ${availableKeys}</span>
                    </div>

                    <div style="font-size: 11px; color: #38bdf8; text-align: left; width: 100%; margin-top: 4px;">Global Active Rooms:</div>
                    
                    <div id="roomsContainer" style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                        <span style="color: #64748b; font-size: 11px;">Loading rooms...</span>
                    </div>
                </div>

                <div class="room-bottom-actions">
                    <button class="room-btn btn-new-room" id="newRoomBtn" ${!hasKey ? 'disabled' : ''}>
                        ${hasKey ? 'Create Room' : 'No Key'}
                    </button>
                    <button class="room-btn btn-cancel" id="cancelBtn">Back</button>
                </div>
            </div>
        `;
    }

    async function fetchAndRenderGlobalRooms() {
        const roomsContainer = container.querySelector('#roomsContainer');
        if (!roomsContainer) return;

        try {
            const response = await fetch(`/api/create-room?mode=${targetMode}&keyType=${targetKeyType}`);
            const data = await response.json();

            let hasMyRoom = false;
            let hasJoinedAnyRoom = false;

            if (data.success && data.rooms && data.rooms.length > 0) {
                roomsContainer.innerHTML = data.rooms.map(room => {
                    const isMyRoom = (room.hostId === userId);
                    const isJoinedByMe = (room.joinedUserId === userId);

                    if (isMyRoom) {
                        hasMyRoom = true;
                    }
                    if (isJoinedByMe) {
                        hasJoinedAnyRoom = true;
                    }

                    const isLocked = room.joinedUserId && room.joinedUserId !== userId;
                    const hasMatched = !!room.joinedUserId;

                    const hostLogo = room.teamLogo || defaultUserAvatar;
                    const hostName = room.teamName || 'Player';
                    
                    const joinerLogo = hasMatched ? (room.joinerTeamLogo || defaultUserAvatar) : '';
                    const joinerName = hasMatched ? (room.joinerTeamName || 'Joined Player') : '';

                    let rightActionHTML = '';
                    if (isMyRoom) {
                        if (!hasMatched) {
                            rightActionHTML = `<button class="card-join-btn" style="background: linear-gradient(135deg, #f43f5e, #e11d48); box-shadow: 0 0 10px rgba(244, 63, 94, 0.4);" data-action="cancelRoom" data-roomid="${room.id}">Cancel</button>`;
                        } else {
                            rightActionHTML = ``; 
                        }
                    } else if (isJoinedByMe) {
                        rightActionHTML = ``; 
                    } else if (isLocked) {
                        rightActionHTML = ``;
                    } else {
                        rightActionHTML = `<button class="card-join-btn" data-roomid="${room.id}" data-hostid="${room.hostId}">Join</button>`;
                    }

                    return `
                        <div class="ios-room-card" style="max-width: 100%;" data-room-index="${room.id}">
                            <div class="matchup-container">
                                <div class="player-side">
                                    <img src="${hostLogo}" alt="Host Logo" class="player-avatar" onerror="this.src='FrontLogo.jpg'">
                                    <span class="player-name">${hostName}</span>
                                </div>

                                <div class="center-vs-wrapper">
                                    ${hasMatched ? `<span class="matched-badge">Matched</span>` : `<div class="vs-badge">VS</div>`}
                                </div>

                                <div class="player-side right">
                                    <div class="right-action-group">
                                        ${rightActionHTML}
                                    </div>
                                    <img src="${joinerLogo}" alt="Joiner Logo" class="player-avatar" onerror="this.src='FrontLogo.jpg'" style="display: ${hasMatched ? 'block' : 'none'};">
                                    <span class="player-name" style="color: ${hasMatched ? '#f8fafc' : '#64748b'}; display: ${hasMatched ? 'inline' : 'none'};">${joinerName}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                roomsContainer.querySelectorAll('.ios-room-card').forEach((card, idx) => {
                    card.addEventListener('click', (e) => {
                        if (e.target.tagName === 'BUTTON') return;
                        const room = data.rooms[idx];
                        
                        // Host သို့မဟုတ် Joiner ဖြစ်မဖြစ် စစ်ဆေးခြင်း
                        const isParticipant = (userId === room.hostId) || (userId === room.joinedUserId);

                        // Spin / FirstPick ပြီးသွားပြီဆိုရင် Reward Code Popup ကို တိုက်ရိုက်ပြမယ် (Polling လုံးဝမ run တော့ပါ)
                        if (room.firstPick && isParticipant) {
                            showRewardCodePopup(room, targetMode, userId, {
                                onComplete: (finalRoom) => {
                                    fetchAndRenderGlobalRooms();
                                }
                            });
                            return;
                        }
                        
                        // မပြီးသေးရင် ပုံမှန် Match Details / Ready Popup ကိုပြမယ်
                        showRoomDetailsPopup(room, targetMode, userId, {
                            onCancelJoiner: (roomId) => cancelJoinerAPI(roomId),
                            onTransferHost: (roomId) => transferHostAPI(roomId),
                            onBothReady: (updatedRoom) => {
                                showRewardCodePopup(updatedRoom, targetMode, userId, {
                                    onComplete: (finalRoom) => {
                                        fetchAndRenderGlobalRooms();
                                    }
                                });
                            }
                        });
                    });
                });

            } else {
                roomsContainer.innerHTML = `<span style="color: #64748b; font-size: 11px; padding: 10px 0;">Active room မရှိသေးပါ။ Room အသစ်ထောင်နိုင်ပါသည်။</span>`;
            }

            const newRoomBtn = container.querySelector('#newRoomBtn');
            if (newRoomBtn) {
                if (hasMyRoom) {
                    newRoomBtn.disabled = true;
                    newRoomBtn.textContent = 'Room Created';
                    newRoomBtn.style.background = '#1e293b';
                    newRoomBtn.style.color = '#64748b';
                    newRoomBtn.style.cursor = 'not-allowed';
                } else if (hasJoinedAnyRoom) {
                    newRoomBtn.disabled = true;
                    newRoomBtn.textContent = 'Joined Room';
                    newRoomBtn.style.background = '#1e293b';
                    newRoomBtn.style.color = '#64748b';
                    newRoomBtn.style.cursor = 'not-allowed';
                } else if (hasKey) {
                    newRoomBtn.disabled = false;
                    newRoomBtn.textContent = 'Create Room';
                    newRoomBtn.style.background = 'linear-gradient(135deg, #0284c7, #9333ea)';
                    newRoomBtn.style.color = '#fff';
                    newRoomBtn.style.cursor = 'pointer';
                } else {
                    newRoomBtn.disabled = true;
                    newRoomBtn.textContent = 'No Key';
                    newRoomBtn.style.background = '#1e293b';
                    newRoomBtn.style.color = '#64748b';
                    newRoomBtn.style.cursor = 'not-allowed';
                }
            }

            roomsContainer.querySelectorAll('.card-join-btn:not([data-action="cancelRoom"])').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const currentKeysData = getKeyData();
                    const currentKeysCount = currentKeysData.modes[targetMode]?.[targetKeyType] || 0;
                    
                    if (currentKeysCount <= 0) {
                        alert('သော့ (Key) မလုံလောက်ပါသဖြင့် Room သို့ ဝင်၍မရပါ။');
                        return;
                    }

                    const roomIdToJoin = e.target.getAttribute('data-roomid');
                    joinRoomAPI(roomIdToJoin);
                });
            });

            roomsContainer.querySelectorAll('[data-action="cancelRoom"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const roomIdToCancel = e.target.getAttribute('data-roomid');
                    cancelHostRoomAPI(roomIdToCancel);
                });
            });

        } catch (err) {
            console.error("Fetch rooms error:", err);
            roomsContainer.innerHTML = `<span style="color: #f43f5e; font-size: 11px;">Rooms များကို ဆွဲထုတ်၍ မရပါ။</span>`;
        }
    }

    async function joinRoomAPI(roomId) {
        try {
            const response = await fetch('/api/create-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, roomId: roomId })
            });
            const result = await response.json();

            if (result.success) {
                deductKey(targetMode, targetKeyType);
                fetchAndRenderGlobalRooms();
            } else {
                alert(result.message || 'Room သို့ Join၍ မရပါ။');
            }
        } catch (err) {
            console.error("Join room error:", err);
            alert('ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။');
        }
    }

    async function cancelJoinerAPI(roomId) {
        try {
            const response = await fetch('/api/create-room', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, roomId: roomId, action: 'leaveJoiner' })
            });
            const result = await response.json();
            if (result.success) {
                fetchAndRenderGlobalRooms();
            }
        } catch (err) {
            console.error("Leave room error:", err);
        }
    }

    async function transferHostAPI(roomId) {
        try {
            const response = await fetch('/api/create-room', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, roomId: roomId, action: 'transferHost' })
            });
            const result = await response.json();
            if (result.success) {
                fetchAndRenderGlobalRooms();
            }
        } catch (err) {
            console.error("Transfer host error:", err);
        }
    }

    async function cancelHostRoomAPI(roomId) {
        try {
            const response = await fetch('/api/create-room', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, roomId: roomId, action: 'cancelRoom' })
            });
            const result = await response.json();
            if (result.success) {
                fetchAndRenderGlobalRooms();
            } else {
                alert(result.message || 'Room ကို ဖျက်၍ မရပါ။');
            }
        } catch (err) {
            console.error("Cancel room error:", err);
            alert('ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။');
        }
    }

    container.innerHTML = renderScreenHTML();
    fetchAndRenderGlobalRooms();

    const newRoomBtn = container.querySelector('#newRoomBtn');
    if (newRoomBtn) {
        newRoomBtn.addEventListener('click', async () => {
            if (newRoomBtn.disabled) return;

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

                deductKey(targetMode, targetKeyType);
                fetchAndRenderGlobalRooms();
                
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