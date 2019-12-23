import { TILES } from './tiles';
import { characterFactory } from './character';
import { held } from './index';
import { KEY } from './eventHandlers';

const PLAYER_DEFAULTS = {
    x: 512,
    y: 512,
    width: 20,
    tileSet: [
        {
            tile: TILES.playerTop,
            y: -32,
        },
        {
            tile: TILES.playerBottom,
        },
    ],
    processFrame,
    checkForMovement,
};

export function playerFactory(options) {
    const playerProps = {
        ...PLAYER_DEFAULTS,
        ...options,
    };

    return characterFactory(playerProps);
}

function processFrame() {
    this.checkForMovement();
}

function checkForMovement() {
    const right = held[KEY.D] ? 1 : 0;
    const left = held[KEY.A] ? 1 : 0;
    const up = held[KEY.W] ? 1 : 0;
    const down = held[KEY.S] ? 1 : 0;

    this.isSprinting = !!held[KEY.SHIFT];

    if (right || left || up || down) {
        this.clearTargets();

        this.moveToward(
            right - left,
            up - down
        );
    }
    else if (this.hasTarget()) {
        this.approachTarget();
    }
}

