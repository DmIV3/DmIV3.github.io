import { TOUCH } from "./touch.js";
import { Vec } from "./vector.js";
import { COLL } from "./collision.js";
import { M } from './math.js';

export const VJoystick = {
    create: function(boxPos, boxSize, radius){
        return {
            pos: Vec.fromVector(boxPos),
            size: Vec.fromVector(boxSize),
            rot: 0,
            visible: true,
            radius: radius,
            start: Vec.create(0, 0),
            current: Vec.create(0, 0),
            active: false,
            inpId: -1,
            pressed: false,
            dir: Vec.create(0, 0),

            update: function(dt){
                if(!this.visible) return;
                this.chekPressed();
                this.chekReleased();

                if(this.pressed){
                    if(!this.active){
                        this.active = true;
                        this.start.x = TOUCH.touches[this.inpId].start.x;
                        this.start.y = TOUCH.touches[this.inpId].start.y;
                    }else{
                        this.current.x = TOUCH.touches[this.inpId].current.x;
                        this.current.y = TOUCH.touches[this.inpId].current.y;
                        
                        if(M.distSq(this.start.x, this.start.y, this.current.x, this.current.y) > this.radius * this.radius){
                            this.dir.x = this.current.x - this.start.x;
                            this.dir.y = this.current.y - this.start.y;
                            Vec.normalize(this.dir);
                        }else{
                            this.dir.x = (this.current.x - this.start.x) / this.radius;
                            this.dir.y = (this.current.y - this.start.y) / this.radius;
                        }
                    }
                }else{
                    this.active = false;
                    this.dir.x = 0;
                    this.dir.y = 0;
                }
            },

            render: function(ctx){
                if(!this.visible) return;

                if(this.pressed){
                    ctx.fillStyle = '#EEEEEE';
                    ctx.strokeStyle = '#DCDCDC';
                    ctx.lineWidth = 8;
                    ctx.beginPath()
                    ctx.arc(this.start.x, this.start.y, this.radius, 0, M.TWO_PI);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.arc(this.start.x + this.dir.x * this.radius, this.start.y + this.dir.y * this.radius, this.radius / 2, 0, M.TWO_PI);
                    ctx.fill();
                    ctx.closePath();
                }
            },

            getVector: function(){
                return this.dir;
            },

            chekPressed: function(){
                if(!this.pressed){
                    for (let i = 0; i < TOUCH.touches.length; i++) {
                        if(!TOUCH.touches[i].active)
                            continue;
                        if(COLL.pointRect(TOUCH.touches[i].start.x, TOUCH.touches[i].start.y,  this.pos.x, this.pos.y, this.size.x, this.size.y)){
                            this.pressed = true; 
                            this.inpId = i;
                        }
                    }
                }
            },
        
            chekReleased: function(){
                if(this.pressed){
                    if(!TOUCH.touches[this.inpId].active){
                        this.pressed = false;
                        this.inpId = -1;
                    }
                }
            }
        }
    }
}