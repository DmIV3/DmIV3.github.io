class ImageManager{
    static images = [];

    static loadImages(imagesToLoad){
        this.images = [];
        for (let i = 0; i < imagesToLoad.length; i++) {
            let img = {};
            img.name = imagesToLoad[i].name;
            img.image = new Image();
            img.image.src = imagesToLoad[i].src;
            this.images.push(img);
        }
    }

    static getImage(name){
        for (let i = 0; i < this.images.length; i++) {
            if(this.images[i].name == name){
                return this.images[i].image;
            } 
        }
        console.error("ImageManager: Can't find the image: " + name);
    }
}