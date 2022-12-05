class GM{
    static entityPool = {};
    static objects = [];
    static justCreatedEntities = [];
    static needCreate = false;
    static needSort = true;
    static #paused = false;
    static updatePhysics = function(){};
    static bodiesToTest = [];

    static init(){
        if(SETTINGS.physicsOnRequest){
            GM.updatePhysics = function(){
                for (let i = 0; i < GM.bodiesToTest.length; i++) {
                    GM.bodiesToTest[i].update();
                }
                for (let i = 0; i < GM.bodiesToTest.length; i++) {
                    const body1 = GM.bodiesToTest[i];
                    for(let j = i + 1; j < GM.bodiesToTest.length; j++){
                        const body2 = GM.bodiesToTest[j];
                        if(body1.type == 1){
                            if(body2.type == 1)
                                PHYS.SATBBCollision(body1, body2);
                            else
                                PHYS.SATBCCollision(body1, body2);
                        }
                        if(body1.type == 0){
                            if(body2.type == 1)
                                PHYS.SATBCCollision(body2, body1);
                            else
                                PHYS.SATCCCollision(body1, body2);
                        }
                    }
                }
                GM.bodiesToTest = [];
            }
        }else{
            GM.updatePhysics = function(){
                for (let i = 0; i < GM.objects.length; i++) {
                    if(GM.objects[i].physics){
                        GM.objects[i].physics.update();
                        GM.objects[i].physics.collisionObjects = [];
                    }
                }
        
                for(let i = 0; i < GM.objects.length; i++){
                    if(!GM.objects[i].physics)
                        continue;
        
                    if(GM.objects[i].physics.type == 1){
                        for(let j = i + 1; j < GM.objects.length; j++){
                            if(!GM.objects[j].physics)
                                continue;
        
                            if(GM.objects[j].physics.type == 1){
                                PHYS.SATBBCollision(GM.objects[i].physics, GM.objects[j].physics);
                            }else if(GM.objects[j].physics.type == 0){
                                PHYS.SATBCCollision(GM.objects[i].physics, GM.objects[j].physics);
                            }
                        }
                    }else if(GM.objects[i].physics.type == 0){
                        for(let j = i + 1; j < GM.objects.length; j++){
                            if(!GM.objects[j].physics)
                                continue;
        
                            if(GM.objects[j].physics.type == 1){
                                PHYS.SATBCCollision(GM.objects[j].physics, GM.objects[i].physics);
                            }else if(GM.objects[j].physics.type == 0){
                                PHYS.SATCCCollision(GM.objects[i].physics, GM.objects[j].physics)
                            }
                        }
                    }
                }
            }
        }
    }   

    static update(){
        if(GM.#paused)
            return;

        GM.performCreate();

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update();
        }

        GM.updatePhysics();

        for (let i = 0; i < this.objects.length; i++) {
            if(this.objects[i].graphics){
                this.objects[i].graphics.update();
            }
        }

        if(GM.needSort){
            GM.sortByZ();
            GM.needSort = false;
        }
    }

    static render(renderer){
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].render(renderer);
        }
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
                    renderer.drawRotatedCroppedImage(g.image, g.x, g.y, g.w, g.h, Math.floor(VP.screenX(newEntity.pos.x - newEntity.size.x / 2)), Math.floor(VP.screenY(newEntity.pos.y - newEntity.size.y / 2)), newEntity.size.x, newEntity.size.y, newEntity.angle);
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
            if(name == GM.objects[i].name){
                return GM.objects[i];
            }
            
        }
        for (let i = 0; i < GM.justCreatedEntities.length; i++) {
            if(name == GM.justCreatedEntities[i].ref.name){
                return GM.justCreatedEntities[i].ref;
            }
        }
    }

    static size(){
        return this.objects.length;
    }

    static requestSort(){
        GM.needSort = true;
    }
    static requestPHYS(obj){
        if(obj.physics != undefined)
            GM.bodiesToTest.push(obj.physics);
    }
    static requestCreate(entity, args){
        GM.needCreate = true;
        GM.justCreatedEntities.push({
            ref: entity,
            args: args
        });
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