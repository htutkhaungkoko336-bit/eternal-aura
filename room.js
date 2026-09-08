import { renderMatchScreen } from './match.js';
import { getKeyData, deductKey } from './keysStore.js';

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

    const defaultUserName = userDocData.userName || userDocData.name || 'Player';
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
                    background: rgba(15, 23, 42, 0.7);
                    border: 1px solid rgba(56, 189, 248, 0.2);
                    border-radius: 12px;
                    padding: 10px 14px;
                    width: 100%;
                    max-width: 330px;
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
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    border: 1.5px solid #38bdf8;
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
                    font-weight: 800;
                    color: #38bdf8;
                }
                .right-action-group {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .card-join-btn {
                    background: #0284c7;
                    color: #fff;
                    border: none;
                    padding: 5px 12px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .card-cancel-btn {
                    background: rgba(244, 63, 94, 0.15);
                    color: #f43f5e;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                }
                
                /* iOS Clean Minimalist Popup Overlay */
                .ios-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    z-index: 1000;
                    padding: 12px;
                    box-sizing: border-box;
                }
                .ios-popup-sheet {
                    background: #1c1c1e;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 340px;
                    padding: 20px 16px 16px 16px;
                    color: #fff;
                    font-size: 13px;
                    box-sizing: border-box;
                    margin-bottom: 10px;
                    animation: slideUp 0.25s ease-out;
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .ios-popup-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #ebebf5;
                    text-align: center;
                    margin-bottom: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .ios-popup-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 16px;
                }
                .ios-popup-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 13px;
                    color: #aeaeb2;
                    padding: 2px 0;
                }
                .ios-popup-item span:last-child {
                    color: #fff;
                    font-weight: 500;
                }
                .ios-popup-close {
                    width: 100%;
                    background: #2c2c2e;
                    color: #0a84ff;
                    border: none;
                    padding: 12px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    text-align: center;
                }
                .ios-popup-close:active {
                    background: #3a3a3c;
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
                    font-weight: 600;
                    font-size: 14px;
                    text-align: center;
                    border: none;
                    cursor: pointer;
                }
                .btn-new-room {
                    background: ${hasKey ? '#0a84ff' : '#2c2c2e'};
                    color: ${hasKey ? '#fff' : '#636366'};
                    cursor: ${hasKey ? 'pointer' : 'not-allowed'};
                }
                .btn-cancel {
                    background: #1c1c1e;
                    color: #0a84ff;
                }
            </style>

            <div class="room-screen-wrapper">
                <div style="text-align: center; margin-top: 10px; width: 100%; max-width: 330px;">
                    <h2 style="color: #fff; font-size: 16px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">${displayTitle}</h2>
                    <span style="font-size: 11px; color: #8e8e93;">Format: ${boType}</span>
                </div>
                
                <div class="room-content-center" id="roomContentArea">
                    <div style="width: 100%; display: flex; justify-content: space-between; font-size: 11px; padding: 0 4px; color: #8e8e93; box-sizing: border-box;">
                        <span>Mode: <b style="color: #fff;">${targetMode.toUpperCase()} (${targetKeyType.toUpperCase()})</b></span>
                        <span>Keys: <b style="color: ${hasKey ? '#30d158' : '#ff453a'};">${availableKeys}</b></span>
                    </div>

                    <div style="font-size: 11px; color: #8e8e93; text-align: left; width: 100%; margin-top: 4px;">Active Rooms</div>
                    
                    <div id="roomsContainer" style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                        <span style="color: #8e8e93; font-size: 11px;">Loading rooms...</span>
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

                    if (isMyRoom) hasMyRoom = true;
                    if (isJoinedByMe) hasJoinedAnyRoom = true;

                    const isLocked = room.joinedUserId && room.joinedUserId !== userId;

                    return `
                        <div class="ios-room-card" data-room-index="${room.id}">
                            <div class="matchup-container">
                                <div class="player-side">
                                    <img src="${room.teamLogo || defaultUserAvatar}" alt="Logo" class="player-avatar" onerror="this.src='FrontLogo.jpg'">
                                    <span class="player-name">${room.teamName || 'Player'}</span>
                                </div>
                                <div class="vs-badge">VS</div>
                                <div class="player-side right">
                                    <div class="right-action-group">
                                        ${isMyRoom || isJoinedByMe
                                            ? `<button class="card-cancel-btn" data-roomid="${room.id}" data-hostid="${room.hostId}">Cancel</button>` 
                                            : isLocked
                                                ? `<span style="font-size: 10px; color: #ff453a; font-weight: 600;">Locked</span>`
                                                : `<button class="card-join-btn" data-roomid="${room.id}" data-hostid="${room.hostId}">Join</button>`
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                roomsContainer.querySelectorAll('.ios-room-card').forEach((card, idx) => {
                    card.addEventListener('click', (e) => {
                        if (e.target.tagName === 'BUTTON') return;
                        const room = data.rooms[idx];
                        showRoomDetailsPopup(room, targetMode);
                    });
                });

            } else {
                roomsContainer.innerHTML = `<span style="color: #8e8e93; font-size: 11px; padding: 10px 0;">Active room မရှိသေးပါ။</span>`;
            }

            const newRoomBtn = container.querySelector('#newRoomBtn');
            if (newRoomBtn) {
                if (hasMyRoom) {
                    newRoomBtn.disabled = true;
                    newRoomBtn.textContent = 'Room Created';
                    newRoomBtn.style.background = '#2c2c2e';
                    newRoomBtn.style.color = '#636366';
                } else if (hasJoinedAnyRoom) {
                    newRoomBtn.disabled = true;
                    newRoomBtn.textContent = 'Joined Room';
                    newRoomBtn.style.background = '#2c2c2e';
                    newRoomBtn.style.color = '#636366';
                } else if (hasKey) {
                    newRoomBtn.disabled = false;
                    newRoomBtn.textContent = 'Create Room';
                    newRoomBtn.style.background = '#0a84ff';
                    newRoomBtn.style.color = '#fff';
                } else {
                    newRoomBtn.disabled = true;
                    newRoomBtn.textContent = 'No Key';
                    newRoomBtn.style.background = '#2c2c2e';
                    newRoomBtn.style.color = '#636366';
                }
            }

            roomsContainer.querySelectorAll('.card-cancel-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    cancelRoomAPI(e.target.getAttribute('data-hostid'), e.target.getAttribute('data-roomid'));
                });
            });

            roomsContainer.querySelectorAll('.card-join-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    joinRoomAPI(e.target.getAttribute('data-roomid'));
                });
            });

        } catch (err) {
            console.error("Fetch rooms error:", err);
            roomsContainer.innerHTML = `<span style="color: #ff453a; font-size: 11px;">Rooms များကို ဆွဲထုတ်၍ မရပါ။</span>`;
        }
    }

    // iOS Clean Minimalist Bottom Sheet Popup
    function showRoomDetailsPopup(room, mode) {
        let contentListHTML = '';
        const is1v1 = mode.toLowerCase().includes('1v1');

        if (is1v1) {
            const name = room.inGameName || room.teamName || room.userName || 'Unknown Player';
            const hero = room.heroName || room.hero || 'Not Specified';
            const contact = room.contactPhNo || room.kpayPhNo || 'N/A';

            contentListHTML = `
                <div class="ios-popup-item"><span>Name</span><span>${name}</span></div>
                <div class="ios-popup-item"><span>Hero Name</span><span>${hero}</span></div>
                <div class="ios-popup-item"><span>Contact</span><span>${contact}</span></div>
            `;
        } else {
            const sqName = room.sqName || room.teamName || 'Unknown Squad';
            const contact = room.contactPhNo || room.kpayPhNo || 'N/A';

            const formatPlayerName = (p) => {
                if (!p) return '-';
                return typeof p === 'object' ? (p.name || '-') : p;
            };

            contentListHTML = `
                <div class="ios-popup-item" style="border-bottom: 0.5px solid #2c2c2e; padding-bottom: 6px; margin-bottom: 4px;"><span>Squad</span><span style="color: #0a84ff; font-weight: 600;">${sqName}</span></div>
                <div class="ios-popup-item"><span>Roamer</span><span>${formatPlayerName(room.roamer)}</span></div>
                <div class="ios-popup-item"><span>EXP</span><span>${formatPlayerName(room.exp)}</span></div>
                <div class="ios-popup-item"><span>Gold</span><span>${formatPlayerName(room.gold)}</span></div>
                <div class="ios-popup-item"><span>Mid</span><span>${formatPlayerName(room.mid)}</span></div>
                <div class="ios-popup-item"><span>Jungle</span><span>${formatPlayerName(room.jungle)}</span></div>
                <div class="ios-popup-item" style="border-top: 0.5px solid #2c2c2e; padding-top: 6px; margin-top: 4px;"><span>Contact</span><span>${contact}</span></div>
            `;
        }

        const overlay = document.createElement('div');
        overlay.className = 'ios-popup-overlay';
        overlay.innerHTML = `
            <div class="ios-popup-sheet">
                <div class="ios-popup-title">${is1v1 ? '1v1 Room Details' : 'Squad Details'}</div>
                <div class="ios-popup-list">
                    ${contentListHTML}
                </div>
                <button class="ios-popup-close" id="closePopupBtn">Close</button>
            </div>
        `;
        document.body.appendChild(overlay);

        const closePopup = () => overlay.remove();
        overlay.querySelector('#closePopupBtn').addEventListener('click', closePopup);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });
    }

    async function joinRoomAPI(roomId) {
        try {
            const response = await fetch('/api/join-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, roomId: roomId })
            });
            const result = await response.json();
            if (result.success) {
                fetchAndRenderGlobalRooms();
            } else {
                alert(result.message || 'Room သို့ Join၍ မရပါ။');
            }
        } catch (err) {
            console.error("Join room error:", err);
        }
    }

    async function cancelRoomAPI(targetHostId, roomId) {
        try {
            const response = await fetch('/api/create-room', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, roomId: roomId })
            });
            const result = await response.json();
            if (result.success) {
                fetchAndRenderGlobalRooms();
            } else {
                alert(result.message || 'Room ဖျက်၍ မရပါ။');
            }
        } catch (err) {
            console.error("Cancel room error:", err);
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
                    alert(result.message || 'Room ဖန်တီး၍ မရပါ။');
                    newRoomBtn.disabled = false;
                    newRoomBtn.textContent = 'Create Room';
                    return;
                }

                deductKey(targetMode, targetKeyType);
                fetchAndRenderGlobalRooms();
                
            } catch (err) {
                console.error("Room create error:", err);
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