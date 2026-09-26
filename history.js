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

        // 2. Inject CSS styles dynamically (Modern & Sleek Design with Win/Lose Badges)
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
                
                /* Win / Lose Badge Styles */
                .result-badge{font-size:0.75rem;padding:3px 10px;border-radius:6px;font-weight:700;text-transform:uppercase;}
                .result-win{background:rgba(34, 197, 94, 0.2);color:#4ade80;border:1px solid rgba(34, 197, 94, 0.3);}
                .result-lose{background:rgba(239, 68, 68, 0.2);color:#f87171;border:1px solid rgba(239, 68, 68, 0.3);}
                .result-draw{background:rgba(234, 179, 8, 0.2);color:#facc15;border:1px solid rgba(234, 179, 8, 0.3);}
                
                .match-teams-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:4px 0;}
                .team-box{display:flex;align-items:center;gap:8px;flex:1;}
                .team-box.away{justify-content:flex-end;text-align:right;}
                .team-logo-img{width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,0.1);background:#0f172a;}
                .team-name-text{color:#e2e8f0;font-size:0.9rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;}
                .vs-badge{color:#64748b;font-size:0.75rem;font-weight:800;font-style:italic;}
                
                .match-card-footer{display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;color:#94a3b8;border-top:1px solid rgba(255,255,255,0.05);padding-top:8px;}
                .empty-history{text-align:center;color:#64748b;padding:30px 0;font-size:0.9rem;}
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', historyStyles);
    }

    // 4. Element Selectors & Modal
    const historyModal = document.getElementById('history-modal');
    const historyCloseBtn = document.getElementById('history-close-btn');
    const historyListContainer = document.getElementById('history-list-container');

    // Render History Cards function
    function renderHistory(data) {
        if (!historyListContainer) return;
        historyListContainer.innerHTML = '';

        // Data သည် Array ဟုတ်မဟုတ် သေချာစစ်ဆေးပါ (forEach Error မတက်စေရန်)
        if (!Array.isArray(data)) {
            data = [];
        }

        if (data.length === 0) {
            historyListContainer.innerHTML = `<div class="empty-history">No battle history found yet.</div>`;
            return;
        }

        data.forEach(match => {
            const result = match.myResult || 'Draw';
            let resultClass = 'result-draw';
            if (result === 'Win') resultClass = 'result-win';
            else if (result === 'Lose') resultClass = 'result-lose';

            const cardHTML = `
                <div class="history-card-item">
                    <div class="match-card-header">
                        <span class="match-room-title">${match.roomTitle || 'CUSTOM ROOM'} (${match.mode || '5v5'})</span>
                        <span class="result-badge ${resultClass}">${result}</span>
                    </div>
                    
                    <div class="match-teams-row">
                        <div class="team-box home">
                            <img src="${match.teamLogo || match.hostLogo || 'https://via.placeholder.com/28'}" class="team-logo-img" alt="Logo">
                            <span class="team-name-text" title="${match.teamName || match.hostName}">${match.teamName || match.hostName || 'Host'}</span>
                        </div>
                        <span class="vs-badge">${match.boType || 'VS'}</span>
                        <div class="team-box away">
                            <span class="team-name-text" title="${match.joinerTeamName || match.joinedUserName}">${match.joinerTeamName || match.joinedUserName || 'Joiner'}</span>
                            <img src="${match.joinerTeamLogo || match.joinedUserLogo || 'https://via.placeholder.com/28'}" class="team-logo-img" alt="Logo">
                        </div>
                    </div>
                    
                    <div class="match-card-footer">
                        <span>🕒 ${match.completedAt || match.createdAt || 'Recent'}</span>
                        <span>Code: ${match.matchCode || match.roomId || 'N/A'}</span>
                    </div>
                </div>
            `;
            historyListContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

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

// API မှ User ID ဖြင့် History လှမ်းဆွဲရန် function (Safe Array Handling)
export async function fetchAndInitHistory(userId) {
    try {
        const response = await fetch(`/api/active-room?history=true&userId=${userId || ''}`); 
        const result = await response.json();
        
        let historyArray = [];
        
        if (result && result.success && Array.isArray(result.history)) {
            historyArray = result.history;
        } else if (result && Array.isArray(result.data)) {
            historyArray = result.data;
        } else if (Array.isArray(result)) {
            historyArray = result;
        } else {
            historyArray = [];
        }
        
        initHistoryManagement(historyArray);

    } catch (error) {
        console.error('Failed to fetch match history from API:', error);
        initHistoryManagement([]);
    }
}

// 6. History ခလုတ်နှိပ်သည့်အခါ (auth.js က သိမ်းထားသော user_id ကိုပါ တစ်ပါတည်း တွဲစစ်ပေးသည်)
export function setupHistoryButton() {
    const historyBtn = document.getElementById('history-open-btn'); 
    if (!historyBtn) return;

    historyBtn.addEventListener('click', () => {
        const currentUserId = window.activeUserId || localStorage.getItem('user_id'); 
        
        if (!currentUserId) {
            console.warn("User ID not found. Please log in first.");
            alert("ကျေးဇူးပြု၍ အရင်ဆုံး Login ဝင်ပါ။");
            return;
        }

        fetchAndInitHistory(currentUserId);
    });
}