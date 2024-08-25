import { MOUSE } from "../libs/mouse.js";
import { KB } from "../libs/keyboard.js";
import { Vec } from "../libs/vector.js";
import { M } from "../libs/math.js";
import { CANVAS } from "../libs/canvas.js";
import { VJoystick } from "../libs/utils.js";

export class Game {
    constructor(){
        this.tiles = new Array(16);
        this.tiles[0] = new Tile(0,   [false, false, false, false], '../wave_func_collapse/res/tile_0.png');
        this.tiles[1] = new Tile(1,   [false, true,  false, false], '../wave_func_collapse/res/tile_1.png');
        this.tiles[2] = new Tile(2,   [false, false, false, true],  '../wave_func_collapse/res/tile_2.png');
        this.tiles[3] = new Tile(3,   [true,  false, false, false], '../wave_func_collapse/res/tile_3.png');
        this.tiles[4] = new Tile(4,   [false, false, true,  false], '../wave_func_collapse/res/tile_4.png');
        this.tiles[5] = new Tile(5,   [false, true,  false, true],  '../wave_func_collapse/res/tile_5.png');
        this.tiles[6] = new Tile(6,   [true,  true , false, false], '../wave_func_collapse/res/tile_6.png');
        this.tiles[7] = new Tile(7,   [false, true,  true,  false], '../wave_func_collapse/res/tile_7.png');
        this.tiles[8] = new Tile(8,   [true,  true,  true,  true],  '../wave_func_collapse/res/tile_8.png');
        this.tiles[9] = new Tile(9,   [true,  false, false, true],  '../wave_func_collapse/res/tile_9.png');
        this.tiles[10] = new Tile(10, [false, false, true,  true],  '../wave_func_collapse/res/tile_10.png');
        this.tiles[11] = new Tile(11, [true,  false, true,  false], '../wave_func_collapse/res/tile_11.png');
        this.tiles[12] = new Tile(12, [true,  true,  true,  false], '../wave_func_collapse/res/tile_12.png');
        this.tiles[13] = new Tile(13, [false, true,  true,  true],  '../wave_func_collapse/res/tile_13.png');
        this.tiles[14] = new Tile(14, [true,  false, true,  true],  '../wave_func_collapse/res/tile_14.png');
        this.tiles[15] = new Tile(15, [true,  true,  false, true],  '../wave_func_collapse/res/tile_15.png');

        this.width = 20;
        this.height = 20;
        this.connectionProbability = 0.333;
        this.size = Math.floor(Math.min(CANVAS.width / this.width, CANVAS.height / this.height));
        this.offset = Vec.create(~~((CANVAS.width - (this.width * this.size)) / 2), ~~((CANVAS.height - (this.height * this.size)) / 2));
        log(this.offset)
        this.tileMap = M.create2dArray(this.width, this.height, -1);
        this.xPos = 0, this.yPos = 0;
        this.tileMap[0][0] = 0;
    }

    update(dt){
        for(let i = 0; i < 10; i++)
            this.step();
        if(KB.keyDown('KeyA')){
            this.xPos = 0, this.yPos = 0;
            this.tileMap = M.create2dArray(this.width, this.height, -1);
            this.tileMap[0][0] = 0;
        }
    }

    render(ctx){
        for(let y = 0; y < this.tileMap.length; y++){
            for(let x = 0; x < this.tileMap[y].length; x++){
                if(this.tileMap[y][x] === -1)
                    continue;
                this.tiles[this.tileMap[y][x]].render(ctx, x * this.size + this.offset.x, y * this.size + this.offset.y, this.size);
            }
        }
    }

    step(){
        if(this.xPos >= this.width-1 && this.yPos >= this.height-1){
            return;
        }

        this.xPos++;
        if(this.xPos >= this.width){
            this.xPos = 0;
            this.yPos++;
        }

        let pick = Vec.create(this.xPos, this.yPos);

        let newConnections = {
            left: this.setConnection(pick, Vec.create(-1, 0)),
            right: this.setConnection(pick, Vec.create(1, 0)),
            top: this.setConnection(pick, Vec.create(0, -1)),
            bottom: this.setConnection(pick, Vec.create(0, 1)),
        };

        let candidats = [];
        for(let t of this.tiles){
            if(t.connections.left === newConnections.left &&
                t.connections.right === newConnections.right &&
                t.connections.top === newConnections.top &&
                t.connections.bottom === newConnections.bottom
            )
            candidats.push(t);
        }

        this.tileMap[pick.y][pick.x] = candidats[M.rndi(0, candidats.length-1)].id;
    }

    setConnection(pick, dirVec){
        let pos = Vec.fromVector(pick);
        Vec.add(pos, dirVec);
        if(pos.x < 0 || pos.y < 0 || pos.x >= this.width || pos.y >= this.height)
            return false;
        
        let index = this.tileMap[pos.y][pos.x];

        if(index === -1)
            return Math.random() < this.connectionProbability;

        let target = this.tiles[index];

        if(pick.x > pos.x){
            return target.connections.right;
        }else if(pick.x < pos.x){
            return target.connections.left;
        }else if(pick.y > pos.y){
            return target.connections.bottom;
        }else if(pick.y < pos.y){
            return target.connections.top;
        }
        return false;
    }
}

class Tile{
    constructor(id, connections, imagePath){
        this.id = id;
        this.image = undefined;
        new Promise(resolve =>{
            this.image = document.createElement('img');
            this.image.src = imagePath;
            this.image.addEventListener('load', ()=>resolve(this.image));
        });
        this.connections = {
            top: connections[0],
            right: connections[1],
            bottom: connections[2],
            left: connections[3],
        }
    }
    
    render(ctx, x, y, size){
        if(this.image)
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, x, y, size, size);
    }
}
