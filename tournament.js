import { renderRegisterForm } from './tournamentRegistration.js';

let tournamentData = {
    groups: [
        { 
            id: 1, name: "Group 1", date: "16.8.2026", time: "6:00 PM", 
            slots: [{ team: null, status: "available", label: "Slot 1" }, { team: null, status: "available", label: "Slot 2" }] 
        },
        { 
            id: 2, name: "Group 2", date: "16.8.2026", time: "7:00 PM", 
            slots: [{ team: null, status: "available", label: "Slot 3" }, { team: null, status: "available", label: "Slot 4" }] 
        },
        { 
            id: 3, name: "Group 3", date: "16.8.2026", time: "8:00 PM", 
            slots: [{ team: null, status: "available", label: "Slot 5" }, { team: null, status: "available", label: "Slot 6" }] 
        },
        { 
            id: 4, name: "Group 4", date: "16.8.2026", time: "9:00 PM", 
            slots: [{ team: null, status: "available", label: "Slot 7" }, { team: null, status: "available", label: "Slot 8" }] 
        }
    ],
    semis: [
        { name: "SEMI 1", date: "16.8.2026", time: "10:00 PM", team1: "Group 1 Winner", team2: "Group 2 Winner" },
        { name: "SEMI 2", date: "16.8.2026", time: "10:30 PM", team1: "Group 3 Winner", team2: "Group 4 Winner" }
    ],
    champion: { name: "CHAMPION", date: "17.8.2026", time: "8:00 PM" }
};

