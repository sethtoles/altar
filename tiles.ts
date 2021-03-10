import { DEFAULT_PROP } from './constants';
import tile_0 from 'url:./tiles/tile_0.png';
import tile_1 from 'url:./tiles/tile_1.png';
import tile_2 from 'url:./tiles/tile_2.png';
import tile_3 from 'url:./tiles/tile_3.png';
import tile_4 from 'url:./tiles/tile_4.png';

export type Tile = {
    width: number;
    height: number;
    image: HTMLImageElement;
}

interface TileOptions extends Partial<Tile> {
    src: string;
}

function buildTile(options: TileOptions) {
    const { src, ...tileData } = options;
    const image = new Image();
    
    image.src = src;

    return {
        width: DEFAULT_PROP.WIDTH,
        height: DEFAULT_PROP.HEIGHT,
        image,
        ...tileData,
    }
}

const tileConfig = {
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
} as const;

export type TileName = keyof typeof tileConfig;
type Tiles = { [name in TileName]: Tile };

export const TILES = (Object.keys(tileConfig) as TileName[]).reduce((acc, tileName) => ({
    ...acc,
    [tileName]: buildTile(tileConfig[tileName]),
}), {}) as Tiles;
