import { GameObject } from './gameObject';
import { TILES } from './tiles';

const SPRINT_MODIFIER = 1.03;

export class Character extends GameObject {
    baseSpeed = 1;
    speed: number;
    sprintSpeed = 3;
    isSprinting = false;
    maxStamina = 5;
    stamina: number;
    targets: GameObject[] = [];
    tileSet: GameObject['tileSet'] = [
        {
            tile: TILES.character,
        },
    ];

    constructor(options?: Partial<Character>) {
        super(options);

        this.speed = this.baseSpeed;
        this.stamina = this.maxStamina;

        Object.assign(this, options);
    }

    getSpeed() {
        if (this.isSprinting) {
            const newSpeed = this.speed * SPRINT_MODIFIER;
            this.speed = Math.min(this.sprintSpeed, newSpeed);
        }
        else {
            this.speed = (this.speed + this.baseSpeed) / 2;
        }

        return this.speed;
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
