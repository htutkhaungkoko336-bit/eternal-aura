// tournament.js
import { renderModeScreen } from './mode.js';

let tournamentData = {
    groups: [
        { 
            id: 1, name: "Group 1", date: "16.8.2026", time: "6:00 PM", 
            slots: [
                { team: null, status: "available" }, { team: null, status: "available" },
                { team: null, status: "available" }, { team: null, status: "available" }
            ] 
        },
        { 
            id: 2, name: "Group 2", date: "16.8.2026", time: "7:00 PM", 
            slots: [
                { team: null, status: "available" }, { team: null, status: "available" },
                { team: null, status: "available" }, { team: null, status: "available" }
            ] 
        },
        { 
            id: 3, name: "Group 3", date: "16.8.2026", time: "8:00 PM", 
            slots: [
                { team: null, status: "available" }, { team: null, status: "available" },
                { team: null, status: "available" }, { team: null, status: "available" }
            ] 
        },
        { 
            id: 4, name: "Group 4", date: "16.8.2026", time: "9:00 PM", 
            slots: [
                { team: null, status: "available" }, { team: null, status: "available" },
                { team: null, status: "available" }, { team: null, status: "available" }
            ] 
        }
    ],
    semis: [
        { name: "SEMI 1", date: "16.8.2026", time: "10:00 PM", team1: "Group 1 Winner", team2: "Group 2 Winner" },
        { name: "SEMI 2", date: "16.8.2026", time: "10:30 PM", team1: "Group 3 Winner", team2: "Group 4 Winner" }
    ]
};

