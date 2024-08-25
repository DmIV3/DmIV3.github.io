export const TOUCH = {

    max: 3,
    touches: [],
    lastTouches: {},

    init: function(surface){
        for (let i = 0; i < this.max; i++) {
            this.touches[i] = {
                current: {x: 0, y: 0},
                start: {x: 0, y: 0},
                end: {x: 0, y: 0},
                active: false
            }
            this.lastTouches[i] = false;
        }
      
        surface.addEventListener("touchstart", (e)=>{
            e.preventDefault();
            for(let i = 0; i < e.touches.length; i++){
                for(let j = 0; j < this.max; j++){
                    if(j === e.touches[i].identifier &&  this.touches[j].active === false){
                      this.touches[j].current.x = this.touches[j].start.x = e.touches[i].clientX;
                      this.touches[j].current.y = this.touches[j].start.y = e.touches[i].clientY;
                      this.touches[j].active = true;
                    }
                }
            }
        }, {passive: false});
      
        surface.addEventListener("touchmove", (e)=>{
            e.preventDefault();
            for(let i = 0; i < e.touches.length; i++){
                for(let j = 0; j < this.max; j++){
                    if(j === e.touches[i].identifier){
                        this.touches[j].current.x = e.touches[i].clientX;
                        this.touches[j].current.y = e.touches[i].clientY;
                    }
                }
            }
        }, {passive: false});
      
        surface.addEventListener("touchend", (e)=>{
            e.preventDefault();
            for(let j = 0; j < this.max; j++){
                this.touches[j].active = false;
                for(let i = 0; i < e.touches.length; i++){
                    if(j === e.touches[i].identifier){
                        this.touches[j].active = true;
                    }
                }
            }
      
            for(let j = 0; j < this.max; j++){
                if(this.touches[j].active === false){
                    this.touches[j].end.x = this.touches[j].current.x;
                    this.touches[j].end.y = this.touches[j].current.y;
                }
            }
        }, {passive: false});
      
        surface.addEventListener("touchcancel", (e)=>{
            for(let j = 0; j < this.max; j++){
                this.touches[j].active = false;
                for(let i = 0; i < e.touches.length; i++){
                    if(j === e.touches[i].identifier){
                        this.touches[j].active = true;
                    }
                }
            }
      
            for(let j = 0; j < this.max; j++){
                if(this.touches[j].active === false){
                    this.touches[j].end.x = this.touches[j].x;
                    this.touches[j].end.y = this.touches[j].y;
                }
            }
        }, {passive: false});
    },

    update: function(){
        for (let i = 0; i < this.max; i++) {
            this.lastTouches[i] = this.touches[i].active;  
        }
    },

    get: function(id){return this.touches[id];},

    getAll: function(){return this.touches;},
  
    started: function(id){return this.touches[id].active && !this.lastTouches[id];},
  
    ended: function(id){return !this.touches[id].active && this.lastTouches[id];}
}