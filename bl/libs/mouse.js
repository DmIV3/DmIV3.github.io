export const MOUSE = {
    surface: undefined,
    x: 0,
    y: 0,
    down: false,
    left: false,
    leftPressed: false,
    leftReleased: false,
    middle: false,
    middlePressed: false,
    middleReleased: false,
    right: false,
    rightPressed: false,
    rightReleased: false,
    pressed: false,
    released: false,

    init: function(surface=document.body){
        if(this.surface !== undefined){
            console.error("MOUSE: Mouse listener is already inited. Somwhere...");
            return;
        }
        this.surface = surface;

        surface.onmousemove = e =>{
            e.preventDefault();
            this.x = e.offsetX;
            this.y = e.offsetY;
        }

        surface.onmouseleave = e =>{
            e.preventDefault();
            this.left = false;
            this.leftReleased = true;
            this.middle = false;
            this.middleReleased = true;
            this.right = false;
            this.rightReleased = true;
        }

        surface.oncontextmenu = e => e.preventDefault();

        surface.onmousedown = e =>{
            e.preventDefault();
            this.down = true;
            this.pressed = true;
            switch (e.button){
                case 0:
                    this.left = true;
                    this.leftPressed = true;
                    break;
                case 1:
                    this.middle = true;
                    this.middlePressed = true;
                    break;
                case 2:
                    this.right = true;
                    this.rightPressed = true;
                    break;
            }
        }

        surface.onmouseup = e =>{
            e.preventDefault();
            this.down = false;
            this.released = true;
            switch (e.button){
                case 0:
                    this.left = false;
                    this.leftReleased = true;
                    break;
                case 1:
                    this.middle = false;
                    this.middleReleased = true;
                    break;
                case 2:
                    this.right = false;
                    this.rightReleased = true;
                    break;
            }
        }
    },

    update: function(){
        this.pressed = false;
        this.released = false;
        this.leftPressed = false;
        this.leftReleased = false;
        this.rightPressed = false;
        this.rightReleased = false;
        this.middlePressed = false;
        this.middleReleased = false;
    }
}