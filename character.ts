import { gameObjectFactory, GameObject } from './gameObject';
import { makeTargeting } from './targeting';
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
};

type Character = GameObject & typeof baseCharacter;

export function characterFactory(options?: Partial<Character>) {
    const characterProps = {
        ...baseCharacter,
        ...options,
    };

    const character = gameObjectFactory(characterProps);

    makeTargeting(character);

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
