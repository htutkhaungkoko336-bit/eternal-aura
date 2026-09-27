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
            renderHistoryModal(data.history || [], userId);
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
            display: flex; justify-content: center; align-items: center; z-index: 1000; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="
                background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
                border: 1px solid rgba(255, 255, 255, 0.12); width: 92%; max-width: 420px;
                max-height: 85vh; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            ">
                <!-- Modal Header -->
                <div style="padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.7);">
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

                <!-- Modal Body (History Cards List) -->
                <div style="padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px;">
                    ${historyList.length === 0 ? `
                        <div style="text-align: center; padding: 50px 0;">
                            <div style="font-size: 45px; margin-bottom: 12px;">📭</div>
                            <p style="color: #94a3b8; font-size: 14px; margin: 0;">မှတ်တမ်း မရှိသေးပါ</p>
                        </div>
                    ` : historyList.map((item, index) => {
                        const isWin = item.myResult === 'Win';
                        const isLose = item.myResult === 'Lose';
                        const accentColor = isWin ? '#34d399' : (isLose ? '#f87171' : '#fbbf24');
                        
                        return `
                            <div class="history-card-item" data-index="${index}" style="
                                background: rgba(30, 41, 59, 0.7);
                                border: 1px solid rgba(255, 255, 255, 0.08);
                                border-radius: 16px; padding: 14px 16px;
                                display: flex; justify-content: space-between; align-items: center;
                                position: relative; overflow: hidden; cursor: pointer;
                                transition: all 0.2s ease;
                                backdrop-filter: blur(6px);
                            " onmouseover="this.style.background='rgba(51, 65, 85, 0.85)'" onmouseout="this.style.background='rgba(30, 41, 59, 0.7)'">
                                
                                <!-- Left Glowing Indicator -->
                                <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${accentColor};"></div>

                                <div style="padding-left: 6px;">
                                    <div style="color: #f8fafc; font-weight: 600; font-size: 15px; letter-spacing: -0.2px;">
                                        ${item.roomTitle || item.teamVsTeam || item.mode || 'Match'}
                                    </div>
                                    <div style="color: #94a3b8; font-size: 12px; margin-top: 5px; display: flex; align-items: center; gap: 5px;">
                                        <span>🕒</span> ${item.completedAt || item.createdAt || '-'}
                                    </div>
                                </div>

                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="
                                        background: ${accentColor}20; color: ${accentColor}; border: 1px solid${accentColor}40;
                                        padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
                                        text-transform: uppercase; letter-spacing: 0.5px;
                                    ">${item.myResult}</span>
                                    <span style="color: #64748b; font-size: 14px;">❯</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>

        <!-- Detail Modal Container (Hidden by default) -->
        <div id="match-detail-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
            display: none; justify-content: center; align-items: center; z-index: 1100;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        ">
            <div style="
                background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.15); width: 88%; max-width: 360px;
                border-radius: 20px; padding: 22px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);
                position: relative;
            ">
                <h4 style="color: #f8fafc; margin: 0 0 15px 0; font-size: 16px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">📊 Match Details</h4>
                
                <div id="detail-content" style="display: flex; flex-direction: column; gap: 10px; font-size: 14px; color: #cbd5e1;">
                    <!-- Dynamically injected detail info -->
                </div>

                <button id="close-detail-modal" style="
                    width: 100%; margin-top: 18px; background: #3b82f6; color: #fff; border: none;
                    padding: 10px; border-radius: 12px; font-weight: 600; cursor: pointer;
                ">ပိတ်မည်</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Event Listeners for Closing Main History Modal
    document.getElementById('close-history-modal').addEventListener('click', () => {
        document.getElementById('history-modal').remove();
    });

    document.getElementById('history-modal').addEventListener('click', (e) => {
        if (e.target.id === 'history-modal') {
            document.getElementById('history-modal').remove();
        }
    });

    // Event Listeners to Open Detail Modal when a card is clicked
    document.querySelectorAll('.history-card-item').forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            const item = historyList[index];
            
            const detailContainer = document.getElementById('detail-content');
            
            // Format Team Members list safely
            let membersHTML = '-';
            if (item.teamMembers && Array.isArray(item.teamMembers)) {
                membersHTML = item.teamMembers.map(m => `<span style="background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 6px; font-size: 12px; display: inline-block; margin: 2px;">${m}</span>`).join(' ');
            } else if (typeof item.teamMembers === 'string') {
                membersHTML = item.teamMembers;
            }

            detailContainer.innerHTML = `
                <div style="display: flex; justify-content: space-between;"><span style="color: #94a3b8;">Team vs Team:</span> <strong style="color: #fff;">${item.roomTitle || item.teamVsTeam || '-'}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span style="color: #94a3b8;">Mode:</span> <strong style="color: #38bdf8;">${item.mode || '-'}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span style="color: #94a3b8;">Fee:</span> <strong style="color: #facc15;">${item.fee || 'Free'}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span style="color: #94a3b8;">Result:</span> <strong style="color: ${item.myResult === 'Win' ? '#34d399' : '#f87171'};">${item.myResult || '-'}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span style="color: #94a3b8;">Time/Date:</span> <span style="color: #fff; font-size: 13px;">${item.completedAt || item.createdAt || '-'}</span></div>
                <div style="margin-top: 6px;">
                    <span style="color: #94a3b8; display: block; margin-bottom: 4px;">Team Members:</span>
                    <div style="background: rgba(15, 23, 42, 0.5); padding: 8px; border-radius: 8px; max-height: 90px; overflow-y: auto;">
                        ${membersHTML}
                    </div>
                </div>
            `;

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