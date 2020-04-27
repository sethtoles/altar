import { ctx } from './index';

export function makeRenderable(gameObject) {
    Object.assign(gameObject, {
        render,
    });
}

function render(camera) {
    this.tileSet.forEach(({ tile, x = 0, y = 0 }) => {
        const tileX = this.x + x;
        const tileY = this.y + y;
        
        if (
            tileX > camera.x + camera.width ||
            tileY > camera.y + camera.height ||
            tileX + tile.width < camera.x ||
            tileY + tile.height < camera.y
        ) {
            return;
        }
        
        ctx.drawImage(
            tile.image,
            Math.round(tileX - camera.x) * camera.zoom,
            Math.round(tileY - camera.y) * camera.zoom,
            tile.width * camera.zoom,
            tile.height * camera.zoom
        );
    });
}
