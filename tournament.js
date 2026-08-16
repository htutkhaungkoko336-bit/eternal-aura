// tournament.js
import { renderModeScreen } from './mode.js';

// Group ၁ ခုလျှင် ၂ သင်း (စုစုပေါင်း ၈ သင်း / ၄ ခုသော Group)
const tournamentGroups = [
    { id: 1, name: "GP 1", time: "16.8.2026 - 6:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] },
    { id: 2, name: "GP 2", time: "16.8.2026 - 7:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] },
    { id: 3, name: "GP 3", time: "16.8.2026 - 8:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] },
    { id: 4, name: "GP 4", time: "16.8.2026 - 9:00 PM", slots: [{ team: null, status: "available" }, { team: null, status: "available" }] }
];

export function renderTournamentScreen(container) {
    container.innerHTML = `
        <div style="padding: 10px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; box-sizing: border-box; overflow-x: auto; overflow-y: auto;">
            
            <!-- Header -->
            <div style="display: flex; align-items: center; width: 100%; min-width: 340px; margin-bottom: 10px;">
                <button id="back-to-mode" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold; padding: 0;">← Back</button>
                <h2 style="color: #38bdf8; margin: 0 auto; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Tournament Brackets</h2>
            </div>

            <!-- Main Horizontal Tree Container -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; width: max-content; padding: 10px 0;">
                
                <!-- LEFT SIDE (GP1 & GP2) -->
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${renderGroupCard(tournamentGroups[0])}
                    ${renderGroupCard(tournamentGroups[1])}
                </div>

                <!-- LEFT SEMI FINAL (GP1 Winner vs GP2 Winner) -->
                <div style="background: #1e293b; border: 1px solid #38bdf8; padding: 8px; border-radius: 8px; width: 90px; text-align: center; display: flex; flex-direction: column; gap: 6px;">
                    <span style="font-size: 9px; color: #38bdf8; font-weight: bold;">SEMI 1</span>
                    <div style="background: #0f172a; padding: 4px; border-radius: 4px; font-size: 8px; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">GP1 Winner</div>
                    <span style="font-size: 8px; color: #94a3b8;">VS</span>
                    <div style="background: #0f172a; padding: 4px; border-radius: 4px; font-size: 8px; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">GP2 Winner</div>
                </div>

                <!-- CENTER: CHAMPION -->
                <div style="background: linear-gradient(to bottom, #0f172a, #1e293b); border: 2px solid #38bdf8; padding: 10px; border-radius: 12px; width: 100px; text-align: center; box-shadow: 0 0 12px rgba(56, 189, 248, 0.3); display: flex; flex-direction: column; gap: 6px;">
                    <span style="font-size: 10px; color: #facc15; font-weight: bold; text-transform: uppercase;">👑 Champion</span>
                    <div style="background: #1e293b; border: 1px solid #475569; padding: 5px; border-radius: 4px; font-size: 9px; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Finalist 1</div>
                    <span style="font-size: 8px; color: #38bdf8; font-weight: bold;">VS</span>
                    <div style="background: #1e293b; border: 1px solid #475569; padding: 5px; border-radius: 4px; font-size: 9px; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Finalist 2</div>
                </div>

                <!-- RIGHT SEMI FINAL (GP3 Winner vs GP4 Winner) -->
                <div style="background: #1e293b; border: 1px solid #38bdf8; padding: 8px; border-radius: 8px; width: 90px; text-align: center; display: flex; flex-direction: column; gap: 6px;">
                    <span style="font-size: 9px; color: #38bdf8; font-weight: bold;">SEMI 2</span>
                    <div style="background: #0f172a; padding: 4px; border-radius: 4px; font-size: 8px; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">GP3 Winner</div>
                    <span style="font-size: 8px; color: #94a3b8;">VS</span>
                    <div style="background: #0f172a; padding: 4px; border-radius: 4px; font-size: 8px; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">GP4 Winner</div>
                </div>

                <!-- RIGHT SIDE (GP3 & GP4) -->
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${renderGroupCard(tournamentGroups[2])}
                    ${renderGroupCard(tournamentGroups[3])}
                </div>

            </div>
        </div>
    `;

    // Back button event
    document.getElementById('back-to-mode').addEventListener('click', () => {
        renderModeScreen(container);
    });

    // Slot click event for booking
    const slotElements = container.querySelectorAll('.group-slot');
    slotElements.forEach(el => {
        el.addEventListener('click', (e) => {
            const groupId = parseInt(e.currentTarget.getAttribute('data-group'));
            const slotIndex = parseInt(e.currentTarget.getAttribute('data-slot'));
            const group = tournamentGroups.find(g => g.id === groupId);
            const slot = group.slots[slotIndex];

            if (slot.status !== 'available') {
                alert(`ဒီနေရာကို ဝယ်ယူပြီးပါပြီ (သို့) စောင့်ဆိုင်းဆဲ ဖြစ်နေပါသည်။`);
                return;
            }
            showTournamentRegForm(container, groupId, slotIndex);
        });
    });
}

// Group Card Generator Helper
function renderGroupCard(group) {
    return `
        <div style="background: #1e293b; border: 1px solid #334155; padding: 8px; border-radius: 8px; width: 110px; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 9px; color: #38bdf8; font-weight: bold;">${group.name}</span>
                <span style="font-size: 7px; color: #94a3b8;">6 PM</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
                ${group.slots.map((slot, idx) => `
                    <div class="group-slot" data-group="${group.id}" data-slot="${idx}"
                         style="background: ${slot.status === 'available' ? '#0f172a' : '#334155'}; border: 1px solid ${slot.status === 'available' ? '#38bdf8' : '#ef4444'}; padding: 4px; border-radius: 4px; text-align: center; cursor: ${slot.status === 'available' ? 'pointer' : 'not-allowed'};">
                        <span style="font-size: 8px; color: ${slot.team ? '#f8fafc' : '#38bdf8'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;">
                            ${slot.team || 'Slot ' + (idx + 1)}
                        </span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Registration Form 
function showTournamentRegForm(container, groupId, slotIndex) {
    const group = tournamentGroups.find(g => g.id === groupId);
    const slot = group.slots[slotIndex];
    
    container.innerHTML = `
        <div style="padding: 20px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box;">
            <div style="display: flex; align-items: center; width: 100%; max-width: 340px; margin-bottom: 15px;">
                <button id="back-to-brackets" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold;">← Back</button>
            </div>
            
            <div style="width: 100%; max-width: 340px; background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #38bdf8; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);">
                <h3 style="margin: 0; color: #38bdf8; font-size: 16px; text-transform: uppercase;">Register ${group.name} - Slot ${slotIndex + 1}</h3>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Time: ${group.time}</p>
                
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-size: 12px; color: #cbd5e1;">Team Name</label>
                    <input type="text" id="tour-team-name" placeholder="Enter Team Name" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; border-radius: 8px; color: white; outline: none; box-sizing: border-box;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-size: 12px; color: #cbd5e1;">Payment Screenshot</label>
                    <input type="file" id="tour-payment-img" style="width: 100%; color: #94a3b8; font-size: 12px;">
                </div>

                <button id="submit-tour-reg" style="width: 100%; padding: 12px; background: linear-gradient(to right, #38bdf8, #818cf8); border: none; border-radius: 8px; font-weight: bold; color: #0f172a; cursor: pointer; margin-top: 10px;">Confirm & Submit</button>
            </div>
        </div>
    `;

    document.getElementById('back-to-brackets').addEventListener('click', () => {
        renderTournamentScreen(container);
    });

    document.getElementById('submit-tour-reg').addEventListener('click', () => {
        const teamName = document.getElementById('tour-team-name').value.trim();
        if (!teamName) {
            alert("ကျေးဇူးပြု၍ Team Name ထည့်ပါ။");
            return;
        }

        slot.status = 'pending';
        slot.team = teamName;

        alert("Booking Submitted Successfully! Admin အတည်ပြုချက်ကို စောင့်ဆိုင်းနေပါသည်။");
        renderTournamentScreen(container);
    });
}