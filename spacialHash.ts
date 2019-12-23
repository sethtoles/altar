import { DEFAULT_PROP } from './constants';

export function spacialHashFactory(options?) {
    const hash = {
        cellSize: DEFAULT_PROP.WIDTH,
        addChild,
        removeChild,
        refreshChild,
        getIntersectedCellKeys,
        ...options,
    };

    return hash;
}

function cellFactory(options?) {
    const cell = {
        children: [],
        ...options,
    };

    return cell;
}

function addChild(child) {
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

function removeChild(child) {
    child.containers.forEach(({ children }) => {
        const index = children.indexOf(child);

        if (index > -1) {
            children.splice(index, 1);
        }
    });

    child.containers = [];
}

function refreshChild(child) {
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

function getIntersectedCellKeys(object) {
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