export async function renderTournamentScreen(container) {
    const userRole = localStorage.getItem('userRole') || 'user'; 
    const isAdmin = (userRole === 'admin');

    try {
        const response = await fetch('/api/register', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        if (result.success && result.data) {
            tournamentData.groups = result.data.groups || tournamentData.groups;
            tournamentData.semis = result.data.semis || tournamentData.semis;
            tournamentData.champion = result.data.champion || tournamentData.champion;
        }
    } catch (e) {
        console.log("Using default local data, server fetch failed:", e);
    }

    container.innerHTML = `
        <div style="padding: 10px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; box-sizing: border-box; overflow-y: auto; background-color: #0f172a;">
            
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 380px; margin-bottom: 10px;">
                <h2 style="color: #38bdf8; margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">TOURNAMENT BRACKETS</h2>
                ${isAdmin ? '<button id="toggle-admin" style="background: #334155; border: 1px solid #38bdf8; color: #38bdf8; padding: 3px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">Admin Edit</button>' : ''}
            </div>

            <!-- Main Vertical Tree Container -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; max-width: 380px; padding-bottom: 20px;">
                
                <!-- TOP GROUPS -->
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
                        <div style="display: flex; flex-direction: column; align-items: center; padding: 0 6px;">
                            <span style="color: #f97316; font-weight: bold; font-size: 9px;">VS</span>
                            <span style="color: #ffffff; font-weight: bold; font-size: 7px;">BO3</span>
                        </div>
                        <span style="background: #0f172a; border: 1px solid #475569; padding: 6px 8px; border-radius: 6px; flex: 1;">${tournamentData.semis[0].team2}</span>
                    </div>
                </div>

                <!-- CHAMPION BOX -->
                <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 2px solid #facc15; padding: 14px; border-radius: 12px; width: 95%; text-align: center; box-shadow: 0 0 20px rgba(250, 204, 21, 0.4); position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; left: -10px; font-size: 24px; opacity: 0.15;">🏆</div>
                    <div style="position: absolute; bottom: -10px; right: -10px; font-size: 24px; opacity: 0.15;">🏆</div>
                    
                    <div style="display: flex; justify-content: center; align-items: center; gap: 6px; margin-bottom: 4px;">
                        <span style="font-size: 14px;">🏆</span>
                        <span style="font-size: 12px; color: #facc15; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">CHAMPION PRIZE</span>
                        <span style="font-size: 14px;">🏆</span>
                    </div>
                    
                    <div style="font-size: 18px; color: #fef08a; font-weight: 900; margin: 4px 0 6px 0; text-shadow: 0 0 10px rgba(250,204,21,0.6);">400,000 Ks</div>
                    <div style="font-size: 8px; color: #94a3b8; margin-bottom: 10px;">${tournamentData.champion.date} | ${tournamentData.champion.time}</div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                        <div style="flex:1; background: #1e293b; border: 1px solid #475569; padding: 8px; border-radius: 6px; font-size: 9px; color: #f8fafc; font-weight: bold;">Semi 1 Winner</div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <span style="color: #f97316; font-weight: bold; font-size: 10px;">VS</span>
                            <span style="color: #ffffff; font-weight: bold; font-size: 8px;">BO5</span>
                        </div>
                        <div style="flex:1; background: #1e293b; border: 1px solid #475569; padding: 8px; border-radius: 6px; font-size: 9px; color: #f8fafc; font-weight: bold;">Semi 2 Winner</div>
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
                        <div style="display: flex; flex-direction: column; align-items: center; padding: 0 6px;">
                            <span style="color: #f97316; font-weight: bold; font-size: 9px;">VS</span>
                            <span style="color: #ffffff; font-weight: bold; font-size: 7px;">BO3</span>
                        </div>
                        <span style="background: #0f172a; border: 1px solid #475569; padding: 6px 8px; border-radius: 6px; flex: 1;">${tournamentData.semis[1].team2}</span>
                    </div>
                </div>

                <!-- BOTTOM GROUPS -->
                <div style="display: flex; justify-content: space-between; width: 100%; gap: 8px;">
                    ${renderGroupCard(tournamentData.groups[2])}
                    ${renderGroupCard(tournamentData.groups[3])}
                </div>

            </div>
        </div>
    `;

    const toggleAdminBtn = document.getElementById('toggle-admin');
    if (toggleAdminBtn) {
        toggleAdminBtn.addEventListener('click', () => {
            showAdminEditor(container);
        }); 
    }

    container.querySelectorAll('.group-slot').forEach(el => {
        el.addEventListener('click', (e) => {
            const groupId = parseInt(e.currentTarget.getAttribute('data-group'));
            const slotIndex = parseInt(e.currentTarget.getAttribute('data-slot'));
            const group = tournamentData.groups.find(g => g.id === groupId);
            const selectedSlotLabel = group.slots[slotIndex].label;

            if (group.slots[slotIndex].status === 'available') {
                renderRegisterForm(container, { selectedSlot: selectedSlotLabel });
            } else {
                alert("ဒီ Slot ကို အဖွဲ့တစ်ဖွဲ့မှ ယူပြီးပါပြီ (သို့) ပိတ်ထားပါသည်။");
            }
        });
    });
}

function renderGroupCard(group) {
    return `
        <div style="background: #1e293b; border: 1px solid #334155; padding: 10px; border-radius: 10px; width: 48%; box-sizing: border-box; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
                <span style="font-size: 10px; color: #38bdf8; font-weight: bold; text-transform: uppercase;">${group.name}</span>
                <span style="font-size: 8px; color: #94a3b8;">${group.date} ${group.time}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
                
                <!-- Slot 0 (အားလုံး ပုံမှန်အရောင် #0f172a နှင့် #334155 ဘောင်သာ သုံးထားသည်) -->
                <div class="group-slot" data-group="${group.id}" data-slot="0"
                     style="background: #0f172a; border: 1px solid #334155; padding: 8px 5px; border-radius: 6px; text-align: center; cursor: pointer;">
                    <span style="font-size: 9px; color: ${group.slots[0].team ? '#ffffff' : '#38bdf8'}; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;">
                        ${group.slots[0].team || group.slots[0].label}
                    </span>
                </div>

                <div style="display: flex; flex-direction: column; align-items: center; padding: 2px 0;">
                    <span style="font-size: 9px; color: #f97316; font-weight: bold; line-height: 1;">VS</span>
                    <span style="font-size: 7px; color: #ffffff; font-weight: bold; line-height: 1; margin-top: 2px;">BO3</span>
                </div>

                <!-- Slot 1 (အားလုံး ပုံမှန်အရောင် #0f172a နှင့် #334155 ဘောင်သာ သုံးထားသည်) -->
                <div class="group-slot" data-group="${group.id}" data-slot="1"
                     style="background: #0f172a; border: 1px solid #334155; padding: 8px 5px; border-radius: 6px; text-align: center; cursor: pointer;">
                    <span style="font-size: 9px; color: ${group.slots[1].team ? '#ffffff' : '#38bdf8'}; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;">
                        ${group.slots[1].team || group.slots[1].label}
                    </span>
                </div>

            </div>
        </div>
    `;
}

function showAdminEditor(container) {
    container.innerHTML = `
        <div style="padding: 15px; color: white; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box; overflow-y: auto; height: 100%; background-color: #0f172a;">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 380px; margin-bottom: 15px;">
                <button id="back-to-bracket" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-weight: bold;">← Back</button>
                <h3 style="color: #38bdf8; margin: 0; font-size: 13px;">Admin: Manage Brackets & Slots</h3>
            </div>
            
            <div style="width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 12px; padding-bottom: 20px;">
                
                <h4 style="color: #f97316; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase;">Groups & Slots Settings</h4>
                ${tournamentData.groups.map((group, gIdx) => `
                    <div style="background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid #334155;">
                        <div style="font-size: 11px; color: #38bdf8; font-weight: bold; margin-bottom: 6px;">${group.name}</div>
                        <div style="display: flex; gap: 6px; margin-bottom: 8px;">
                            <div style="flex: 1;"><label style="font-size: 8px; color: #94a3b8;">Date</label><input type="text" id="g-date-${gIdx}" value="${group.date}" style="width: 100%; padding: 5px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px; box-sizing: border-box;"></div>
                            <div style="flex: 1;"><label style="font-size: 8px; color: #94a3b8;">Time</label><input type="text" id="g-time-${gIdx}" value="${group.time}" style="width: 100%; padding: 5px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px; box-sizing: border-box;"></div>
                        </div>

                        ${group.slots.map((slot, sIdx) => `
                            <div style="background: #0f172a; padding: 8px; border-radius: 6px; border: 1px solid #475569; margin-bottom: 6px;">
                                <div style="font-size: 9px; color: #cbd5e1; margin-bottom: 4px; font-weight: bold;">${slot.label} (Team / Status)</div>
                                <div style="display: flex; gap: 6px;">
                                    <input type="text" id="slot-team-${gIdx}-${sIdx}" value="${slot.team || ''}" placeholder="Team/Squad Name" style="flex: 2; padding: 5px; background: #1e293b; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px; box-sizing: border-box;">
                                    <select id="slot-status-${gIdx}-${sIdx}" style="flex: 1; padding: 5px; background: #1e293b; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px;">
                                        <option value="available" ${slot.status === 'available' ? 'selected' : ''}>Available</option>
                                        <option value="booked" ${slot.status === 'booked' ? 'selected' : ''}>Booked/Block</option>
                                    </select>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}

                <h4 style="color: #f97316; margin: 10px 0 0 0; font-size: 11px; text-transform: uppercase;">Semis & Champion Time</h4>
                ${tournamentData.semis.map((semi, sIdx) => `
                    <div style="background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid #334155;">
                        <div style="font-size: 11px; color: #38bdf8; font-weight: bold; margin-bottom: 6px;">${semi.name}</div>
                        <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                            <div style="flex: 1;"><label style="font-size: 8px; color: #94a3b8;">Date</label><input type="text" id="semi-date-${sIdx}" value="${semi.date}" style="width: 100%; padding: 5px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px; box-sizing: border-box;"></div>
                            <div style="flex: 1;"><label style="font-size: 8px; color: #94a3b8;">Time</label><input type="text" id="semi-time-${sIdx}" value="${semi.time}" style="width: 100%; padding: 5px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px; box-sizing: border-box;"></div>
                        </div>
                        <div style="display: flex; gap: 6px;">
                            <input type="text" id="semi-team1-${sIdx}" value="${semi.team1}" style="flex: 1; padding: 5px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px;">
                            <input type="text" id="semi-team2-${sIdx}" value="${semi.team2}" style="flex: 1; padding: 5px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px;">
                        </div>
                    </div>
                `).join('')}

                <div style="background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid #334155;">
                    <div style="font-size: 11px; color: #facc15; font-weight: bold; margin-bottom: 6px;">Champion Settings</div>
                    <div style="display: flex; gap: 6px;">
                        <div style="flex: 1;"><label style="font-size: 8px; color: #94a3b8;">Date</label><input type="text" id="champ-date" value="${tournamentData.champion.date}" style="width: 100%; padding: 5px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px; box-sizing: border-box;"></div>
                        <div style="flex: 1;"><label style="font-size: 8px; color: #94a3b8;">Time</label><input type="text" id="champ-time" value="${tournamentData.champion.time}" style="width: 100%; padding: 5px; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: white; font-size: 9px; box-sizing: border-box;"></div>
                    </div>
                </div>
                
                <button id="save-settings" style="width: 100%; padding: 10px; background: #38bdf8; border: none; border-radius: 6px; font-weight: bold; color: #0f172a; cursor: pointer; margin-top: 10px;">Save All Changes</button>
            </div>
        </div>
    `;

    document.getElementById('back-to-bracket').addEventListener('click', () => renderTournamentScreen(container));

    document.getElementById('save-settings').addEventListener('click', async () => {
        tournamentData.groups.forEach((group, gIdx) => {
            group.date = document.getElementById(`g-date-${gIdx}`).value.trim();
            group.time = document.getElementById(`g-time-${gIdx}`).value.trim();

            group.slots.forEach((slot, sIdx) => {
                const teamInputVal = document.getElementById(`slot-team-${gIdx}-${sIdx}`).value.trim();
                const statusInputVal = document.getElementById(`slot-status-${gIdx}-${sIdx}`).value;

                slot.status = statusInputVal;
                if (teamInputVal !== '') {
                    slot.team = teamInputVal;
                } else if (statusInputVal === 'available') {
                    slot.team = null; 
                } else {
                    slot.team = "BLOCKED"; 
                }
            });
        });

        tournamentData.semis.forEach((semi, sIdx) => {
            semi.date = document.getElementById(`semi-date-${sIdx}`).value.trim();
            semi.time = document.getElementById(`semi-time-${sIdx}`).value.trim();
            semi.team1 = document.getElementById(`semi-team1-${sIdx}`).value.trim();
            semi.team2 = document.getElementById(`semi-team2-${sIdx}`).value.trim();
        });

        tournamentData.champion.date = document.getElementById(`champ-date`).value.trim();
        tournamentData.champion.time = document.getElementById(`champ-time`).value.trim();

        const saveBtn = document.getElementById('save-settings');
        saveBtn.disabled = true;
        saveBtn.innerText = "Saving to Server...";

        try {
            const response = await fetch('/api/register', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'update_brackets',
                    data: {
                        userId: localStorage.getItem('userId') || 'admin_user',
                        groups: tournamentData.groups,
                        semis: tournamentData.semis,
                        champion: tournamentData.champion
                    }
                })
            });

            const result = await response.json();
            
            if (result.success) {
                alert("ပြောင်းလဲမှုများနှင့် Slot များကို Server တွင် အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။");
                renderTournamentScreen(container);
            } else {
                alert("သိမ်းဆည်းရာတွင် အမှားရှိပါသည်: " + result.message);
                saveBtn.disabled = false;
                saveBtn.innerText = "Save All Changes";
            }
        } catch (error) {
            console.error("API Error:", error);
            alert("ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။ ကျေးဇူးပြု၍ ထပ်ကြိုးစားပါ။");
            saveBtn.disabled = false;
            saveBtn.innerText = "Save All Changes";
        }
    });
}