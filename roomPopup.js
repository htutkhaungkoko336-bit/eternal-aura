export function showRoomDetailsPopup(room, mode, userId, callbacks = {}) {
    const is1v1 = mode.toLowerCase().includes('1v1');
    const hasMatched = !!room.joinedUserId;

    let hostReadyState = room.hostReady || false;
    let joinerReadyState = room.joinerReady || false;
    let firstPickResult = room.firstPick || null;

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    let pollInterval = null;
    let isWheelShown = false; // Spin wheel popup ထွက်လာပြီးပြီလားဆိုတာကို ထိန်းချုပ်ဖို့

    function startPollingForReady() {
        if (!room.id) return;
        
        pollInterval = setInterval(async () => {
            if (isWheelShown) return; // Wheel ပေါ်နေပြီဆိုရင် polling ထပ်မခေါ်တော့ပါ

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
                
                if (updatedRoom.hostReady !== hostReadyState || 
                    updatedRoom.joinerReady !== joinerReadyState || 
                    updatedRoom.firstPick !== firstPickResult ||
                    updatedRoom.spinStartTime !== room.spinStartTime) {
                    
                    hostReadyState = !!updatedRoom.hostReady;
                    joinerReadyState = !!updatedRoom.joinerReady;
                    if (updatedRoom.firstPick) firstPickResult = updatedRoom.firstPick;
                    if (updatedRoom.spinStartTime) room.spinStartTime = updatedRoom.spinStartTime;
                    
                    updatePopupContent();
                }

                // နှစ်ဖက်စလုံး Ready ဖြစ်သွားပြီဆိုရင် သီးသန့် Spin Wheel Pop-up ကို ခေါ်ပါမည်
                if (updatedRoom.hostReady && updatedRoom.joinerReady) {
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

                    // Room details popup အဟောင်းကို ဖယ်ရှားပြီး Spin Wheel popup သပ်သပ်ကို ဖွင့်ပါမည်
                    overlay.remove();
                    showSpinWheelPopup(room, mode, userId, callbacks);
                }
            } catch (error) {
                console.error("Polling check error:", error);
            }
        }, 500); 
    }

    function updatePopupContent() {
        const bothReady = hostReadyState && joinerReadyState;
        let actionButtonsHTML = '';

        if (hasMatched) {
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
            const hostContact = room.contactPhNo || room.kpayPhNo || 'N/A';
            const joinerName = room.joinerTeamName || room.joinerUserName || 'Joined Player';
            const joinerHero = room.joinerHeroName || room.joinerHero || 'Not Specified';
            const joinerContact = room.joinerContactPhNo || room.joinerKpayPhNo || 'N/A';

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

                        ${hasMatched ? `
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
            const hostContact = room.contactPhNo || room.kpayPhNo || 'N/A';
            const joinerSqName = room.joinerSqName || room.joinerTeamName || 'Joiner SQ';
            const joinerContact = room.joinerContactPhNo || room.joinerKpayPhNo || 'N/A';

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

                        ${hasMatched ? `
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
                } else if (userId === room.joinedUserId) {
                    joinerReadyState = !joinerReadyState;
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

// သီးသန့်ခွဲထုတ်ထားသော Spin Wheel Pop-up ဖန်တီးသည့် Function
function showSpinWheelPopup(room, mode, userId, callbacks) {
    const is1v1 = mode.toLowerCase().includes('1v1');
    const team1Name = is1v1 ? (room.inGameName || room.teamName || room.userName || 'Host') : (room.sqName || room.teamName || 'Host SQ');
    const team2Name = is1v1 ? (room.joinerTeamName || room.joinerUserName || 'Joiner') : (room.joinerSqName || room.joinerTeamName || 'Joiner SQ');

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        @keyframes pulseShake {
            0% { transform: scale(1); }
            25% { transform: scale(1.1) rotate(-3deg); }
            50% { transform: scale(1.15) rotate(3deg); }
            75% { transform: scale(1.1) rotate(-2deg); }
            100% { transform: scale(1); }
        }
        .shake-num {
            display: inline-block;
            animation: pulseShake 0.6s infinite ease-in-out;
            color: #ff3b30;
            text-shadow: 0 0 15px rgba(255,59,48,0.6);
        }
    `;
    document.head.appendChild(styleTag);

    overlay.innerHTML = `
        <div class="popup-box" style="max-width: 420px; width: 95%; background: rgba(20, 20, 25, 0.98); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); color: #fff; padding: 24px; text-align: center; position: relative;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #8e8e93; margin-bottom: 6px;">⚡ Destiny Battle Draw ⚡</div>
            <div style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 16px;" id="spinStatusText">
                🔥 Fate is choosing... <span id="countdownNum" class="shake-num">3</span>
            </div>

            <div style="position: relative; width: 190px; height: 190px; margin: 10px auto; border-radius: 50%; box-shadow: 0 0 40px rgba(0,122,255,0.3), inset 0 0 20px rgba(255,255,255,0.2); border: 4px solid rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center;">
                
                <!-- အပေါ်အောက် အတိအကျဖြစ်စေရန် အစိမ်းက အပေါ် (0-180deg)၊ အပြာက အောက် (180-360deg) သတ်မှတ်ထားသည် -->
                <div id="wheelElement" style="position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(#34c759 0deg 180deg, #007aff 180deg 360deg); transition: transform 10s cubic-bezier(0.05, 0.9, 0.1, 1);"></div>

                <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 16px solid #ff3b30; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); z-index: 10;"></div>
                
                <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 5;">
                    <div style="width: 12px; height: 12px; background: #1c1c1e; border-radius: 50%;"></div>
                </div>
            </div>

            <!-- အရောင်အကွက်များ -->
            <div style="display: flex; justify-content: space-around; margin-top: 18px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; background: #34c759; border-radius: 4px; box-shadow: 0 0 8px rgba(52,199,89,0.5);"></div>
                    <span style="font-size: 13px; font-weight: 700; color: #fff; max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${team1Name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; background: #007aff; border-radius: 4px; box-shadow: 0 0 8px rgba(0,122,255,0.5);"></div>
                    <span style="font-size: 13px; font-weight: 700; color: #fff; max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${team2Name}</span>
                </div>
            </div>

            <div style="font-size: 13px; color: #aeaeb2; margin-top: 14px;" id="spinSubText">
                May the best legend claim the first strike! ⚡
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const wheelEl = overlay.querySelector('#wheelElement');
    const statusText = overlay.querySelector('#spinStatusText');
    const subText = overlay.querySelector('#spinSubText');
    const numEl = overlay.querySelector('#countdownNum');

    const startTime = room.spinStartTime || (Date.now() + 3000);

    const countdownInterval = setInterval(() => {
        const now = Date.now();
        const timeLeft = startTime - now;

        if (timeLeft > 0) {
            const secs = Math.ceil(timeLeft / 1000);
            if (numEl) numEl.textContent = secs;
        } else {
            clearInterval(countdownInterval);
            if (numEl) {
                numEl.textContent = "GO!";
                numEl.className = ""; 
                numEl.style.color = "#34c759";
                numEl.style.textShadow = "0 0 20px rgba(52,199,89,0.8)";
            }

            if (statusText) statusText.innerHTML = `⚡ Spinning the wheel of destiny...`;

            let chosenWinner = room.firstPick;

            if (userId === room.hostId && !chosenWinner) {
                const teams = [team1Name, team2Name];
                chosenWinner = teams[Math.floor(Math.random() * teams.length)];
                
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

            if (userId === room.joinedUserId && !chosenWinner) {
                const checkWinnerInterval = setInterval(async () => {
                    try {
                        const res = await fetch(`/api/create-room?roomId=${room.id}`);
                        const data = await res.json();
                        if (data.success && data.room && data.room.firstPick) {
                            clearInterval(checkWinnerInterval);
                            executeSpin(data.room.firstPick);
                        }
                    } catch (e) {
                        console.error("Error fetching winner:", e);
                    }
                }, 500);
                return;
            }

            if (chosenWinner) {
                executeSpin(chosenWinner);
            }
        }
    }, 200);

    function executeSpin(winner) {
        // အစိမ်း (Team 1) ကျရင် အပေါ်မှာ တည့်တည့်ရပ်မယ် (0 ဒီဂရီ - အကြိမ်ကြိမ်လှည့်)၊ 
        // အပြာ (Team 2) ကျရင် အောက်ကဟာ အပေါ်ကိုရောက်လာအောင် 180 ဒီဂရီ ထပ်ပေါင်းလှည့်ပေးမယ်။
        const baseRotations = 360 * 10;
        const targetDegree = winner === team1Name ? baseRotations : baseRotations + 180;

        if (wheelEl) {
            wheelEl.style.transform = `rotate(${targetDegree}deg)`;
        }

        setTimeout(() => {
            if (statusText) {
                statusText.innerHTML = `🏆 First Pick Winner: <span style="color: #34c759; text-shadow: 0 0 20px rgba(52,199,89,0.4);">${winner}</span>`;
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
            }, 2500);

        }, 10000);
    }
}