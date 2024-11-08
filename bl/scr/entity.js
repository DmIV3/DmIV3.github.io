import { MOUSE } from "../libs/mouse.js";
import { KB } from "../libs/keyboard.js";
import { Vec } from "../libs/vector.js";
import { M } from "../libs/math.js";
import { CANVAS } from "../libs/canvas.js";
import { VJoystick } from "../libs/utils.js";
import { COLL } from "../libs/collision.js";

export class Game {
    constructor(){
        let cell_size = 50;
        let h_cells_amt = Math.ceil(CANVAS.width / cell_size);
        let v_cells_amt = Math.ceil(CANVAS.height / cell_size);
        this.points = (new Array(600)).fill(0);

        
        for(let i in this.points){
            this.points[i] = Vec.create(M.rndi(0, CANVAS.width), M.rndi(0, CANVAS.height));
        }

        this.grid = new Grid(this.points, h_cells_amt, v_cells_amt, cell_size);
        this.ballLightning1 = new BallLigthning(CANVAS.centerX, CANVAS.centerY, this.grid);
        this.ballLightning2 = new BallLigthning(CANVAS.centerX, CANVAS.centerY, this.grid);
        this.ballLightning3 = new BallLigthning(CANVAS.centerX, CANVAS.centerY, this.grid);
    }

    update(dt){
        this.ballLightning1.update(dt);
        this.ballLightning2.update(dt);
        this.ballLightning3.update(dt);
    }

    render(ctx){
        ctx.fillStyle = 'gray';
        for(let p of this.points){
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, M.TWO_PI);
            ctx.fill();
        }

        this.ballLightning1.render(ctx);
        this.ballLightning2.render(ctx);
        this.ballLightning3.render(ctx);
    }
}

class Grid{
    constructor(points_arr, h_cells, v_cells, cell_size){
        this.cell_size = cell_size;
        this.table_width = h_cells;
        this.table_height = v_cells;
        this.points = [];
        this.table = [];

        // Creating cells of the table
        for(let i = 0; i < h_cells * v_cells; i++){
            this.table.push({
                adjacentCells: [],
                container: [],
            });
        }

        // Distribute the points between the cells
        for (let i = 0; i < points_arr.length; i++) {
            let point = points_arr[i];
            this.getCellByScreenCoords(point.x, point.y).container.push(point);
        }
        
        // Make connections between the cells
        for (let i = 0; i < this.table.length; i++) {
            const cell = this.table[i];
            this.setupConnections(cell, i);
        }
    }

    getCellByScreenCoords(x, y){
        let index = Math.min(Math.max(Math.floor(y / this.cell_size) * this.table_width + Math.floor(x / this.cell_size), 0), this.table.length-1);
        return this.table[index];
    }

    getCluster(x, y){
        let points = [];
        let cell = this.getCellByScreenCoords(x, y);
        
        for(let i = 0; i < cell.adjacentCells.length; i++){
            points.push(...this.table[cell.adjacentCells[i]].container)
        }
        points.push(...cell.container);

        return points;
    }

    setupConnections(cell, index){
        let left = index - 1;
        let right = index + 1;
        let top = index - this.table_width;
        let bot = index + this.table_width;
        let leftAllowed = Math.floor(left  / this.table_width) === Math.floor(index / this.table_width);
        let rightAllowed = Math.floor(right  / this.table_width) === Math.floor(index / this.table_width);
        let topAllowed = top >= 0;
        let botAllowed = bot < this.table.length;

        if(leftAllowed){
            cell.adjacentCells.push(left);
        }
        if(rightAllowed){
            cell.adjacentCells.push(right);
        }
        if(topAllowed){
            if(leftAllowed){
                cell.adjacentCells.push(top-1);
            }
            cell.adjacentCells.push(top);
            if(rightAllowed){
                cell.adjacentCells.push(top+1);
            }
        }
        if(botAllowed){
            if(leftAllowed){
                cell.adjacentCells.push(bot-1);
            }
            cell.adjacentCells.push(bot);
            if(rightAllowed){
                cell.adjacentCells.push(bot+1);
            }
        }
    }
}

