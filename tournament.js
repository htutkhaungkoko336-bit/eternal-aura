// tournament.js
import { renderModeScreen } from './mode.js';

// ၈ သင်းစာ Tournament Slots များ (အချိန်နှင့် ရက်စွဲပါ)
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
        <div style="padding: 20px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box;">
            <div style="display: flex; align-items: center; justify-content: space-width; width: 100%; max-width: 340px; margin-bottom: 15px;">
                <button id="back-to-mode" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold;">← Back</button>
                <h2 style="color: #38bdf8; margin: 0 auto; font-size: 18px; text-transform: uppercase;">Tournament Slots</h2>
            </div>
            
            <div id="slot-grid" style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 12px; width: 100%; max-width: 340px;">
                ${tournamentSlots.map(slot => `
                    <div class="slot-card" data-id="${slot.id}" 
                         style="background: #1e293b; padding: 12px 16px; border-radius: 10px; border: 1px solid ${slot.status === 'available' ? '#38bdf8' : (slot.status === 'pending' ? '#facc15' : '#ef4444')}; display: flex; justify-content: space-between; align-items: center; cursor: ${slot.status === 'available' ? 'pointer' : 'not-allowed'};">
                        <div>
                            <p style="font-size: 11px; color: #94a3b8; margin: 0;">${slot.time}</p>
                            <h4 style="margin: 4px 0 0 0; font-size: 14px; color: #f8fafc;">${slot.team || 'Slot ' + slot.id + ' (Available)'}</h4>
                        </div>
                        <span style="font-size: 10px; padding: 4px 8px; border-radius: 4px; background: ${slot.status === 'available' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color: ${slot.status === 'available' ? '#22c55e' : '#ef4444'}; text-transform: uppercase; font-weight: bold;">${slot.status}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Back ခလုတ်အတွက် Event Listener
    document.getElementById('back-to-mode').addEventListener('click', () => {
        renderModeScreen(container);
    });

    // Slot တစ်ခုချင်းစီကို နှိပ်ခြင်း
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

// Slot ရွေးချယ်ပြီးပါက ပေါ်လာမည့် Registration Form
function showTournamentRegForm(container, slotId) {
    const slot = tournamentSlots.find(s => s.id === slotId);
    
    container.innerHTML = `
        <div style="padding: 20px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box;">
            <div style="display: flex; align-items: center; width: 100%; max-width: 340px; margin-bottom: 15px;">
                <button id="back-to-slots" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold;">← Back to Slots</button>
            </div>
            
            <div style="width: 100%; max-width: 340px; background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; display: flex; flex-direction: column; gap: 12px;">
                <h3 style="margin: 0; color: #38bdf8; font-size: 16px;">Register Slot ${slotId}</h3>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Time: ${slot.time}</p>
                
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-size: 12px; color: #cbd5e1;">Team Name</label>
                    <input type="text" id="tour-team-name" placeholder="Enter Team Name" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; border-radius: 8px; color: white; outline: none; box-sizing: border-box;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-size: 12px; color: #cbd5e1;">Payment Screenshot (50,000 MMK)</label>
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

        // Status ကို Pending ပြောင်းခြင်း (Admin အတည်ပြုချက်စောင့်ရန်)
        slot.status = 'pending';
        slot.team = teamName;

        alert("Booking Submitted Successfully! Admin အတည်ပြုချက်ကို စောင့်ဆိုင်းနေပါသည်။");
        renderTournamentScreen(container);
    });
}