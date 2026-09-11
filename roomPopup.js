export function showRoomDetailsPopup(room, mode, userId, callbacks = {}) {
    const is1v1 = mode.toLowerCase().includes('1v1');
    const hasMatched = !!room.joinedUserId;

    // Ready & Cancel States tracking
    let hostReadyState = room.hostReady || false;
    let joinerReadyState = room.joinerReady || false;

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    // ၂ ယောက်စလုံး Ready ဖြစ်သွားတာနဲ့ လုပ်ဆောင်မယ့် Polling စနစ်
    let pollInterval = null;

    function startPollingForReady() {
        if (!room.id) return;
        
        pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/rooms?roomId=${room.id}`);
                const text = await res.text(); // json အစား text နဲ့ အရင်ဖတ်ပါ
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
                
                // ပြင်ပမှ state တွေ ပြောင်းသွားရင် Local variables တွေကို update လုပ်ပေးခြင်း
                if (updatedRoom.hostReady !== hostReadyState || updatedRoom.joinerReady !== joinerReadyState) {
                    hostReadyState = updatedRoom.hostReady;
                    joinerReadyState = updatedRoom.joinerReady;
                    updatePopupContent(); // UI ကိုပါ တခါတည်း update လုပ်ပေးသည်
                }

                // ၂ ယောက်လုံး Ready ဖြစ်သွားခြင်း စစ်ဆေးရန်
                if (updatedRoom.hostReady && updatedRoom.joinerReady) {
                    clearInterval(pollInterval);
                    if (callbacks.onBothReady) callbacks.onBothReady(updatedRoom);
                }
            } catch (error) {
                console.error("Polling check error:", error);
            }
        }, 1000); // ၁ စက္ကန့်တစ်ကြိမ် Real-time နီးပါးစစ်မည်
    }

    function updatePopupContent() {
        let actionButtonsHTML = '';

        if (hasMatched) {
            actionButtonsHTML = `
                <div style="display: flex; gap: 10px; margin-top: 14px;">
                    <!-- Host Actions (Shown if current user is Host) -->
                    ${userId === room.hostId ? `
                        <button id="popupReadyBtn" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; background: ${hostReadyState ? '#10b981' : 'linear-gradient(135deg, #0284c7, #9333ea)'}; color: #fff;">
                            ${hostReadyState ? 'Unready' : 'Ready'}
                        </button>
                        <button id="popupCancelBtn" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 700; border: 1px solid rgba(244, 63, 94, 0.4); background: rgba(244, 63, 94, 0.15); color: #f43f5e; cursor: pointer; opacity: ${hostReadyState ? '0.4' : '1'}; pointer-events: ${hostReadyState ? 'none' : 'auto'};">
                            Cancel
                        </button>
                    ` : ''}

                    <!-- Joiner Actions (Shown if current user is Joiner) -->
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
                        
                        <!-- Host Info -->
                        <div style="flex: 1; background: rgba(56, 189, 248, 0.08); padding: 8px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.2);">
                            <div style="font-weight: 700; color: #38bdf8; margin-bottom: 6px; font-size: 12px; text-align: center;">
                                Host ${hostReadyState ? ' ✅' : ''}
                            </div>
                            <div class="popup-row" style="font-size: 11px;"><span>Name:</span> <b>${hostName}</b></div>
                            <div class="popup-row" style="font-size: 11px;"><span>Hero:</span> <b style="color: #10b981;">${hostHero}</b></div>
                            <div class="popup-row" style="font-size: 11px; border-bottom: none;"><span>Contact:</span> <b>${hostContact}</b></div>
                        </div>

                        <!-- Joiner Info (If matched) -->
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
                        
                        <!-- Host Squad -->
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

                        <!-- Joiner Squad (If matched) -->
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

        // Re-bind events after innerHTML update
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
                if (userId === room.hostId) {
                    hostReadyState = !hostReadyState;
                } else if (userId === room.joinedUserId) {
                    joinerReadyState = !joinerReadyState;
                }
                
                updatePopupContent(); // UI ကို ချက်ချင်း update လုပ်ရန်

                // Backend ကို Ready status လှမ်းပို့မည်
                try {
                    await fetch('/api/rooms', { 
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

    // Polling ကို စတင်လိုက်ပါ
    startPollingForReady();

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            if (pollInterval) clearInterval(pollInterval);
            overlay.remove();
        }
    });
}