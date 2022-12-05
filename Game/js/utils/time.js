class Time{
    static elapsed = 0;
    static passed = 0;
    static delta = 0;
    static last = 0;
    static fps = 0;
    static pause = false;
    
    static update(timestamp){
        this.passed = timestamp;
        this.elapsed = timestamp - this.last;
        if(this.elapsed > 100){
            this.elapsed = 16.66;
        }
        this.last = timestamp;
        this.delta = this.elapsed / 1000;
        this.fps = 1000 / this.elapsed;
    }

    static deltaSeconds(){
        return this.delta;
    }
    static getPassed(){
        return this.passed;
    }
    static getFPS(){
        return this.fps;
    }
    static getElapsed(){
        return this.elapsed;
    }
}