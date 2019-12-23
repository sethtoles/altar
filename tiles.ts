import { DEFAULT_PROP } from './constants';
import tile_0 from './tiles/tile_0.png';
import tile_1 from './tiles/tile_1.png';
import tile_2 from './tiles/tile_2.png';
import tile_3 from './tiles/tile_3.png';
import tile_4 from './tiles/tile_4.png';

export const TILES = {
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
};
