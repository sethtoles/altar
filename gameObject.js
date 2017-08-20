((global) => {
    global.gameObjectFactory = gameObjectFactory;

    function gameObjectFactory(options) {
        const gameObject = {
            x: 0,
            y: 0,
            width: DEFAULT_PROP.WIDTH,
            height: DEFAULT_PROP.HEIGHT,
            canCollide: false,
            move,
            intersects,
            ...options,
        };

        if (gameObject.canCollide) {
            gameObject.containers = [];
        }

        if (gameObject.tileSet) {
            global.makeRenderable(gameObject);
        }

        return gameObject;
    }

    function move(x, y) {
        this.x += x;
        this.y += y;

        if (this.canCollide) {
            this.containers.forEach(({ children }) => {
                children.forEach((child) => {
                    if (this !== child && this.intersects(child)) {
                        const overlapX = (x > 0) ?
                            (this.x + this.width + NUDGE) - child.x :
                            -((child.x + child.width) - this.x);

                        const overlapY = (y > 0) ?
                            (this.y + this.height + NUDGE) - child.y :
                            -((child.y + child.height) - this.y);

                        const absOverlapX = Math.abs(overlapX);
                        const absOverlapY = Math.abs(overlapY);

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

            global.scene.colliders.refreshChild(this);
        }
    }

    function intersects(target) {
        const top = this.y;
        const bottom = top + this.height;
        const left = this.x;
        const right = left + this.width;

        const targetTop = target.y;
        const targetBottom = targetTop + target.height;
        const targetLeft = target.x;
        const targetRight = targetLeft + target.width;

        const verticalOverlap = (top <= targetBottom) && (bottom >= targetTop);
        const horizontalOverlap = (right >= targetLeft) && (left <= targetRight);

        return (verticalOverlap && horizontalOverlap);
    }
})(window);
