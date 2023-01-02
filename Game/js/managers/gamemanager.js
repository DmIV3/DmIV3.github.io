class GM{
    static entityPool = {};
    static objects = [];
    static justCreatedEntities = [];
    static needCreate = false;
    static needSort = true;
    static #paused = false;

    static update(){
        if(GM.#paused)
            return;

        GM.performCreate();

        ///////////////////////////////////////////////
        let startTime = new Date().getTime();
        for (let i = 0; i < this.objects.length; i++) {
            if(!this.objects[i].active) continue;
            this.objects[i].update();
        }
        GM.t1 = new Date().getTime() - startTime;
        ////////////////////////////////////////////////

        ///////////////////////////////////////////////
        startTime = new Date().getTime();
        GM.updatePhysics();
        GM.t2 = new Date().getTime() - startTime;
        ////////////////////////////////////////////////


        ///////////////////////////////////////////////
        startTime = new Date().getTime();
        for (let i = 0; i < this.objects.length; i++) {
            if(this.objects[i].graphics){
                this.objects[i].graphics.update();
            }
        }
        GM.t3 = new Date().getTime() - startTime;
        ////////////////////////////////////////////////

        if(GM.needSort){
            GM.sortByZ();
            GM.needSort = false;
        }
    }

    static updatePhysics(){
        ///////////////////////////////////////////////
        let startTime = new Date().getTime();
        for (let i = 0; i < GM.objects.length; i++) {
            if(!GM.objects[i].active)
                continue;

            if(GM.objects[i].physics){
                GM.objects[i].physics.update();
                GM.objects[i].physics.collisionObjects = [];
            }
        }
        GM.t5 = new Date().getTime() - startTime;
        ////////////////////////////////////////////////

        for(let i = 0; i < GM.objects.length; i++){
            if(!GM.objects[i].active)
                continue;

            if(!GM.objects[i].physics)
                continue;

            let body1 = GM.objects[i].physics;

            if(body1.type == 1){
                for(let j = i + 1; j < GM.objects.length; j++){
                    if(!GM.objects[j].active)
                        continue;
                    if(!GM.objects[j].physics)
                        continue;

                    let body2 = GM.objects[j].physics;

                    if(body2.type == 1)
                        PHYS.SATBBCollision(body1, body2);
                    else if(body2.type == 0)
                        PHYS.SATBCCollision(body1, body2);
                }
            }else if(body1.type == 0){
                for(let j = i + 1; j < GM.objects.length; j++){
                    if(!GM.objects[j].active)
                        continue;
                    if(!GM.objects[j].physics)
                        continue;

                    let body2 = GM.objects[j].physics;

                    if(body2.type == 1)
                        PHYS.SATBCCollision(body2, body1);
                    else if(body2.type == 0)
                        PHYS.SATCCCollision(body1, body2);
                }
            }
        }
    }


    static render(renderer){
        ///////////////////////////////////////////////
        let startTime = new Date().getTime();
        for (let i = 0; i < this.objects.length; i++) {
            if(!this.objects[i].active) continue;
            this.objects[i].render(renderer);
        }
        GM.t4 = new Date().getTime() - startTime;
        ////////////////////////////////////////////////
    }

    static add(name, x, y, args){
        let newEntity = undefined;
        if(GM.entityPool[name] == undefined)
            return undefined;
        newEntity = Object.create(GM.entityPool[name]);
        newEntity.name = name;
        newEntity.init(x, y);
        GM.requestCreate(newEntity, args);
        if(newEntity.render == undefined){
            newEntity.render = function(renderer){
                if(newEntity.graphics){
                    let g = newEntity.graphics.getSprite();
                    renderer.drawRotatedCroppedImage(g.image, g.x, g.y, g.w, g.h, VP.screenX(newEntity.pos.x - newEntity.size.x / 2), VP.screenY(newEntity.pos.y - newEntity.size.y / 2), newEntity.size.x, newEntity.size.y, newEntity.angle);
                }
            }
        }
        if(newEntity.update == undefined)
            newEntity.update = function(){};
        return newEntity;
    }

    static remove(object){
        for (let i = this.objects.length-1; i >= 0; i--) {
            if(object == this.objects[i])
                this.objects.splice(i, 1);
        }
    }

    static findByName(name){
        for (let i = 0; i < GM.objects.length; i++) {
            if(name == GM.objects[i].name)
                return GM.objects[i];
            
        }
    }

    static size(){
        return this.objects.length;
    }

    static requestSort(){
        GM.needSort = true;
    }

    static requestCreate(entity, args){
        GM.needCreate = true;
        GM.justCreatedEntities.push({
            ref: entity,
            args: args
        });
    }

    static requestPHYS(obj){
        if(obj.physics != undefined)
            GM.bodiesToTest.push(obj.physics);
    }

    static performCreate(){
        if(GM.needCreate){
            for (let i = 0; i < GM.justCreatedEntities.length; i++) {
                GM.justCreatedEntities[i].ref.create(GM.justCreatedEntities[i].args);
                GM.objects.push(GM.justCreatedEntities[i].ref);
                GM.requestSort();
            }
            GM.needCreate = false;
            GM.justCreatedEntities = [];
        }
    }

    static sortByZ(){
        this.objects.sort(function(a, b){
            return a.z - b.z;
        });
    }

    static loadObjects(){
        GM.entityPool = {};
        for(let key in Entities){
            for (let entityName in Entities[key]) {
                GM.entityPool[entityName] = Entities[key][entityName];
            }
        }
    }

    static getObjects(){
        return GM.objects;
    }

    static clear(){
        GM.objects = [];
        GM.justCreatedEntities = [];
    }

    static pause(){
        GM.#paused = true;
        SFX.pauseAll();
    }

    static unpause(){
        GM.#paused = false;
        SFX.resumeAll();
    }

    static isPaused(){
        return GM.#paused;
    }
}