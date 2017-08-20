function cameraFactory(options) {
    const gameObject = gameObjectFactory();
    const camera = {
        // Base
        ...gameObject,
        // Property Defaults
        zoom: DEFAULT_PROP.ZOOM,
        maxZoom: 5,
        minZoom: 0.8,
        zoomRate: 0.2,
        // Methods
        zoomIn,
        zoomOut,
        resetZoom,
        zoomChanged,
        follow,
        // Overrides
        ...options,
    }

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
        this.zoom = DEFAULT_PROP.ZOOM;

        this.zoomChanged()
    }

    function zoomChanged() {
        ctx.imageSmoothingEnabled = this.zoom <= 1;

        this.width = elements.canvas.width / this.zoom;
        this.height = elements.canvas.height / this.zoom;

        this.follow(scene.player);
    }

    function follow(gameObject, smooth) {
        const scale = 2 * this.zoom;
        const newX = gameObject.x + (gameObject.width / 2) - (elements.canvas.width / scale);
        const newY = gameObject.y + (gameObject.height / 2) - (elements.canvas.height / scale);

        if (smooth) {
            this.x = newX + ((this.x - newX) * 0.95);
            this.y = newY + ((this.y - newY) * 0.95);
        }
        else {
            this.x = newX;
            this.y = newY;
        }
    }
}
