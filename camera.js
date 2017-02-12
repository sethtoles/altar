function cameraFactory(options) {
    const CAMERA_DEFAULTS = {
        zoom: 1,
        maxZoom: 5,
        minZoom: 0.8,
        zoomRate: 0.2,
    };

    const gameObject = gameObjectFactory();
    const camera = Object.assign(gameObject, CAMERA_DEFAULTS, options);

    camera.zoomIn = zoomIn.bind(camera);
    camera.zoomOut = zoomOut.bind(camera);
    camera.resetZoom = resetZoom.bind(camera);
    camera.zoomChanged = zoomChanged.bind(camera);
    camera.follow = follow.bind(camera);

    return camera;

    function zoomIn() {
        if (this.zoom < this.maxZoom) {
            this.zoom += this.zoomRate;

            this.zoomChanged()
        }
    }

    function zoomOut() {
        if (this.zoom > this.minZoom) {
            this.zoom -= this.zoomRate;

            this.zoomChanged()
        }
    }

    function resetZoom() {
        this.zoom = CAMERA_DEFAULTS.zoom;

        this.zoomChanged()
    }

    function zoomChanged() {
        ctx.imageSmoothingEnabled = this.zoom <= 1;

        this.width = el.canvas.width / this.zoom;
        this.height = el.canvas.height / this.zoom;

        this.follow(player);
    }

    function follow(gameObject, smooth) {
        const scale = 2 * this.zoom;
        const newX = gameObject.x + (gameObject.width / 2) - (el.canvas.width / scale);
        const newY = gameObject.y + (gameObject.height / 2) - (el.canvas.height / scale);

        if (smooth) {
            this.x = newX + ((this.x - newX) * 0.95);
            this.y = newY + ((this.y - newY) * 0.95);
        } else {
            this.x = newX;
            this.y = newY;
        }
    }
}
