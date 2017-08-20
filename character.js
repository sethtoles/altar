((global) => {
    global.characterFactory = characterFactory;

    const CHARACTER_DEFAULTS = {
        canMove: true,
        canTarget: true,
        canCollide: true,
        baseSpeed: 1,
        sprintSpeed: 3,
        isSprinting: false,
        tileSet: [
            {
                tile: TILES.character,
            },
        ],
        getSpeed,
    };

    function characterFactory(options) {
        const characterProps = {
            ...CHARACTER_DEFAULTS,
            ...options,
        };

        const character = gameObjectFactory(characterProps);

        if (character.canMove) {
            character.moveToward = moveToward;
        }

        if (character.canTarget) {
            global.makeTargeting(character);
        }

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
})(window);
