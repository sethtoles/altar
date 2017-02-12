const TILES = {
    0: {
        src: './tiles/tile_0.png',
    },
    character: {
        src: './tiles/tile_1.png',
    },
    player: {
        src: './tiles/tile_2.png',
    },
};

for (const key in TILES) {
    const tile = TILES[key];

    tile.image = new Image();
    tile.image.src = tile.src;

    tile.width = tile.width || DEFAULT_PROP.WIDTH;
    tile.height = tile.height || DEFAULT_PROP.HEIGHT;
};
