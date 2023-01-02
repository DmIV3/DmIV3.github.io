let Entities = {};
Entities["std"] = {
    std_inv_wall: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.active = true;
            this.angle = 0;
            this.z = 9999;
            this.physics = PHYS.createBox(this, this.size, [-1], 1);
            this.graphics = undefined;
        },
        create(){
            this.angle = 0;
            this.physics.verticesRef = [
                Vec.v2(0, 0),
                Vec.v2(this.size.x, 0),
                Vec.v2(this.size.x, this.size.y),
                Vec.v2(0, this.size.y)
            ];
            this.physics.setStatic();
        },
        update(){},
        render(){
        }
    }
}