// tournament.js
import { renderModeScreen } from './mode.js';

let tournamentData = {
    groups: [
        { id: 1, name: "Group 1", date: "16.8.2026", time: "6:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] },
        { id: 2, name: "Group 2", date: "16.8.2026", time: "7:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] },
        { id: 3, name: "Group 3", date: "16.8.2026", time: "8:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] },
        { id: 4, name: "Group 4", date: "16.8.2026", time: "9:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] }
    ]
};

export function renderTournamentScreen(container) {
    container.innerHTML = `
        <div style="padding: 15px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; min-height: 100vh; background: #0f172a; box-sizing: border-box;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 400px; margin-bottom: 15px;">
                <button id="back-to-mode" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-size: 12px;">← Back</button>
                <h2 style="color: #38bdf8; margin: 0; font-size: 16px; text-transform: uppercase;">Tournament Brackets</h2>
                <button id="toggle-admin" style="background: #1e293b; border: 1px solid #38bdf8; color: #38bdf8; padding: 3px 8px; border-radius: 4px; font-size: 9px; cursor: pointer;">Admin</button>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%; max-width: 400px;">
                
                <div style="display: flex; justify-content: space-between; width: 100%; gap: 10px;">
                    ${renderGroupCard(tournamentData.groups[0])}
                    ${renderGroupCard(tournamentData.groups[1])}
                </div>

                ${renderMatchBox("SEMI FINAL 1", "GP1 Winner", "GP2 Winner", "10:00 PM")}

                <!-- CHAMPION BO5 -->
                <div style="background: linear-gradient(135deg, #1e293b, #0f172a); border: 2px solid #facc15; padding: 15px; border-radius: 12px; width: 100%; text-align: center; box-shadow: 0 0 15px rgba(250, 204, 21, 0.2);">
                    <div style="font-size: 12px; color: #facc15; font-weight: bold; margin-bottom: 5px;">👑 CHAMPIONSHIP (BO 5) 👑</div>
                    <div style="display: flex; justify-content: space-between; gap: 10px; align-items: center;">
                        <div style="flex:1; padding: 8px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; font-size: 10px; font-weight: bold;">Finalist 1</div>
                        <div style="color: #facc15; font-size: 10px; font-weight: bold;">VS</div>
                        <div style="flex:1; padding: 8px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; font-size: 10px; font-weight: bold;">Finalist 2</div>
                    </div>
                </div>

                ${renderMatchBox("SEMI FINAL 2", "GP3 Winner", "GP4 Winner", "10:30 PM")}

                <div style="display: flex; justify-content: space-between; width: 100%; gap: 10px;">
                    ${renderGroupCard(tournamentData.groups[2])}
                    ${renderGroupCard(tournamentData.groups[3])}
                </div>
            </div>
        </div>
    `;

    // Event Listeners
    document.getElementById('back-to-mode').addEventListener('click', () => renderModeScreen(container));
    document.getElementById('toggle-admin').addEventListener('click', () => showAdminEditor(container));
    
    container.querySelectorAll('.group-slot').forEach(el => {
        el.addEventListener('click', (e) => {
            const groupId = parseInt(e.currentTarget.getAttribute('data-group'));
            const slotIndex = parseInt(e.currentTarget.getAttribute('data-slot'));
            const group = tournamentData.groups.find(g => g.id === groupId);
            if (group.slots[slotIndex].status === 'available') {
                showTournamentRegForm(container, groupId, slotIndex);
            } else {
                alert("ဒီနေရာကို ဝယ်ယူပြီးပါပြီ။");
            }
        });
    });
}

function renderGroupCard(group) {
    return `
        <div style="border: 1px solid #334155; padding: 8px; border-radius: 8px; width: 48%; background: #1e293b;">
            <div style="text-align: center; font-size: 9px; color: #38bdf8; font-weight: bold;">${group.name}</div>
            <div style="text-align: center; font-size: 7px; color: #94a3b8; margin-bottom: 6px;">${group.date} | ${group.time}</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
                ${group.slots.map((s, i) => `
                    <div class="group-slot" data-group="${group.id}" data-slot="${i}" style="background: #0f172a; border: 1px solid #38bdf8; padding: 5px; border-radius: 4px; text-align: center; cursor: pointer; font-size: 9px; color: white;">
                        ${s.team || 'Slot ' + (i+1)}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderMatchBox(title, w1, w2, time) {
    return `
        <div style="background: #1e293b; border: 1px solid #475569; padding: 10px; border-radius: 8px; width: 100%; text-align: center;">
            <div style="font-size: 9px; color: #38bdf8; font-weight: bold;">${title}</div>
            <div style="font-size: 8px; color: #94a3b8; margin-bottom: 5px;">${time}</div>
            <div style="display: flex; justify-content: space-around; font-size: 9px; color: #cbd5e1;">
                <span>${w1}</span> <span style="color:#facc15;">VS</span> <span>${w2}</span>
            </div>
        </div>
    `;
}

// Admin Editor
function showAdminEditor(container) {
    container.innerHTML = `
        <div style="padding: 20px; color: white; width: 100%; max-width: 400px; margin: auto;">
            <button id="back-to-bracket" style="background: none; border: none; color: #38bdf8; cursor: pointer;">← Back</button>
            <h3 style="color: #38bdf8;">Admin Settings</h3>
            ${tournamentData.groups.map((g, i) => `
                <div style="margin-bottom: 10px; background: #1e293b; padding: 10px; border-radius: 6px;">
                    <div style="font-size: 10px;">${g.name}</div>
                    <input type="text" id="date-${i}" value="${g.date}" style="width: 48%; padding: 4px;">
                    <input type="text" id="time-${i}" value="${g.time}" style="width: 48%; padding: 4px;">
                </div>
            `).join('')}
            <button id="save-settings" style="width: 100%; padding: 10px; background: #38bdf8; border: none; border-radius: 6px; cursor: pointer;">Save</button>
        </div>
    `;
    document.getElementById('back-to-bracket').addEventListener('click', () => renderTournamentScreen(container));
    document.getElementById('save-settings').addEventListener('click', () => {
        tournamentData.groups.forEach((g, i) => {
            g.date = document.getElementById(`date-${i}`).value;
            g.time = document.getElementById(`time-${i}`).value;
        });
        alert("သိမ်းဆည်းပြီးပါပြီ။");
        renderTournamentScreen(container);
    });
}
// (Register form function ကျန်သည်ကိုလည်း လိုအပ်ပါက ထည့်သွင်းနိုင်ပါသည်)