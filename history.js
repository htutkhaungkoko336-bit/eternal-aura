export async function fetchAndInitHistory(userId) {
    try {
        if (!userId) {
            console.error("User ID is missing for fetching history.");
            return;
        }

        const response = await fetch(`/api/rooms?history=true&userId=${userId}`);
        
        // Response က JSON ဟုတ်မဟုတ် အရင်စစ်ဆေးပါ (404 HTML Error တွေကြောင့် App မရပ်သွားအောင်)
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
            background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center;
            align-items: center; z-index: 1000; font-family: sans-serif;
        ">
            <div style="
                background: #0f172a; border: 1px solid #334155; width: 90%; max-width: 400px;
                max-height: 80vh; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden;
            ">
                <div style="padding: 15px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="color: #fff; margin: 0; font-size: 18px;">📜 Match History</h3>
                    <button id="close-history-modal" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 15px; overflow-y: auto; flex: 1;">
                    ${historyList.length === 0 ? 
                        `<p style="color: #94a3b8; text-align: center; margin-top: 20px;">မှတ်တမ်း မရှိသေးပါ</p>` :
                        historyList.map(item => {
                            const isWin = item.myResult === 'Win';
                            const isLose = item.myResult === 'Lose';
                            const badgeColor = isWin ? '#22c55e' : (isLose ? '#ef4444' : '#eab308');
                            
                            return `
                                <div style="
                                    background: #1e293b; border-radius: 8px; padding: 12px; margin-bottom: 10px;
                                    display: flex; justify-content: space-between; align-items: center; border-left: 4px solid ${badgeColor};
                                ">
                                    <div>
                                        <div style="color: #fff; font-weight: bold; font-size: 14px;">${item.roomTitle || item.mode || 'Match'}</div>
                                        <div style="color: #94a3b8; font-size: 11px; margin-top: 4px;">အချိန်: ${item.completedAt || item.createdAt || '-'}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <span style="
                                            background: ${badgeColor}; color: #fff; padding: 4px 10px;
                                            border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block;
                                        ">${item.myResult}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')
                    }
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('close-history-modal').addEventListener('click', () => {
        document.getElementById('history-modal').remove();
    });

    document.getElementById('history-modal').addEventListener('click', (e) => {
        if (e.target.id === 'history-modal') {
            document.getElementById('history-modal').remove();
        }
    });
}