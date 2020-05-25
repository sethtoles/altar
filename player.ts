import { Character } from './character';
import { held, KEY } from './eventHandlers';
import { TILES } from './tiles';

export class Player extends Character {
    constructor(options?: Partial<Player>) {
        super(options);

        this.x = 512;
        this.y = 512;
        this.width = 20;
        this.tileSet = [
            {
                tile: TILES.playerTop,
                y: -32,
            },
            {
                tile: TILES.playerBottom,
            },
        ];

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

