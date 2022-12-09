class GM{
    static entityPool = {};
    static objects = [];
    static justCreatedEntities = [];
    static needCreate = false;
    static needSort = true;
    static #paused = false;
    static updatePhysics = function(){};
    static addPhysics = function(){};
    static removePhysics = function(){};
    static bodiesToTest = [];
    static newEntityID = 0;


    static init(){
        if(SETTINGS.physicsOnRequest){
            GM.updatePhysics = function(){
                for (let i = 0; i < GM.bodiesToTest.length; i++) {
                    GM.bodiesToTest[i].update();
                    GM.bodiesToTest[i].collisionObjects = [];
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

            GM.addPhysics = function(phys){};

            GM.removePhysics = function(id){
                for(let j = GM.bodiesToTest.length-1; j >= 0; j--){
                    if(id == GM.bodiesToTest[j].owner.id)
                        GM.bodiesToTest.splice(j, 1);
                }
            }
        }else{
            GM.updatePhysics = function(){
                for (let i = 0; i < GM.bodiesToTest.length; i++) {
                    GM.bodiesToTest[i].update();
                    GM.bodiesToTest[i].collisionObjects = [];
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
            }

            GM.addPhysics = function(phys){
                GM.bodiesToTest.push(phys);
            }

            GM.removePhysics = function(id){
                for(let j = GM.bodiesToTest.length-1; j >= 0; j--){
                    if(id == GM.bodiesToTest[j].owner.id)
                        GM.bodiesToTest.splice(j, 1);
                }
            }
        }
    }   

    static update(){
        if(GM.#paused)
            return;

        GM.performCreate();
        //////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let start = new Date().getTime();
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update();
        }
        GM.t1 = new Date().getTime() - start;
        //////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        start = new Date().getTime();
        GM.updatePhysics();
        GM.t3 = new Date().getTime() - start;
        //////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
        //////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let start = new Date().getTime();
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].render(renderer);
        }
        GM.t2 = new Date().getTime() - start;
        //////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

    static add(name, x, y, args){
        let newEntity = undefined;
        if(GM.entityPool[name] == undefined)
            return undefined;
        newEntity = Object.create(GM.entityPool[name]);
        newEntity.name = name;
        newEntity.id = GM.newEntityID;
        GM.newEntityID++;
        newEntity.init(x, y);
        GM.requestCreate(newEntity, args);
        if(newEntity.render == undefined){
            if(newEntity.graphics){
                newEntity.render = function(renderer){
                    renderer.drawEntity(newEntity);
                }
            }else{
                newEntity.render = function(renderer){
                }
            }
        }

        if(newEntity.update == undefined)
            newEntity.update = function(){};
        return newEntity;
    }

    static remove(object){
        for (let i = GM.objects.length-1; i >= 0; i--) {
            if(object == GM.objects[i]){
                if(object.physics != undefined)
                    GM.removePhysics(object.id);
                GM.objects.splice(i, 1);
            }
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
                if(GM.justCreatedEntities[i].ref.physics != undefined)
                    GM.addPhysics(GM.justCreatedEntities[i].ref.physics)
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
        GM.bodiesToTest = [];
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