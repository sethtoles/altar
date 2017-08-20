function mapFactory(tileMap) {
    const map = [];

    tileMap.forEach((row, rowIndex) => {
        row.forEach((tileId, columnIndex) => {
            const tile = TILES[tileId];
            const { width, height } = tile;

            const tileObject = gameObjectFactory({
                tileSet: [
                    {
                        tile,
                    },
                ],
                x: columnIndex * width,
                y: rowIndex * height,
            });

            map.push(tileObject);
        });
    });

    return map;
};
