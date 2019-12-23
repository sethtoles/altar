import { held } from './index';

export const utils = {
    clearHeld,
};

function clearHeld() {
    for (const key in held) {
        held[key] = false;
    }
}
