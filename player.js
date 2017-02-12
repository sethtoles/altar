((global) => {
    global.playerFactory = playerFactory;

    function playerFactory(options) {
        const PLAYER_DEFAULTS = {
            x: 512,
            y: 512,
            tile: TILES.player,
        };

        const character = characterFactory();
        const player = Object.assign(character, PLAYER_DEFAULTS, options);

        player.processFrame = processFrame.bind(player);
        player.checkForMovement = checkForMovement.bind(player);

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

        this.sprinting = !!held[KEY.SHIFT];

        if (right || left || up || down) {
            this.moveToward(
                right - left,
                up - down
            );
        } else if (this.targeting && this.hasTarget()) {
            this.approachTarget();
        }
    }
})(window);

