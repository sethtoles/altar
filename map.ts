import { GameObject } from './gameObject';
import { TILES } from './tiles';

type TileName = keyof typeof TILES;

export function mapFactory(tileMap: TileName[][]) {
    const map: GameObject[] = [];

    tileMap.forEach((row, rowIndex) => {
        row.forEach((tileId, columnIndex) => {
            const tile = TILES[tileId];
            const { width, height } = tile;

            const tileObject = new GameObject({
                tileSet: [
                    {
                        tile,
                    },
                ],
                x: columnIndex * width,
                y: rowIndex * height,
                width: 0,
                height: 0,
            });

            map.push(tileObject);
        });
    });

    return map;
}
