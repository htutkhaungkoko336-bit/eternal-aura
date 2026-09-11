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
                .card-cancel-btn {
                    background: rgba(244, 63, 94, 0.15);
                    color: #f43f5e;
                    border: 1px solid rgba(244, 63, 94, 0.4);
                    padding: 5px 10px;
                    border-radius: 6px;
                    font-size: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .card-cancel-btn:hover {
                    background: rgba(244, 63, 94, 0.3);
                }
                
                /* Pop-up Modal Styles */
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(4, 4, 8, 0.85);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    padding: 16px;
                    box-sizing: border-box;
                }
                .popup-box {
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
                    border: 2px solid #38bdf8;
                    border-radius: 14px;
                    width: 100%;
                    max-width: 310px;
                    padding: 20px 18px;
                    box-shadow: 0 0 25px rgba(56, 189, 248, 0.3);
                    color: #fff;
                    font-size: 12px;
                    box-sizing: border-box;
                    position: relative;
                    max-height: 85vh;
                    overflow-y: auto;
                }
                .popup-title {
                    font-size: 14px;
                    font-weight: 800;
                    color: #38bdf8;
                    text-align: center;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    border-bottom: 1px solid rgba(56, 189, 248, 0.3);
                    padding-bottom: 8px;
                }
                .popup-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 4px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    font-size: 12px;
                }
                .popup-close-btn {
                    width: 100%;
                    margin-top: 16px;
                    background: linear-gradient(135deg, #0284c7, #9333ea);
                    color: #fff;
                    border: none;
                    padding: 10px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    text-align: center;
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
                    
                    const joinerLogo = room.joinerTeamLogo || defaultUserAvatar;
                    const joinerName = room.joinerTeamName || (hasMatched ? 'Joined Player' : 'Waiting...');

                    let rightActionHTML = '';
                    if (isMyRoom) {
                        // Host အတွက် Joiner မလာသေးရင် (hasMatched က false ဖြစ်နေရင်) Cancel btn ပြမယ်၊ Joiner လာရင် (hasMatched ဖြစ်ရင်) ဖြုတ်မယ်
                        if (!hasMatched) {
                            rightActionHTML = `<button class="card-cancel-btn" data-roomid="${room.id}">Cancel</button>`;
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
                                <!-- Host Player Side -->
                                <div class="player-side">
                                    <img src="${hostLogo}" alt="Host Logo" class="player-avatar" onerror="this.src='FrontLogo.jpg'">
                                    <span class="player-name">${hostName}</span>
                                </div>

                                <!-- Center Center Area -->
                                <div class="center-vs-wrapper">
                                    ${hasMatched ? `<span class="matched-badge">Matched</span>` : `<div class="vs-badge">VS</div>`}
                                </div>

                                <!-- Joiner Player Side -->
                                <div class="player-side right">
                                    <div class="right-action-group">
                                        ${rightActionHTML}
                                    </div>
                                    <img src="${hasMatched ? joinerLogo : 'FrontLogo.jpg'}" alt="Joiner Logo" class="player-avatar" onerror="this.src='FrontLogo.jpg'" style="display: ${hasMatched ? 'block' : 'none'};">
                                    <span class="player-name" style="color: ${hasMatched ? '#f8fafc' : '#64748b'};">${hasMatched ? joinerName : 'Waiting...'}</span>
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

            roomsContainer.querySelectorAll('.card-join-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const roomIdToJoin = e.target.getAttribute('data-roomid');
                    joinRoomAPI(roomIdToJoin);
                });
            });

            // Card ထဲက Host ရဲ့ Cancel button အတွက် Event listener ထည့်သွင်းခြင်း
            roomsContainer.querySelectorAll('.card-cancel-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const roomIdToCancel = e.target.getAttribute('data-roomid');
                    transferHostAPI(roomIdToCancel);
                });
            });

        } catch (err) {
            console.error("Fetch rooms error:", err);
            roomsContainer.innerHTML = `<span style="color: #f43f5e; font-size: 11px;">Rooms များကို ဆွဲထုတ်၍ မရပါ။</span>`;
        }
    }

    function showRoomDetailsPopup(room, mode) {
        const is1v1 = mode.toLowerCase().includes('1v1');
        const hasMatched = !!room.joinedUserId;

        let hostReadyState = room.hostReady || false;
        let joinerReadyState = room.joinerReady || false;

        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        function updatePopupContent() {
            let actionButtonsHTML = '';

            if (hasMatched) {
                actionButtonsHTML = `
                    <div style="display: flex; gap: 10px; margin-top: 14px;">
                        ${userId === room.hostId ? `
                            <button id="popupReadyBtn" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; background: ${hostReadyState ? '#10b981' : 'linear-gradient(135deg, #0284c7, #9333ea)'}; color: #fff;">
                                ${hostReadyState ? 'Unready' : 'Ready'}
                            </button>
                            <button id="popupCancelBtn" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 700; border: 1px solid rgba(244, 63, 94, 0.4); background: rgba(244, 63, 94, 0.15); color: #f43f5e; cursor: pointer; opacity: ${hostReadyState ? '0.4' : '1'}; pointer-events: ${hostReadyState ? 'none' : 'auto'};">
                                Cancel
                            </button>
                        ` : ''}

                        ${userId === room.joinedUserId ? `
                            <button id="popupReadyBtn" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; background: ${joinerReadyState ? '#10b981' : 'linear-gradient(135deg, #0284c7, #9333ea)'}; color: #fff;">
                                ${joinerReadyState ? 'Unready' : 'Ready'}
                            </button>
                            <button id="popupCancelBtn" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 700; border: 1px solid rgba(244, 63, 94, 0.4); background: rgba(244, 63, 94, 0.15); color: #f43f5e; cursor: pointer; opacity: ${joinerReadyState ? '0.4' : '1'}; pointer-events: ${joinerReadyState ? 'none' : 'auto'};">
                                Cancel
                            </button>
                        ` : ''}
                    </div>
                `;
            }

            if (is1v1) {
                const hostName = room.inGameName || room.teamName || room.userName || 'Unknown Player';
                const hostHero = room.heroName || room.hero || 'Not Specified';
                const hostContact = room.contactPhNo || room.kpayPhNo || 'N/A';

                const joinerName = room.joinerTeamName || room.joinerUserName || 'Joined Player';
                const joinerHero = room.joinerHeroName || room.joinerHero || 'Not Specified';
                const joinerContact = room.joinerContactPhNo || room.joinerKpayPhNo || 'N/A';

                overlay.innerHTML = `
                    <div class="popup-box" style="max-width: 420px; width: 95%;">
                        <div class="popup-title">1VS1 Room Details</div>
                        <div style="display: flex; gap: 8px; width: 100%;">
                            <div style="flex: 1; background: rgba(56, 189, 248, 0.08); padding: 8px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.2);">
                                <div style="font-weight: 700; color: #38bdf8; margin-bottom: 6px; font-size: 12px; text-align: center;">
                                    Host ${hostReadyState ? ' ✅' : ''}
                                </div>
                                <div class="popup-row" style="font-size: 11px;"><span>Name:</span> <b>${hostName}</b></div>
                                <div class="popup-row" style="font-size: 11px;"><span>Hero:</span> <b style="color: #10b981;">${hostHero}</b></div>
                                <div class="popup-row" style="font-size: 11px; border-bottom: none;"><span>Contact:</span> <b>${hostContact}</b></div>
                            </div>

                            ${hasMatched ? `
                            <div style="flex: 1; background: rgba(16, 185, 129, 0.08); padding: 8px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.2);">
                                <div style="font-weight: 700; color: #10b981; margin-bottom: 6px; font-size: 12px; text-align: center;">
                                    Joiner ${joinerReadyState ? ' ✅' : ''}
                                </div>
                                <div class="popup-row" style="font-size: 11px;"><span>Name:</span> <b>${joinerName}</b></div>
                                <div class="popup-row" style="font-size: 11px;"><span>Hero:</span> <b style="color: #10b981;">${joinerHero}</b></div>
                                <div class="popup-row" style="font-size: 11px; border-bottom: none;"><span>Contact:</span> <b>${joinerContact}</b></div>
                            </div>
                            ` : '<div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 11px; background: rgba(255,255,255,0.02); border-radius: 6px;">Waiting...</div>'}

                        </div>
                        ${actionButtonsHTML}
                        <button class="popup-close-btn" id="closePopupBtn" style="margin-top: 12px;">Close</button>
                    </div>
                `;
            } else {
                const hostSqName = room.sqName || room.teamName || 'Host SQ';
                const hostContact = room.contactPhNo || room.kpayPhNo || 'N/A';

                const joinerSqName = room.joinerSqName || room.joinerTeamName || 'Joiner SQ';
                const joinerContact = room.joinerContactPhNo || room.joinerKpayPhNo || 'N/A';

                const formatPlayerName = (p) => {
                    if (!p) return '-';
                    if (typeof p === 'object') return p.name || '-';
                    return p;
                };

                overlay.innerHTML = `
                    <div class="popup-box" style="max-width: 500px; width: 95%;">
                        <div class="popup-title" style="margin-bottom: 4px;">SQ MATCH DETAILS</div>
                        <div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px; text-align: center;">5VS5 Players Comparison</div>
                        
                        <div style="display: flex; gap: 8px; width: 100%; max-height: 65vh; overflow-y: auto;">
                            <div style="flex: 1; background: rgba(56, 189, 248, 0.08); padding: 6px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.2);">
                                <div style="font-weight: 700; color: #38bdf8; margin-bottom: 6px; font-size: 11px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    ${hostSqName} ${hostReadyState ? ' ✅' : ''}
                                </div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>Roamer:</span> <b>${formatPlayerName(room.roamer)}</b></div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>EXP:</span> <b>${formatPlayerName(room.exp)}</b></div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>Gold:</span> <b>${formatPlayerName(room.gold)}</b></div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>Mid:</span> <b>${formatPlayerName(room.mid)}</b></div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>Jungle:</span> <b>${formatPlayerName(room.jungle)}</b></div>
                                <div class="popup-row" style="font-size: 10px; border-bottom: none; border-top: 1px solid rgba(56, 189, 248, 0.3); margin-top: 4px; padding-top: 4px;"><span>Contact:</span> <b style="font-size: 9px;">${hostContact}</b></div>
                            </div>

                            ${hasMatched ? `
                            <div style="flex: 1; background: rgba(16, 185, 129, 0.08); padding: 6px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.2);">
                                <div style="font-weight: 700; color: #10b981; margin-bottom: 6px; font-size: 11px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    ${joinerSqName} ${joinerReadyState ? ' ✅' : ''}
                                </div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>Roamer:</span> <b>${formatPlayerName(room.joinerRoamer)}</b></div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>EXP:</span> <b>${formatPlayerName(room.joinerExp)}</b></div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>Gold:</span> <b>${formatPlayerName(room.joinerGold)}</b></div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>Mid:</span> <b>${formatPlayerName(room.joinerMid)}</b></div>
                                <div class="popup-row" style="font-size: 10px; padding: 4px 0;"><span>Jungle:</span> <b>${formatPlayerName(room.joinerJungle)}</b></div>
                                <div class="popup-row" style="font-size: 10px; border-bottom: none; border-top: 1px solid rgba(16, 185, 129, 0.3); margin-top: 4px; padding-top: 4px;"><span>Contact:</span> <b style="font-size: 9px;">${joinerContact}</b></div>
                            </div>
                            ` : `<div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 11px; background: rgba(255,255,255,0.02); border-radius: 6px; text-align: center; padding: 10px;">Waiting for joiner squad...</div>`}

                        </div>

                        ${actionButtonsHTML}
                        <button class="popup-close-btn" id="closePopupBtn" style="margin-top: 10px;">Close</button>
                    </div>
                `;
            }

            overlay.querySelector('#closePopupBtn').addEventListener('click', () => {
                overlay.remove();
            });

            const readyBtn = overlay.querySelector('#popupReadyBtn');
            if (readyBtn) {
                readyBtn.addEventListener('click', () => {
                    if (userId === room.hostId) {
                        hostReadyState = !hostReadyState;
                    } else if (userId === room.joinedUserId) {
                        joinerReadyState = !joinerReadyState;
                    }
                    updatePopupContent();
                });
            }

            const cancelBtn = overlay.querySelector('#popupCancelBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    if (userId === room.joinedUserId) {
                        cancelJoinerAPI(room.id);
                    } else if (userId === room.hostId) {
                        transferHostAPI(room.id);
                    }
                    overlay.remove();
                });
            }
        }

        updatePopupContent();
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
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
                body: JSON.stringify({ userId: userId, roomId: roomId, action: 'cancelRoom' })
            });
            const result = await response.json();
            if (result.success) {
                fetchAndRenderGlobalRooms();
            }
        } catch (err) {
            console.error("Cancel room error:", err);
        }
    }

    // Screen ကို Container ထဲသို့ ပုံဖော်ခြင်းနှင့် အလုပ်စတင်ခြင်း
    container.innerHTML = renderScreenHTML();
    fetchAndRenderGlobalRooms();

    const cancelBtn = container.querySelector('#cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            renderMatchScreen(container, userDocData);
        });
    }

    const newRoomBtn = container.querySelector('#newRoomBtn');
    if (newRoomBtn) {
        newRoomBtn.addEventListener('click', async () => {
            if (!hasKey) return;
            try {
                const response = await fetch('/api/create-room', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: userId, mode: targetMode, keyType: targetKeyType })
                });
                const result = await response.json();
                if (result.success) {
                    deductKey(targetMode, targetKeyType);
                    fetchAndRenderGlobalRooms();
                } else {
                    alert(result.message || 'Room တည်ဆောက်၍ မရပါ။');
                }
            } catch (err) {
                console.error("Create room error:", err);
            }
        });
    }
}