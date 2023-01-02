class Touch{
    constructor(id){
        this.id = id;
        this.start = {
            x: 0,
            y: 0
        };
        this.current = {
            x: 0,
            y: 0
        };
        this.end = {
            x: 0,
            y: 0
        };
        this.active = false;
    }
}
class Input{
    static keys = [];
    static lastKeys = [];
    static touches;
    static lastTouches = [];
    static mousePosX = 0;
    static mousePosY = 0;
    static mouseWheelScroll = 0;
    static mousebuttons = [];
    static lastButtons = [];
    static mobile = false;

    static init(surface){
        let touchesAmount = 0;
        
        if(navigator.userAgentData.mobile){
            this.mobile = true;
            touchesAmount = 5;
            this.lastTouches = new Array(touchesAmount).fill(false);
            surface.addEventListener("touchstart", this.#handleStart, false);
            surface.addEventListener("touchmove", this.#handleMove, false);
            surface.addEventListener("touchend", this.#handleEnd, false);
            surface.addEventListener("touchcancel", this.#handleCancel, false);
        }else{
            this.mobile = false;
            touchesAmount = 3;
            this.keys = new Array(180).fill(false);
            this.lastKeys = new Array(180).fill(false);
            this.mousebuttons = new Array(3).fill(false);
            this.lastButtons = new Array(3).fill(false);
            this.lastTouches = new Array(touchesAmount).fill(false);
            surface.addEventListener("mousedown", this.#handleMouseStart, false);
            surface.addEventListener("mouseup", this.#handleMouseEnd, false);
            surface.addEventListener("mousemove", this.#handleMouseMove, false);
            surface.addEventListener("contextmenu", this.#rightButton, false);
            surface.addEventListener("mouseleave", this.#handleMouseLeave, false);
            document.addEventListener("keydown", this.#keyDown, false);
            document.addEventListener("keyup", this.#keyUp, false);
            
            surface.addEventListener("wheel", this.#handleWheel, false);
        }
        window.addEventListener("resize", this.#windowResize, false);
        Input.touches = new Array(touchesAmount);

        for(let i = 0; i < Input.touches.length; i++){
            Input.touches[i] = new Touch(i);
        }
    }

    static mouseX(){
        return this.mousePosX;
    }
    static mouseY(){
        return this.mousePosY;
    }

    static touch(id){
        return this.touches[id];
    }

    static getTouches(){
        return this.touches;
    }

    static touchStarted(t){
        return this.touches[t].active && !this.lastTouches[t];
    }

    static touchEnded(t){
        return !this.touches[t].active && this.lastTouches[t];
    }

    static keyDown(kc){
        return this.keys[kc];
    }

    static keyPressed(kc){
        return this.keys[kc] && !this.lastKeys[kc];
    }

    static keyReleased(kc){
        return !this.keys[kc] && this.lastKeys[kc];
    }

    static mouseDown(btn){
        return this.mousebuttons[btn];
    }

    static mousePressed(btn){
        return this.mousebuttons[btn] && !this.lastButtons[btn];
    }

    static mouseReleased(btn){
        return !this.mousebuttons[btn] && this.lastButtons[btn];
    }

    static mouseWheel(){
        return this.mouseWheelScroll;
    }

    static update(){
        for (let i = 0; i < this.keys.length; i++) {
            this.lastKeys[i] = this.keys[i];  
        }
        for (let i = 0; i < this.mousebuttons.length; i++) {
            this.lastButtons[i] = this.mousebuttons[i];  
        }
        for (let i = 0; i < this.touches.length; i++) {
            this.lastTouches[i] = this.touches[i].active;  
        }

        this.mouseWheelScroll = 0;
    }

    static #windowResize(){
        VP.resize();
    }

    static #handleStart(e){
        e.preventDefault();
        for(let i = 0; i < e.touches.length; i++){
            for(let j = 0; j< Input.touches.length; j++){
                if(Input.touches[j].id == e.touches[i].identifier &&  Input.touches[j].active == false){
                     Input.touches[j].start.x = e.touches[i].clientX;
                     Input.touches[j].start.y = e.touches[i].clientY;
                     Input.touches[j].current.x = e.touches[i].clientX;
                     Input.touches[j].current.y = e.touches[i].clientY;
                     Input.touches[j].active = true;
                }
            }
        }
    }
    static #handleMove(e){
      	e.preventDefault();
          for(let i = 0; i < e.touches.length; i++){
        	for(let j = 0; j < Input.touches.length; j++){
    	    	if(Input.touches[j].id == e.touches[i].identifier){
    			    Input.touches[j].current.x = e.touches[i].clientX;
    			    Input.touches[j].current.y = e.touches[i].clientY;
    			}
    	    }
        }
    }
    static #handleEnd(e){
    	e.preventDefault();
        for(let j = 0; j < Input.touches.length; j++){
    		Input.touches[j].active = false;
        	for(let i = 0; i < e.touches.length; i++){
    	    	if(Input.touches[j].id == e.touches[i].identifier){
    				Input.touches[j].active = true;
    			}
    	    }
        }
        for(let j = 0; j < Input.touches.length; j++){
        	if(Input.touches[j].active == false){
    	    	Input.touches[j].end.x = Input.touches[j].current.x;
    			Input.touches[j].end.y = Input.touches[j].current.y;
    		}
       }
    }
    static #handleCancel(e){
        e.preventDefault();
        for(let j = 0; j < Input.touches.length; j++){
            Input.touches[j].active = false;
            for(let i = 0; i < e.touches.length; i++){
                if(Input.touches[j].id == e.touches[i].identifier){
                    Input.touches[j].active = true;
                }
            }
        }
        for(let j = 0; j < Input.touches.length; j++){
            if(Input.touches[j].active == false){
                Input.touches[j].end.x = Input.touches[j].current.x;
                Input.touches[j].end.y = Input.touches[j].current.y;
            }
        }
    }
        
    static #handleMouseStart(e){
        e.preventDefault();
        Input.mousebuttons[e.button] = true;
        Input.touches[e.button].active = true;
        Input.touches[e.button].start.x = e.clientX;
        Input.touches[e.button].start.y = e.clientY;
        Input.touches[e.button].current.x = e.clientX;
        Input.touches[e.button].current.y = e.clientY;
    }
    static #handleMouseEnd(e){
        e.preventDefault();
        Input.mousebuttons[e.button] = false;
    	Input.touches[e.button].active = false;
    	Input.touches[e.button].end.x = e.clientX;
    	Input.touches[e.button].end.y = e.clientY;
    }
    static #handleMouseMove(e){
        e.preventDefault();
        Input.mousePosX = e.clientX;
        Input.mousePosY = e.clientY;
        for(let i = 0; i < Input.touches.length; i++){
            if(Input.touches[i].active){
                Input.touches[i].current.x = e.clientX;
                Input.touches[i].current.y = e.clientY;
            }
        }
    }
    static #handleMouseLeave(e){
    	e.preventDefault();
    	for(let i = 0; i < Input.touches.length; i++){
    		Input.touches[i].active = false;
    		Input.touches[i].end.x = e.clientX;
    		Input.touches[i].end.y = e.clientY;
    	}
        Input.clearMouseInput();
    }
    static #rightButton(e){
    	e.preventDefault();
    }
        
    static #keyDown(e){
        if(e.keyCode == 9)
            e.preventDefault();
    	Input.keys[e.keyCode] = true;
    }
    static #keyUp(e){
        if(e.keyCode == 9)
            e.preventDefault();
    	Input.keys[e.keyCode] = false;
    }

    static #handleWheel(e){
        e.preventDefault();
        if(e.deltaY > 0)
            Input.mouseWheelScroll = 1;
        else if(e.deltaY < 0)
            Input.mouseWheelScroll = -1;
        else
            Input.mouseWheelScroll = 0;
    }

    static clearKeyInput(){
        for(let i = 0; i < Input.keys.length; i++){
    		Input.keys[i] = false;
    	}
    }

    static clearMouseInput(){
        for (let i = 0; i < Input.mousebuttons.length; i++) {
            Input.mousebuttons[i] = false;
        }
    }
}