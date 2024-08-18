import * as En from "./entity.js";
import { CANVAS } from '../libs/canvas.js';
import { MOUSE } from '../libs/mouse.js';
import { KB } from "../libs/keyboard.js";
import { TOUCH } from "../libs/touch.js";
import { VJoystick } from "../libs/utils.js";

CANVAS.init();
MOUSE.init(CANVAS.canvas);
TOUCH.init(CANVAS.canvas);
KB.init();

let prevTime = 0,
    deltaTime = 0;

///////////////// FPS Meter ////////////////////////
let maxFrame = 10;
let frameRate = new Array(maxFrame).fill(0);
let fps = 0;
let frameIndex = 0;
///////////////// FPS Meter ////////////////////////

const game = new En.Game();

function tick(timePassed=0){
    deltaTime = (timePassed - prevTime) / 1000;
    ///////////////// FPS Meter ////////////////////////
    frameRate[frameIndex++] = 1000 / (timePassed - prevTime);
    frameIndex = frameIndex >= maxFrame ? 0 : frameIndex;
    if(frameIndex === 0){
        fps = ~~(frameRate.reduce((acc, curr)=> acc += curr, 0) / maxFrame);
        document.title = 'fps:' + fps;
    }
    ///////////////// FPS Meter ////////////////////////
    prevTime = timePassed;

    CANVAS.clear();

    game.player.controller.update(deltaTime);
    game.update(deltaTime);
    game.render(CANVAS.ctx);    
    game.player.controller.render(CANVAS.ctx);

    MOUSE.update();
    KB.update();
    TOUCH.update();
    requestAnimationFrame(tick, CANVAS.canvas)
}

tick();