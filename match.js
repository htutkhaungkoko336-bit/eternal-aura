// match.js
import { db } from './firebase.js'; // ကိုယ့်ရဲ့ firebase config ထవ် ယူထားတဲ့ db ကို ချိတ်ရန်
import { collection, getDocs, addDoc, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let userKeys = {}; // User ပိုင်ဆိုင်သော key များ သိမ်းရန်
let currentMode = "5vs5"; // Default mode
let currentFee = "5k";    // Default fee

export async function renderMatchScreen(container) {
    const userId = localStorage.getItem('userId');
    
    // User ရဲ့ Key များကို Firestore မှ ဆွဲထုတ်ခြင်း
    if (userId) {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                userKeys = userDoc.data().keys || {}; 
                // ဥပမာ - userKeys ပုံစံက { "5vs5_5k": 1, "1vs1_10k": 2 } ဖြစ်မည်ဟု ယူဆသည်
            }
        } catch (error) {
            console.error("Error fetching user keys:", error);
        }
    }

    container.innerHTML = `
        <div style="padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; gap: 15px; padding-bottom: 90px;">
            
            <!-- Header Title -->
            <div style="font-size: 18px; font-weight: bold; color: #38bdf8; text-align: center; margin-bottom: 5px;">
                Eternal Aura Matchmaking
            </div>

            <!-- Filter Section (Mode & Fee) -->
            <div style="background: #1e293b; padding: 12px; border-radius: 10px; display: flex; flex-direction: column; gap: 10px;">
                <div style="font-size: 12px; color: #94a3b8; font-weight: 600;">SELECT MODE:</div>
                <div style="display: flex; gap: 8px;">
                    <button class="filter-mode-btn active" data-mode="5vs5" style="flex: 1; padding: 8px; background: #38bdf8; color: #0f172a; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">5vs5</button>
                    <button class="filter-mode-btn" data-mode="1vs1" style="flex: 1; padding: 8px; background: #334155; color: #f8fafc; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">1vs1</button>
                </div>

                <div style="font-size: 12px; color: #94a3b8; font-weight: 600; margin-top: 5px;">SELECT FEE:</div>
                <div style="display: flex; gap: 6px; overflow-x: auto;">
                    <button class="filter-fee-btn active" data-fee="5k" style="padding: 6px 12px; background: #38bdf8; color: #0f172a; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">5k</button>
                    <button class="filter-fee-btn" data-fee="10k" style="padding: 6px 12px; background: #334155; color: #f8fafc; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">10k</button>
                    <button class="filter-fee-btn" data-fee="15k" style="padding: 6px 12px; background: #334155; color: #f8fafc; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">15k</button>
                    <button class="filter-fee-btn" data-fee="25k" style="padding: 6px 12px; background: #334155; color: #f8fafc; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">25k</button>
                    <button class="filter-fee-btn" data-fee="50k" style="padding: 6px 12px; background: #334155; color: #f8fafc; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">50k</button>
                </div>
            </div>

            <!-- Rooms List Container -->
            <div id="rooms-list-container" style="display: flex; flex-direction: column; gap: 10px;">
                <div style="color: #94a3b8; text-align: center; font-size: 13px; margin-top: 20px;">Loading rooms...</div>
            </div>

            <!-- Bottom Action Buttons -->
            <div style="position: fixed; bottom: 75px; left: 0; width: 100%; padding: 0 16px; box-sizing: border-box; display: flex; gap: 10px; z-index: 99;">
                <button id="new-room-btn" style="flex: 1; padding: 12px; background: #22c55e; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: not-allowed; opacity: 0.4;" disabled>New Room</button>
                <button id="cancel-room-btn" style="flex: 1; padding: 12px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Cancel</button>
            </div>

        </div>
    `;

    // Event Listeners for Filters
    setupFilterEvents();
    
    // Check initial button state based on default filter
    updateCreateRoomButtonState();

    // Fetch and display rooms
    fetchAndDisplayRooms();
}

