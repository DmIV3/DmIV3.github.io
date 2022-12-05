class Sprite{
    constructor(data){
        this.image = data.image;
        this.x = data.x;
        this.y = data.y;
        this.w = data.width;
        this.h = data.height;
    }

    getSprite(){
        return {image: this.image, x: this.x, y: this.y, w: this.w, h: this.h};
    }

    update(){}
}

class AnimatedSprite{
    constructor(data){
        this.timePerFrame = data.duration / data.frames.length;
        this.timePassed = 0;
        this.image = data.image;
        this.w = data.width;
        this.h = data.height;
        this.frames = data.frames;
        this.loop = data.loop;
        this.currentFrame = 0;
        this.runnig = data.loop;
    }

    update(){

        if(this.runnig){
            this.timePassed += Time.getElapsed();

            if(this.timePassed >= this.timePerFrame){
                this.timePassed = 0;
                this.currentFrame++;
            }

            if(this.currentFrame >= this.frames.length){
                if(this.loop)
                    this.currentFrame = 0;
                else{
                    this.currentFrame = this.frames.length - 1;
                    this.runnig = false;
                }
            }
        }
    }

    isAnimating(){
        return this.runnig;
    }

    getSprite(){
        return {image: this.image,
                x: this.frames[this.currentFrame][0],
                y: this.frames[this.currentFrame][1],
                w: this.w, 
                h: this.h
            };
    }

    play(){
        this.runnig = true;
    }

    stop(){
        this.reset();
        this.runnig = false;
    }

    pause(){
        this.runnig = false;
    }

    reset(){
        this.currentFrame = 0;
        this.timePassed = 0;
    }
}

class Animation{
    constructor(data){
        this.animations = [];
        this.currentAnimation = data[0].animation;

        for (let i = 0; i < data.length; i++) {
            this.animations.push({
                name: data[i].name,
                animation: data[i].animation
            });
        }
    }

    setCurrentAnimation(name){
        for (let i = 0; i < this.animations.length; i++) {
            if(this.animations[i].name == name){
                this.currentAnimation = this.animations[i].animation;
            };
        }
    }

    isAnimating(){
        return this.currentAnimation.runnig;
    }

    getSprite(){
        return this.currentAnimation.getSprite();
    }

    update(){
        this.currentAnimation.update();
    }

    play(){
        this.currentAnimation.play();
    }

    stop(){
        this.currentAnimation.stop();
    }

    pause(){
        this.currentAnimation.pause();
    }

    reset(){
        this.currentAnimation.reset();
    }
}