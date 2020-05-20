import { gameObjectFactory, GameObject } from './gameObject';
import { targetingProps } from './targeting';
import { TILES } from './tiles';

const baseCharacter = {
    baseSpeed: 1,
    sprintSpeed: 3,
    isSprinting: false,
    tileSet: [
        {
            tile: TILES.character,
        },
    ],
    getSpeed,
    moveToward,
    approachTarget,
};

type Character = GameObject & typeof baseCharacter & typeof targetingProps;

export function characterFactory(options?: Partial<Character>) {
    const gameObject = gameObjectFactory();
    const character = {
        ...gameObject,
        ...baseCharacter,
        ...targetingProps,
        ...options,
    };

    return character;
}

function getSpeed(this: Character) {
    return (this.isSprinting) ? this.sprintSpeed : this.baseSpeed;
}

function moveToward(this: Character, directionX: number, directionY: number) {
    const speed = this.getSpeed();

    if (directionX && directionY) {
        const angle = Math.atan2(directionX, directionY);

        directionX = Math.sin(angle);
        directionY = Math.cos(angle);
    }

    this.move(directionX * speed, -directionY * speed);
}

function approachTarget(this: Character) {
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
