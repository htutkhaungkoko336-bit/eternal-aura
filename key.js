// key.js

export const trophyDataList = [
    // 5vs5 Mode (၅ ခု)
    { id: 1, category: '5v5', name: '5K 5v5', keysRequired: '5K', isUnlocked: false },
    { id: 2, category: '5v5', name: '10K 5v5', keysRequired: '10K', isUnlocked: false },
    { id: 3, category: '5v5', name: '15K 5v5', keysRequired: '15K', isUnlocked: false },
    { id: 4, category: '5v5', name: '25K 5v5', keysRequired: '25K', isUnlocked: false },
    { id: 5, category: '5v5', name: '50K 5v5', keysRequired: '50K', isUnlocked: false },
    
    // 1vs1 Mode (၅ ခု)
    { id: 6, category: '1v1', name: '5K 1v1', keysRequired: '5K', isUnlocked: false },
    { id: 7, category: '1v1', name: '10K 1v1', keysRequired: '10K', isUnlocked: false },
    { id: 8, category: '1v1', name: '15K 1v1', keysRequired: '15K', isUnlocked: false },
    { id: 9, category: '1v1', name: '1-v-1 25K', keysRequired: '25K', isUnlocked: false },
    { id: 10, category: '1v1', name: '1-v-1 50K', keysRequired: '50K', isUnlocked: false },
    
    // Tournament (၁ ခု)
    { id: 11, category: 'tour', name: 'Tournament', keysRequired: 'TOUR', isUnlocked: false }
];

export function renderTrophyShowcase(containerId, onTrophyClick) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 4px; max-height: 320px; overflow-y: auto;">
            ${trophyDataList.map(t => `
                <div class="trophy-item-box" data-id="${t.id}" style="
                    background: rgba(15, 23, 42, 0.85);
                    border: 1px solid ${t.isUnlocked ? '#38bdf8' : '#334155'};
                    border-radius: 10px;
                    padding: 8px 4px;
                    text-align: center;
                    cursor: pointer;
                    box-shadow: ${t.isUnlocked ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none'};
                ">
                    <div style="font-size: 11px; font-weight: bold; color: ${t.isUnlocked ? '#38bdf8' : '#94a3b8'};">${t.name}</div>
                    <div style="font-size: 9px; color: #c084fc; margin-top: 4px;">${t.keysRequired} Keys</div>
                </div>
            `).join('')}
        </div>
    `;

    container.querySelectorAll('.trophy-item-box').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.getAttribute('data-id'));
            const trophy = trophyDataList.find(t => t.id === id);
            if (trophy && onTrophyClick) {
                onTrophyClick(trophy);
            }
        });
    });
}