// keysStore.js
let globalKeyData = {
    modes: {
        '5v5': { '5k': 0, '10k': 0, '15k': 0, '25k': 0, '50k': 0 },
        '1v1': { '5k': 0, '10k': 0, '15k': 0, '25k': 0, '50k': 0 },
        'tournament': { 'pass': 0 }
    }
};

export function setKeyData(data) {
    if (data && data.modes) {
        globalKeyData.modes = data.modes;
    }
}

export function getKeyData() {
    return globalKeyData;
}

// Room ဖွင့်လို့ Key လျော့သွားတဲ့အခါ ချက်ချင်း နှုတ်ပေးဖို့
export function deductKey(mode, keyType) {
    if (globalKeyData.modes[mode] && globalKeyData.modes[mode][keyType] > 0) {
        globalKeyData.modes[mode][keyType] -= 1;
    }
}