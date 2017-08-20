((global) => {
    global.playerFactory = playerFactory;

    const PLAYER_DEFAULTS = {
        x: 512,
        y: 512,
        width: 20,
        tileSet: [
            {
                tile: TILES.playerTop,
                y: -32,
            },
            {
                tile: TILES.playerBottom,
            },
        ],
        processFrame,
        checkForMovement,
    };

    function playerFactory(options) {
        const playerProps = {
            ...PLAYER_DEFAULTS,
            ...options,
        };

        return characterFactory(playerProps);
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

