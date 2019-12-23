import { cameraFactory } from './camera';
import { COLOR, FONT, WORLD_MAP } from './constants';
import { addListeners, clearHeld, handleResize } from './eventHandlers';
import { gameObjectFactory } from './gameObject';
import { mapFactory } from './map';
import { playerFactory } from './player';
import { spacialHashFactory } from './spacialHash';
import { TILES } from './tiles';

// Stored Elements
export const elements = {
    canvas: document.getElementById('gameLayer') as HTMLCanvasElement,
};

// Canvas State
export const ctx = elements.canvas.getContext('2d');

// Game State
export const scene = sceneFactory();
let elapsed = 0;

// Environment Setup
addListeners();
handleResize();

// Game Start
scene.camera.zoomChanged()
gameLoop();

// -- FUNCTION DEFINITIONS -- //
function sceneFactory() {
    const background = mapFactory(WORLD_MAP);
    const player = playerFactory({
        sprintSpeed: 5,
    });
    const characters = [];
    const colliders = spacialHashFactory();


    const testingObj = gameObjectFactory({
        x: 300,
        y: 275,
        tileSet: [
            {
                tile: TILES.character,
            },
        ],
    });
    colliders.addChild(testingObj);
    characters.push(testingObj);


    characters.push(player);
    colliders.addChild(player);

    return {
        layers: [
            background,
            player.targets,
            characters,
        ],
        characters,
        player,
        colliders,
        camera: cameraFactory({ following: player }),
        paused: false,
    };
}

function gameLoop(timer?: number) {
    if (scene.paused) {
        return;
    }

    const frameTime = timer - elapsed;
    const extraTime = Math.min(0, 25 - frameTime); // Limit to 40fps
    elapsed = timer;

    clearScreen();

    scene.camera.follow();

    scene.layers.forEach((layer) => {
        layer.forEach((object) => {
            // TODO: Move to worker
            if (object.processFrame) {
                object.processFrame();
            }

            if (object.render) {
                object.render(scene.camera);
            }
        });
    });

    setTimeout(() => {
        window.requestAnimationFrame(gameLoop);
    }, extraTime);
}

export function togglePause() {
    scene.paused = !scene.paused;
    clearHeld();

    if (scene.paused) {
        clearScreen();
        ctx.fillStyle = COLOR.BLACK;
        ctx.font = FONT.PRIMARY;
        ctx.textAlign = 'center';
        ctx.fillText(
            'PAUSED',
            elements.canvas.width / 2,
            elements.canvas.height / 2
        );
    }
    else {
        gameLoop();
    }
}

function clearScreen() {
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
}
