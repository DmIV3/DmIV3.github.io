import { Watch } from "./entity.js";

const watch = Watch.create();


function tick(){
    watch.update();
    watch.render();
}

setInterval(tick, 1000 / 30);
