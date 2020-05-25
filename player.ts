import { Character } from './character';
import { held, KEY } from './eventHandlers';
import { TILES } from './tiles';

export class Player extends Character {
    x = 512;
    y = 512;
    width = 20;
    tileSet = [
        {
            tile: TILES.playerTop,
            y: -32,
        },
        {
            tile: TILES.playerBottom,
        },
    ];
    
    constructor(options?: Partial<Player>) {
        super(options);

        Object.assign(this, options);
    }

    processFrame() {
        this.checkForMovement();
    }

    checkForMovement() {
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
}