// Filter ခလုတ်များအတွက် နှိပ်လိုက်ပါက အလုပ်လုပ်မည့်ပုံစံ
function setupFilterEvents() {
    const modeButtons = document.querySelectorAll('.filter-mode-btn');
    const feeButtons = document.querySelectorAll('.filter-fee-btn');

    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeButtons.forEach(b => { b.style.background = '#334155'; b.style.color = '#f8fafc'; });
            e.target.style.background = '#38bdf8';
            e.target.style.color = '#0f172a';
            currentMode = e.target.getAttribute('data-mode');
            updateCreateRoomButtonState();
            fetchAndDisplayRooms();
        });
    });

    feeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            feeButtons.forEach(b => { b.style.background = '#334155'; b.style.color = '#f8fafc'; });
            e.target.style.background = '#38bdf8';
            e.target.style.color = '#0f172a';
            currentFee = e.target.getAttribute('data-fee');
            updateCreateRoomButtonState();
            fetchAndDisplayRooms();
        });
    });
}

// User မှာ ရွေးထားတဲ့ filter နဲ့ ကိုက်ညီတဲ့ Key ရှိမရှိ စစ်ပြီး New Room ခလုတ်ကို ဖွင့်/ပိတ် လုပ်ခြင်း
function updateCreateRoomButtonState() {
    const keyString = `${currentMode}_${currentFee}`; // ဥပမာ - 5vs5_5k
    const hasKey = (userKeys[keyString] || 0) > 0;
    const newRoomBtn = document.getElementById('new-room-btn');

    if (!newRoomBtn) return;

    if (hasKey) {
        newRoomBtn.disabled = false;
        newRoomBtn.style.opacity = "1";
        newRoomBtn.style.cursor = "pointer";
    } else {
        newRoomBtn.disabled = true;
        newRoomBtn.style.opacity = "0.4";
        newRoomBtn.style.cursor = "not-allowed";
    }
}

// Rooms များကို Firestore မှ ဆွဲထုတ်ပြသခြင်း
async function fetchAndDisplayRooms() {
    const container = document.getElementById('rooms-list-container');
    if (!container) return;

    container.innerHTML = `<div style="color: #94a3b8; text-align: center; font-size: 13px;">Loading rooms...</div>`;

    try {
        const q = query(collection(db, "rooms"), where("status", "==", "waiting"));
        const querySnapshot = await getDocs(q);
        
        let roomsHTML = "";
        querySnapshot.forEach((docSnap) => {
            const room = docSnap.data();
            
            // Filter ချက်ချင်းစစ်ရန် (ရွေးထားသော Mode နဲ့ Fee တူမှသာ ပြမည်၊ သို့မဟုတ် အားလုံးပြရန် room.mode === currentMode လည်း သုံးနိုင်သည်)
            if (room.mode === currentMode && room.fee === currentFee) {
                roomsHTML += `
                    <div style="background: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${room.teamLogo || 'https://via.placeholder.com/35'}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;">
                            <div>
                                <div style="font-weight: bold; color: #f8fafc; font-size: 14px;">${room.teamName || 'Team A'}</div>
                                <div style="font-size: 10px; color: #94a3b8;">Fee: ${room.fee} | BO${room.bo || 1} | ${room.mode}</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span style="font-weight: bold; color: #38bdf8; font-size: 14px;">VS</span>
                            <button class="join-room-btn" data-id="${docSnap.id}" style="background: #38bdf8; color: #0f172a; border: none; width: 30px; height: 30px; border-radius: 50%; font-weight: bold; font-size: 16px; cursor: pointer;">+</button>
                        </div>
                    </div>
                `;
            }
        });

        if (roomsHTML === "") {
            container.innerHTML = `<div style="color: #64748b; text-align: center; font-size: 13px; padding: 20px;">No rooms available for ${currentMode} (${currentFee}). Create one!</div>`;
        } else {
            container.innerHTML = roomsHTML;
        }

    } catch (error) {
        console.error("Error loading rooms:", error);
        container.innerHTML = `<div style="color: #ef4444; text-align: center; font-size: 13px;">Failed to load rooms.</div>`;
    }
}