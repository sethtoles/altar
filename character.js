((global) => {
    global.characterFactory = characterFactory;

    function characterFactory(options) {
        const CHARACTER_DEFAULTS = {
            movable: true,
            targeting: true,
            baseSpeed: 1,
            sprintSpeed: 3,
            sprinting: false,
            tile: TILES.character,
        };

        const gameObject = gameObjectFactory();
        const character = Object.assign(gameObject, CHARACTER_DEFAULTS, options, {
            getSpeed,
        });

        if (character.movable) {
            character.moveToward = moveToward.bind(gameObject);
        }

        if (character.targeting) {
            global.makeTargeting(character);
        }

        return character;
    }

    function getSpeed() {
        return (this.sprinting) ? this.sprintSpeed : this.baseSpeed;
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
