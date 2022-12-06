Entities["Player"] = {
    player_mage: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 20;
            this.physics = PHYS.createBox(this, Vec.v2(25, 50), [COLLIDERS.PLAYER], 1);
            this.graphics = GFX.createAnimationPack("mage_walk_d", "mage_walk_u", "mage_walk_r", "mage_walk_l",
                                                     "mage_att_d", "mage_att_u", "mage_att_r", "mage_att_l");
        },
        create(){
            this.moveSpeed = 200;
            this.shotCd = 300;
            this.moving = false;
            this.shooting = false;
            this.dir = "b";
            VP.setCameraTarget(this);
            this.controller = GM.add("controller", 0, 0, {owner:this, type:0});
        },
        update(){
            this.shotCd -= Time.getElapsed();
            this.move();
        },
        move(){
            this.controller.action();
            if(!this.shooting)
                this.graphics.setCurrentAnimation("mage_walk_"+this.dir);
            
            if(!this.moving && !this.shooting)
                this.graphics.pause();
            else
                this.graphics.play();
        },
        shot(){
            if(this.shotCd <= 0){
                this.graphics.setCurrentAnimation("mage_att_" + this.dir);
                this.graphics.reset();
                this.shotCd = 300;
                let attAngle = 0;
                if(this.dir == "l")
                    attAngle = Math.PI;
                else if(this.dir == "r")
                    attAngle = 0;
                else if(this.dir == "u")
                    attAngle = -1.57;
                else if(this.dir == "d")
                    attAngle = 1.57;
                GM.add("bullet", this.pos.x, this.pos.y, attAngle);
            }
        },
        setZ(){
            this.z = 20 +  UMath.map(this.pos.y, -2000, 2000);
            GM.requestSort();
        },
    },
    bullet: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(20, 20);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createCircle(this, this.size.x/2, [COLLIDERS.PLAYER], 0);
            this.graphics = undefined;
        },
        create(ang){
            this.dir = Vec.v2(1,0);
            if(ang != undefined) 
                Vec.setAngle(this.dir, ang);
            else
                Vec.setAngle(this.dir, 0);
            this.lifeTime  = 500;
            this.moveSpeed = 1000;
        },
        update(){
            this.live();
            this.move();
        },
        render(r){
            r.setColor("red");
            r.fillCircle(VP.screenX(this.pos.x), VP.screenY(this.pos.y), 5);
        },
        move(){
            Vec.add(this.pos, Vec.multiplyN(this.dir, this.moveSpeed * Time.deltaSeconds()));
        },
        live(){
            this.lifeTime -= Time.getElapsed();
            if(this.lifeTime <=0)
                GM.remove(this);
            if(this.physics.hasCollision())
                GM.remove(this);
        }
    },
    controller: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(20, 20);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = undefined;
        },
        create(args){
            this.owner = args.owner;
            
            if(args.type == 0){
                this.attBtn = UI.addButton("a", VP.getWidth() - 120, VP.getHeight() - 120, 50, 50, GFX.createSprite("ui", 0, 0, 50, 50), GFX.createSprite("ui", 50, 0, 50, 50));
                this.joy = UI.addJoystick("j", 0, VP.getHeight()/2, VP.getWidth()/3, VP.getHeight()/2, 50, GFX.createSprite("ui", 0, 50, 100, 100), GFX.createSprite("ui", 100, 50, 50, 50));
                this.action = function(){
                    this.owner.moving = false;
                    if(this.joy.active){
                        this.owner.moving = true;
                        this.owner.setZ();
                        Vec.add(this.owner.pos, Vec.multiplyN(this.joy.getInput(), this.owner.moveSpeed * Time.deltaSeconds()));
                        if(Vec.dot(Vec.v2(1, 0), this.joy.getInput()) > 0){
                            let cp = Vec.cross(this.joy.getInput(), Vec.v2(1, 0));
                            if(cp >= -1 && cp < -0.5)
                                this.owner.dir = "d";
                            else if(cp >= -0.5 && cp < 0.5)
                                this.owner.dir = "r";
                            else
                                this.owner.dir = "u";
                        }else{
                            let cp = Vec.cross(this.joy.getInput(), Vec.v2(1, 0));
                            if(cp >= -1 && cp < -0.5)
                                this.owner.dir = "d";
                            else if(cp >= -0.5 && cp < 0.5)
                                this.owner.dir = "l";
                            else
                                this.owner.dir = "u";
                        }
                    }
                    if(this.attBtn.getDown()){
                        this.owner.shooting = true;
                        this.owner.shot();
                    }else{
                        this.owner.shooting = false; 
                    }
                }
            }else{
                this.action = function(){
                    if(Input.keyDown(65)){
                        this.owner.pos.x -= this.owner.moveSpeed * Time.deltaSeconds();
                        this.owner.dir = "l";
                        this.owner.moving = true;
                    }
                    if(Input.keyDown(68)){
                        this.owner.pos.x += this.owner.moveSpeed * Time.deltaSeconds();
                        this.owner.dir = "r";
                        this.owner.moving = true;
                    }
                    if(Input.keyDown(87)){
                        this.owner.pos.y -= this.owner.moveSpeed * Time.deltaSeconds();
                        this.owner.dir = "u";
                        this.owner.setZ();
                        this.owner.moving = true;
                    }
                    if(Input.keyDown(83)){
                        this.owner.pos.y += this.owner.moveSpeed * Time.deltaSeconds();
                        this.owner.dir = "d";
                        this.owner.setZ();                    
                        this.owner.moving = true;
                    }

            

                    if(Input.mouseDown(0)){
                        this.owner.shooting = true;
                        this.owner.shot();
                    }else{
                        this.owner.shooting = false; 
                    }
                }
            }
            
        },
        update(){

        }
    },
    debug:{
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(20, 20);
            this.angle = 0;
            this.z = 999;
            this.physics = undefined;
            this.graphics = undefined;
        },
        create(){
            this.timePassed = 0;
            this.fps = 0;
            this.line = 1;
        },
        update(){
            this.fps = Time.getFPS().toFixed(2);
        },
        render(r){
            this.line = 1;
            r.setColor("white");
            r.setFontSize(18);
            r.setTextAlign("left");
            this.drawLine(r, this.fps);
        },
        drawLine(renderer, text){
            renderer.fillText(text, 20, 50 +  (this.line++ * 20));
        }
    }
}
Entities["Brick Walls"] = {
    brick: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 0, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_l_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 100, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 0, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_t_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 0, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 0, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 50, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_l_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 100, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 150, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 50, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_r_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 100, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 150, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 50, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_b_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 150, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 50, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_l_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 100, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    brick_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 150, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
}
Entities["Rock Walls"] = {
    rock: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 200, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_l_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 300, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 200, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_t_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 200, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 200, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 250, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_l_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 300, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 350, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 250, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_r_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 300, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 350, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 250, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_b_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 350, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 250, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_l_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 300, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    rock_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 350, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
}
Entities["Steel Walls"] = {
    steel: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 400, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_l_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 500, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 400, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_t_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 400, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 400, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 450, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_l_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 500, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 550, 0, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 450, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_r_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 500, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 550, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 450, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_b_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 550, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 450, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_l_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 500, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    steel_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("tiles", 550, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
}
Entities["Roof Tiles"] = {
    roof: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 0, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_l_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 100, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 0, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_t_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 0, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 0, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 50, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_l_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 100, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 150, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 50, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_r_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 100, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 150, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 50, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_b_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 150, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 50, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_l_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 100, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    roof_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 150, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
}
Entities["Flowers"] = {
    flowers: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 200, 0, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_l_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 300, 100, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 200, 50, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_t_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 200, 100, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 200, 150, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 250, 0, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_l_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 300, 0, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 350, 0, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 200, 50, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_r_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations",300, 50, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_b_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 350, 50, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 250, 100, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_b_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 350, 100, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 250, 150, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_l_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 300, 150, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    flowers_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 350, 150, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
}
Entities["Stone Roads"] = {
    road: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 200, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_l_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 300, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 200, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_t_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 200, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 200, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 250, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_l_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 300, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 350, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_b_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 250, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_l_b_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 300, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_l_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 350, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 250, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_t_l_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 350, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 250, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_l_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 300, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    road_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 350, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },

}
Entities["Dirt Roads"] = {
    dirt: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 400, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_l_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 500, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 400, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_t_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 400, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 400, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 450, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_l_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 500, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_l: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 550, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_b_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 450, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_l_b_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 500, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_l_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 550, 250, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_t_r_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 450, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_t_l_b: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 550, 300, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 450, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_l_t_r: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 500, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    dirt_l_t: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = undefined;
            this.graphics = GFX.createSprite("tiles", 550, 350, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },

}
Entities["Nature"] = {
    tree_trunk_1: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 11;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("decorations", 0, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    tree_trunk_2: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 11;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("decorations", 50, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    tree_trunk_3: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 11;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("decorations", 100, 50, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    tree_leaves_1: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 0, 0, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    tree_leaves_2: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 50, 0, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    tree_leaves_3: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 30;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 100, 0, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    bushes_1: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 20;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 150, 0, 50, 50);
        },
        create(){
            this.z = 20 +  UMath.map(this.pos.y, -2000, 2000);
            GM.requestSort();
        },
        update(){

        }
    },
    bushes_2: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 20;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 150, 50, 50, 50);
        },
        create(){
            this.z = 20 +  UMath.map(this.pos.y, -2000, 2000);
            GM.requestSort();
        },
        update(){

        }
    },
    bushes_3: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 20;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 150, 100, 50, 50);
        },
        create(){
            this.z = 20 +  UMath.map(this.pos.y, -2000, 2000);
            GM.requestSort();
        },
        update(){

        }
    },
    bushes_4: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 20;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 150, 150, 50, 50);
        },
        create(){
            this.z = 20 +  UMath.map(this.pos.y, -2000, 2000);
            GM.requestSort();
        },
        update(){

        }
    },
    stone_1: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("decorations", 0, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    stone_2: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("decorations", 50, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    stone_3: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("decorations", 100, 100, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    stone_4: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("decorations", 0, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    stone_5: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("decorations", 50, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
    stone_6: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 10;
            this.physics = PHYS.createBox(this, this.size, [COLLIDERS.WALLS], 1);
            this.graphics = GFX.createSprite("decorations", 100, 150, 50, 50);
        },
        create(){
            this.physics.setStatic();
        },
        update(){
           
        }
    },
}
Entities["Destructuble Env"] = {
    barrel: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 20;
            this.physics = PHYS.createCircle(this, this.size.x / 2, [], 1);
            this.graphics = GFX.createSprite("decorations", 0, 200, 50, 50);
        },
        create(){
            this.physics.setMass(this.physics.mass * 2);
            this.hp = 3;
        },
        update(){
            if(this.physics.hasCollisionWith("bullet")){
                this.hp--;
                if(this.hp <= 0){
                    GM.remove(this);
                    GM.add("barrel_broken", this.pos.x, this.pos.y);
                }
            }
        }
    },
    barrel_broken: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 20;;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 50, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    crate: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 20;
            this.physics = PHYS.createBox(this, this.size, [], 1);
            this.graphics = GFX.createSprite("decorations", 100, 200, 50, 50);
        },
        create(){
            this.physics.setMass(this.physics.mass * 2);
            this.hp = 3;
        },
        update(){
            if(this.physics.hasCollisionWith("bullet")){
                this.hp--;
                if(this.hp <= 0){
                    GM.remove(this);
                    GM.add("crate_broken", this.pos.x, this.pos.y);
                }
            }
        }
    },
    crate_broken: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(50, 50);
            this.angle = 0;
            this.z = 20;;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 150, 200, 50, 50);
        },
        create(){
            
        },
        update(){
           
        }
    },
    bucket: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(25, 25);
            this.angle = 0;
            this.z = 20;
            this.physics = PHYS.createBox(this, this.size, [], 1);
            this.graphics = GFX.createSprite("decorations", 0, 250, 25, 25);
        },
        create(){
            this.physics.setMass(this.physics.mass * 2);
            this.hp = 3;
        },
        update(){
            if(this.physics.hasCollisionWith("bullet")){
                this.hp--;
                if(this.hp <= 0){
                    GM.remove(this);
                    GM.add("bucket_broken", this.pos.x, this.pos.y);
                }
            }
        }
    },
    bucket_broken: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(25, 25);
            this.angle = 0;
            this.z = 20;;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 25, 250, 25, 25);
        },
        create(){
            
        },
        update(){
           
        }
    },
    vase: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(25, 25);
            this.angle = 0;
            this.z = 20;
            this.physics = PHYS.createBox(this, this.size, [], 1);
            this.graphics = GFX.createSprite("decorations", 0, 275, 25, 25);
        },
        create(){
            this.physics.setMass(this.physics.mass * 2);
            this.hp = 1;
        },
        update(){
            if(this.physics.hasCollisionWith("bullet")){
                this.hp--;
                if(this.hp <= 0){
                    GM.remove(this);
                    GM.add("vase_broken", this.pos.x, this.pos.y);
                }
            }
        }
    },
    vase_broken: {
        init(x, y){
            this.pos = Vec.v2(x, y);
            this.size = Vec.v2(25, 25);
            this.angle = 0;
            this.z = 20;;
            this.physics = undefined;
            this.graphics = GFX.createSprite("decorations", 25, 275, 25, 25);
        },
        create(){
            
        },
        update(){
           
        }
    },
}