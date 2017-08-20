const TILES = {
    0: {
        src: './tiles/tile_0.png',
    },
    target: {
        src: './tiles/tile_1.png',
    },
    character: {
        src: './tiles/tile_2.png',
    },
    playerTop: {
        src: './tiles/tile_3.png',
        width: 20,
    },
    playerBottom: {
        src: './tiles/tile_4.png',
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
