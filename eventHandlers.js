const KEY = {
    CLICK: 1,
    RIGHT_CLICK: 3,
    SHIFT: 16,
    ESC: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ZERO: 48,
    A: 65,
    D: 68,
    S: 83,
    W: 87,
    CMD: 224,
    EQUALS: 61,
    MINUS: 173,
};

function addListeners() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', event => event.preventDefault());

    function handleKeyDown(event) {
        held[event.which] = true;
        console.log('key', event.which);

        switch (event.which) {
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

    function handleKeyUp(event) {
        held[event.which] = false;
    }

    function handleMouseDown(event) {
        // Prevent default click handling on canvas
        if (event.target === elements.canvas) {
            event.preventDefault();
        }
    }

    function handleMouseUp(event) {
        if (event.target === elements.canvas && !scene.paused) {
            getWorldCoordinates(event);
        }
    }

    function getWorldCoordinates(event) {
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

function handleResize() {
    elements.canvas.width = window.innerWidth;
    elements.canvas.height = window.innerHeight;
    scene.camera.zoomChanged();
}

function handleFocus() {
    utils.clearHeld();
}

function handleBlur() {
    utils.clearHeld();
}
