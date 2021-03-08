import { Camera } from './camera';
import { DEFAULT_PROP, FRAME_RATE } from './constants';
import { ctx, scene } from './index';
import { Cell } from './spacialHash';
import { Tile } from './tiles';

type TileConfig = {
    x?: number;
    y?: number;
    tile: Tile;
}

export class GameObject {
    x = 0;
    y = 0;
    private previous: [number, number];
    velocity = [0, 0];
    moved = false;
    width = DEFAULT_PROP.WIDTH;
    height = DEFAULT_PROP.HEIGHT;
    containers?: Cell[];
    tileSet?: TileConfig[];

    constructor(options?: Partial<GameObject>) {
        Object.assign(this, options);

        this.previous = [this.x, this.y];

        if (this.width && this.height) {
            this.containers = [];
        }
    }

    processFrame(frame: number) {
        if (this.moved) {
            const [oldX, oldY] = this.previous;
            
            if (this.x !== oldX) {
                this.velocity[0] = this.x - oldX;
                this.previous[0] = this.x;
            } else {
                this.velocity[0] = 0;
            }
            
            if (this.y !== oldY) {
                this.velocity[1] = this.y - oldY;
                this.previous[1] = this.y;
            } else {
                this.velocity[1] = 0;
            }
    
            if (frame % FRAME_RATE === 0) {
                // Debug every second.
            }

            this.moved = false;
        } else {
            this.velocity = [0, 0];
        }
    }

    move(x: number, y: number) {
        this.previous = [this.x, this.y];
        this.x += x;
        this.y += y;
        this.moved = true;

        // Only check objects with dimension.
        if (this.width && this.height) {
            // Iterate through all containers this object is a member of.
            this.containers.forEach(({ children: siblings }) => {
                // Check all sibling members.
                siblings.forEach((sibling) => {
                    // Ensure we're checking another element, and that it overlaps this one.
                    // TODO: Trace along movement path to determine illegal moves.
                    if (this !== sibling && this.intersects(sibling)) {
                        // Determine amount of x overlap:
                        // Positive value indicates this is to the left of sibling,
                        // negative indicates this is to the right.
                        const overlapX = (x > 0) ?
                            this.x + this.width - sibling.x :
                            -(sibling.x + sibling.width - this.x);

                        // Determine amount of y overlap:
                        // Positive value indicates this is above sibling,
                        // negative indicates this is below.
                        const overlapY = (y > 0) ?
                            this.y + this.height - sibling.y :
                            -(sibling.y + sibling.height - this.y);

                        // Calculate magnitude of overlap on each axis.
                        const absOverlapX = Math.abs(overlapX);
                        const absOverlapY = Math.abs(overlapY);

                        // The movement on the axis with less overlap should be cancelled,
                        // allowing this object to hug the edge of its sibling.
                        if (absOverlapX < absOverlapY) {
                            this.x -= overlapX;
                        }
                        else if (absOverlapX > absOverlapY) {
                            this.y -= overlapY;
                        }
                        else {
                            this.x -= overlapX;
                            this.y -= overlapY;
                        }
                    }
                });
            });

            scene.colliders.refreshChild(this);
        }
    }

    intersects(target: GameObject) {
        const top = this.y;
        const bottom = top + this.height;

        const targetTop = target.y;
        if (bottom < targetTop) return false; // This is above the target.

        const targetBottom = targetTop + target.height;
        if (top > targetBottom) return false; // This is below the target.

        const left = this.x;
        const right = left + this.width;

        const targetLeft = target.x;
        if (right < targetLeft) return false; // This is left of the target.

        const targetRight = targetLeft + target.width;
        if (left > targetRight) return false; // This is right of the target.

        return true;
    }

    render(camera: Camera) {
        this.tileSet?.forEach(({ tile, x = 0, y = 0 }) => {
            const tileX = this.x + x;
            const tileY = this.y + y;

            if (!this.intersects(camera)) return;

            ctx.drawImage(
                tile.image,
                Math.round(tileX - camera.x) * camera.zoom,
                Math.round(tileY - camera.y) * camera.zoom,
                tile.width * camera.zoom,
                tile.height * camera.zoom
            );
        });
    }
}
