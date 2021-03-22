interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const intersects = (rect1: Rect, rect2: Rect) => {
    if (rect1.y + rect1.height <= rect2.y) return false; // rect1 is above rect2.
    if (rect1.y >= rect2.y + rect2.height) return false; // rect1 is below rect2.
    if (rect1.x + rect1.width <= rect2.x) return false; // rect1 is left of rect2.
    if (rect1.x >= rect2.x + rect2.width) return false; // rect1 is right of rect2.

    return true;
}

export const vectorLength = ([x, y]: [number, number]) => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

export const clamp = (min: number, value: number, max: number) => Math.min(Math.max(value, min), max);
