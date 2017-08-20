((global) => {
    global.makeRenderable = makeRenderable;

    function makeRenderable(gameObject) {
        Object.assign(gameObject, {
            render,
        });
    }

    function render(camera) {
        if (
            this.x > camera.x + camera.width ||
            this.y > camera.y + camera.height ||
            this.x + this.width < camera.x ||
            this.y + this.height < camera.y
        ) {
            return;
        }

        this.tileSet.forEach(({ tile, x, y }) => {
            ctx.drawImage(
                tile.image,
                (Math.round(this.x + (x || 0)) - camera.x) * camera.zoom,
                (Math.round(this.y + (y || 0)) - camera.y) * camera.zoom,
                tile.width * camera.zoom,
                tile.height * camera.zoom
            );
        });
    }
})(window);
