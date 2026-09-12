export function showRoomDetailsPopup(room, mode, userId, callbacks = {}) {
    const is1v1 = mode.toLowerCase().includes('1v1');
    const hasMatched = !!room.joinedUserId;

    // server မှ ပါလာသော ရလဒ်များဖြင့် အစောပိုင်း အခြေအနေကို အမြဲတမ်း တိုက်ဆိုင်ယူပါ
    let hostReadyState = !!room.hostReady;
    let joinerReadyState = !!room.joinerReady;
    let firstPickResult = room.firstPick || null;

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    let pollInterval = null;
    let isWheelShown = false; 

    function startPollingForReady() {
        if (!room.id) return;
        
        pollInterval = setInterval(async () => {
            if (isWheelShown) return; 

            try {
                const res = await fetch(`/api/create-room?roomId=${room.id}`);
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("API response is not valid JSON:", text);
                    return;
                }

                if (!data.success || !data.room) {
                    clearInterval(pollInterval);
                    overlay.remove();
                    if (callbacks.onCancelled) callbacks.onCancelled();
                    return;
                }

                const updatedRoom = data.room;
                
                // Server မှ ရလာသော room အချက်အလက်အသစ်များကို room object ထဲသို့ အမြဲတမ်း ထည့်သွင်းပေးပါ
                room.hostReady = !!updatedRoom.hostReady;
                room.joinerReady = !!updatedRoom.joinerReady;
                room.joinedUserId = updatedRoom.joinedUserId;
                room.firstPick = updatedRoom.firstPick;

                if (updatedRoom.hostReady !== hostReadyState || 
                    updatedRoom.joinerReady !== joinerReadyState || 
                    updatedRoom.firstPick !== firstPickResult ||
                    updatedRoom.spinStartTime !== room.spinStartTime ||
                    updatedRoom.joinedUserId !== room.joinedUserId) {
                    
                    hostReadyState = room.hostReady;
                    joinerReadyState = room.joinerReady;
                    if (updatedRoom.firstPick) firstPickResult = updatedRoom.firstPick;
                    if (updatedRoom.spinStartTime) room.spinStartTime = updatedRoom.spinStartTime;
                    
                    room.joinerTeamName = updatedRoom.joinerTeamName;
                    room.joinerUserName = updatedRoom.joinerUserName;
                    room.joinerHeroName = updatedRoom.joinerHeroName;
                    room.joinerHero = updatedRoom.joinerHero;
                    room.joinerContactPhNo = updatedRoom.joinerContactPhNo;
                    room.joinerKpayPhNo = updatedRoom.joinerKpayPhNo;
                    room.joinerSqName = updatedRoom.joinerSqName;
                    room.joinerRoamer = updatedRoom.joinerRoamer;
                    room.joinerExp = updatedRoom.joinerExp;
                    room.joinerGold = updatedRoom.joinerGold;
                    room.joinerMid = updatedRoom.joinerMid;
                    room.joinerJungle = updatedRoom.joinerJungle;

                    updatePopupContent();
                }

                if (room.hostReady && room.joinerReady) {
                    isWheelShown = true;
                    clearInterval(pollInterval);
                    
                    if (userId === room.hostId && !room.isSpinningTriggered) {
                        room.isSpinningTriggered = true;
                        const spinStartTime = Date.now() + 3000;
                        fetch('/api/create-room', { 
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ roomId: room.id, userId: userId, spinStartTime: spinStartTime })
                        }).catch(err => console.error("Failed to set spin start time", err));
                        room.spinStartTime = spinStartTime;
                    }

                    overlay.remove();
                    showSpinWheelPopup(room, mode, userId, callbacks);
                }
            } catch (error) {
                console.error("Polling check error:", error);
            }
        }, 500); 
    }

    function updatePopupContent() {
        const currentHasMatched = !!room.joinedUserId;
        const bothReady = hostReadyState && joinerReadyState;
        let actionButtonsHTML = '';

        if (currentHasMatched) {
            actionButtonsHTML = `
                <div style="display: flex; gap: 10px; margin-top: 14px; pointer-events: ${bothReady ? 'none' : 'auto'}; opacity: ${bothReady ? '0.6' : '1'};">
                    ${userId === room.hostId ? `
                        <button id="popupReadyBtn" style="flex: 1; padding: 12px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; background: ${hostReadyState ? '#34c759' : 'linear-gradient(135deg, #007aff, #5856d6)'}; color: #fff; font-size: 15px; box-shadow: 0 4px 12px rgba(0,122,255,0.3); transition: all 0.2s;">
                            ${hostReadyState ? 'Unready' : 'Ready'}
                        </button>
                        <button id="popupCancelBtn" style="flex: 1; padding: 12px; border-radius: 12px; font-weight: 700; border: none; background: rgba(255, 59, 48, 0.15); color: #ff3b30; cursor: pointer; opacity: ${hostReadyState ? '0.4' : '1'}; pointer-events: ${hostReadyState ? 'none' : 'auto'}; font-size: 15px;">
                            Cancel
                        </button>
                    ` : ''}

                    ${userId === room.joinedUserId ? `
                        <button id="popupReadyBtn" style="flex: 1; padding: 12px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; background: ${joinerReadyState ? '#34c759' : 'linear-gradient(135deg, #007aff, #5856d6)'}; color: #fff; font-size: 15px; box-shadow: 0 4px 12px rgba(0,122,255,0.3); transition: all 0.2s;">
                            ${joinerReadyState ? 'Unready' : 'Ready'}
                        </button>
                        <button id="popupCancelBtn" style="flex: 1; padding: 12px; border-radius: 12px; font-weight: 700; border: none; background: rgba(255, 59, 48, 0.15); color: #ff3b30; cursor: pointer; opacity: ${joinerReadyState ? '0.4' : '1'}; pointer-events: ${joinerReadyState ? 'none' : 'auto'}; font-size: 15px;">
                            Cancel
                        </button>
                    ` : ''}
                </div>
            `;
        }

        if (is1v1) {
            const hostName = room.inGameName || room.teamName || room.userName || 'Unknown Player';
            const hostHero = room.heroName || room.hero || 'Not Specified';
            const hostContact = currentHasMatched ? (room.contactPhNo || room.kpayPhNo || 'N/A') : 'Hidden';
            
            const joinerName = room.joinerTeamName || room.joinerUserName || 'Joined Player';
            const joinerHero = room.joinerHeroName || room.joinerHero || 'Not Specified';
            const joinerContact = currentHasMatched ? (room.joinerContactPhNo || room.joinerKpayPhNo || 'N/A') : '';

            overlay.innerHTML = `
                <div class="popup-box" style="max-width: 420px; width: 95%; position: relative; overflow: hidden; background: #1c1c1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); color: #fff; padding: 20px;">
                    <div class="popup-title" style="font-size: 17px; font-weight: 700; text-align: center; margin-bottom: 16px; letter-spacing: -0.5px;">1VS1 Room Details</div>
                    <div style="display: flex; gap: 10px; width: 100%;">
                        <div style="flex: 1; background: rgba(0, 122, 255, 0.08); padding: 12px; border-radius: 14px; border: 1px solid rgba(0, 122, 255, 0.2);">
                            <div style="font-weight: 700; color: #0a84ff; margin-bottom: 8px; font-size: 13px; text-align: center;">Host ${hostReadyState ? ' ✅' : ''}</div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Name:</span> <b>${hostName}</b></div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Hero:</span> <b style="color: #34c759;">${hostHero}</b></div>
                            <div class="popup-row" style="font-size: 12px; border-bottom: none;"><span>Contact:</span> <b>${hostContact}</b></div>
                        </div>

                        ${currentHasMatched ? `
                        <div style="flex: 1; background: rgba(52, 199, 89, 0.08); padding: 12px; border-radius: 14px; border: 1px solid rgba(52, 199, 89, 0.2);">
                            <div style="font-weight: 700; color: #34c759; margin-bottom: 8px; font-size: 13px; text-align: center;">Joiner ${joinerReadyState ? ' ✅' : ''}</div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Name:</span> <b>${joinerName}</b></div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Hero:</span> <b style="color: #34c759;">${joinerHero}</b></div>
                            <div class="popup-row" style="font-size: 12px; border-bottom: none;"><span>Contact:</span> <b>${joinerContact}</b></div>
                        </div>
                        ` : '<div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #8e8e93; font-size: 12px; background: rgba(255,255,255,0.03); border-radius: 14px;">Waiting...</div>'}
                    </div>
                    ${actionButtonsHTML}
                    <button class="popup-close-btn" id="closePopupBtn" style="margin-top: 12px; width: 100%; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.08); border: none; color: #fff; font-weight: 600; cursor: pointer;">Close</button>
                </div>
            `;
        } else {
            const hostSqName = room.sqName || room.teamName || 'Host SQ';
            const hostContact = currentHasMatched ? (room.contactPhNo || room.kpayPhNo || 'N/A') : 'Hidden';
            const joinerSqName = room.joinerSqName || room.joinerTeamName || 'Joiner SQ';
            const joinerContact = currentHasMatched ? (room.joinerContactPhNo || room.joinerKpayPhNo || 'N/A') : '';

            const formatPlayerName = (p) => {
                if (!p) return '-';
                if (typeof p === 'object') return p.name || '-';
                return p;
            };

            overlay.innerHTML = `
                <div class="popup-box" style="max-width: 500px; width: 95%; position: relative; overflow: hidden; background: #1c1c1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); color: #fff; padding: 20px;">
                    <div class="popup-title" style="font-size: 17px; font-weight: 700; text-align: center; margin-bottom: 4px; letter-spacing: -0.5px;">5VS5 MATCH DETAILS</div>
                    <div style="font-size: 11px; color: #8e8e93; margin-bottom: 14px; text-align: center;">Players Comparison</div>
                    
                    <div style="display: flex; gap: 10px; width: 100%; max-height: 50vh; overflow-y: auto;">
                        <div style="flex: 1; background: rgba(0, 122, 255, 0.08); padding: 10px; border-radius: 14px; border: 1px solid rgba(0, 122, 255, 0.2);">
                            <div style="font-weight: 700; color: #0a84ff; margin-bottom: 8px; font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${hostSqName} ${hostReadyState ? ' ✅' : ''}</div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Roamer:</span> <b>${formatPlayerName(room.roamer)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>EXP:</span> <b>${formatPlayerName(room.exp)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Gold:</span> <b>${formatPlayerName(room.gold)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Mid:</span> <b>${formatPlayerName(room.mid)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Jungle:</span> <b>${formatPlayerName(room.jungle)}</b></div>
                            <div class="popup-row" style="font-size: 11px; border-bottom: none; border-top: 1px solid rgba(0, 122, 255, 0.3); margin-top: 6px; padding-top: 6px;"><span>Contact:</span> <b style="font-size: 10px;">${hostContact}</b></div>
                        </div>

                        ${currentHasMatched ? `
                        <div style="flex: 1; background: rgba(52, 199, 89, 0.08); padding: 10px; border-radius: 14px; border: 1px solid rgba(52, 199, 89, 0.2);">
                            <div style="font-weight: 700; color: #34c759; margin-bottom: 8px; font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${joinerSqName} ${joinerReadyState ? ' ✅' : ''}</div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Roamer:</span> <b>${formatPlayerName(room.joinerRoamer)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>EXP:</span> <b>${formatPlayerName(room.joinerExp)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Gold:</span> <b>${formatPlayerName(room.joinerGold)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Mid:</span> <b>${formatPlayerName(room.joinerMid)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Jungle:</span> <b>${formatPlayerName(room.joinerJungle)}</b></div>
                            <div class="popup-row" style="font-size: 11px; border-bottom: none; border-top: 1px solid rgba(52, 199, 89, 0.3); margin-top: 6px; padding-top: 6px;"><span>Contact:</span> <b style="font-size: 10px;">${joinerContact}</b></div>
                        </div>
                        ` : `<div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #8e8e93; font-size: 12px; background: rgba(255,255,255,0.03); border-radius: 14px; text-align: center; padding: 10px;">Waiting for joiner squad...</div>`}
                    </div>

                    ${actionButtonsHTML}
                    <button class="popup-close-btn" id="closePopupBtn" style="margin-top: 12px; width: 100%; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.08); border: none; color: #fff; font-weight: 600; cursor: pointer;">Close</button>
                </div>
            `;
        }

        const closeBtn = overlay.querySelector('#closePopupBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (pollInterval) clearInterval(pollInterval);
                overlay.remove();
            });
        }

        const readyBtn = overlay.querySelector('#popupReadyBtn');
        if (readyBtn) {
            readyBtn.addEventListener('click', async () => {
                if (bothReady) return;

                if (userId === room.hostId) {
                    hostReadyState = !hostReadyState;
                    room.hostReady = hostReadyState;
                } else if (userId === room.joinedUserId) {
                    joinerReadyState = !joinerReadyState;
                    room.joinerReady = joinerReadyState;
                }
                
                updatePopupContent();

                try {
                    await fetch('/api/create-room', { 
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            roomId: room.id,
                            userId: userId,
                            hostReady: userId === room.hostId ? hostReadyState : undefined,
                            joinerReady: userId === room.joinedUserId ? joinerReadyState : undefined
                        })
                    });
                } catch (err) {
                    console.error("Failed to update ready state", err);
                }
            });
        }

        const cancelBtn = overlay.querySelector('#popupCancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (bothReady) return;
                if (pollInterval) clearInterval(pollInterval);
                if (userId === room.joinedUserId) {
                    if (callbacks.onCancelJoiner) callbacks.onCancelJoiner(room.id);
                } else if (userId === room.hostId) {
                    if (callbacks.onTransferHost) callbacks.onTransferHost(room.id);
                }
                overlay.remove();
            });
        }
    }

    updatePopupContent();
    document.body.appendChild(overlay);
    startPollingForReady();

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            if (pollInterval) clearInterval(pollInterval);
            overlay.remove();
        }
    });
}