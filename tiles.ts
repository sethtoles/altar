import { DEFAULT_PROP } from './constants';
import tile_0 from 'url:./tiles/tile_0.png';
import tile_1 from 'url:./tiles/tile_1.png';
import tile_2 from 'url:./tiles/tile_2.png';
import tile_3 from 'url:./tiles/tile_3.png';
import tile_4 from 'url:./tiles/tile_4.png';

export type Tile = {
    src: string;
    width?: number;
    height?: number;
    image?: HTMLImageElement;
}

// TODO: Make stricter index with only specified keys.
type TileMap = { [key: string]: Tile;}

export const TILES: TileMap = {
    0: {
        src: tile_0,
    },
    target: {
        src: tile_1,
    },
    character: {
        src: tile_2,
    },
    playerTop: {
        src: tile_3,
        width: 20,
    },
    playerBottom: {
        src: tile_4,
        width: 20,
    },
};

for (const key in TILES) {
    const tile = TILES[key];

    tile.image = new Image();
    tile.image.src = tile.src;

    tile.width = tile.width || DEFAULT_PROP.WIDTH;
    tile.height = tile.height || DEFAULT_PROP.HEIGHT;
}
