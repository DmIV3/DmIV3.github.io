export const CANVAS = {
    canvas: undefined,
    ctx: undefined,
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    onresize: function(){},

    init: function(width=0, height=0){

        if(this.ctx !== undefined){
            console.error("CANVAS: canvas is already inited. Somewhere...");
            return;
        }

        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.canvas.style.imageRendering = 'pixelated';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        document.body.appendChild(this.canvas);

        if(width === 0 && height === 0){
            this.resize();
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = 0;
            this.canvas.style.left = 0;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            window.onresize = this.resize.bind(this);
        }else{
            this.canvas.width = this.width = width;
            this.canvas.height = this.height = height;
            this.centerX = width / 2;
            this.centerY = height / 2;
        }
        
    },

    clear: function(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    },
    point: function(v, color='red', fill=true){
        this.ctx.beginPath();
        this.ctx.arc(v.x, v.y, 5, 0, 6.283);
        if(fill){
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }else{
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
    },
    circle: function(v, r=5, color='red', fill=true){
        this.ctx.beginPath();
        this.ctx.arc(v.x, v.y, r, 0, 6.283);
        if(fill){
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }else{
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
    },
    rect: function(v, s, color='red', fill=true){
        this.ctx.beginPath();
        this.ctx.rect(v.x, v.y, s.x, s.y);
        if(fill){
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }else{
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
    },
    line: function(a, b, color='red'){
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(b.x, b.y);
        this.ctx.stroke();
    },


    getCanvas: function(){
        return this.canvas;
    },
    getContext: function(){
        return this.ctx;
    },
    getDimentions: function(){
        return {
            width: this.width,
            height: this.height,
            centerX: this.centerX,
            centerY: this.centerY
        }
    },
    resize: function(){
        this.canvas.width = this.width = window.innerWidth;
        this.canvas.height = this.height = window.innerHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.onresize();
    }
}