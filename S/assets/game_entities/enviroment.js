//// TO DO
import { Vec2 } from "../../engine/maths/vector.js";
export const ENVIROMENTS = {
    wall: {
        create(x, y){
            this.pos = Vec2.create(x, y);
            this.size = Vec2.create(64, 64);
            this.color = 'orange';
        },
        update(){
            
        },
        render(ctx){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, this.size.x, this.size.y);
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'darkgreen';
            ctx.rect(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, this.size.x, this.size.y);
            ctx.stroke();
        }
    }
}