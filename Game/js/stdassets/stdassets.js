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
        render(r){
            r.setColor("white");
            let p1 = this.physics.vertices[0];
            let p2 = this.physics.vertices[1];
            let p3 = this.physics.vertices[2];
            let p4 = this.physics.vertices[3];
            r.drawLine(VP.screenX(p1.x), VP.screenY(p1.y), VP.screenX(p2.x), VP.screenY(p2.y))
            r.drawLine(VP.screenX(p2.x), VP.screenY(p2.y), VP.screenX(p3.x), VP.screenY(p3.y))
            r.drawLine(VP.screenX(p3.x), VP.screenY(p3.y), VP.screenX(p4.x), VP.screenY(p4.y))
            r.drawLine(VP.screenX(p4.x), VP.screenY(p4.y), VP.screenX(p1.x), VP.screenY(p1.y))
        }
    }
}