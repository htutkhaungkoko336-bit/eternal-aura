// tournament.js
import { renderModeScreen } from './mode.js';

// ၈ သင်းစာ Tournament Slots များ
const tournamentSlots = [
    { id: 1, time: "16.8 - 6:00 PM", status: "available", team: null },
    { id: 2, time: "16.8 - 6:30 PM", status: "available", team: null },
    { id: 3, time: "16.8 - 7:00 PM", status: "available", team: null },
    { id: 4, time: "16.8 - 7:30 PM", status: "available", team: null },
    { id: 5, time: "16.8 - 8:00 PM", status: "available", team: null },
    { id: 6, time: "16.8 - 8:30 PM", status: "available", team: null },
    { id: 7, time: "16.8 - 9:00 PM", status: "available", team: null },
    { id: 8, time: "16.8 - 9:30 PM", status: "available", team: null }
];

export function renderTournamentScreen(container) {
    container.innerHTML = `
        <div style="padding: 12px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; box-sizing: border-box; overflow-y: auto;">
            
            <!-- Header with Back Button -->
            <div style="display: flex; align-items: center; width: 100%; max-width: 340px; margin-bottom: 10px;">
                <button id="back-to-mode" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold; padding: 0;">← Back</button>
                <h2 style="color: #38bdf8; margin: 0 auto; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">Eternal Arena Bracket</h2>
            </div>

            <!-- Full Screen Tournament Tree Container -->
            <div style="width: 100%; max-width: 340px; background: linear-gradient(to bottom, #0f172a, #1e293b); border: 1px solid #38bdf8; border-radius: 12px; padding: 12px; box-sizing: border-box; box-shadow: 0 0 15px rgba(56, 189, 248, 0.15); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
                
                <!-- TOP SIDE (Quarter-finals to Semi) -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="text-align: center; font-size: 10px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">-- Quarter Finals (Top) --</div>
                    
                    <!-- 4 Slots (Quarter Finals) -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
                        ${renderSlotBox(0)}
                        ${renderSlotBox(1)}
                        ${renderSlotBox(2)}
                        ${renderSlotBox(3)}
                    </div>

                    <!-- Semi Final Top -->
                    <div style="display: flex; justify-content: space-around; padding: 0 20px;">
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 6px; width: 45%; text-align: center; font-size: 10px; color: #cbd5e1;">Semi Final 1</div>
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 6px; width: 45%; text-align: center; font-size: 10px; color: #cbd5e1;">Semi Final 2</div>
                    </div>
                </div>

                <!-- CENTER: FINALS / CHAMPION -->
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6px 0; border-top: 1px dashed #334155; border-bottom: 1px dashed #334155;">
                    <div style="background: linear-gradient(to right, #38bdf8, #818cf8); color: #0f172a; font-weight: 800; padding: 8px 16px; border-radius: 8px; width: 85%; text-align: center; font-size: 12px; text-transform: uppercase; box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);">
                        👑 Grand Finals (Champion)
                    </div>
                </div>

                <!-- BOTTOM SIDE (Semi to Quarter-finals) -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <!-- Semi Final Bottom -->
                    <div style="display: flex; justify-content: space-around; padding: 0 20px;">
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 6px; width: 45%; text-align: center; font-size: 10px; color: #cbd5e1;">Semi Final 3</div>
                        <div style="background: #1e293b; border: 1px solid #475569; padding: 6px; border-radius: 6px; width: 45%; text-align: center; font-size: 10px; color: #cbd5e1;">Semi Final 4</div>
                    </div>

                    <div style="text-align: center; font-size: 10px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">-- Quarter Finals (Bottom) --</div>
                    
                    <!-- 4 Slots (Quarter Finals) -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
                        ${renderSlotBox(4)}
                        ${renderSlotBox(5)}
                        ${renderSlotBox(6)}
                        ${renderSlotBox(7)}
                    </div>
                </div>

            </div>
        </div>
    `;

    // Back button event
    document.getElementById('back-to-mode').addEventListener('click', () => {
        renderModeScreen(container);
    });

    // Slot click handlers
    const slotCards = container.querySelectorAll('.slot-node');
    slotCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const slotId = parseInt(e.currentTarget.getAttribute('data-id'));
            const slot = tournamentSlots.find(s => s.id === slotId);
            
            if (slot.status !== 'available') {
                alert(`Slot ${slotId} (${slot.team || 'Booked'}) ကို ဝယ်ယူပြီးပါပြီ (သို့) စောင့်ဆိုင်းဆဲ ဖြစ်နေပါသည်။`);
                return;
            }
            showTournamentRegForm(container, slotId);
        });
    });
}

// Helper function for rendering individual slot box in tree with text-overflow safety
function renderSlotBox(index) {
    const slot = tournamentSlots[index];
    const borderColor = slot.status === 'available' ? '#38bdf8' : (slot.status === 'pending' ? '#facc15' : '#ef4444');
    const bgColor = slot.status === 'available' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.9)';
    
    return `
        <div class="slot-node" data-id="${slot.id}" 
             style="background: ${bgColor}; border: 1px solid ${borderColor}; padding: 6px 2px; border-radius: 6px; cursor: ${slot.status === 'available' ? 'pointer' : 'not-allowed'}; text-align: center; display: flex; flex-direction: column; justify-content: center; height: 45px; box-sizing: border-box;">
            <span style="font-size: 7px; color: #94a3b8;">Slot ${slot.id}</span>
            <span style="font-size: 9px; font-weight: bold; color: ${slot.team ? '#f8fafc' : '#38bdf8'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 2px;">
                ${slot.team || slot.time.split('-')[1].trim()}
            </span>
        </div>
    `;
}

// Registration Form 
function showTournamentRegForm(container, slotId) {
    const slot = tournamentSlots.find(s => s.id === slotId);
    
    container.innerHTML = `
        <div style="padding: 20px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box;">
            <div style="display: flex; align-items: center; width: 100%; max-width: 340px; margin-bottom: 15px;">
                <button id="back-to-slots" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold;">← Back to Tree</button>
            </div>
            
            <div style="width: 100%; max-width: 340px; background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #38bdf8; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);">
                <h3 style="margin: 0; color: #38bdf8; font-size: 16px; text-transform: uppercase;">Register Slot ${slotId}</h3>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Time: ${slot.time}</p>
                
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