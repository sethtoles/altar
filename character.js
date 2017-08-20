((global) => {
    global.characterFactory = characterFactory;

    function characterFactory(options) {
        const gameObject = gameObjectFactory({
            canCollide: true,
        });

        const character = {
            // Base
            ...gameObject,
            // Property Defaults
            canMove: true,
            canTarget: true,
            baseSpeed: 1,
            sprintSpeed: 3,
            isSprinting: false,
            tile: TILES.character,
            // Methods
            getSpeed,
            // Overrides
            ...options,
        };

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
