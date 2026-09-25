// history.js - Handles the history popup and dynamic list rendering with real match data

export function initHistoryManagement(historyData = []) {
    // 1. Inject History Modal HTML into the body dynamically if it doesn't exist
    if (!document.getElementById('history-modal')) {
        const historyModalHTML = `
            <div id="history-modal" class="history-modal-overlay">
                <div class="history-modal-content">
                    <div class="history-header">
                        <div class="history-title-wrapper">
                            <h3>📜 Match History</h3>
                            <span class="history-subtitle">Your recent battle records</span>
                        </div>
                        <button id="history-close-btn" class="history-close-btn">&times;</button>
                    </div>
                    <div class="history-body">
                        <div class="history-list" id="history-list-container">
                            <!-- History items will be injected here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', historyModalHTML);

        // 2. Inject CSS styles dynamically (Modern & Sleek Design)
        const historyStyles = `
            <style>
                .history-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.75);backdrop-filter:blur(10px);display:flex;justify-content:center;align-items:center;z-index:1000;opacity:0;visibility:hidden;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);}
                .history-modal-overlay.active{opacity:1;visibility:visible;}
                .history-modal-content{background:linear-gradient(135deg, #1e293b, #0f172a);border:1px solid rgba(255,255,255,0.12);width:92%;max-width:460px;max-height:85vh;border-radius:24px;box-shadow:0 25px 50px -12px rgba(0, 0, 0, 0.7);overflow:hidden;display:flex;flex-direction:column;transform:translateY(20px) scale(0.95);transition:transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);}
                .history-modal-overlay.active .history-modal-content{transform:translateY(0) scale(1);}
                .history-header{padding:20px 24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);}
                .history-title-wrapper h3{color:#f8fafc;font-size:1.2rem;font-weight:700;margin:0;letter-spacing:0.5px;}
                .history-subtitle{color:#64748b;font-size:0.75rem;font-weight:500;}
                .history-close-btn{background:rgba(255,255,255,0.05);border:none;color:#94a3b8;font-size:1.4rem;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;}
                .history-close-btn:hover{background:rgba(239,68,68,0.2);color:#ef4444;}
                .history-body{padding:20px 24px;overflow-y:auto;flex:1;}
                .history-list{display:flex;flex-direction:column;gap:14px;}
                
                /* Match Card Styling */
                .history-card-item{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);padding:16px;border-radius:16px;display:flex;flex-direction:column;gap:12px;transition:all 0.2s ease;position:relative;overflow:hidden;}
                .history-card-item::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(to bottom, #3b82f6, #6366f1);}
                .history-card-item:hover{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.12);transform:translateY(-2px);box-shadow:0 10px 20px -5px rgba(0,0,0,0.3);}
                
                .match-card-header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:8px;}
                .match-room-title{color:#38bdf8;font-size:0.85rem;font-weight:700;letter-spacing:0.3px;}
                .match-code-badge{background:rgba(56, 189, 248, 0.1);color:#38bdf8;font-size:0.7rem;padding:3px 8px;border-radius:6px;font-weight:600;}
                
                .match-teams-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:4px 0;}
                .team-box{display:flex;align-items:center;gap:8px;flex:1;}
                .team-box.away{justify-content:flex-end;text-align:right;}
                .team-logo-img{width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,0.1);background:#0f172a;}
                .team-name-text{color:#e2e8f0;font-size:0.9rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;}
                .vs-badge{color:#64748b;font-size:0.75rem;font-weight:800;font-style:italic;}
                
                .match-card-footer{display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;color:#94a3b8;border-top:1px solid rgba(255,255,255,0.05);padding-top:8px;}
                .match-status-badge{padding:2px 8px;border-radius:4px;font-weight:600;text-transform:uppercase;font-size:0.65rem;}
                .status-completed{background:rgba(34, 197, 94, 0.15);color:#4ade80;}
                .status-pending{background:rgba(234, 179, 8, 0.15);color:#facc15;}
                
                .empty-history{text-align:center;color:#64748b;padding:30px 0;font-size:0.9rem;}
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', historyStyles);
    }

    // 4. Element Selectors & Modal
    const historyModal = document.getElementById('history-modal');
    const historyCloseBtn = document.getElementById('history-close-btn');
    const historyListContainer = document.getElementById('history-list-container');

    // Render History Cards function (Real Data Implementation)
    function renderHistory(data) {
        if (!historyListContainer) return;
        historyListContainer.innerHTML = '';

        // အကယ်၍ Data မရှိခဲ့ရင်ပြရန်
        if (!data || data.length === 0) {
            historyListContainer.innerHTML = `<div class="empty-history">No battle history found yet.</div>`;
            return;
        }

        data.forEach(match => {
            const statusClass = match.status === 'completed' ? 'status-completed' : 'status-pending';
            
            const cardHTML = `
                <div class="history-card-item">
                    <div class="match-card-header">
                        <span class="match-room-title">${match.roomTitle || 'CUSTOM ROOM'} (${match.mode || '5v5'})</span>
                        <span class="match-code-badge">${match.matchCode || 'N/A'}</span>
                    </div>
                    
                    <div class="match-teams-row">
                        <div class="team-box home">
                            <img src="${match.teamLogo || 'https://via.placeholder.com/28'}" class="team-logo-img" alt="Logo">
                            <span class="team-name-text" title="${match.teamName}">${match.teamName || 'Team 1'}</span>
                        </div>
                        <span class="vs-badge">${match.boType || 'VS'}</span>
                        <div class="team-box away">
                            <span class="team-name-text" title="${match.joinerTeamName}">${match.joinerTeamName || 'Team 2'}</span>
                            <img src="${match.joinerTeamLogo || 'https://via.placeholder.com/28'}" class="team-logo-img" alt="Logo">
                        </div>
                    </div>
                    
                    <div class="match-card-footer">
                        <span>🕒 ${match.completedAt || match.createdAt || 'Recent'}</span>
                        <span class="match-status-badge ${statusClass}">${match.status || 'finished'}</span>
                    </div>
                </div>
            `;
            historyListContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // Open Modal and render data
    renderHistory(historyData);
    if (historyModal) {
        historyModal.classList.add('active');
    }

    // 5. Event Listeners for closing modal
    if (historyCloseBtn && historyModal) {
        historyCloseBtn.onclick = () => {
            historyModal.classList.remove('active');
        };

        historyModal.onclick = (e) => {
            if (e.target === historyModal) {
                historyModal.classList.remove('active');
            }
        };
    }
}

// history.js ထဲတွင် API မှ ဒေတာလှမ်းဆွဲရန် function အသစ်ထည့်သွင်းခြင်း

export async function fetchAndInitHistory() {
    try {
        // သင့်ရဲ့ project ထဲက history/active room API endpoint လမ်းကြောင်းအတိုင်း ညှိပေးပါ
        const response = await fetch('/api/active-room?type=history'); 
        const result = await response.json();
        
        if (result.success && result.history) {
            initHistoryManagement(result.history);
        } else if (Array.isArray(result)) {
            initHistoryManagement(result);
        } else {
            initHistoryManagement([]);
        }
    } catch (error) {
        console.error('Failed to fetch match history from API:', error);
        initHistoryManagement([]);
    }
}