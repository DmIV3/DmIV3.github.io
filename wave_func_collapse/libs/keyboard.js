export const KB = {
    keys: {
        Any: {
            pressed: false,
            down: false,
            up: false
        }
    },
    keyArray: ['Any'],
    lastKey: undefined,

    init: function(){
        document.body.onkeydown = function(e){
            e.preventDefault();

            KB.lastKey = e.code;
            
            
            if(e.repeat) { return };
            KB.keys.Any.down = true;

            if(KB.keys[e.code] === undefined){
                KB.keyArray.push(e.code);
                KB.keys[e.code] = {
                    pressed: true,
                    down: true,
                    up: false
                }
                return;
            }
            
            KB.keys[e.code].pressed = true;
            KB.keys[e.code].down = true;
        }

        document.body.onkeyup = function(e){
            e.preventDefault();

            KB.keys.Any.up = true;

            if(KB.keys[e.code] === undefined){
                KB.keyArray.push(e.code);
                KB.keys[e.code] = {
                    pressed: false,
                    down: false,
                    up: true
                }
                return;
            }

            KB.keys[e.code].pressed = false;
            KB.keys[e.code].up = true;
        }
    },

    keyPressed: function(code){
        return this.keys[code] ? this.keys[code].pressed : false;
    },

    keyDown: function(code){
        return this.keys[code] ? this.keys[code].down : false;
    },

    keyUp: function(code){
        return this.keys[code] ? this.keys[code].up : false;
    },

    update: function(){
        this.keys.Any.pressed = false;

        for (let i = 0; i < this.keyArray.length; i++) {
            if(this.keys[this.keyArray[i]].pressed) this.keys.Any.pressed = true;

            this.keys[this.keyArray[i]].up = false;
            this.keys[this.keyArray[i]].down = false;
        }
    }
}