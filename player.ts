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

    processFrame(frame: number) {
        this.checkForMovement();
        super.processFrame(frame);
    }

    checkForMovement() {
        // Ensure that manual movement targets are outside the bounds of moveToward damping.
        const desiredMoveDistance = this.sprintSpeed * this.inertia;
        
        const right = held[KEY.D] ? desiredMoveDistance : 0;
        const left = held[KEY.A] ? desiredMoveDistance : 0;
        const up = held[KEY.W] ? desiredMoveDistance : 0;
        const down = held[KEY.S] ? desiredMoveDistance : 0;

        this.isSprinting = held[KEY.SHIFT];

        if (right || left || up || down) {
            this.clearTargets();

            this.moveToward(
                right - left,
                down - up
            );
        }
        else if (this.hasTarget()) {
            this.approachTarget();
        }
    }
}

