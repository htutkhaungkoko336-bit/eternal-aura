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
            background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(8px);
            display: flex; justify-content: center; align-items: center; z-index: 1000; font-family: 'Inter', sans-serif;
        ">
            <div style="
                background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                border: 1px solid rgba(255, 255, 255, 0.1); width: 92%; max-width: 420px;
                max-height: 82vh; border-radius: 20px; display: flex; flex-direction: column; overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            ">
                <!-- Modal Header -->
                <div style="padding: 18px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.6);">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">📜</span>
                        <h3 style="color: #f8fafc; margin: 0; font-size: 17px; font-weight: 700; letter-spacing: 0.5px;">Match History</h3>
                    </div>
                    <button id="close-history-modal" style="
                        background: rgba(255, 255, 255, 0.06); border: none; color: #94a3b8; width: 32px; height: 32px;
                        border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
                        transition: all 0.2s ease;
                    ">&times;</button>
                </div>

                <!-- Modal Body -->
                <div style="padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px;">
                    ${historyList.length === 0 ? `
                        <div style="text-align: center; padding: 40px 0;">
                            <div style="font-size: 40px; margin-bottom: 10px;">📭</div>
                            <p style="color: #94a3b8; font-size: 14px; margin: 0;">မှတ်တမ်း မရှိသေးပါ</p>
                        </div>
                    ` : historyList.map(item => {
                        const isWin = item.myResult === 'Win';
                        const isLose = item.myResult === 'Lose';
                        
                        // Modern Gradient & Shadow Design based on status
                        const accentColor = isWin ? '#10b981' : (isLose ? '#ef4444' : '#f59e0b');
                        const bgGradient = isWin 
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(30, 41, 59, 0.7) 100%)' 
                            : isLose 
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(30, 41, 59, 0.7) 100%)'
                            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(30, 41, 59, 0.7) 100%)';

                        return `
                            <div style="
                                background: ${bgGradient};
                                border: 1px solid rgba(255, 255, 255, 0.07);
                                border-radius: 14px; padding: 14px 16px;
                                display: flex; justify-content: space-between; align-items: center;
                                position: relative; overflow: hidden;
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                            ">
                                <!-- Left Glowing Indicator Border -->
                                <div style="
                                    position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
                                    background: ${accentColor}; box-shadow: 0 0 10px${accentColor};
                                "></div>

                                <div style="padding-left: 6px;">
                                    <div style="color: #f8fafc; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;">
                                        ${item.roomTitle || item.mode || 'Match'}
                                    </div>
                                    <div style="color: #94a3b8; font-size: 12px; margin-top: 5px; display: flex; align-items: center; gap: 4px;">
                                        <span>🕒</span> ${item.completedAt || item.createdAt || '-'}
                                    </div>
                                </div>

                                <div style="text-align: right;">
                                    <span style="
                                        background: ${accentColor}; color: #ffffff; padding: 5px 14px;
                                        border-radius: 30px; font-size: 12px; font-weight: 800;
                                        box-shadow: 0 2px 10px ${accentColor}40;
                                        letter-spacing: 0.5px; text-transform: uppercase;
                                        display: inline-block;
                                    ">${item.myResult}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
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