((global) => {
    global.gameObjectFactory = gameObjectFactory;

    function gameObjectFactory(options) {
        const DEFAULTS = {
            x: 0,
            y: 0,
            width: DEFAULT_PROP.WIDTH,
            height: DEFAULT_PROP.HEIGHT,
        };

        const gameObject = Object.assign(DEFAULTS, options, {
            move,
            render,
        });

        return gameObject;
    }

    function move(x, y) {
        this.x += x;
        this.y += y;
    }

    function render(camera) {
        if (
            !this.tile
            || this.x > camera.x + camera.width
            || this.y > camera.y + camera.height
            || this.x + this.width < camera.x
            || this.y + this.height < camera.y
        ) {
            return;
        }

        ctx.drawImage(
            this.tile.image,
            (Math.round(this.x) - camera.x) * camera.zoom,
            (Math.round(this.y) - camera.y) * camera.zoom,
            this.width * camera.zoom,
            this.height * camera.zoom
        );
    }
})(window);
