let SceneEditor =
    {
        name: "scene editor",
        create: function(){                
            this.editing = true;
            this.typing = false;

            this.entities = [];
            this.invWalls = [];
            this.dummies = {};
            this.pickedEntity = undefined;
            this.entityID = 0;
            this.grabber = new SceneObjectsGrabber(this);

            this.currentScene = "";

            this.textInput = SceneEditorUI.createTextInput(this);
            this.controlPanel = SceneEditorUI.createControlPanel(this);
            this.entitiesPanel = SceneEditorUI.createEntitiesPanel(this);
            this.entityPropsPanel = SceneEditorUI.createEntityPropsPanel(this);
            this.sceneEntitiesPanel = SceneEditorUI.createSceneEntitiesPanel(this);
            
            this.loadObjects();
            if(SCENES.length == 0){
                this.newScene("Main");
            }else{
                this.loadScene("Main");
            }

            this.camTarget = {pos: Vec.zero()};
            this.camSpeed = 500;
            VP.getCamera().setTarget(this.camTarget);
        },

        update: function(){
            if(!this.editing)
                return;

            if(this.typing)
                return;

            this.controll();

            if(this.pickedEntity != undefined)
                this.pickedEntity.update(this.controlPanel.snap);

            this.grabber.update();
        },

        render: function(renderer){
            if(!this.editing)
                return;

            this.renderGrid(renderer);
            
            
            this.entities.forEach(e => {
                e.render(renderer);
            });

            if(this.controlPanel.wallEdit.active || this.controlPanel.wallEdit.shown){
                this.invWalls.forEach(e => {
                    e.render(renderer);
                });
            }

            this.drawWorldOrigin(renderer);

            if(this.pickedEntity != undefined){
                this.pickedEntity.render(renderer);
                renderer.setFontSize(16);
                renderer.setColor("#ffffff");
                renderer.setTextAlign("center");
                renderer.setTextBaseline("middle");
                renderer.fillText(
                    "x:" + Math.floor(this.pickedEntity.pos.x) + 
                    " y:" + Math.floor(this.pickedEntity.pos.y), 
                    VP.screenX(this.pickedEntity.pos.x), 
                    VP.screenY(this.pickedEntity.pos.y - this.pickedEntity.size.y / 2 - 10));
            }

            this.grabber.render(renderer);
        },

        renderGrid(r){
            if(!this.controlPanel.snap.active)
                return;

            let xOff = Math.floor(VP.getCamera().pos.x % this.controlPanel.snap.width);
            let yOff = Math.floor(VP.getCamera().pos.y % this.controlPanel.snap.height);

            r.setColor("green");
            r.setLineWidth(1);
            let colls = Math.floor(VP.getWidth() / this.controlPanel.snap.width);
            let rows = Math.floor(VP.getHeight() / this.controlPanel.snap.height);

            for (let y = 0; y <= rows + 1; y++) {
                for (let x = 0; x <= colls + 1; x++) {
                    r.fillRect(x * this.controlPanel.snap.width - xOff - 1, y * this.controlPanel.snap.height -  yOff - 1, 2, 2);
                    r.drawLine(0, y * this.controlPanel.snap.height -  yOff - this.controlPanel.snap.height / 2, VP.getWidth(), y * this.controlPanel.snap.height -  yOff - this.controlPanel.snap.height / 2);
                    r.drawLine(x * this.controlPanel.snap.width - xOff - this.controlPanel.snap.width / 2, 0, x * this.controlPanel.snap.width - xOff - this.controlPanel.snap.width / 2, VP.getHeight());
                } 
            }
        },

        drawWorldOrigin: function(renderer){
            renderer.setColor("white");
            renderer.setLineWidth(1);
            renderer.drawLine(VP.screenX(-100), VP.screenY(0), VP.screenX(100), VP.screenY(0));
            renderer.drawLine(VP.screenX(0), VP.screenY(-100), VP.screenX(0), VP.screenY(100));
            renderer.setFontSize(10);
            renderer.fillText("0,0", VP.screenX(-20), VP.screenY(-10));
        },

        controll: function(){
            if(Input.mousePressed(0))
                this.placeEntity();

            if(Input.mousePressed(2))
                this.releaseEntities();

            if(Input.keyDown(65)) // a
                Vec.add(this.camTarget.pos, Vec.v2(-this.camSpeed * Time.deltaSeconds(), 0));
            if(Input.keyDown(68)) // d
                Vec.add(this.camTarget.pos, Vec.v2(this.camSpeed * Time.deltaSeconds(), 0));
            if(Input.keyDown(87)) // w
                Vec.add(this.camTarget.pos, Vec.v2(0, -this.camSpeed * Time.deltaSeconds()));
            if(Input.keyDown(83)) // s
                Vec.add(this.camTarget.pos, Vec.v2(0, this.camSpeed * Time.deltaSeconds()));

            if(Input.keyPressed(88))  /// x
                this.deleteEntities();

            if(Input.keyPressed(32))   //// space
                this.cameraToGrabbed();

            if(Input.keyPressed(71)) //// g
                this.grabber.run();

            if(Input.keyPressed(69) && this.controlPanel.wallEdit.active) //// e
                this.grabber.switchEditingWalls();
            
            
            if(Input.keyPressed(9)){ //// Tab
                this.controlPanel.grid.click();
            }

            if(Input.keyPressed(90)){ //// TEST Z!
                
                console.log(this.grabber);
            }

        },

        loadObjects: function(){
            this.dummies = {};
            for (let key in Entities) {
                for (entityName in Entities[key]) {
                    this.dummies[entityName] = Entities[key][entityName];
                }
            }
            for (let key in Entities) {
                this.entitiesPanel.add(key);
            }
        },

        loadScene: function(name){
            this.recreateScene();
            this.entityID = 0;
            this.entities = [];
            this.invWalls = [];
            this.currentScene = name;
            for (let i = 0; i < SCENES.length; i++) {
                const scene = SCENES[i];
                if(scene.name == name){
                    for (let j = 0; j < scene.go.length; j++) {
                        const e = scene.go[j];
                        if(this.dummies[e.name] == undefined)
                            continue;
                        let newEnt = this.cloneEntity(e.name, this.dummies[e.name], e.pos.x, e.pos.y);
                        newEnt.size.x = e.size.x;
                        newEnt.size.y = e.size.y;
                        newEnt.angle = e.angle;
                        if(newEnt.name == "std_inv_wall"){
                            this.invWalls.push(newEnt);
                        }
                        else{
                            this.entities.push(newEnt);
                        }
                    }
                }
            }
            GM.clear();
            UI.clear();
            this.releaseEntities();
            VP.getCamera().setTarget(this.camTarget);

            this.sceneEntitiesPanel.clear();
            for (let i = 0; i < this.entities.length; i++) {
                this.sceneEntitiesPanel.add(this.entities[i]);
            }
            for (let i = 0; i < this.invWalls.length; i++) {
                this.sceneEntitiesPanel.add(this.invWalls[i]);
            }
        },

        newScene: function(name){
            this.recreateScene();
            name = name.trim();
            if(name == "")
                return;
            for (let i = 0; i < SCENES.length; i++) {
                const e = SCENES[i];
                if(e.name == name){
                    console.log("SCENE EDITOR: scene " + name + " already exists!");
                    return;
                }
            }
            SCENES.push(
                {
                    name: name,
                    ui: [],
                    go: []
                }
            );
            this.currentScene = name;
            this.controlPanel.addScene(this, name);
            this.entities = [];
            this.resetCamera();
            this.loadScene(name);
        },

        deleteScene: function(){
            if(SCENES.length == 1){
                console.log("Can't delete the last one!!!");
                return;
            }


            for (let i = 0; i < SCENES.length; i++) {
                const scene = SCENES[i];
                if(scene.name == this.currentScene)
                    SCENES.splice(i, 1);
            }

            let opts = this.controlPanel.loadSceneOption.querySelectorAll("option");
            for (let i = 0; i < opts.length; i++) {
                const e = opts[i];
                if(e.innerText == this.currentScene)
                    e.remove();
            }

            this.loadScene("Main");
            this.resetCamera();
            this.controlPanel.loadSceneOption.value = this.currentScene;
        },

        play: function(){
            this.recreateScene();
            this.editing = false;
            SceneEditorUI.hideElement(this.textInput.container);
            SceneEditorUI.hideElement(this.controlPanel.loadSceneOption);
            SceneEditorUI.hideElement(this.controlPanel.playBtn);
            SceneEditorUI.hideElement(this.controlPanel.newSceneBtn);
            SceneEditorUI.hideElement(this.controlPanel.saveBtn);
            SceneEditorUI.hideElement(this.controlPanel.delSceneBtn);
            SceneEditorUI.hideElement(this.entityPropsPanel.container);
            SceneEditorUI.hideElement(this.entitiesPanel.container);
            SceneEditorUI.hideElement(this.sceneEntitiesPanel.container);
            SceneEditorUI.showElement(this.controlPanel.editBtn);

            SceneEditorUI.hideElement(this.controlPanel.chkbxContainer);
            SceneEditorUI.hideElement(this.controlPanel.gridWidthInputContainer);
            SceneEditorUI.hideElement(this.controlPanel.gridHeightInputContainer);

            SceneEditorUI.hideElement(this.controlPanel.wallEditingContainer);

            this.controlPanel.container.style.height = "40px";
            SCM.loadScene(this.currentScene);
        },

        edit: function(){
            this.editing = true;
            SceneEditorUI.showElement(this.controlPanel.loadSceneOption);
            SceneEditorUI.showElement(this.controlPanel.newSceneBtn);
            SceneEditorUI.showElement(this.controlPanel.playBtn);
            SceneEditorUI.showElement(this.controlPanel.saveBtn);
            SceneEditorUI.showElement(this.controlPanel.delSceneBtn);
            SceneEditorUI.showElement(this.entityPropsPanel.container);
            SceneEditorUI.showElement(this.entitiesPanel.container);
            SceneEditorUI.showElement(this.sceneEntitiesPanel.container);
            SceneEditorUI.hideElement(this.controlPanel.editBtn);

            SceneEditorUI.showElement(this.controlPanel.chkbxContainer);
            SceneEditorUI.showElement(this.controlPanel.gridWidthInputContainer);
            SceneEditorUI.showElement(this.controlPanel.gridHeightInputContainer);

            SceneEditorUI.showElement(this.controlPanel.wallEditingContainer);

            this.controlPanel.container.style.height = "120px";
            this.loadScene(this.currentScene);
        },

        save: function(){
            this.recreateScene();
            let stringified = JSON.stringify(SCENES);
            let result = "let SCENES = \'";
            result += stringified;
            result += "\';\n";
            result += "SCENES = JSON.parse(SCENES);\n";
            let a = document.createElement('a');
            let file = new Blob([result], {type: "text/javascript"});
            a.href = URL.createObjectURL(file);
            a.download = "scenes.js";
            a.click();
            URL.revokeObjectURL(a.href);
        },
        
        recreateScene: function(){
            for (let i = 0; i < SCENES.length; i++) {
                const scene = SCENES[i];
                if(this.currentScene == scene.name){
                    scene.go = [];
                    for (let j = 0; j < this.entities.length; j++) {
                        const en = this.entities[j];
                        scene.go.push(
                            {
                                name: en.name,
                                pos: {
                                    x: en.pos.x,
                                    y: en.pos.y
                                }, 
                                size: {
                                    x: en.size.x,
                                    y: en.size.y
                                },
                                angle: en.angle
                            }
                        );
                    }
                    for (let j = 0; j < this.invWalls.length; j++) {
                        const en = this.invWalls[j];
                        scene.go.push(
                            {
                                name: en.name,
                                pos: {
                                    x: en.pos.x,
                                    y: en.pos.y
                                }, 
                                size: {
                                    x: en.size.x,
                                    y: en.size.y
                                },
                                angle: en.angle
                            }
                        );
                    }
                }
            }
        },

        pickEntity: function(name){
            if(this.dummies[name]  != undefined){
                this.releaseEntities();
                let newEntity = this.cloneEntity(name, this.dummies[name], 0, 0);
                newEntity.update = function(grid){
                    if(!grid.active){
                        this.pos.x = VP.worldX(Input.mouseX());
                        this.pos.y = VP.worldY(Input.mouseY());
                    }else{
                        this.pos.x = Math.floor(VP.worldX(Input.mouseX() + grid.width / 2) / grid.width) * grid.width;
                        this.pos.y = Math.floor(VP.worldY(Input.mouseY() + grid.height / 2) / grid.height) * grid.height;
                    }
                    
                    if(this.physics != undefined){
                        if(this.physics.type == 1){
                            this.physics.updateVertices();
                        }
                    }
                };
                if(name  == "std_inv_wall"){
                    if(!this.controlPanel.wallEdit.active)
                        this.controlPanel.wallEditChkbx.click();
                        newEntity.update = function(grid){
                            if(!grid.active){
                                this.pos.x = VP.worldX(Input.mouseX());
                                this.pos.y = VP.worldY(Input.mouseY());
                            }else{
                                this.pos.x = Math.floor(VP.worldX(Input.mouseX() + grid.width / 2) / grid.width) * grid.width - grid.width / 2;
                                this.pos.y = Math.floor(VP.worldY(Input.mouseY() + grid.height / 2) / grid.height) * grid.height - grid.height / 2;
                            }
                            this.physics.updateVertices();
                        }
                }else{
                    if(this.controlPanel.wallEdit.active)
                        this.controlPanel.wallEditChkbx.click();
                }
                this.pickedEntity = newEntity;
            }else{
                this.pickedEntity = undefined;  
            }
        },

        placeEntity: function(){
            if(this.pickedEntity == undefined)
                return;
            let newEntity = this.cloneEntity(this.pickedEntity.name, this.pickedEntity, Math.floor(this.pickedEntity.pos.x), Math.floor(this.pickedEntity.pos.y));
            if(newEntity.name == "std_inv_wall"){
                this.invWalls.push(newEntity);
            }else{
                this.entities.push(newEntity);
            }
            this.sortByZ();
            this.sceneEntitiesPanel.add(newEntity);
        },

        cloneEntity: function(name, entity, posX, posY) {
            let newEntity = Object.create(entity);
            newEntity.init(posX, posY);
            newEntity.name = name;
            if(name == "std_inv_wall"){
                newEntity.render = function(r){
                    r.setColor("rgba(255,255,255,0.3");
                    r.fillRect(VP.screenX(this.pos.x), VP.screenY(this.pos.y), this.size.x, this.size.y);
                    r.setColor("#ffffff");
                    r.setLineWidth(1);
                    r.drawRect(VP.screenX(this.pos.x), VP.screenY(this.pos.y), this.size.x, this.size.y);
                }
            }else{
                newEntity.render = function(renderer){
                    if(newEntity.graphics != undefined){
                        let g = newEntity.graphics.getSprite();
                        renderer.drawRotatedCroppedImage(g.image, g.x, g.y, g.w, g.h, VP.screenX(newEntity.pos.x - newEntity.size.x / 2), VP.screenY(newEntity.pos.y - newEntity.size.y / 2), newEntity.size.x, newEntity.size.y, newEntity.angle);
                    }else{
                        renderer.setColor("green");
                        renderer.drawCircle(VP.screenX(newEntity.pos.x), VP.screenY(newEntity.pos.y), 20);
                        renderer.setColor("blue");
                        renderer.setFontSize(16);
                        renderer.setTextAlign("center");
                        renderer.setTextBaseline("middle");
                        renderer.fillText(newEntity.name, VP.screenX(newEntity.pos.x), VP.screenY(newEntity.pos.y));
                    }
    
                    
                    if(newEntity.physics != undefined){
                        renderer.setColor("red");
                        renderer.setLineWidth(1);
                        if(newEntity.physics.type == 0){
                            renderer.drawCircle(VP.screenX(newEntity.physics.pos.x), VP.screenY(newEntity.physics.pos.y), newEntity.physics.radius);
                        }else{
                            let verts = newEntity.physics.getVertices();
                            for (let y = 0; y < verts.length; y++) {
                                const p1 = UMath.arrayLoop(verts, y);
                                const p2 = UMath.arrayLoop(verts, y+1);
                                renderer.drawLine(VP.screenX(p1.x), VP.screenY(p1.y), VP.screenX(p2.x), VP.screenY(p2.y));
                                
                            }
                        }
                    }
                    
                }
            }
            
            if(newEntity.physics){
                if(newEntity.physics.type == 1){
                    newEntity.physics.updateVertices();
                }
            }

            newEntity.id = this.entityID;
            this.entityID++;

            return newEntity;
        },

        cameraToGrabbed: function(){
            if(this.grabber.pickedList.length > 0){
                let x = 0;
                let y = 0;
                for (let i = 0; i < this.grabber.pickedList.length; i++) {
                    const e = this.grabber.pickedList[i];
                    x += e.pos.x;
                    y += e.pos.y;
                }
                this.camTarget.pos = Vec.v2(x / this.grabber.pickedList.length, y / this.grabber.pickedList.length);
            }else{
                this.resetCamera();
            }
        },

        sortByZ: function(){
            this.entities.sort(function(a, b){
                return a.z - b.z;
            });
        },

        releaseEntities: function(){
            this.pickedEntity = undefined;
            this.grabber.reset();
            this.disableEntityFields();
        },

        deleteEntities: function(){
            if(this.grabber.active)
                return;
            for (let i = 0; i < this.grabber.pickedList.length; i++) {
                const grabbedEn = this.grabber.pickedList[i];
                if(grabbedEn.name == "std_inv_wall"){
                    for (let j = 0; j < this.invWalls.length; j++) {
                        const sceneEn = this.invWalls[j];
                        if(sceneEn == grabbedEn){
                            this.sceneEntitiesPanel.remove(sceneEn.id);
                            this.invWalls.splice(j, 1);
                        }
                    }
                }else{
                    for (let j = 0; j < this.entities.length; j++) {
                        const sceneEn = this.entities[j];
                        if(sceneEn == grabbedEn){
                            this.sceneEntitiesPanel.remove(sceneEn.id);
                            this.entities.splice(j, 1);
                        }
                    }
                } 
            }
            this.releaseEntities();
        },

        resetCamera: function(){
            this.camTarget = {pos: Vec.zero()};
            VP.getCamera().setTarget(this.camTarget);
        },

        enanbleEntityFields: function(){
            this.entityPropsPanel.enable();
        },

        disableEntityFields: function(){
            this.entityPropsPanel.disable();
        },

        setEntityPanelFields: function(x, y, w, h, angle){
            this.entityPropsPanel.setFields(x, y, w, h, angle);
        },

        setEntity: function(){
            this.entityPropsPanel.setEntity();
        },

        updatePlacedEntityButton(en){
            this.sceneEntitiesPanel.update(en);
        }
    };
