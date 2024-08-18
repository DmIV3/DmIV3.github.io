import { MOUSE } from "../libs/mouse.js";
import { KB } from "../libs/keyboard.js";
import { Vec } from "../libs/vector.js";
import { M } from "../libs/math.js";
import { CANVAS } from "../libs/canvas.js";
import { VJoystick } from "../libs/utils.js";

export class Game {
    constructor(){
        this.map = [
            [1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,1,0,0,0,1],
            [1,0,1,0,0,0,0,0,0,1],
            [1,0,1,0,0,1,0,0,0,1],
            [1,0,1,0,0,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,1],
            [1,1,1,1,1,1,1,1,1,1],
        ]

        this.player = new Player(4, 3, 0, this.map);
        this.mapPreview = new MapPreview(this.map, this.player, Vec.create(5, 5), Vec.create(200, 200));
        this.renderer = new Renderer(this.map, this.player, undefined, 0.471239);
    }

    update(dt){
        this.player.update(dt);
    }

    render(ctx){
        this.renderer.render(ctx);
        this.mapPreview.render(ctx);
    }
}

class Player{
    constructor(xPos=0, yPos=0, rot=0, map){
        this.pos = Vec.create(xPos, yPos);
        this.rot = rot;

        this.moveSpeed = 2.0; // Tiles per second
        this.rotSpeed = M.PI / 2; // Turns per second (in radians)

        this.map = map; // 2D array

        this.controller = VJoystick.create(Vec.create(20, 20), Vec.create(CANVAS.width / 3, CANVAS.height -40), 50);
    }
    
    update(dt){
        // if(KB.keyPressed('KeyA')){
        //     this.rot -= this.rotSpeed * dt;
        // }
        
        // if(KB.keyPressed('KeyD')){
        //     this.rot += this.rotSpeed * dt;
        // }
        
        // if(KB.keyPressed('KeyW')){
        //     this.move(true, this.moveSpeed * dt);
        // }
        
        // if(KB.keyPressed('KeyS')){
        //     this.move(false, this.moveSpeed * dt);
        // }

        let input = this.controller.getVector();
        if(input.y > 0){
            this.move(true, -input.y * this.moveSpeed * dt);
        }else if(input.y < 0){
            this.move(false, input.y * this.moveSpeed * dt);
        }
        this.rot += input.x * this.rotSpeed * dt;
    }

    render(ctx){
        this.controller.render();
    }

    move(forward, amount){
        let dir = Vec.fromAngle(this.rot);
        Vec.scale(dir, amount);
        let nextPos = Vec.fromVector(this.pos);
        if(forward)
            Vec.add(nextPos, dir);
        else
            Vec.sub(nextPos, dir);
        
        if(this.map[~~nextPos.y][~~nextPos.x] !== 1){
            Vec.copy(this.pos, nextPos);
        }
    }
}

class MapPreview{
    constructor(map, player, pos, size){
        this.map = map;
        this.player = player;

        if(pos === undefined){
            this.pos = Vec.create(10, 10);
        }else{
            this.pos = pos;
        }
        if(size === undefined){
            this.size = Vec.create(200, 200);
        }else{
            this.size = size;
        }
        this.cellSize = Vec.create(this.size.x / map[0].length, this.size.y / map.length);
    }

    render(ctx){
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';
        ctx.moveTo(this.pos.x -1, this.pos.y-1);
        ctx.lineTo(this.pos.x + this.size.x + 1, this.pos.y -1);
        ctx.lineTo(this.pos.x + this.size.x + 1, this.pos.y + this.size.y + 1);
        ctx.lineTo(this.pos.x -1, this.pos.y + this.size.y + 1);
        ctx.lineTo(this.pos.x -1, this.pos.y -1);
        ctx.stroke();

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[0].length; x++) {
                if(this.map[y][x] === 1){
                    ctx.fillStyle = '#333333';
                }else if(this.map[y][x] === 0){
                    ctx.fillStyle = '#AAAAAA';
                }
                ctx.fillRect(this.pos.x + (x * this.cellSize.x), this.pos.y + (y * this.cellSize.y), this.cellSize.x, this.cellSize.y);
            }
        }

        let playerPos = Vec.create(this.pos.x + (this.player.pos.x * this.cellSize.x),
                                    this.pos.y + (this.player.pos.y * this.cellSize.y));
        let playerDir = Vec.fromAngle(this.player.rot);
        Vec.scale(playerDir, this.cellSize.x);
        Vec.add(playerDir, playerPos);

        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(playerPos.x, playerPos.y, 5, 0, M.TWO_PI);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(playerPos.x, playerPos.y);
        ctx.lineTo(playerDir.x, playerDir.y);
        ctx.stroke();
    }
}

