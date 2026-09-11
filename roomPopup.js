export function showRoomDetailsPopup(room, mode, userId, callbacks = {}) {
    const is1v1 = mode.toLowerCase().includes('1v1');
    const hasMatched = !!room.joinedUserId;

    let hostReadyState = room.hostReady || false;
    let joinerReadyState = room.joinerReady || false;
    let firstPickResult = room.firstPick || null;

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    let pollInterval = null;

    function startPollingForReady() {
        if (!room.id) return;
        
        pollInterval = setInterval(async () => {
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
                    if (updatedRoom.selectedWinner) room.selectedWinner = updatedRoom.selectedWinner;
                    
                    updatePopupContent();
                }

                if (updatedRoom.hostReady && updatedRoom.joinerReady) {
                    if (updatedRoom.firstPick && callbacks.onBothReady) {
                        setTimeout(() => {
                            clearInterval(pollInterval);
                            callbacks.onBothReady(updatedRoom);
                        }, 13000);
                    }
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

        const team1Name = is1v1 ? (room.inGameName || room.teamName || room.userName || 'Host') : (room.sqName || room.teamName || 'Host SQ');
        const team2Name = is1v1 ? (room.joinerTeamName || room.joinerUserName || 'Joiner') : (room.joinerSqName || room.joinerTeamName || 'Joiner SQ');

        const spinWheelHTML = bothReady ? `
            <div style="position: absolute; inset: 0; background: rgba(20, 20, 25, 0.95); backdrop-filter: blur(20px); z-index: 50; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; border-radius: 24px; animation: fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <div style="width: 100%; text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #8e8e93; margin-bottom: 6px;">Selection Draw (Top-Bottom)</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;" id="spinStatusText">
                        ⏳ Get Ready... <span id="countdownNum" style="color: #ff3b30;">3</span>
                    </div>
                </div>

                <div style="position: relative; width: 210px; height: 210px; margin: 10px auto; border-radius: 50%; background: conic-gradient(#34c759 0deg 180deg, #007aff 180deg 360deg); box-shadow: 0 0 40px rgba(0,122,255,0.3), inset 0 0 20px rgba(255,255,255,0.2); border: 4px solid rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center;">
                    <div id="wheelElement" style="position: absolute; inset: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <div style="position: absolute; top: 40px; font-size: 12px; font-weight: 800; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8); max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${team1Name}</div>
                        <div style="position: absolute; bottom: 40px; font-size: 12px; font-weight: 800; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8); max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${team2Name}</div>
                    </div>
                    <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 16px solid #ff3b30; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); z-index: 10;"></div>
                    <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 5;">
                        <div style="width: 14px; height: 14px; background: #1c1c1e; border-radius: 50%;"></div>
                    </div>
                </div>

                <div style="font-size: 13px; color: #aeaeb2; margin-top: 20px; text-align: center;" id="spinSubText">
                    Relax & enjoy the 10s spin experience...
                </div>
            </div>
            <style>
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            </style>
        ` : '';

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
                            <div style="font-weight: 700; color: #0a84ff; margin-bottom: 8px; font-size: 13px; text-align: center;">
                                Host ${hostReadyState ? ' ✅' : ''}
                            </div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Name:</span> <b>${hostName}</b></div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Hero:</span> <b style="color: #34c759;">${hostHero}</b></div>
                            <div class="popup-row" style="font-size: 12px; border-bottom: none;"><span>Contact:</span> <b>${hostContact}</b></div>
                        </div>

                        ${hasMatched ? `
                        <div style="flex: 1; background: rgba(52, 199, 89, 0.08); padding: 12px; border-radius: 14px; border: 1px solid rgba(52, 199, 89, 0.2);">
                            <div style="font-weight: 700; color: #34c759; margin-bottom: 8px; font-size: 13px; text-align: center;">
                                Joiner ${joinerReadyState ? ' ✅' : ''}
                            </div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Name:</span> <b>${joinerName}</b></div>
                            <div class="popup-row" style="font-size: 12px; margin-bottom: 6px;"><span>Hero:</span> <b style="color: #34c759;">${joinerHero}</b></div>
                            <div class="popup-row" style="font-size: 12px; border-bottom: none;"><span>Contact:</span> <b>${joinerContact}</b></div>
                        </div>
                        ` : '<div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #8e8e93; font-size: 12px; background: rgba(255,255,255,0.03); border-radius: 14px;">Waiting...</div>'}
                    </div>
                    ${actionButtonsHTML}
                    <button class="popup-close-btn" id="closePopupBtn" style="margin-top: 12px; width: 100%; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.08); border: none; color: #fff; font-weight: 600; cursor: pointer;">Close</button>
                    ${spinWheelHTML}
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
                    <div class="popup-title" style="font-size: 17px; font-weight: 700; text-align: center; margin-bottom: 4px; letter-spacing: -0.5px;">SQ MATCH DETAILS</div>
                    <div style="font-size: 11px; color: #8e8e93; margin-bottom: 14px; text-align: center;">5VS5 Players Comparison</div>
                    
                    <div style="display: flex; gap: 10px; width: 100%; max-height: 50vh; overflow-y: auto;">
                        <div style="flex: 1; background: rgba(0, 122, 255, 0.08); padding: 10px; border-radius: 14px; border: 1px solid rgba(0, 122, 255, 0.2);">
                            <div style="font-weight: 700; color: #0a84ff; margin-bottom: 8px; font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${hostSqName} ${hostReadyState ? ' ✅' : ''}
                            </div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Roamer:</span> <b>${formatPlayerName(room.roamer)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>EXP:</span> <b>${formatPlayerName(room.exp)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Gold:</span> <b>${formatPlayerName(room.gold)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Mid:</span> <b>${formatPlayerName(room.mid)}</b></div>
                            <div class="popup-row" style="font-size: 11px; padding: 5px 0;"><span>Jungle:</span> <b>${formatPlayerName(room.jungle)}</b></div>
                            <div class="popup-row" style="font-size: 11px; border-bottom: none; border-top: 1px solid rgba(0, 122, 255, 0.3); margin-top: 6px; padding-top: 6px;"><span>Contact:</span> <b style="font-size: 10px;">${hostContact}</b></div>
                        </div>

                        ${hasMatched ? `
                        <div style="flex: 1; background: rgba(52, 199, 89, 0.08); padding: 10px; border-radius: 14px; border: 1px solid rgba(52, 199, 89, 0.2);">
                            <div style="font-weight: 700; color: #34c759; margin-bottom: 8px; font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${joinerSqName} ${joinerReadyState ? ' ✅' : ''}
                            </div>
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
                    ${spinWheelHTML}
                </div>
            `;
        }

        // စတင် Spin လုပ်မည့်အချိန်ကို Host ဘက်က သတ်မှတ်ပေးခြင်း (Database ထဲ Winner ကို ကြိုမထည့်သေးပါ)
        if (bothReady && userId === room.hostId && !room.isSpinningTriggered) {
            room.isSpinningTriggered = true;
            
            const spinStartTime = Date.now() + 3000; // 3 sec 3-2-1 countdown

            fetch('/api/create-room', { 
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: room.id,
                    userId: userId,
                    spinStartTime: spinStartTime
                    // firstPick ကို ဒီမှာ ထည့်မပေးထားပါဘူး (Spin ပြီးမှ တင်မှာဖြစ်ပါတယ်)
                })
            }).catch(err => console.error("Failed to set spin start time", err));
        }

        if (bothReady && (room.spinStartTime || firstPickResult)) {
            const wheelEl = overlay.querySelector('#wheelElement');
            const statusText = overlay.querySelector('#spinStatusText');
            const subText = overlay.querySelector('#spinSubText');
            const numEl = overlay.querySelector('#countdownNum');

            const startTime = room.spinStartTime || (Date.now() + 3000);
            
            function runAnimationSequence() {
                const now = Date.now();
                const timeLeft = startTime - now;

                if (timeLeft > 0) {
                    const secs = Math.ceil(timeLeft / 1000);
                    if (numEl) numEl.textContent = secs;
                    setTimeout(runAnimationSequence, 200);
                } else {
                    if (numEl) {
                        numEl.textContent = "GO!";
                        numEl.style.color = "#34c759";
                    }

                    if (statusText) statusText.innerHTML = `🎲 Spinning leisurely (10s)...`;

                    // **ဤနေရာတွင် Spin စတင်လည်ပတ်သည့်အချိန်၌ တိုက်ဆိုင်ရာ Random ရွေးချယ်ခြင်းကို လုပ်ဆောင်သည်**
                    const teams = [team1Name, team2Name];
                    const chosenWinner = teams[Math.floor(Math.random() * teams.length)];
                    const targetDegree = chosenWinner === team1Name ? 360 * 10 : 360 * 10 + 180;

                    if (wheelEl) {
                        wheelEl.style.transition = 'transform 10s cubic-bezier(0.05, 0.9, 0.1, 1)';
                        wheelEl.style.transform = `rotate(${targetDegree}deg)`;
                    }

                    // **၁၀ စက္ကန့် Spin လည်ပြီးဆုံးချိန် (Animation ပြီးဆုံးမှသာ) Winner ကို Database ထဲသို့ ပေးပို့ခြင်း**
                    setTimeout(() => {
                        if (statusText) {
                            statusText.innerHTML = `🎉 First Pick: <span style="color: #34c759; text-shadow: 0 0 20px rgba(52,199,89,0.4);">${chosenWinner}</span>`;
                        }
                        if (subText) {
                            subText.textContent = 'Redirecting to draft phase...';
                        }

                        // Host ဘက်မှသာ Winner ရလဒ်ကို database သို့ တရားဝင် အပ်ဒိတ်လုပ်ပေးခြင်း
                        if (userId === room.hostId) {
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
                    }, 10000);
                }
            }

            runAnimationSequence();
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