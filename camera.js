// The percentage of the distance to the followed object that the camera will move each tick.
// Lower number means a smoother, longer movement
const SMOOTH_AMOUNT = 0.95;

function cameraFactory(options) {
    const gameObject = gameObjectFactory();
    const camera = {
        // Base
        ...gameObject,
        // Property Defaults
        zoom: DEFAULT_PROP.ZOOM,
        zoomLevels: [0.7, DEFAULT_PROP.ZOOM, 2, 4],
        smooth: true,
        following: null,
        // State
        centerX: 0,
        centerY: 0, 
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
        const zoomLevelIndex = this.zoomLevels.indexOf(this.zoom);
        if (zoomLevelIndex < this.zoomLevels.length - 1) {
            this.zoom = this.zoomLevels[zoomLevelIndex + 1];

            this.zoomChanged()
        }
    }

    function zoomOut() {
        const zoomLevelIndex = this.zoomLevels.indexOf(this.zoom);
        if (zoomLevelIndex > 0) {
            this.zoom = this.zoomLevels[zoomLevelIndex - 1];

            this.zoomChanged()
        }
    }

    function resetZoom() {
        this.zoom = DEFAULT_PROP.ZOOM;

        this.zoomChanged()
    }

    function zoomChanged() {
        ctx.imageSmoothingEnabled = this.zoom <= 1;

        const { width: canvasWidth, height: canvasHeight } = elements.canvas;
        this.width = canvasWidth / this.zoom;
        this.height = canvasHeight / this.zoom;
        this.centerX = canvasWidth / (this.zoom * 2);
        this.centerY = canvasHeight / (this.zoom * 2);

        if (this.following) {
            const wasSmooth = this.smooth;
            this.smooth = false;
            this.follow();
            this.smooth = wasSmooth;
        }
    }

    function follow() {
        const { x, y, width, height } = this.following;
        // Align canvas center point to following center point
        const newX = Math.round(x + (width / 2) - this.centerX);
        const newY = Math.round(y + (height / 2) - this.centerY);

        if (this.x !== newX) {
            if (this.smooth) {
                const adjustedX = (this.x - newX) * SMOOTH_AMOUNT;
                this.x = Math.abs(adjustedX) < 1 ? newX : Math.round(newX + adjustedX);
            }
            else {
                this.x = newX;
            }
        }
        
        if (this.y !== newY) {
            if (this.smooth) {
                const adjustedY = (this.y - newY) * SMOOTH_AMOUNT;
                this.y = Math.abs(adjustedY) < 1 ? newY : Math.round(newY + adjustedY);
            }
            else {
                this.y = newY;
            }

        }
    }
}
