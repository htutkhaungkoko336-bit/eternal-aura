// history.js - Handles the history popup and dynamic list rendering

export function initHistoryManagement() {
    // 1. Inject History Modal HTML into the body dynamically if it doesn't exist
    if (!document.getElementById('history-modal')) {
        const historyModalHTML = `
            <div id="history-modal" class="history-modal-overlay">
                <div class="history-modal-content">
                    <div class="history-header">
                        <h3>📜 Activity History</h3>
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

        // 2. Inject CSS styles dynamically (Minified / Single-line format)
        const historyStyles = `
            <style>
                .history-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);backdrop-filter:blur(8px);display:flex;justify-content:center;align-items:center;z-index:1000;opacity:0;visibility:hidden;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);}
                .history-modal-overlay.active{opacity:1;visibility:visible;}
                .history-modal-content{background:linear-gradient(135deg, #1e293b, #0f172a);border:1px solid rgba(255,255,255,0.1);width:90%;max-width:420px;border-radius:20px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);overflow:hidden;transform:translateY(20px) scale(0.95);transition:transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);}
                .history-modal-overlay.active .history-modal-content{transform:translateY(0) scale(1);}
                .history-header{padding:20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.08);}
                .history-header h3{color:#f8fafc;font-size:1.15rem;font-weight:600;margin:0;letter-spacing:0.5px;}
                .history-close-btn{background:rgba(255,255,255,0.05);border:none;color:#94a3b8;font-size:1.5rem;width:35px;height:35px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;}
                .history-close-btn:hover{background:rgba(239,68,68,0.2);color:#ef4444;}
                .history-body{padding:20px;max-height:350px;overflow-y:auto;}
                .history-list{display:flex;flex-direction:column;gap:12px;}
                .history-card-item{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);padding:14px 16px;border-radius:12px;display:flex;flex-direction:column;gap:4px;transition:background 0.2s;}
                .history-card-item:hover{background:rgba(255,255,255,0.06);}
                .history-item-title{color:#e2e8f0;font-size:0.95rem;font-weight:500;}
                .history-item-time{color:#64748b;font-size:0.75rem;}
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', historyStyles);
    }

    // 3. Dummy History Data
    const sampleHistory = [
        { title: "Generated Key #A892", time: "Today, 10:45 AM" },
        { title: "Updated Profile Settings", time: "Yesterday, 4:15 PM" },
        { title: "Logged into System", time: "Oct 24, 08:30 AM" }
    ];

    // 4. Element Selectors & Modal
    const historyModal = document.getElementById('history-modal');
    const historyCloseBtn = document.getElementById('history-close-btn');
    const historyListContainer = document.getElementById('history-list-container');

    // Render History Cards function
    function renderHistory() {
        if (!historyListContainer) return;
        historyListContainer.innerHTML = '';
        sampleHistory.forEach(item => {
            const cardHTML = `
                <div class="history-card-item">
                    <span class="history-item-title">${item.title}</span>
                    <span class="history-item-time">${item.time}</span>
                </div>
            `;
            historyListContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // Open Modal and render data
    renderHistory();
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