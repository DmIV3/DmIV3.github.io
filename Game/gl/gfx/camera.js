class Camera{
    constructor(){
        this.matrix = Mat4.create();
        this.tanslationMatrix = Mat4.create();
        this.rotationMatrix = Mat4.create();
        this.zoomMatrix = Mat4.create();
        this.pos = Vec3.create(0, 0, 0);
        this.rotation = Vec3.create(0, 0, 0);
        this.zoom = Vec3.create(1, 1, 1);
    }

    setX(x=0){
        this.pos[0] = x;
    }

    setY(y=0){
        this.pos[1] = y;
    }

    setZ(z=0){
        this.pos[2] = z;
    }

    setPosition(x=0, y=0, z=0){
        this.pos[0] = x;
        this.pos[1] = y;
        this.pos[2] = z;
    }

    moveX(x=0){
        this.pos[0] += x;
    }

    moveY(y=0){
        this.pos[1] += y;
    }

    moveZ(z=0){
        this.pos[2] += z;
    }

    move(x=0, y=0, z=0){
        this.pos[0] += x;
        this.pos[1] += y;
        this.pos[2] += z;
    }

    setRotX(x=0){
        this.rotation[0] = x;
    }

    setRotY(y=0){
        this.rotation[1] = y;
    }

    setRotZ(z=0){
        this.rotation[2] = z;
    }

    setRot(x=0, y=0, z=0){
        this.rotation[0] = x;
        this.rotation[1] = y;
        this.rotation[2] = z;
    }

    rotateX(x=0){
        this.rotation[0] += x;
    }

    rotateY(y=0){
        this.rotation[1] += y;
    }

    rotateZ(z=0){
        this.rotation[2] += z;
    }

    rotate(x=0, y=0, z=0){
        this.rotation[0] += x;
        this.rotation[1] += y;
        this.rotation[2] += z;
    }

    setScaleX(x=1){
        this.zoom[0] = x;
    }

    setScaleY(y=1){
        this.zoom[1] = y;
    }

    setScale(x=1, y=1){
        this.zoom[0] = x;
        this.zoom[1] = y;
    }

    scaleX(x=0){
        this.zoom[0] += x;
    }

    scaleY(y=0){
        this.zoom[1] += y;
    }

    scale(x=0, y=0){
        this.zoom[0] += x;
        this.zoom[1] += y;
    }

    applyTransforms(){
        this.tanslationMatrix = Mat4.translation(this.pos[0], this.pos[1], this.pos[2]);
        this.rotationMatrix = Mat4.rotation(this.rotation[0], this.rotation[1], this.rotation[2]);
        this.zoomMatrix = Mat4.scalation(this.zoom[0], this.zoom[1], this.zoom[2]);

        
        Mat4.multiply(this.tanslationMatrix, this.rotationMatrix);
        Mat4.multiply(this.tanslationMatrix, this.zoomMatrix);
        
        this.matrix = this.tanslationMatrix;
    }
}