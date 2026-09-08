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
                .vs-badge {
                    font-size: 10px;
                    font-weight: 900;
                    color: #38bdf8;
                    background: rgba(56, 189, 248, 0.15);
                    padding: 3px 6px;
                    border-radius: 6px;
                    border: 1px solid rgba(56, 189, 248, 0.4);
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
                    font-size: 11px;
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
                    max-width: 280px; /* ဘောက်စ်အကျယ်ကို အနည်းငယ် လျှော့ချလိုက်သည် */
                    padding: 20px 16px;
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
                    padding: 8px 10px; /* ဘေးဘောင်နှင့် ကပ်မနေစေရန် padding ပိုပေးထားသည် */
                    margin-bottom: 4px;
                    background: rgba(255, 255, 255, 0.03); /* လိုင်းတစ်ခုချင်းစီကို နောက်ခံပါးပါးလေး ထည့်ပေးထားသည် */
                    border-radius: 6px;
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

            if (data.success && data.rooms && data.rooms.length > 0) {
                roomsContainer.innerHTML = data.rooms.map(room => {
                    const isMyRoom = (room.hostId === userId);
                    if (isMyRoom) {
                        hasMyRoom = true;
                    }

                    return `
                        <div class="ios-room-card" style="max-width: 100%;" data-room-index="${room.id}">
                            <div class="matchup-container">
                                <div class="player-side">
                                    <img src="${room.teamLogo || defaultUserAvatar}" alt="Logo" class="player-avatar" onerror="this.src='FrontLogo.jpg'">
                                    <span class="player-name">${room.teamName || 'Player'}</span>
                                </div>
                                <div class="vs-badge">VS</div>
                                <div class="player-side right">
                                    <div class="right-action-group">
                                        ${isMyRoom 
                                            ? `<button class="card-cancel-btn" data-hostid="${room.hostId}">Cancel</button>` 
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

            roomsContainer.querySelectorAll('.card-cancel-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetHostId = e.target.getAttribute('data-hostid');
                    cancelRoomAPI(targetHostId);
                });
            });

            roomsContainer.querySelectorAll('.card-join-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const hostIdToJoin = e.target.getAttribute('data-hostid');
                    alert(`Room (Host ID: ${hostIdToJoin}) သို့ ချိတ်ဆက်ရန် အသင့်ဖြစ်ပါပြီ။`);
                });
            });

        } catch (err) {
            console.error("Fetch rooms error:", err);
            roomsContainer.innerHTML = `<span style="color: #f43f5e; font-size: 11px;">Rooms များကို ဆွဲထုတ်၍ မရပါ။</span>`;
        }
    }

    function showRoomDetailsPopup(room, mode) {
        let contentHTML = '';
        const is1v1 = mode.toLowerCase().includes('1v1');

        if (is1v1) {
            const name = room.inGameName || room.teamName || 'Unknown Player';
            const hero = room.heroName || 'Not Specified';
            const contact = room.contactPhNo || room.kpayPhNo || 'N/A';

            contentHTML = `
                <div class="popup-box">
                    <div class="popup-title">1VS1 Room Details</div>
                    <div class="popup-row"><span>Name:</span> <b style="color: #38bdf8;">${name}</b></div>
                    <div class="popup-row"><span>Hero Name:</span> <b style="color: #10b981;">${hero}</b></div>
                    <div class="popup-row"><span>Contact:</span> <b>${contact}</b></div>
                    <button class="popup-close-btn" id="closePopupBtn">Close</button>
                </div>
            `;
        } else {
            const sqName = room.sqName || room.teamName || 'Unknown Squad';
            const contact = room.contactPhNo || room.kpayPhNo || 'N/A';

            const formatPlayerName = (p) => {
                if (!p) return '-';
                if (typeof p === 'object') {
                    return p.name || '-';
                }
                return p;
            };

            const roamer = formatPlayerName(room.roamer);
            const exp = formatPlayerName(room.exp);
            const gold = formatPlayerName(room.gold);
            const mid = formatPlayerName(room.mid);
            const jungle = formatPlayerName(room.jungle);

            contentHTML = `
                <div class="popup-box">
                    <div class="popup-title">SQ: ${sqName}</div>
                    <div style="font-size: 11px; color: #94a3b8; margin-bottom: 10px; text-align: center;">5VS5 Players List</div>
                    
                    <div class="popup-row"><span>Roamer:</span> <b style="color: #38bdf8;">${roamer}</b></div>
                    <div class="popup-row"><span>EXP:</span> <b style="color: #38bdf8;">${exp}</b></div>
                    <div class="popup-row"><span>Gold:</span> <b style="color: #38bdf8;">${gold}</b></div>
                    <div class="popup-row"><span>Mid:</span> <b style="color: #38bdf8;">${mid}</b></div>
                    <div class="popup-row"><span>Jungle:</span> <b style="color: #38bdf8;">${jungle}</b></div>
                    
                    <div class="popup-row" style="margin-top: 10px; border-top: 1px solid rgba(56, 189, 248, 0.3); padding-top: 10px; background: transparent;">
                        <span>Contact:</span> <b style="color: #38bdf8;">${contact}</b>
                    </div>
                    
                    <button class="popup-close-btn" id="closePopupBtn">Close</button>
                </div>
            `;
        }

        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML = contentHTML;
        document.body.appendChild(overlay);

        overlay.querySelector('#closePopupBtn').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    async function cancelRoomAPI(targetHostId) {
        try {
            const response = await fetch('/api/create-room', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: targetHostId })
            });
            const result = await response.json();

            if (result.success) {
                fetchAndRenderGlobalRooms();
            } else {
                alert(result.message || 'Room ဖျက်၍ မရပါ။');
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