class BallLigthning{
    constructor(x, y, table){
        this.table = table;
        this.pos = Vec.create(x, y);
        this.legs = [];
        this.legPositions = [];
        this.legLenth = 80;
        this.searchRadius = 50;
        this.legAmt = 32;

        for(let i = 0; i < this.legAmt; i++){
            let step = M.TWO_PI / this.legAmt;
            this.legPositions.push(Vec.create(
                this.pos.x + Math.cos(i * step) * this.legLenth, 
                this.pos.y + Math.sin(i * step) * this.legLenth));
            this.legs.push(Vec.create(0, 0));
        }
        this.move(Vec.create());

        this.nextPos = Vec.create();
        this.oldPos = Vec.fromVector(this.pos);
        this.travelTime = 0;
        this.setNextPosition(Vec.fromAngle(M.rndi(0, M.TWO_PI)));

        this.lightningSprites = [
            document.createElement('img'), 
            document.createElement('img'),
            document.createElement('img'),
            document.createElement('img'),
            document.createElement('img'),
        ]
        this.lightningSprites[0].src = '/img/lightning1.png';
        this.lightningSprites[1].src = '/img/lightning2.png';
        this.lightningSprites[2].src = '/img/lightning3.png';
        this.lightningSprites[3].src = '/img/ball1.png';
        this.lightningSprites[4].src = '/img/ball2.png';
    }

    update(dt){
        this.travelTime += dt / 3;
        let nextMove = Vec.create();
        Vec.lerp(this.oldPos, this.nextPos, nextMove, this.travelTime);
        this.move(Vec.create(nextMove.x - this.pos.x, nextMove.y - this.pos.y));
        if(this.travelTime >= 1){
            this.setNextPosition(Vec.fromAngle(M.rndi(0, M.TWO_PI)));
        }
    }

    render(ctx){
        for (let i = 0; i < this.legs.length; i++) {
            const leg = this.legs[i];
            let len = Vec.dist(this.pos, leg);
            ctx.save();
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(M.angle(this.pos.x, this.pos.y, leg.x, leg.y));
            ctx.drawImage(this.lightningSprites[M.rndi(0, 2)], 0, -8, len, 16);
            ctx.restore();
        }

        ctx.drawImage(this.lightningSprites[M.rndi(3, 4)], this.pos.x - 32, this.pos.y - 32, 64, 64);
    }

    move(amtVec){
        Vec.add(this.pos, amtVec);
        this.pos.x = Math.min(Math.max(0, this.pos.x), CANVAS.width);
        this.pos.y = Math.min(Math.max(0, this.pos.y), CANVAS.height);

        for(let i = 0; i < this.legPositions.length; i++){
            let step = M.TWO_PI / this.legAmt;
            this.legPositions[i].x = Math.min(Math.max(0, this.pos.x + Math.cos(i * step) * this.legLenth), CANVAS.width);
            this.legPositions[i].y = Math.min(Math.max(0, this.pos.y + Math.sin(i * step) * this.legLenth), CANVAS.height);
        }

        this.moveLegs();
    }

    moveLegs(){
        for(let i = 0; i < this.legPositions.length; i++){
            const searchPoint = this.legPositions[i];
            const tablePoints = this.table.getCluster(searchPoint.x, searchPoint.y);

            let closestPoint = Vec.create(Infinity, Infinity);
            for(let tp of tablePoints){
                if(Vec.dist(searchPoint, tp) <= this.searchRadius){
                    let foundPoint = Vec.fromVector(tp);
                    if(Vec.distSq(searchPoint, foundPoint) < Vec.distSq(searchPoint, closestPoint)){
                        closestPoint = foundPoint;
                    }
                }
            }
            if(closestPoint.x === Infinity && closestPoint.y === Infinity){
                this.legs[i] = Vec.fromVector(this.pos);
            }else{
                this.legs[i] = Vec.fromVector(closestPoint);
            }
        }
    }

    setNextPosition(direction){
        Vec.normalize(direction)
        this.nextPos = direction;
        this.oldPos = Vec.fromVector(this.pos);
        this.travelTime = 0;
        Vec.scale(this.nextPos, M.rndi(100, 200));
        Vec.add(this.nextPos, this.pos);
    }
}
