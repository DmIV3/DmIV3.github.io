class Camera2D{
    constructor(x, y){
        this.pos = Vec.v2(x, y);
        this.center = Vec.zero();
        this.target = undefined;

        this.transData = {
            t: 0,
            duration: 0,
            processing: false,
            shaking: false,
            amplitude: Vec.zero(),
            startPos: Vec.zero(),
            endPos: Vec.zero()
        };  
    }

    update(){
        this.center.x = this.pos.x + VP.getWidth() / 2;
        this.center.y = this.pos.y + VP.getHeight() / 2;
        this.#execMoveLinear();
        this.#execFollowTarget();
        this.#exeScreenShake();
    }

    setTarget(target){
        this.target = target;
    }

    removeTarget(){
        this.target = undefined;
    }

    lookAt(x, y){
        this.pos.x = Math.round(x - VP.getWidth() / 2);
        this.pos.y = Math.round(y - VP.getHeight() / 2);
    }

    moveTo(start, end, duration){
        if(this.transData.shaking)
            return;
        this.target = undefined;
        this.transData.processing = true;
        this.transData.startPos = Vec.copy(start);
        this.transData.endPos = Vec.copy(end);
        this.transData.duration = duration / 1000;
        this.transData.t = 0;
    }

    #execMoveLinear(){
        if(this.transData.processing){
            this.transData.t += (1 / this.transData.duration) * Time.deltaSeconds();
            this.pos = Vec.lerp(this.transData.startPos, this.transData.endPos, this.transData.t);
            this.pos.x -= VP.getWidth() / 2;
            this.pos.y -= VP.getHeight() / 2;
            if(this.transData.t >= 1 || this.target){
                this.transData.processing = false;
            }
        }
    }

    #execFollowTarget(){
        if(this.target){
            this.lookAt(this.target.pos.x, this.target.pos.y);
        }
    }

    shake(amplitude, duration){
        if(this.transData.processing)
            return;
            
        this.transData.shaking = true;
        this.transData.amplitude.x = amplitude;
        this.transData.duration = duration;
        if(!this.target){
            this.target = {
                pos: Vec.copy(this.center)
            }
        }
    }

    #exeScreenShake(){
        if(this.transData.shaking){
            this.transData.duration -= Time.getElapsed();
            Vec.setAngle(this.transData.amplitude, UMath.random(0, 6.283));
            Vec.add(this.pos, this.transData.amplitude);
            if(this.transData.duration <= 0){
                this.transData.shaking = false;
            }
        }
    }
}

class VP{
    static width = 0;
    static height = 0;
    static surface;
    static camera;

    static update(){
        this.camera.update();
    }

    static getWidth(){
        return this.width;
    }

    static getHeight(){
        return this.height;
    }

    static setSurface(canvas){
        this.surface = canvas;
    }

    static getSurface(){
        return this.surface;
    }

    static setCamera(camera){
        this.camera = camera;
    }

    static getCamera(){
        return this.camera;
    }

    static setCameraTarget(target){
        this.camera.setTarget(target);
    }

    static getCameraPos(){
        return this.camera.pos;
    }

    static getCameraCenter(){
        return this.camera.center;
    }

    static screenX(x){
        return x - this.camera.pos.x;
    }

    static screenY(y){
        return y - this.camera.pos.y;
    }

    static worldX(x){
        return x + this.camera.pos.x;
    }

    static worldY(y){
        return y + this.camera.pos.y;
    }

    static resize(){
        this.width = this.surface.width = window.innerWidth;
        this.height = this.surface.height  = window.innerHeight;
    }
}