import { Watch } from "./entity.js";

MOUSE.init();

let prevTime = 0,
    deltaTime = 0;


const watch = Watch.create();
let t = 0.05;

function tick(elapsedTime=0){
    deltaTime = (elapsedTime - prevTime) / 1000;
    prevTime = elapsedTime;

    t -= deltaTime;
    if(t <= 0){
        TWEEN.update(deltaTime);

        watch.update();
        watch.render();

        t = 0.05 + t;
        MOUSE.update();
    }

    requestAnimationFrame(tick)
}
tick(0);