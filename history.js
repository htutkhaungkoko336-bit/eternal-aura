export async function fetchAndInitHistory(userId) {
    try {
        if (!userId) {
            console.error("User ID is missing for fetching history.");
            return;
        }

        const response = await fetch('/api/create-room?history=true&userId=' + userId);
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server did not return JSON. Endpoint might be incorrect (404).");
        }

        const data = await response.json();

        if (data.success) {
            let historyList = data.history || [];
            
            // ရက်စွဲအသစ်ဆုံးကို အပေါ်ဆုံးရောက်အောင် စဉ်ပေးခြင်း (Newest First)
            historyList.sort((a, b) => {
                const dateA = new Date(a.completedAt || a.createdAt || 0);
                const dateB = new Date(b.completedAt || b.createdAt || 0);
                return dateB - dateA; // အသစ်ဆုံးက ထိပ်ဆုံးသို့ ရောက်မည်
            });

            renderHistoryModal(historyList, userId);
        } else {
            console.error("Failed to load history:", data.message);
        }
    } catch (error) {
        console.error("Error fetching history:", error);
    }
}

function renderHistoryModal(historyList, userId) {
    const existingModal = document.getElementById('history-modal');
    if (existingModal) existingModal.remove();

    const modalHTML = `
        <div id="history-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(12px);
            display: flex; justify-content: center; align-items: center; z-index: 1000; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        ">
            <div style="
                background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
                border: 1px solid rgba(255, 255, 255, 0.12); width: 94%; max-width: 440px;
                max-height: 85vh; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            ">
                <!-- Modal Header -->
                <div style="padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.7); flex-shrink: 0;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 18px;">📜</span>
                        <h3 style="color: #f8fafc; margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.3px;">Match History</h3>
                    </div>
                    <button id="close-history-modal" style="
                        background: rgba(255, 255, 255, 0.08); border: none; color: #94a3b8; width: 32px; height: 32px;
                        border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
                        transition: all 0.2s ease;
                    ">&times;</button>
                </div>

                <!-- Modal Body (History Cards List with Proper Scrolling) -->
                <div style="padding: 16px; overflow-y: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 12px;">
                    ${historyList.length === 0 ? `
                        <div style="text-align: center; padding: 50px 0;">
                            <div style="font-size: 45px; margin-bottom: 12px;">📭</div>
                            <p style="color: #94a3b8; font-size: 14px; margin: 0;">မှတ်တမ်း မရှိသေးပါ</p>
                        </div>
                    ` : historyList.map((item, index) => {
                        const isWin = item.myResult === 'Win';
                        const isLose = item.myResult === 'Lose';
                        const badgeBg = isWin ? 'linear-gradient(135deg, #10b981, #059669)' : (isLose ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #f59e0b, #d97706)');
                        
                        const hostTeamName = item.teamName || 'Host Team';
                        const hostLogo = item.teamLogo || 'https://via.placeholder.com/32';
                        const joinerTeamName = item.joinerTeamName || 'Joiner Team';
                        const joinerLogo = item.joinerTeamLogo || 'https://via.placeholder.com/32';
                        
                        const modeText = item.mode ? item.mode.toUpperCase() : 'MATCH';
                        const feeText = item.keyType || item.fee ? `• ${item.keyType || item.fee}` : '';

                        return `
                            <div class="history-card-item" data-index="${index}" style="
                                background: linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%);
                                border: 1px solid rgba(255, 255, 255, 0.08);
                                border-radius: 18px; padding: 14px;
                                display: flex; flex-direction: column; gap: 10px;
                                cursor: pointer; transition: all 0.2s ease;
                                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
                                position: relative; overflow: hidden; flex-shrink: 0;
                            " onmouseover="this.style.borderColor='rgba(56, 189, 248, 0.4)'" onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.08)'">
                                
                                <!-- Top Row: Teams VS Layout -->
                                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                                    <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                                        <img src="${hostLogo}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.src='https://via.placeholder.com/30'">
                                        <span style="color: #f8fafc; font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${hostTeamName}</span>
                                    </div>

                                    <div style="
                                        background: linear-gradient(135deg, #0ea5e9, #2563eb); color: #fff;
                                        font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 8px;
                                        letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(14, 165, 233, 0.4);
                                    ">VS</div>

                                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex: 1; min-width: 0;">
                                        <span style="color: #f8fafc; font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right;">${joinerTeamName}</span>
                                        <img src="${joinerLogo}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.src='https://via.placeholder.com/30'">
                                    </div>
                                </div>

                                <!-- Bottom Row: Mode, Fee, Date & Win/Lose Badge -->
                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
                                    <div style="display: flex; flex-direction: column; gap: 2px;">
                                        <div style="color: #38bdf8; font-size: 11px; font-weight: 700;">
                                            ${modeText} <span style="color: #facc15; font-weight: 600;">${feeText}</span>
                                        </div>
                                        <div style="color: #94a3b8; font-size: 10px; display: flex; align-items: center; gap: 4px;">
                                            <span>🕒</span> ${item.completedAt || item.createdAt || '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <span style="
                                            background: ${badgeBg}; color: #ffffff; padding: 4px 12px;
                                            border-radius: 14px; font-size: 10px; font-weight: 800;
                                            letter-spacing: 0.5px; text-transform: uppercase;
                                            box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: inline-block;
                                        ">${item.myResult || 'MATCH'}</span>
                                    </div>
                                </div>

                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>

        <!-- Detailed Comparison Modal -->
        <div id="match-detail-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px);
            display: none; justify-content: center; align-items: center; z-index: 1100;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        ">
            <div style="
                background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
                border: 1px solid rgba(255, 255, 255, 0.15); width: 92%; max-width: 440px;
                border-radius: 24px; padding: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.8);
                display: flex; flex-direction: column; max-height: 90vh;
            ">
                <!-- Header -->
                <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 15px;">
                    <h3 id="detail-title" style="color: #38bdf8; margin: 0; font-size: 17px; font-weight: 700; letter-spacing: 0.5px;">MATCH DETAILS</h3>
                    <p id="detail-subtitle" style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Player & Hero Details</p>
                </div>

                <!-- Comparison Body Container -->
                <div id="detail-content-container" style="display: flex; gap: 10px; overflow-y: auto; flex: 1; padding-bottom: 10px;">
                    <!-- Content injected via JS -->
                </div>

                <!-- Footer Extra Meta Info -->
                <div style="background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 12px; margin-top: 10px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;">
                    <div>Result: <strong id="detail-result" style="color: #fff;">-</strong></div>
                    <div>Fee: <strong id="detail-fee" style="color: #facc15;">-</strong></div>
                    <div>Time: <strong id="detail-time" style="color: #fff;">-</strong></div>
                </div>

                <!-- Close Button -->
                <button id="close-detail-modal" style="
                    width: 100%; margin-top: 12px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff; border: none;
                    padding: 11px; border-radius: 12px; font-weight: 600; cursor: pointer;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                ">Close</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close Main History Modal
    document.getElementById('close-history-modal').addEventListener('click', () => {
        document.getElementById('history-modal').remove();
    });

    document.getElementById('history-modal').addEventListener('click', (e) => {
        if (e.target.id === 'history-modal') {
            document.getElementById('history-modal').remove();
        }
    });

    // Open Comparison Detail Modal on Card Click
    document.querySelectorAll('.history-card-item').forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            const item = historyList[index];
            
            const mode = (item.mode || '').toLowerCase();
            const is1v1 = mode.includes('1v1') || mode.includes('1VS1');

            document.getElementById('detail-title').innerText = item.roomTitle || `${item.mode ? item.mode.toUpperCase() : 'MATCH'} DETAILS`;
            document.getElementById('detail-subtitle').innerText = is1v1 ? 'Player & Hero Details' : 'Players Comparison';

            const container = document.getElementById('detail-content-container');

            if (is1v1) {
                container.innerHTML = `
                    <!-- Host Team Box -->
                    <div style="flex: 1; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; width: 100%;">
                            <img src="${item.teamLogo || 'https://via.placeholder.com/28'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);">
                            <span style="color: #38bdf8; font-weight: 700; font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${item.teamName || 'Host Team'}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #cbd5e1; width: 100%;">
                            <div style="font-size: 12px;">
                                <span style="color: #94a3b8; font-size: 11px;">Player Name:</span> <strong style="color: #fff;">${item.inGameName || item.name || '-'}</strong>
                            </div>
                            <div style="font-size: 12px;">
                                <span style="color: #94a3b8; font-size: 11px;">Hero Name:</span> <strong style="color: #38bdf8;">${item.heroName || '-'}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Joiner Team Box -->
                    <div style="flex: 1; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; width: 100%;">
                            <img src="${item.joinerTeamLogo || 'https://via.placeholder.com/28'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);">
                            <span style="color: #f87171; font-weight: 700; font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${item.joinerTeamName || 'Joiner Team'}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #cbd5e1; width: 100%;">
                            <div style="font-size: 12px;">
                                <span style="color: #94a3b8; font-size: 11px;">Player Name:</span> <strong style="color: #fff;">${item.joinerInGameName || item.joinerName || '-'}</strong>
                            </div>
                            <div style="font-size: 12px;">
                                <span style="color: #94a3b8; font-size: 11px;">Hero Name:</span> <strong style="color: #f87171;">${item.joinerHeroName || '-'}</strong>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                const hRoamer = item.roamer?.name || item.roamer || '-';
                const hExp = item.exp?.name || item.exp || '-';
                const hGold = item.gold?.name || item.gold || '-';
                const hMid = item.mid?.name || item.mid || '-';
                const hJungle = item.jungle?.name || item.jungle || '-';

                const jRoamer = item.joinerRoamer?.name || item.joinerRoamer || '-';
                const jExp = item.joinerExp?.name || item.joinerExp || '-';
                const jGold = item.joinerGold?.name || item.joinerGold || '-';
                const jMid = item.joinerMid?.name || item.joinerMid || '-';
                const jJungle = item.joinerJungle?.name || item.joinerJungle || '-';

                container.innerHTML = `
                    <!-- Host Team Box -->
                    <div style="flex: 1; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; width: 100%;">
                            <img src="${item.teamLogo || 'https://via.placeholder.com/28'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);">
                            <span style="color: #38bdf8; font-weight: 700; font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${item.teamName || 'Host Team'}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #cbd5e1; width: 100%;">
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;"><span style="color: #94a3b8; font-size: 11px;">Roamer:</span> <strong style="color: #fff;">${hRoamer}</strong></div>
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;"><span style="color: #94a3b8; font-size: 11px;">EXP:</span> <strong style="color: #fff;">${hExp}</strong></div>
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;"><span style="color: #94a3b8; font-size: 11px;">Gold:</span> <strong style="color: #fff;">${hGold}</strong></div>
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;"><span style="color: #94a3b8; font-size: 11px;">Mid:</span> <strong style="color: #fff;">${hMid}</strong></div>
                            <div style="display: flex; justify-content: space-between;"><span style="color: #94a3b8; font-size: 11px;">Jungle:</span> <strong style="color: #fff;">${hJungle}</strong></div>
                        </div>
                    </div>

                    <!-- Joiner Team Box -->
                    <div style="flex: 1; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; width: 100%;">
                            <img src="${item.joinerTeamLogo || 'https://via.placeholder.com/28'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);">
                            <span style="color: #f87171; font-weight: 700; font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${item.joinerTeamName || 'Joiner Team'}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #cbd5e1; width: 100%;">
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;"><span style="color: #94a3b8; font-size: 11px;">Roamer:</span> <strong style="color: #fff;">${jRoamer}</strong></div>
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;"><span style="color: #94a3b8; font-size: 11px;">EXP:</span> <strong style="color: #fff;">${jExp}</strong></div>
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;"><span style="color: #94a3b8; font-size: 11px;">Gold:</span> <strong style="color: #fff;">${jGold}</strong></div>
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 4px;"><span style="color: #94a3b8; font-size: 11px;">Mid:</span> <strong style="color: #fff;">${jMid}</strong></div>
                            <div style="display: flex; justify-content: space-between;"><span style="color: #94a3b8; font-size: 11px;">Jungle:</span> <strong style="color: #fff;">${jJungle}</strong></div>
                        </div>
                    </div>
                `;
            }

            // Meta Info
            document.getElementById('detail-result').innerText = item.myResult || '-';
            document.getElementById('detail-fee').innerText = item.keyType || item.fee || 'Free';
            document.getElementById('detail-time').innerText = item.completedAt || item.createdAt || '-';

            document.getElementById('match-detail-modal').style.display = 'flex';
        });
    });

    // Close Detail Modal Events
    document.getElementById('close-detail-modal').addEventListener('click', () => {
        document.getElementById('match-detail-modal').style.display = 'none';
    });

    document.getElementById('match-detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'match-detail-modal') {
            document.getElementById('match-detail-modal').style.display = 'none';
        }
    });
}