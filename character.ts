import { gameObjectFactory } from './gameObject';
import { makeTargeting } from './targeting';
import { TILES } from './tiles';

const CHARACTER_DEFAULTS = {
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

export function characterFactory(options) {
    const characterProps = {
        ...CHARACTER_DEFAULTS,
        ...options,
    };

    const character = gameObjectFactory(characterProps);

    makeTargeting(character);

    return character;
}

function getSpeed() {
    return (this.isSprinting) ? this.sprintSpeed : this.baseSpeed;
}

function moveToward(directionX, directionY) {
    const speed = this.getSpeed();

    if (directionX && directionY) {
        const angle = Math.atan2(directionX, directionY);

        directionX = Math.sin(angle);
        directionY = Math.cos(angle);
    }

    this.move(directionX * speed, -directionY * speed);
}
