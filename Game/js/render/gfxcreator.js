class GFX{
    static animations = [];

    static loadAnimations(animationPrefabs){
        for (let i = 0; i < animationPrefabs.length; i++) {
            
            this.animations.push({
                name: animationPrefabs[i].name,
                animation: {
                    duration: animationPrefabs[i].data.duration,
                    loop: animationPrefabs[i].data.loop,
                    image: ImageManager.getImage(animationPrefabs[i].data.imageName),
                    width: animationPrefabs[i].data.width,
                    height: animationPrefabs[i].data.height,
                    frames: animationPrefabs[i].data.frames
                }
                    
            });
        }
    }

    static  createAnimationPack(...names){
        let pack = [];
        for (let i = 0; i < this.animations.length; i++) {
            for (let j = 0; j < names.length; j++) {
                if(this.animations[i].name == names[j]){
                    pack.push({
                        name: this.animations[i].name,
                        animation: new AnimatedSprite(this.animations[i].animation)
                    });
                } 
            }
        }
        if(pack.length > 0)
            return new Animation(pack);
        else
            console.error("AnimationManager: Can't find animations!!!");
    }

    static  createAnimation(name){
        for (let i = 0; i < this.animations.length; i++) {
            if(this.animations[i].name == name){
                return new AnimatedSprite(this.animations[i].animation);
            }
        }
        console.error("AnimationManager: Can't find animation " + name);
    }

    static createSprite(name, x, y, width, height){
        let image = ImageManager.getImage(name);
        if(image == undefined)
            return undefined;
        return new Sprite(
            {
                image: ImageManager.getImage(name), 
                x: x || 0, 
                y: y || 0, 
                width: width || 32, 
                height: height || 32
            });
    }
}