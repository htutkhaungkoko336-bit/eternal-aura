// tournament.js
import { renderModeScreen } from './mode.js';

// ၄ ခုသော Groups (GP1, GP2, GP3, GP4)
const tournamentGroups = [
    { id: 1, name: "GP 1", time: "16.8 - 6:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] },
    { id: 2, name: "GP 2", time: "16.8 - 7:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] },
    { id: 3, name: "GP 3", time: "16.8 - 8:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] },
    { id: 4, name: "GP 4", time: "16.8 - 9:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] }
];

export function renderTournamentScreen(container) {
    container.innerHTML = `
        <div style="padding: 10px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; box-sizing: border-box; overflow-y: auto;">
            
            <div style="display: flex; align-items: center; width: 100%; max-width: 340px; margin-bottom: 15px;">
                <button id="back-to-mode" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold;">← Back</button>
                <h2 style="color: #38bdf8; margin: 0 auto; font-size: 14px; text-transform: uppercase;">Tournament Bracket</h2>
            </div>

            <!-- Vertical Tree Container -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%; max-width: 340px;">
                
                <!-- TOP GROUPS (GP1 & GP2) -->
                <div style="display: flex; gap: 10px;">
                    ${renderGroupCard(tournamentGroups[0])}
                    ${renderGroupCard(tournamentGroups[1])}
                </div>

                <!-- TOP SEMI-FINAL -->
                <div style="background: #1e293b; border: 1px solid #38bdf8; padding: 6px 15px; border-radius: 8px; font-size: 9px; color: #cbd5e1; text-align: center;">
                    SEMI 1: GP1 Winner vs GP2 Winner
                </div>

                <!-- CENTER CHAMPION BOX -->
                <div style="background: linear-gradient(to bottom, #0f172a, #1e293b); border: 2px solid #facc15; padding: 12px; border-radius: 12px; width: 80%; text-align: center; box-shadow: 0 0 15px rgba(250, 204, 21, 0.2);">
                    <span style="font-size: 11px; color: #facc15; font-weight: bold; text-transform: uppercase;">👑 Champion</span>
                    <div style="margin-top: 8px; display: flex; justify-content: space-between; gap: 10px;">
                        <div style="flex:1; background: #0f172a; padding: 5px; border-radius: 4px; font-size: 9px;">Finalist 1</div>
                        <div style="flex:1; background: #0f172a; padding: 5px; border-radius: 4px; font-size: 9px;">Finalist 2</div>
                    </div>
                </div>

                <!-- BOTTOM SEMI-FINAL -->
                <div style="background: #1e293b; border: 1px solid #38bdf8; padding: 6px 15px; border-radius: 8px; font-size: 9px; color: #cbd5e1; text-align: center;">
                    SEMI 2: GP3 Winner vs GP4 Winner
                </div>

                <!-- BOTTOM GROUPS (GP3 & GP4) -->
                <div style="display: flex; gap: 10px;">
                    ${renderGroupCard(tournamentGroups[2])}
                    ${renderGroupCard(tournamentGroups[3])}
                </div>

            </div>
        </div>
    `;

    document.getElementById('back-to-mode').addEventListener('click', () => renderModeScreen(container));

    container.querySelectorAll('.group-slot').forEach(el => {
        el.addEventListener('click', (e) => {
            const groupId = parseInt(e.currentTarget.getAttribute('data-group'));
            const slotIndex = parseInt(e.currentTarget.getAttribute('data-slot'));
            const group = tournamentGroups.find(g => g.id === groupId);
            if (group.slots[slotIndex].status === 'available') {
                showTournamentRegForm(container, groupId, slotIndex);
            } else {
                alert("ဒီ Slot ကို ဝယ်ယူပြီးပါပြီ။");
            }
        });
    });
}

function renderGroupCard(group) {
    return `
        <div style="background: #1e293b; border: 1px solid #334155; padding: 6px; border-radius: 8px; width: 75px; text-align: center;">
            <div style="font-size: 8px; color: #38bdf8; font-weight: bold; margin-bottom: 4px;">${group.name}</div>
            <div style="display: flex; flex-direction: column; gap: 3px;">
                ${group.slots.map((slot, idx) => `
                    <div class="group-slot" data-group="${group.id}" data-slot="${idx}"
                         style="background: ${slot.status === 'available' ? '#0f172a' : '#334155'}; border: 1px solid ${slot.status === 'available' ? '#38bdf8' : '#ef4444'}; padding: 4px; border-radius: 4px; cursor: pointer;">
                        <span style="font-size: 8px; color: ${slot.team ? '#fff' : '#38bdf8'}; overflow: hidden; white-space: nowrap; display: block;">
                            ${slot.team || 'Slot ' + (idx + 1)}
                        </span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showTournamentRegForm(container, groupId, slotIndex) {
    const group = tournamentGroups.find(g => g.id === groupId);
    const slot = group.slots[slotIndex];
    
    container.innerHTML = `
        <div style="padding: 20px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%;">
            <button id="back-to-brackets" style="background: none; border: none; color: #38bdf8; margin-bottom: 10px;">← Back</button>
            <div style="width: 100%; max-width: 320px; background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #38bdf8;">
                <h3 style="margin: 0 0 10px 0; color: #38bdf8; font-size: 14px;">Register ${group.name}</h3>
                <input type="text" id="tour-team-name" placeholder="Enter Team Name" style="width: 100%; padding: 8px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: white; margin-bottom: 10px;">
                <button id="submit-tour-reg" style="width: 100%; padding: 10px; background: #38bdf8; border: none; border-radius: 6px; font-weight: bold; color: #0f172a;">Confirm</button>
            </div>
        </div>
    `;

    document.getElementById('back-to-brackets').addEventListener('click', () => renderTournamentScreen(container));
    document.getElementById('submit-tour-reg').addEventListener('click', () => {
        const name = document.getElementById('tour-team-name').value;
        if (name) {
            slot.status = 'pending';
            slot.team = name;
            alert("Success!");
            renderTournamentScreen(container);
        }
    });
}