export function renderTournamentScreen(container) {
    container.innerHTML = `
        <div style="padding: 10px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; box-sizing: border-box; overflow-y: auto;">
            
            <!-- Header with Back & Admin Toggle -->
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 380px; margin-bottom: 10px;">
                <button id="back-to-mode" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold; font-size: 12px;">← Back</button>
                <h2 style="color: #38bdf8; margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Tournament Brackets</h2>
                <button id="toggle-admin" style="background: #334155; border: 1px solid #38bdf8; color: #38bdf8; padding: 3px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">Admin Edit</button>
            </div>

            <!-- Main Vertical Tree Container -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; max-width: 380px; padding-bottom: 20px;">
                
                <!-- TOP GROUPS (Group 1 & Group 2) -->
                <div style="display: flex; justify-content: space-between; width: 100%; gap: 8px;">
                    ${renderGroupCard(tournamentData.groups[0])}
                    ${renderGroupCard(tournamentData.groups[1])}
                </div>

                <!-- SEMI FINAL 1 -->
                <div style="background: rgba(30, 41, 59, 0.9); border: 1px solid #38bdf8; padding: 10px 12px; border-radius: 8px; width: 90%; text-align: center; box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
                        <span style="font-size: 10px; color: #38bdf8; font-weight: bold;">SEMI 1</span>
                        <span style="font-size: 8px; color: #94a3b8;">${tournamentData.semis[0].date} ${tournamentData.semis[0].time}</span>
                    </div>
                    <div style="display: flex; justify-content: space-around; align-items: center; font-size: 9px; color: #cbd5e1; padding: 4px 0;">
                        <span style="background: #0f172a; border: 1px solid #475569; padding: 6px 8px; border-radius: 6px; flex: 1;">${tournamentData.semis[0].team1}</span>
                        <span style="color: #f97316; font-weight: bold; padding: 0 8px;">VS BO3</span>
                        <span style="background: #0f172a; border: 1px solid #475569; padding: 6px 8px; border-radius: 6px; flex: 1;">${tournamentData.semis[0].team2}</span>
                    </div>
                </div>

                <!-- CHAMPION BOX -->
                <div style="background: linear-gradient(to bottom, #0f172a, #1e293b); border: 2px solid #facc15; padding: 12px; border-radius: 12px; width: 95%; text-align: center; box-shadow: 0 0 15px rgba(250, 204, 21, 0.25);">
                    <span style="font-size: 11px; color: #facc15; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">👑 Champion</span>
                    <div style="margin-top: 8px; display: flex; justify-content: space-between; gap: 8px;">
                        <div style="flex:1; background: #1e293b; border: 1px solid #475569; padding: 8px; border-radius: 6px; font-size: 9px; color: #f8fafc; font-weight: bold;">Finalist 1</div>
                        <span style="align-self: center; font-size: 10px; color: #f97316; font-weight: bold;">VS BO3</span>
                        <div style="flex:1; background: #1e293b; border: 1px solid #475569; padding: 8px; border-radius: 6px; font-size: 9px; color: #f8fafc; font-weight: bold;">Finalist 2</div>
                    </div>
                </div>

                <!-- SEMI FINAL 2 -->
                <div style="background: rgba(30, 41, 59, 0.9); border: 1px solid #38bdf8; padding: 10px 12px; border-radius: 8px; width: 90%; text-align: center; box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
                        <span style="font-size: 10px; color: #38bdf8; font-weight: bold;">SEMI 2</span>
                        <span style="font-size: 8px; color: #94a3b8;">${tournamentData.semis[1].date} ${tournamentData.semis[1].time}</span>
                    </div>
                    <div style="display: flex; justify-content: space-around; align-items: center; font-size: 9px; color: #cbd5e1; padding: 4px 0;">
                        <span style="background: #0f172a; border: 1px solid #475569; padding: 6px 8px; border-radius: 6px; flex: 1;">${tournamentData.semis[1].team1}</span>
                        <span style="color: #f97316; font-weight: bold; padding: 0 8px;">VS BO3</span>
                        <span style="background: #0f172a; border: 1px solid #475569; padding: 6px 8px; border-radius: 6px; flex: 1;">${tournamentData.semis[1].team2}</span>
                    </div>
                </div>

                <!-- BOTTOM GROUPS (Group 3 & Group 4) -->
                <div style="display: flex; justify-content: space-between; width: 100%; gap: 8px;">
                    ${renderGroupCard(tournamentData.groups[2])}
                    ${renderGroupCard(tournamentData.groups[3])}
                </div>

            </div>
        </div>
    `;

    // Events
    document.getElementById('back-to-mode').addEventListener('click', () => renderModeScreen(container));
    
    document.getElementById('toggle-admin').addEventListener('click', () => {
        showAdminEditor(container);
    });

    container.querySelectorAll('.group-slot').forEach(el => {
        el.addEventListener('click', (e) => {
            const groupId = parseInt(e.currentTarget.getAttribute('data-group'));
            const slotIndex = parseInt(e.currentTarget.getAttribute('data-slot'));
            const group = tournamentData.groups.find(g => g.id === groupId);
            if (group.slots[slotIndex].status === 'available') {
                showTournamentRegForm(container, groupId, slotIndex);
            } else {
                alert("ဒီ Slot ကို ဝယ်ယူပြီးပါပြီ။");
            }
        });
    });
}

// Group Card UI (Group တစ်ခုချင်းစီတွင် Slot ၄ ခုစီပါဝင်ပြီး စုစုပေါင်း Slot ၈ ခုအထိ ဖြစ်စေသည်)
function renderGroupCard(group) {
    return `
        <div style="background: #1e293b; border: 1px solid #334155; padding: 10px; border-radius: 10px; width: 48%; box-sizing: border-box; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
                <span style="font-size: 10px; color: #38bdf8; font-weight: bold; text-transform: uppercase;">${group.name}</span>
                <span style="font-size: 8px; color: #94a3b8;">${group.date} ${group.time}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
                ${group.slots.map((slot, index) => `
                    <div class="group-slot" data-group="${group.id}" data-slot="${index}"
                         style="background: ${slot.status === 'available' ? '#0f172a' : '#334155'}; border: 1px solid ${slot.status === 'available' ? '#38bdf8' : '#ef4444'}; padding: 6px 4px; border-radius: 6px; text-align: center; cursor: pointer;">
                        <span style="font-size: 9px; color: ${slot.team ? '#fff' : '#38bdf8'}; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;">
                            ${slot.team || `Slot ${index + 1}`}
                        </span>
                    </div>
                    ${index === 1 ? `<div style="text-align: center; font-size: 8px; color: #f97316; font-weight: bold; padding: 2px 0;">VS BO3</div>` : ''}
                `).join('')}
            </div>
        </div>
    `;
}

