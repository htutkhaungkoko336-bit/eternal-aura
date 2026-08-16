// tournament.js
import { renderModeScreen } from './mode.js';

// ၈ သင်းစာ Tournament Slots များ
const tournamentSlots = [
    { id: 1, time: "16.8.2026 - 6:00 PM", status: "available", team: null },
    { id: 2, time: "16.8.2026 - 6:30 PM", status: "available", team: null },
    { id: 3, time: "16.8.2026 - 7:00 PM", status: "available", team: null },
    { id: 4, time: "16.8.2026 - 7:30 PM", status: "available", team: null },
    { id: 5, time: "16.8.2026 - 8:00 PM", status: "available", team: null },
    { id: 6, time: "16.8.2026 - 8:30 PM", status: "available", team: null },
    { id: 7, time: "16.8.2026 - 9:00 PM", status: "available", team: null },
    { id: 8, time: "16.8.2026 - 9:30 PM", status: "available", team: null }
];

export function renderTournamentScreen(container) {
    container.innerHTML = `
        <div style="padding: 16px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box; overflow-y: auto;">
            
            <!-- Header -->
            <div style="display: flex; align-items: center; width: 100%; max-width: 340px; margin-bottom: 12px;">
                <button id="back-to-mode" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold; padding: 0;">← Back</button>
                <h2 style="color: #38bdf8; margin: 0 auto; font-size: 16px; text-transform: uppercase;">Tournament Bracket</h2>
            </div>
            
            <!-- 1. Slot Booking Section -->
            <div style="width: 100%; max-width: 340px; margin-bottom: 20px;">
                <h3 style="font-size: 13px; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">1. Select Slot / Register</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                    ${tournamentSlots.map(slot => `
                        <div class="slot-card" data-id="${slot.id}" 
                             style="background: #1e293b; padding: 8px; border-radius: 8px; border: 1px solid ${slot.status === 'available' ? '#38bdf8' : (slot.status === 'pending' ? '#facc15' : '#ef4444')}; cursor: ${slot.status === 'available' ? 'pointer' : 'not-allowed'}; text-align: center;">
                            <p style="font-size: 9px; color: #94a3b8; margin: 0;">${slot.time}</p>
                            <p style="margin: 3px 0; font-size: 11px; font-weight: bold; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${slot.team || 'Slot ' + slot.id}</p>
                            <span style="font-size: 8px; padding: 2px 4px; border-radius: 3px; background: ${slot.status === 'available' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color: ${slot.status === 'available' ? '#22c55e' : '#ef4444'}; text-transform: uppercase;">${slot.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 2. Visual Bracket Section (ညီမဆွဲပြထားသည့် ပုံစံအတိုင်း) -->
            <div style="width: 100%; max-width: 340px; background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 12px; box-sizing: border-box;">
                <h3 style="font-size: 13px; color: #38bdf8; margin: 0 0 12px 0; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">Tournament Tree</h3>
                
                <div style="display: flex; flex-direction: column; gap: 10px; align-items: center; font-size: 10px;">
                    
                    <!-- Quarter Finals (Top 4 slots) -->
                    <div style="display: flex; justify-content: space-between; width: 100%; gap: 4px;">
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 4px; width: 23%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tournamentSlots[0].team || 'Slot 1'}</div>
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 4px; width: 23%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tournamentSlots[1].team || 'Slot 2'}</div>
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 4px; width: 23%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tournamentSlots[2].team || 'Slot 3'}</div>
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 4px; width: 23%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tournamentSlots[3].team || 'Slot 4'}</div>
                    </div>

                    <!-- Semi Finals (Top Side) -->
                    <div style="display: flex; justify-content: space-around; width: 70%;">
                        <div style="background: #1e293b; border: 1px solid #38bdf8; padding: 6px; border-radius: 4px; width: 40%; text-align: center;">Semi 1</div>
                        <div style="background: #1e293b; border: 1px solid #38bdf8; padding: 6px; border-radius: 4px; width: 40%; text-align: center;">Semi 2</div>
                    </div>

                    <!-- Finals / Champion -->
                    <div style="background: linear-gradient(to right, #38bdf8, #818cf8); color: #0f172a; font-weight: bold; padding: 8px; border-radius: 6px; width: 50%; text-align: center; text-transform: uppercase;">
                        👑 Champion (Finals)
                    </div>

                    <!-- Semi Finals (Bottom Side) -->
                    <div style="display: flex; justify-content: space-around; width: 70%;">
                        <div style="background: #1e293b; border: 1px solid #38bdf8; padding: 6px; border-radius: 4px; width: 40%; text-align: center;">Semi 3</div>
                        <div style="background: #1e293b; border: 1px solid #38bdf8; padding: 6px; border-radius: 4px; width: 40%; text-align: center;">Semi 4</div>
                    </div>

                    <!-- Quarter Finals (Bottom 4 slots) -->
                    <div style="display: flex; justify-content: space-between; width: 100%; gap: 4px;">
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 4px; width: 23%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tournamentSlots[4].team || 'Slot 5'}</div>
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 4px; width: 23%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tournamentSlots[5].team || 'Slot 6'}</div>
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 4px; width: 23%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tournamentSlots[6].team || 'Slot 7'}</div>
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 4px; width: 23%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tournamentSlots[7].team || 'Slot 8'}</div>
                    </div>

                </div>
            </div>

        </div>
    `;

    // Back button
    document.getElementById('back-to-mode').addEventListener('click', () => {
        renderModeScreen(container);
    });

    // Slot click handler
    const slotCards = container.querySelectorAll('.slot-card');
    slotCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const slotId = parseInt(e.currentTarget.getAttribute('data-id'));
            const slot = tournamentSlots.find(s => s.id === slotId);
            
            if (slot.status !== 'available') {
                alert("ဒီ Slot ကို ဝယ်ယူပြီးပါပြီ (သို့) စောင့်ဆိုင်းဆဲ ဖြစ်နေပါသည်။");
                return;
            }
            showTournamentRegForm(container, slotId);
        });
    });
}

// Registration Form 
function showTournamentRegForm(container, slotId) {
    const slot = tournamentSlots.find(s => s.id === slotId);
    
    container.innerHTML = `
        <div style="padding: 20px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box;">
            <div style="display: flex; align-items: center; width: 100%; max-width: 340px; margin-bottom: 15px;">
                <button id="back-to-slots" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold;">← Back</button>
            </div>
            
            <div style="width: 100%; max-width: 340px; background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; display: flex; flex-direction: column; gap: 12px;">
                <h3 style="margin: 0; color: #38bdf8; font-size: 16px;">Register Slot ${slotId}</h3>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Time: ${slot.time}</p>
                
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-size: 12px; color: #cbd5e1;">Team Name</label>
                    <input type="text" id="tour-team-name" placeholder="Enter Team Name" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; border-radius: 8px; color: white; outline: none; box-sizing: border-box;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-size: 12px; color: #cbd5e1;">Payment Screenshot</label>
                    <input type="file" id="tour-payment-img" style="width: 100%; color: #94a3b8; font-size: 12px;">
                </div>

                <button id="submit-tour-reg" style="width: 100%; padding: 12px; background: linear-gradient(to right, #38bdf8, #818cf8); border: none; border-radius: 8px; font-weight: bold; color: #0f172a; cursor: pointer; margin-top: 10px;">Submit Booking</button>
            </div>
        </div>
    `;

    document.getElementById('back-to-slots').addEventListener('click', () => {
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