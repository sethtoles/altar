import { Camera } from './camera';
import { Character } from './character';
import { FRAME_RATE, COLOR, FONT, WORLD_MAP } from './constants';
import { addListeners, clearHeld, handleResize } from './eventHandlers';
import { GameObject } from './gameObject';
import { mapFactory } from './map';
import { Player } from './player';
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
let frame = 1;

// Environment Setup
addListeners();
handleResize();

// Game Start
scene.camera.zoomChanged()
gameLoop();

// -- FUNCTION DEFINITIONS -- //
function sceneFactory() {
    const background = mapFactory(WORLD_MAP);
    const player = new Player({
        sprintSpeed: 5,
    });
    const characters: Character[] = [];
    const props: GameObject[] = [];
    const colliders = spacialHashFactory();


    const testingObj = new GameObject({
        x: 300,
        y: 275,
        tileSet: [
            {
                tile: TILES.character,
            },
        ],
    });
    colliders.addChild(testingObj);
    props.push(testingObj);


    colliders.addChild(player);
    characters.push(player);

    return {
        layers: [
            background,
            props,
            player.targets,
            characters,
        ],
        characters,
        player,
        colliders,
        camera: new Camera({ following: player }),
        paused: false,
    };
}

function gameLoop(timer?: number) {
    if (scene.paused) {
        return;
    }

    const frameTime = timer - elapsed;
    const extraTime = Math.min(0, (1000 / FRAME_RATE) - frameTime); // Limit to 40fps
    elapsed = timer;
    frame++;

    clearScreen();

    scene.camera.follow();

    scene.layers.forEach((layer) => {
        layer.forEach((object) => {
            object.processFrame(frame); // TODO: Move to worker
            object.render(scene.camera);
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
