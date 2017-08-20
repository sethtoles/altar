const KEY = {
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
    CMD: 91,
    EQUALS: 187,
    MINUS: 189,
};

function addListeners() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mouseup', handleClick);

    function handleKeyDown(event) {
        held[event.which] = true;

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
            default:
                console.log(event.which);
        }
    }

    function handleKeyUp(event) {
        held[event.which] = false;
    }

    function handleClick(event) {
        if (!scene.paused) {
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
            tile: TILES.character,
        });
    }
}

function handleResize(event) {
    elements.canvas.width = window.innerWidth;
    elements.canvas.height = window.innerHeight;
}
