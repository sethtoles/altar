import { GameObject } from './gameObject';
import { ctx, elements } from './index';

// The percentage of the distance to the followed object that the camera will move each tick.
// Lower number means a smoother, longer movement.
const SMOOTH_AMOUNT = 0.95;
// Scale factor of sprite pixel to screen pixel.
const DEFAULT_ZOOM = 1;

export interface Camera {
    zoom: number;
    zoomLevels: number[];
    smooth: boolean;
    following: GameObject | null;
    centerX: number;
    centerY: number;
}

export class Camera extends GameObject {
    constructor(options?: Partial<Camera>) {
        super(options);

        this.zoom = DEFAULT_ZOOM;
        this.zoomLevels = [0.7, DEFAULT_ZOOM, 2, 4];
        this.smooth = true;
        this.following = null;
        this.centerX = 0;
        this.centerY = 0;

        Object.assign(this, options);
    }

    zoomIn() {
        const zoomLevelIndex = this.zoomLevels.indexOf(this.zoom);
        if (zoomLevelIndex < this.zoomLevels.length - 1) {
            this.zoom = this.zoomLevels[zoomLevelIndex + 1];

            this.zoomChanged()
        }
    }

    zoomOut() {
        const zoomLevelIndex = this.zoomLevels.indexOf(this.zoom);
        if (zoomLevelIndex > 0) {
            this.zoom = this.zoomLevels[zoomLevelIndex - 1];

            this.zoomChanged()
        }
    }

    resetZoom() {
        this.zoom = DEFAULT_ZOOM;

        this.zoomChanged()
    }

    zoomChanged() {
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

    follow() {
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
