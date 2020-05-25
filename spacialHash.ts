import { DEFAULT_PROP } from './constants';
import { GameObject } from './gameObject';

const baseHash = {
    cellSize: DEFAULT_PROP.WIDTH,
    addChild,
    removeChild,
    refreshChild,
    getIntersectedCellKeys,
};

export type Cell = {
    children: GameObject[];
};

type SpacialHash = typeof baseHash & {
    [key: string]: Cell;
};

export function spacialHashFactory(options?: Partial<SpacialHash>) {
    const hash = {
        ...baseHash,
        ...options,
    } as SpacialHash;

    return hash;
}



function cellFactory(options?: Partial<Cell>) {
    const cell = {
        children: [],
        ...options,
    };

    return cell;
}

function addChild(this: SpacialHash, child: GameObject) {
    const cellKeys = this.getIntersectedCellKeys(child);

    cellKeys.forEach((key) => {
        if (!this[key]) {
            this[key] = cellFactory();
        }

        const cell = this[key];

        child.containers.push(cell);
        cell.children.push(child);
    });
}

function removeChild(this: SpacialHash, child: GameObject) {
    child.containers.forEach(({ children }) => {
        const index = children.indexOf(child);

        if (index > -1) {
            children.splice(index, 1);
        }
    });

    child.containers = [];
}

function refreshChild(this: SpacialHash, child: GameObject) {
    const newKeys = this.getIntersectedCellKeys(child);
    const minKey = newKeys[0];
    const maxKey = newKeys[newKeys.length - 1];
    const { containers } = child;
    const minContainer = containers[0];
    const maxContainer = containers[containers.length - 1];

    if (this[minKey] !== minContainer || this[maxKey] !== maxContainer) {
        this.removeChild(child);
        this.addChild(child);
    }
}

function getIntersectedCellKeys(this: SpacialHash, object: GameObject) {
    const { x, y, width, height } = object;
    const { cellSize } = this;
    const cellKeys = [];
    const minX = Math.floor(x / cellSize) * cellSize;
    const minY = Math.floor(y / cellSize) * cellSize;
    const maxX = Math.floor((x + width) / cellSize) * cellSize;
    const maxY = Math.floor((y + height) / cellSize) * cellSize;

    for (let iterX = minX; iterX <= maxX; iterX += cellSize) {
        for (let iterY = minY; iterY <= maxY; iterY += cellSize) {
            const hashedKey = [iterX, iterY].join();

            cellKeys.push(hashedKey);
        }
    }

    return cellKeys;
}
