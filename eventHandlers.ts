import { elements, scene, togglePause } from './index';
import { TILES } from './tiles';

export const held: { [key: string]: true } = {};

export function clearHeld() {
    for (const key in held) {
        delete held[key];
    }
}

export const KEY = {
    SHIFT: 'ShiftLeft',
    ESC: 'Escape',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    ZERO: 'Digit0',
    A: 'KeyA',
    D: 'KeyD',
    S: 'KeyS',
    W: 'KeyW',
    CMD: 'OSLeft',
    EQUALS: 'Equal',
    MINUS: 'Minus',
};

export function addListeners() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    window.addEventListener('focus', clearHeld);
    window.addEventListener('blur', clearHeld);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', event => event.preventDefault());

    function handleKeyDown(event: KeyboardEvent) {
        held[event.code] = true;
        console.log('key', event.code);

        switch (event.code) {
            case KEY.ESC:
                togglePause();
                break;
            case KEY.EQUALS:
                scene.camera.zoomIn();
                break;
            case KEY.MINUS:
                scene.camera.zoomOut();
                break;
            case KEY.ZERO:
                scene.camera.resetZoom();
                break;
        }
    }

    function handleKeyUp(event: KeyboardEvent) {
        delete held[event.code];
    }

    function handleMouseDown(event: MouseEvent) {
        // Prevent default click handling on canvas
        if (event.target === elements.canvas) {
            event.preventDefault();
        }
    }

    function handleMouseUp(event: MouseEvent) {
        if (event.target === elements.canvas && !scene.paused) {
            getWorldCoordinates(event);
        }
    }

    function getWorldCoordinates(event: MouseEvent) {
        const { clientX, clientY } = event;
        const { camera, player } = scene;
        const x = camera.x + (clientX / camera.zoom);
        const y = camera.y + (clientY / camera.zoom);

        if (!held[KEY.CMD]) {
            player.clearTargets();
        }

        player.addTarget({
            x: x - (player.width / 2),
            y: y - (player.height / 2),
            tileSet: [
                {
                    tile: TILES.target,
                },
            ],
        });
    }
}

export function handleResize() {
    elements.canvas.width = window.innerWidth;
    elements.canvas.height = window.innerHeight;
    scene.camera.zoomChanged();
}