class Renderer{
    constructor(map, player, rayAmount, fov){
        CANVAS.onresize = this.resize.bind(this);
        this.map = map;
        this.player = player;

        if(rayAmount !== undefined){
            rayAmount = Math.min(rayAmount, CANVAS.width);
            this.checkAllLines = false;
            this.elemSize = Vec.create(CANVAS.width / rayAmount, CANVAS.height * 1);
            this.rayAmount = rayAmount;
        }else{
            this.checkAllLines = true;
            this.elemSize = Vec.create(1, CANVAS.height * 1);
            this.rayAmount = CANVAS.width;
        }

        if(fov !== undefined){
            this.fov = fov;
        }else{
            this.fov = M.PI * 0.3;
        }

        this.viewStep = this.fov / this.rayAmount;
        this.maxViewDist = 12;
        this.lightDir = Vec.create(1, 0);
    }

    render(ctx){
        let min = this.player.rot - this.fov / 2 + this.viewStep / 2,
            max = this.player.rot + this.fov / 2;

        let wallX = 0;
        for(let i = min; i <= max; i += this.viewStep){

            let rayDIr = Vec.fromAngle(i);
            let intersection = DDA(this.map, this.player.pos, rayDIr, this.maxViewDist);

            if(intersection !== undefined){
                Vec.sub(intersection.pos, this.player.pos);
                let dis = Vec.len(intersection.pos);
                let scale =  1 - (dis / this.maxViewDist);
                let rgb = ~~(175 * scale);
                let light = (Vec.dot(this.lightDir, intersection.nomal) + 1) / 2;
                rgb *= light;
                let color = 'rgb('+ rgb + ', ' + rgb + ', ' + rgb +')';
                if(this.checkAllLines){
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(wallX, CANVAS.centerY - (this.elemSize.y / 2 * scale));
                    ctx.lineTo(wallX, CANVAS.centerY + (this.elemSize.y / 2 * scale));
                    ctx.stroke();
                }else{
                    ctx.fillStyle = color;
                    ctx.fillRect(wallX, CANVAS.centerY - this.elemSize.y * scale / 2, this.elemSize.x, this.elemSize.y * scale);
                }
            }
            wallX += this.elemSize.x;
        }
        ctx.stroke();
    }

    resize(){
        if(this.checkAllLines){
            this.rayAmount = CANVAS.width;
            this.viewStep = this.fov / this.rayAmount;
            this.elemSize = Vec.create(1, CANVAS.height * 1);
        }else{
            this.elemSize = Vec.create(CANVAS.width / this.rayAmount, CANVAS.height * 1);
        }
    }
}

function DDA(arrMap, vRayStart, vRayDir, fMaxDistance=10){
    fMaxDistance--;
    let vRayUnitStepSize = Vec.create( Math.sqrt(1 + (vRayDir.y / vRayDir.x) * (vRayDir.y / vRayDir.x)), 
                                       Math.sqrt(1 + (vRayDir.x / vRayDir.y) * (vRayDir.x / vRayDir.y)));
    let vMapCheck = Vec.create(Math.floor(vRayStart.x), Math.floor(vRayStart.y));
    let vRayLength1D = Vec.create();
    let vStep = Vec.create();

    // Establish Starting Conditions
    if (vRayDir.x < 0){
        vStep.x = -1;
        vRayLength1D.x = (vRayStart.x - vMapCheck.x) * vRayUnitStepSize.x;
    }
    else{
        vStep.x = 1;
        vRayLength1D.x = ((vMapCheck.x + 1) - vRayStart.x) * vRayUnitStepSize.x;
    }

    if (vRayDir.y < 0){
        vStep.y = -1;
        vRayLength1D.y = (vRayStart.y - vMapCheck.y) * vRayUnitStepSize.y;
    }
    else{
        vStep.y = 1;
        vRayLength1D.y = ((vMapCheck.y + 1) - vRayStart.y) * vRayUnitStepSize.y;
    }

    // Perform "Walk" until collision or range check
    let bTileFound = false;
    let fDistance = 0.0;
    let vNormal = Vec.create();
    while (!bTileFound && fDistance < fMaxDistance){
        // Walk along shortest path
        if (vRayLength1D.x < vRayLength1D.y){
            vMapCheck.x += vStep.x;
            fDistance = vRayLength1D.x;
            vRayLength1D.x += vRayUnitStepSize.x;

            // Get surface normal
            vNormal.y = 0;
            vNormal.x = vMapCheck.x > vRayStart.x ? -1 : 1;
        }else{
            vMapCheck.y += vStep.y;
            fDistance = vRayLength1D.y;
            vRayLength1D.y += vRayUnitStepSize.y;

            // Get surface normal
            vNormal.x = 0;
            vNormal.y = vMapCheck.y > vRayStart.y ? -1 : 1;
        }
        // Test tile at new test point
        if (vMapCheck.x >= 0 && vMapCheck.x < arrMap[0].length && vMapCheck.y >= 0 && vMapCheck.y < arrMap.length){
            if (arrMap[vMapCheck.y][vMapCheck.x] == 1){
                bTileFound = true;
            }
        }
    }

    // Calculate intersection location
    if (bTileFound){
        return {
            pos: Vec.create(
                vRayStart.x + vRayDir.x * fDistance,
                vRayStart.y + vRayDir.y * fDistance),
            nomal: vNormal
        };
    }
    return undefined;
}