// Admin Editor Panel
function showAdminEditor(container) {
    container.innerHTML = `
        <div style="padding: 15px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box; overflow-y: auto; height: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 360px; margin-bottom: 15px;">
                <button id="back-to-bracket" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold;">← Back</button>
                <h3 style="color: #38bdf8; margin: 0; font-size: 14px;">Admin: Edit Date & Time</h3>
            </div>
            
            <div style="width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 12px;">
                ${tournamentData.groups.map((group, idx) => `
                    <div style="background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid #334155;">
                        <h4 style="margin: 0 0 8px 0; color: #38bdf8; font-size: 11px;">${group.name} Settings</h4>
                        <div style="display: flex; gap: 8px;">
                            <div style="flex: 1;">
                                <label style="font-size: 8px; color: #94a3b8;">Date</label>
                                <input type="text" id="date-${idx}" value="${group.date}" style="width: 100%; padding: 6px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 10px; box-sizing: border-box;">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 8px; color: #94a3b8;">Time</label>
                                <input type="text" id="time-${idx}" value="${group.time}" style="width: 100%; padding: 6px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 10px; box-sizing: border-box;">
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <button id="save-settings" style="width: 100%; padding: 10px; background: #38bdf8; border: none; border-radius: 6px; font-weight: bold; color: #0f172a; cursor: pointer; margin-top: 10px;">Save Changes</button>
            </div>
        </div>
    `;

    document.getElementById('back-to-bracket').addEventListener('click', () => renderTournamentScreen(container));

    document.getElementById('save-settings').addEventListener('click', () => {
        tournamentData.groups.forEach((group, idx) => {
            const newDate = document.getElementById(`date-${idx}`).value.trim();
            const newTime = document.getElementById(`time-${idx}`).value.trim();
            if(newDate) group.date = newDate;
            if(newTime) group.time = newTime;
        });
        alert("ချိန်ညှိမှုများကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။");
        renderTournamentScreen(container);
    });
}

// Registration Form
function showTournamentRegForm(container, groupId, slotIndex) {
    const group = tournamentData.groups.find(g => g.id === groupId);
    const slot = group.slots[slotIndex];
    
    container.innerHTML = `
        <div style="padding: 20px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%;">
            <button id="back-to-brackets" style="background: none; border: none; color: #38bdf8; margin-bottom: 10px; cursor: pointer;">← Back</button>
            <div style="width: 100%; max-width: 320px; background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #38bdf8;">
                <h3 style="margin: 0 0 5px 0; color: #38bdf8; font-size: 14px;">Register ${group.name} - Slot ${slotIndex + 1}</h3>
                <p style="font-size: 10px; color: #94a3b8; margin: 0 0 10px 0;">${group.date} - ${group.time}</p>
                
                <label style="font-size: 10px; color: #cbd5e1;">Team Name</label>
                <input type="text" id="tour-team-name" placeholder="Enter Team Name" style="width: 100%; padding: 8px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: white; margin: 5px 0 12px 0; box-sizing: border-box;">
                
                <button id="submit-tour-reg" style="width: 100%; padding: 10px; background: #38bdf8; border: none; border-radius: 6px; font-weight: bold; color: #0f172a; cursor: pointer;">Confirm Registration</button>
            </div>
        </div>
    `;

    document.getElementById('back-to-brackets').addEventListener('click', () => renderTournamentScreen(container));
    document.getElementById('submit-tour-reg').addEventListener('click', () => {
        const name = document.getElementById('tour-team-name').value.trim();
        if (name) {
            slot.status = 'pending';
            slot.team = name;
            alert("Registration Submitted Successfully!");
            renderTournamentScreen(container);
        } else {
            alert("ကျေးဇူးပြု၍ Team Name ထည့်ပါ။");
        }
    });
}