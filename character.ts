import { GameObject } from './gameObject';
import { TILES } from './tiles';

export interface Character {
    baseSpeed: number,
    isSprinting: boolean,
    sprintSpeed: number,
    targets: GameObject[],
}

export class Character extends GameObject {
    constructor(options?: Partial<Character>) {
        super(options);

        this.baseSpeed = 1;
        this.sprintSpeed = 3;
        this.isSprinting = false;
        this.tileSet = [
            {
                tile: TILES.character,
            },
        ];

        Object.assign(this, options);
    }

    getSpeed() {
        return (this.isSprinting) ? this.sprintSpeed : this.baseSpeed;
    }

    moveToward(directionX: number, directionY: number) {
        const speed = this.getSpeed();

        if (directionX && directionY) {
            const angle = Math.atan2(directionX, directionY);

            directionX = Math.sin(angle);
            directionY = Math.cos(angle);
        }

        this.move(directionX * speed, -directionY * speed);
    }

    hasTarget() {
        return this.targets.length;
    }

    addTarget(targetOptions?: Partial<GameObject>) {
        const target = new GameObject(targetOptions);

        this.targets.push(target);
    }

    removeTarget(target: GameObject) {
        const index = this.targets.indexOf(target);

        if (index >= 0) {
            return this.targets.splice(index, 1);
        }
    }

    clearTargets() {
        const { length } = this.targets;

        for (let i = length - 1; i >= 0; i--) {
            this.removeTarget(this.targets[i]);
        }
    }

    approachTarget() {
        const target = this.targets[0];
        const speed = this.getSpeed();

        const directionX = target.x - this.x;
        const directionY = this.y - target.y;

        if (
            Math.abs(directionX) < speed
            && Math.abs(directionY) < speed
        ) {
            this.x = target.x;
            this.y = target.y;
            this.removeTarget(target);
        }
        else {
            this.moveToward(directionX, directionY);
        }
    }
}
