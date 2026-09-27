export function showRoomDetailsPopup(room, mode, userId, callbacks = {}) {
    const is1v1 = mode.toLowerCase().includes('1v1');
    const hasMatched = !!room.joinedUserId;

    const isParticipant = (userId === room.hostId) || (userId === room.joinedUserId);

    if (hasMatched && !isParticipant) {
        console.warn("Access denied: Only the host and joiner can view this matched room details.");
        return; 
    }

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
                
                room.hostReady = !!updatedRoom.hostReady;
                room.joinerReady = !!updatedRoom.joinerReady;
                room.joinedUserId = updatedRoom.joinedUserId;
                room.firstPick = updatedRoom.firstPick;

                const currentIsParticipant = (userId === room.hostId) || (userId === room.joinedUserId);
                if (!!room.joinedUserId && !currentIsParticipant) {
                    clearInterval(pollInterval);
                    overlay.remove();
                    return;
                }

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
            
            const hostContactHTML = currentHasMatched ? `<div class="popup-row" style="font-size: 12px; border-bottom: none;"><span>Contact:</span> <b>${room.contactPhNo || room.kpayPhNo || 'N/A'}</b></div>` : '';
            
            const joinerName = room.joinerTeamName || room.joinerUserName || 'Joined Player';
            const joinerHero = room.joinerHeroName || room.joinerHero || 'Not Specified';
            const joinerContactHTML = currentHasMatched ? `<div class="popup-row" style="font-size: 12px; border-bottom: none;"><span>Contact:</span> <b>${room.joinerContactPhNo || room.joinerKpayPhNo || 'N/A'}</b></div>` : '';

            overlay.innerHTML = `
                <div class="popup-box" style="max-width: 420px; width: 95%; position: relative; overflow: hidden; background: #1c1c1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); color: #fff; padding: 20px;">
                    <div class="popup-title" style="font-size: 17px; font-weight: 700; text-align: center; margin-bottom: 16px; letter-spacing: -0.5px;">1VS1 Room Details</div>
                    <div style="display: flex; gap: 10px; width: 100%;">
                        <div style="flex: 1; background: rgba(0, 122, 255, 0.08); padding: 12px; border-radius: 14px; border: 1px solid rgba(0, 122, 255, 0.2);">
                            <div style="font-weight: 700; color: #0a84ff; margin-bottom: 8px; font-size: 13px; text-align: center;">Host ${hostReadyState ? ' ✅' : ''}</div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Name:</span> <b>${hostName}</b></div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Hero:</span> <b style="color: #34c759;">${hostHero}</b></div>
                            ${hostContactHTML}
                        </div>

                        ${currentHasMatched ? `
                        <div style="flex: 1; background: rgba(52, 199, 89, 0.08); padding: 12px; border-radius: 14px; border: 1px solid rgba(52, 199, 89, 0.2);">
                            <div style="font-weight: 700; color: #34c759; margin-bottom: 8px; font-size: 13px; text-align: center;">Joiner ${joinerReadyState ? ' ✅' : ''}</div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Name:</span> <b>${joinerName}</b></div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Hero:</span> <b style="color: #34c759;">${joinerHero}</b></div>
                            ${joinerContactHTML}
                        </div>
                        ` : '<div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #8e8e93; font-size: 12px; background: rgba(255,255,255,0.03); border-radius: 14px;">Waiting...</div>'}
                    </div>
                    ${actionButtonsHTML}
                    <button class="popup-close-btn" id="closePopupBtn" style="margin-top: 12px; width: 100%; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.08); border: none; color: #fff; font-weight: 600; cursor: pointer;">Close</button>
                </div>
            `;
        } else {
            const hostSqName = room.sqName || room.teamName || 'Host SQ';
            
            const hostContactHTML = currentHasMatched ? `<div class="popup-row" style="font-size: 11px; border-bottom: none; border-top: 1px solid rgba(0, 122, 255, 0.3); margin-top: 6px; padding-top: 6px;"><span>Contact:</span> <b style="font-size: 10px;">${room.contactPhNo || room.kpayPhNo || 'N/A'}</b></div>` : '';
            
            const joinerSqName = room.joinerSqName || room.joinerTeamName || 'Joiner SQ';
            const joinerContactHTML = currentHasMatched ? `<div class="popup-row" style="font-size: 11px; border-bottom: none; border-top: 1px solid rgba(52, 199, 89, 0.3); margin-top: 6px; padding-top: 6px;"><span>Contact:</span> <b style="font-size: 10px;">${room.joinerContactPhNo || room.joinerKpayPhNo || 'N/A'}</b></div>` : '';

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
                            ${hostContactHTML}
                        </div>

                        ${currentHasMatched ? `
                        <div style="flex: 1; background: rgba(52, 199, 89, 0.08); padding: 10px; border-radius: 14px; border: 1px solid rgba(52, 199, 89, 0.2);">
                            <div style="font-weight: 700; color: #34c759; margin-bottom: 8px; font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${joinerSqName} ${joinerReadyState ? ' ✅' : ''}</div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Roamer:</span> <b>${formatPlayerName(room.joinerRoamer)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>EXP:</span> <b>${formatPlayerName(room.joinerExp)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Gold:</span> <b>${formatPlayerName(room.joinerGold)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Mid:</span> <b>${formatPlayerName(room.joinerMid)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Jungle:</span> <b>${formatPlayerName(room.joinerJungle)}</b></div>
                            ${joinerContactHTML}
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

export function showSpinWheelPopup(room, mode, userId, callbacks) {
    const is1v1 = mode.toLowerCase().includes('1v1');
    const team1Name = is1v1 ? (room.inGameName || room.teamName || room.userName || 'Host') : (room.sqName || room.teamName || 'Host SQ');
    const team2Name = is1v1 ? (room.joinerTeamName || room.joinerUserName || 'Joiner') : (room.joinerSqName || room.joinerTeamName || 'Joiner SQ');

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        .reel-item {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 900;
        }
    `;
    document.head.appendChild(styleTag);

    // ၁၀ စက္ကန့်စာ မရပ်မနား တဆက်တည်း လည်ပတ်နိုင်ရန် အကွက်များကို လုံလောက်စွာ ထည့်သွင်းထားသည်
    overlay.innerHTML = `
        <div class="popup-box" style="max-width: 420px; width: 95%; background: rgba(20, 20, 25, 0.98); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); color: #fff; padding: 24px; text-align: center; position: relative;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #8e8e93; margin-bottom: 6px;">⚡ First Pick Slot Draw ⚡</div>
            <div style="font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 16px;" id="spinStatusText">
                🎲 Spinning the Slot Wheel...
            </div>

            <!-- Continuous Slot Roller Box -->
            <div style="position: relative; width: 100%; height: 60px; margin: 15px auto; background: rgba(0,0,0,0.6); border-radius: 14px; border: 2px solid rgba(255,255,255,0.15); overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 25%, transparent 75%, rgba(0,0,0,0.7)); z-index: 2; pointer-events: none;"></div>
                <div id="wheelReel" style="position: absolute; top: 0; width: 100%; transform: translateY(0);">
                    <!-- 10 စက္ကန့်စာ တဆက်တည်း အမြန်လည်ရန် အစဉ်လိုက် ထပ်ခါထပ်ခါ ထည့်ထားသော စာရင်းများ -->
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                    <div class="reel-item" style="color: #34c759;">${team1Name}</div>
                    <div class="reel-item" style="color: #007aff;">${team2Name}</div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-around; margin-top: 18px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 14px; height: 14px; background: #34c759; border-radius: 4px;"></div>
                    <span style="font-size: 12px; font-weight: 700; color: #fff; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${team1Name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 14px; height: 14px; background: #007aff; border-radius: 4px;"></div>
                    <span style="font-size: 12px; font-weight: 700; color: #fff; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${team2Name}</span>
                </div>
            </div>

            <div style="font-size: 13px; color: #aeaeb2; margin-top: 14px;" id="spinSubText">
                May the best legend claim the first strike! ⚡
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const wheelReel = overlay.querySelector('#wheelReel');
    const statusText = overlay.querySelector('#spinStatusText');
    const subText = overlay.querySelector('#spinSubText');

    // 1. Host က Winner မရှိသေးရင် အသစ် Random ဆုံးဖြတ်ပြီး Database ထဲ အရင်သိမ်းမည်
    if (userId === room.hostId && !room.firstPick) {
        const teams = [team1Name, team2Name];
        const chosenWinner = teams[Math.floor(Math.random() * teams.length)];
        
        fetch('/api/create-room', { 
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomId: room.id,
                userId: userId,
                firstPick: chosenWinner
            })
        }).catch(err => console.error("Failed to save final winner", err));
    }

    // 2. Host ရော Joiner ပါ Database ထဲက firstPick တန်ဖိုး တူညီစွာ ရလာသည်အထိ စောင့်ဆိုင်းမည်
    const checkWinnerInterval = setInterval(async () => {
        try {
            const res = await fetch(`/api/create-room?roomId=${room.id}`);
            const data = await res.json();
            if (data.success && data.room && data.room.firstPick) {
                clearInterval(checkWinnerInterval);
                startSlotSpin(data.room.firstPick);
            }
        } catch (e) {
            console.error("Error fetching winner:", e);
        }
    }, 500);

    function startSlotSpin(winner) {
        const itemHeight = 60;
        // ၁၀ စက္ကန့်စာ အရှည်လည်ပတ်ရန်အတွက် အောက်ဘက်အကျဆုံး တည်နေရာရှိ အညွှန်းကိန်းကို သတ်မှတ်ခြင်း (Team 1 သို့မဟုတ် Team 2 ပေါ်မူတည်၍ တူညီစွာရပ်မည်)
        const targetIndex = winner === team1Name ? 18 : 19;
        const targetPixel = targetIndex * itemHeight;

        if (statusText) {
            statusText.innerHTML = `🎲 Spinning the Slot Wheel...`;
        }

        // ပေါက်ကွဲအားကောင်းပြီး အစအဆုံး တဆက်တည်း ၁၀ စက္ကန့်တိတိ လည်ပတ်ကာ ရပ်ခါနီးမှ ဖြည်းဖြည်းချင်း အရှိန်သေသွားမည့် ညီညာသော Cubic-bezier ပုံစံ
        wheelReel.style.transition = 'transform 10s cubic-bezier(0.1, 0.9, 0.2, 1.0)';
        wheelReel.style.transform = `translateY(-${targetPixel}px)`;

        setTimeout(() => {
            if (statusText) {
                statusText.innerHTML = `🏆 First Pick Winner: <span style="color: #34c759; text-shadow: 0 0 15px rgba(52,199,89,0.5);">${winner}</span>`;
            }
            if (subText) {
                subText.textContent = 'Entering the battlefield arena... 🚀';
            }

            setTimeout(() => {
                styleTag.remove();
                overlay.remove();
                
                if (callbacks.onBothReady) {
                    callbacks.onBothReady({ ...room, firstPick: winner });
                }
            }, 2000);
        }, 10000);
    }
}
export function showRewardCodePopup(room, mode, userId, callbacks = {}) {
    const is1v1 = mode.toLowerCase().includes('1v1');
    const isHost = userId === room.hostId;

    const targetTeamName = isHost ? (room.joinerSqName || room.joinerTeamName || room.joinerUserName || 'Joiner Team') : (room.sqName || room.teamName || room.inGameName || room.userName || 'Host Team');
    const targetContact = isHost ? (room.joinerContactPhNo || room.joinerKpayPhNo || 'N/A') : (room.contactPhNo || room.kpayPhNo || 'N/A');
    const firstPickTeam = room.firstPickTeam || room.firstPick || 'Not Specified';

    const getPlayerNames = (r, forHostData) => {
        if (is1v1) {
            // 1VS1 အတွက် Name နဲ့ User ID အစား gameId ကို တိုက်ရိုက်ဖမ်းယူခြင်း
            const name = forHostData 
                ? (r.joinerInGameName || r.joinerTeamName || r.joinerUserName || r.joinerHeroName || r.joinerName || 'Joiner Player') 
                : (r.inGameName || r.teamName || r.userName || r.heroName || 'Host Player');
            
            const id = forHostData 
                ? (r.joinerGameId || r.gameId || '-') 
                : (r.gameId || '-');

            return `<div style="font-size: 11px; padding: 3px 0; color: #ccc;">• <span style="color: #8e8e93;">Player:</span> <b>${name}</b> <span style="color: #0a84ff; font-size: 10px;">(Game ID: ${id})</span></div>`;
        }
        
        const roles = ['roamer', 'exp', 'gold', 'mid', 'jungle'];
        let listHTML = '';
        roles.forEach(role => {
            const player = forHostData ? r[role] : r['joiner' + role.charAt(0).toUpperCase() + role.slice(1)];
            let pName = '-';
            let pId = '-';

            if (player) {
                if (typeof player === 'object') {
                    pName = player.name || '-';
                    pId = player.id || '-';
                } else {
                    pName = player;
                }
            }

            // 🔥 Roamer ဖြစ်မှသာ ID ကို ပြသမည်၊ ကျန်တဲ့ role တွေက နာမည်သက်သက်ပဲ ပြပါမည်
            if (role === 'roamer') {
                listHTML += `<div style="font-size: 11px; padding: 3px 0; color: #ccc;">• <span style="text-transform: capitalize; color: #8e8e93;">${role}:</span> <b>${pName}</b> <span style="color: #0a84ff; font-size: 10px;">(ID: ${pId})</span></div>`;
            } else {
                listHTML += `<div style="font-size: 11px; padding: 3px 0; color: #ccc;">• <span style="text-transform: capitalize; color: #8e8e93;">${role}:</span> <b>${pName}</b></div>`;
            }
        });
        return listHTML;
    };

    const playersListHTML = getPlayerNames(room, !isHost);
    let initialMatchCode = room.matchCode || 'Pending...';

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    overlay.innerHTML = `
        <div class="popup-box" style="max-width: 420px; width: 95%; background: #1c1c1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); color: #fff; padding: 20px; text-align: center; position: relative;">
            <div style="font-size: 16px; font-weight: 700; margin-bottom: 4px; color: #34c759;">🎉 Match Successful!</div>
            <div style="font-size: 12px; color: #8e8e93; margin-bottom: 16px;">အချင်းချင်း ဆက်သွယ်ရန်contact ချိတ်ပါ။အနိုင်ရသည့် Team သည် code ဖြင့် Reward ထုတ်ယူပါ။</div>

            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 12px; text-align: left; margin-bottom: 14px;">
                <div style="font-size: 13px; font-weight: 700; color: #0a84ff; margin-bottom: 6px;">Team: ${targetTeamName}</div>
                <div style="font-size: 12px; margin-bottom: 6px;">Contact Ph: <b style="color: #ff3b30;">${targetContact}</b></div>
                <div style="font-size: 12px; margin-bottom: 8px; color: #ff9f0a;">First Pick Team: <b>${firstPickTeam}</b></div>
                
                <div style="font-size: 12px; font-weight: 600; color: #fff; margin-bottom: 4px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">Players Names:</div>
                <div style="max-height: 140px; overflow-y: auto;">
                    ${playersListHTML}
                </div>
            </div>

            <div style="background: linear-gradient(135deg, rgba(0,122,255,0.15), rgba(88,86,214,0.15)); border: 1px solid rgba(0,122,255,0.3); border-radius: 14px; padding: 14px; margin-bottom: 16px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8e8e93; margin-bottom: 4px;">Your Reward Code</div>
                <div id="displayMatchCode" style="font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 2px;">${initialMatchCode}</div>
            </div>

            <button id="closeRewardPopup" style="width: 100%; padding: 12px; border-radius: 12px; background: #007aff; border: none; color: #fff; font-weight: 600; cursor: pointer; font-size: 14px;">Done / Close</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const targetRoomId = room.id || room.hostId;
    const intervalId = setInterval(async () => {
        if (!document.body.contains(overlay)) {
            clearInterval(intervalId);
            return;
        }

        try {
            const res = await fetch(`/api/create-room?roomId=${targetRoomId}`);
            if (res.ok) {
                const data = await res.json();
                const roomData = data.room || data; 
                
                if (data.success && roomData && roomData.matchCode) {
                    clearInterval(intervalId);
                    const codeElement = overlay.querySelector('#displayMatchCode');
                    if (codeElement) {
                        codeElement.textContent = roomData.matchCode;
                    }
                }
            }
        } catch (err) {}
    }, 2000);

    const closeBtn = overlay.querySelector('#closeRewardPopup');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearInterval(intervalId);
            overlay.remove();
            if (callbacks.onComplete) callbacks.onComplete(room);
        });
    }
}