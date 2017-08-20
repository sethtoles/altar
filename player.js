((global) => {
    global.playerFactory = playerFactory;

    function playerFactory(options) {
        const character = characterFactory();
        const player = {
            // Base
            ...character,
            // Property Defaults
            x: 512,
            y: 512,
            tile: TILES.player,
            // Methods
            processFrame,
            checkForMovement,
            // Overrides
            ...options,
        }

        return player;
    }

    function processFrame() {
        this.checkForMovement();
    }

    function checkForMovement() {
        const right = !!held[KEY.D];
        const left = !!held[KEY.A];
        const up = !!held[KEY.W];
        const down = !!held[KEY.S];

        this.isSprinting = !!held[KEY.SHIFT];

        const hasTarget = this.canTarget && this.hasTarget();

        if (right || left || up || down) {
            this.clearTargets();

            this.moveToward(
                right - left,
                up - down
            );
        }
        else if (hasTarget) {
            this.approachTarget();
        }
    }
})(window);

