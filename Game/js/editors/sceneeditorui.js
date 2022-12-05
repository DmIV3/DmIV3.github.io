SceneEditorUI = {
    styleContainer: function(cont){
        cont.style.position = "fixed";
        cont.style.background = "rgba(220, 220, 220, 0.5)";
        cont.style.border = "2px solid white";
        cont.style.transition = "top 300ms";
    },

    hideElement: function(el){
        el.style.display = "none";
    },
    showElement: function(el){
        el.style.display = "inline-block";
    },
    focusElement: function(el){
        el.focus();
        el.select();
    },
    blurElement: function(el){
        el.blur();
    },

    createTextInput: function(that){
        let result = {};
        result.container = document.createElement("div");
        this.styleContainer(result.container);
        result.container.style.width = "400px";
        result.container.style.height = "50px";
        result.container.style.padding = "5px";
        result.container.style.top = "50vh";
        result.container.style.left = "50vw";
        result.container.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(result.container);
        /////////////////////////////////////////////////////////////////////
        result.field = document.createElement("input");
        result.field.style.fontSize = "26px";
        result.field.style.width = "350px";
        result.container.appendChild(result.field);
        /////////////////////////////////////////////////////////////////////
        result.closeBtn = document.createElement("button");
        result.closeBtn.innerText = "❌";
        result.closeBtn.style.position = "absolute";
        result.closeBtn.style.width = "25px";
        result.closeBtn.style.height = "25px";
        result.closeBtn.style.top = "-20px";
        result.closeBtn.style.right = "-20px";
        result.closeBtn.addEventListener("click", (e) => {
            that.typing = false;
            this.hideElement(result.container);
        }, false);
        result.container.appendChild(result.closeBtn);
        ////////////////////////////////////////////////////////////////////
        result.acceptBtn = document.createElement("button");
        result.acceptBtn.innerText = "✓";
        result.acceptBtn.style.position = "absolute";
        result.acceptBtn.style.width = "35px";
        result.acceptBtn.style.height = "35px";
        result.acceptBtn.style.top = "4px";
        result.acceptBtn.style.right = "5px";
        result.acceptBtn.addEventListener("click", (e) => {
            that.typing = false;
            this.hideElement(result.container);
            that.newScene(result.field.value);
        }, false);
        result.container.appendChild(result.acceptBtn);
        this.hideElement(result.container);
        return result;
    },

    createControlPanel: function(that){
        let result = {};
        result.hidden = false;
        result.container = document.createElement("div");
        this.styleContainer(result.container);
        result.container.style.top = "5px";
        result.container.style.left = "5px";
        result.container.style.height = "80px";
        document.body.appendChild(result.container);
        ///////////// HIDE/SHOW BUTTON ///////////////////////////////////////////
        result.hideShowBtn = document.createElement("button");
        result.hideShowBtn.innerText = "▲";
        result.hideShowBtn.style.position = "absolute";
        result.hideShowBtn.style.width = "30px";
        result.hideShowBtn.style.height = "30px";
        result.hideShowBtn.style.bottom = "-35px";
        result.hideShowBtn.style.left = "-3px";
        result.hideShowBtn.addEventListener("click", () => {
            this.blurElement(result.hideShowBtn);
            if(result.hidden){
                result.hidden = false;
                result.hideShowBtn.innerText = "▲";
                result.container.style.top = "5px";
            }else{
                result.hidden = true;
                result.hideShowBtn.innerText = "▼";
                if(that.editing)
                    result.container.style.top = "-80px";
                else
                    result.container.style.top = "-40px";
            }
        }, false);
        result.container.appendChild(result.hideShowBtn);
        ///////////// ADD NEW SCENE OPTION FUNC ////////////////////////////////////
        result.addScene = function(that, name){
            let option = document.createElement("option");
            option.value = name;
            option.innerText = name;
            this.loadSceneOption.querySelectorAll("option").forEach(e => {e.removeAttribute("selected");});
            if(that.currentScene == name)
                option.setAttribute("selected", "");
            this.loadSceneOption.appendChild(option);
        }
        //////////////////// SELECT OPTION LIST /////////////////////////////////////////////
        result.loadSceneOption = document.createElement("select");
        result.loadSceneOption.style.width = "100px";
        result.loadSceneOption.style.height = "35px";
        for (let i = 0; i < SCENES.length; i++) {
            result.addScene(that, SCENES[i].name);
        }
        result.loadSceneOption.addEventListener("input", (e) => {
            this.blurElement(result.loadSceneOption);
            that.loadScene(e.target.value);
            that.resetCamera();
        }, false);
        result.container.appendChild(result.loadSceneOption);
        ////////////////// NEW SCENE BUTTON /////////////////////////////////////////////
        result.newSceneBtn = document.createElement("button");
        result.newSceneBtn.innerText = "New Scene";
        result.newSceneBtn.style.height = "35px";
        result.newSceneBtn.style.padding = "0 5px";
        result.newSceneBtn.addEventListener("click", () => {
            that.typing = true;
            this.showElement(that.textInput.container);
            this.focusElement(that.textInput.field);
        }, false);
        result.container.appendChild(result.newSceneBtn);
        /////////////// DELETE BUTTON ///////////////////////////////////////////////
        result.delSceneBtn = document.createElement("button");
        result.delSceneBtn.innerText = "Delete";
        result.delSceneBtn.style.height = "35px";
        result.delSceneBtn.style.padding = "0 5px";
        result.delSceneBtn.addEventListener("click", () => {
            this.blurElement(result.delSceneBtn);
            if(confirm("Do you really want to remove \"" + that.currentScene + "\" scene?")){
                if(that.currentScene == "Main"){
                    alert("You can not delete the \"Main\" scene");
                }else{
                    that.deleteScene();
                }
            }
        }, false);
        result.container.appendChild(result.delSceneBtn);
        ///////////////// PLAY BUTTON ////////////////////////////////////////////
        result.playBtn = document.createElement("button");
        result.playBtn.innerText = "Play";
        result.playBtn.style.height = "35px";
        result.playBtn.style.padding = "0 5px";
        result.playBtn.addEventListener("click", () => {
            this.blurElement(result.playBtn);
            that.play();
        }, false);
        result.container.appendChild(result.playBtn);
        ///////////////// EDIT BUTTON //////////////////////////////////////////
        result.editBtn = document.createElement("button");
        result.editBtn.innerText = "Edit";
        result.editBtn.style.height = "35px";
        result.editBtn.style.display = "none";
        result.editBtn.style.padding = "0 5px";
        result.editBtn.addEventListener("click", () => {
            this.blurElement(result.editBtn);
            that.edit();
        }, false);
        result.container.appendChild(result.editBtn);
        //////////////// SAVE BUTTON ////////////////////////////////////////////
        result.saveBtn = document.createElement("button");
        result.saveBtn.innerText = "Save";
        result.saveBtn.style.height = "35px";
        result.saveBtn.style.padding = "0 5px";
        result.saveBtn.addEventListener("click", () => {
            this.blurElement(result.saveBtn);
            that.save();
        }, false);
        result.container.appendChild(result.saveBtn);
        //////////// GRID ALIGN PANEL CHECKBOX ///////////////////////////////
        result.container.appendChild(document.createElement("br"));
        result.chkbxContainer = document.createElement("div");
        result.snap = {
            active: false,
            width: SETTINGS.editorGridWidth,
            height: SETTINGS.editorGridHeight
        }
        result.container.appendChild(result.chkbxContainer);
        result.chkbxContainer.style.display = "inline-block";
        result.chkbxContainer.style.height = "40px";
        result.chkbxContainer.style.marginRight = "10px";

        result.grid = document.createElement("input");
        result.grid.setAttribute("id", "grid");
        result.grid.setAttribute("type", "checkbox");
        result.grid.style.display = "inline-block";
        result.grid.style.height = "40px";
        result.grid.style.width = "20px";
        result.grid.oninput = ()=>{
            this.blurElement(result.grid)
            result.snap.active = result.grid.checked;
            if(result.gridWidth.value != "" && result.gridWidth.value != "0"){
                result.snap.width = parseInt(result.gridWidth.value);
            }else{
                result.snap.width = 50;
                result.gridWidth.value = 50;
            }
            if(result.gridHeight.value != "" && result.gridHeight.value != "0"){
                result.snap.height = parseInt(result.gridHeight.value);
            }else{
                result.snap.height = 50;
                result.gridHeight.value = 50;
            }
        }
        let gridLabel = document.createElement("label");
        gridLabel.setAttribute("for", "grid");
        gridLabel.innerText = "Snap to grid";
        gridLabel.style.display = "inline-block";
        gridLabel.style.verticalAlign = "top";
        gridLabel.style.height = "40px";
        gridLabel.style.lineHeight = "40px";
        gridLabel.style.color = "#ffffff";
        result.chkbxContainer.appendChild(result.grid);
        result.chkbxContainer.appendChild(gridLabel);
        
        //////////// GRID ALIGN PANEL WIDTH INPUT ///////////////////////////////
        result.gridWidthInputContainer = document.createElement("div");
        result.container.appendChild(result.gridWidthInputContainer);
        result.gridWidthInputContainer.style.display = "inline";
        result.gridWidthInputContainer.style.height = "40px";
        result.gridWidthInputContainer.style.lineHeight = "40px";
        result.gridWidthInputContainer.style.marginRight = "15px";
        result.gridWidthInputContainer.style.verticalAlign = "top";

        result.gridWidth = document.createElement("input");
        result.gridWidth.setAttribute("id", "gridWidth");
        result.gridWidth.setAttribute("type", "number");
        result.gridWidth.value = result.snap.width;
        result.gridWidth.style.display = "inline-block";
        result.gridWidth.style.width = "50px";

        let gridWidthLabel = document.createElement("label");
        gridWidthLabel.setAttribute("for", "gridWidth");
        gridWidthLabel.innerText = "width";
        gridWidthLabel.style.display = "inline-block";
        gridWidthLabel.style.verticalAlign = "top";
        gridWidthLabel.style.height = "40px";
        gridWidthLabel.style.lineHeight = "40px";
        gridWidthLabel.style.color = "#ffffff";
        result.gridWidth.oninput = ()=>{
            if(result.gridWidth.value != "0")
                result.snap.width = parseInt(result.gridWidth.value);
        }
        result.gridWidthInputContainer.appendChild(result.gridWidth);
        result.gridWidthInputContainer.appendChild(gridWidthLabel);

        //////////// GRID ALIGN PANEL HEIGHT INPUT ///////////////////////////////
        result.gridHeightInputContainer = document.createElement("div");
        result.container.appendChild(result.gridHeightInputContainer);
        result.gridHeightInputContainer.style.display = "inline";
        result.gridHeightInputContainer.style.height = "40px";
        result.gridHeightInputContainer.style.lineHeight = "40px";
        result.gridHeightInputContainer.style.marginRight = "5px";
        result.gridHeightInputContainer.style.verticalAlign = "top";

        result.gridHeight = document.createElement("input");
        result.gridHeight.setAttribute("id", "gridHeight");
        result.gridHeight.setAttribute("type", "number");
        result.gridHeight.value = result.snap.height;
        result.gridHeight.style.display = "inline-block";
        result.gridHeight.style.width = "50px";

        let gridHeightLabel = document.createElement("label");
        gridHeightLabel.setAttribute("for", "gridHeight");
        gridHeightLabel.innerText = "height";
        gridHeightLabel.style.display = "inline-block";
        gridHeightLabel.style.verticalAlign = "top";
        gridHeightLabel.style.height = "40px";
        gridHeightLabel.style.lineHeight = "40px";
        gridHeightLabel.style.color = "#ffffff";
        result.gridHeight.oninput = ()=>{
            if(result.gridHeight.value != "0")
                result.snap.height = parseInt(result.gridHeight.value);
        }
        result.gridHeightInputContainer.appendChild(result.gridHeight);
        result.gridHeightInputContainer.appendChild(gridHeightLabel);
        
        return result;
    },

    createEntitiesPanel: function(that){
        let result = {};
        result.entitiesLists = [];
        result.hidden = true;
        result.container = document.createElement("div");
        this.styleContainer(result.container);
        result.container.style.top = -window.innerHeight + 100 + "px";
        result.container.style.right = "5px";
        result.container.style.width = "200px";
        result.container.style.height = window.innerHeight - 100 + "px";
        document.body.appendChild(result.container);
        ////////////////////////////////////////////////////////////
        result.list = document.createElement("div");
        result.list.style.width = "100%";
        result.list.style.height = "100%";
        result.list.style.overflowY = "scroll";
        result.container.appendChild(result.list);
        /////////////////////////////////////////////////////////////
        result.hideShowBtn = document.createElement("button");
        result.hideShowBtn.innerText = "▼ Entities";
        result.hideShowBtn.style.position = "absolute";
        result.hideShowBtn.style.width = "100px";
        result.hideShowBtn.style.height = "30px";
        result.hideShowBtn.style.bottom = "-35px";
        result.hideShowBtn.style.left = "-3px";
        result.hideShowBtn.addEventListener("click", () => {
            this.blurElement(result.hideShowBtn);
            if(result.hidden){
                result.hidden = false;
                result.hideShowBtn.innerText = "▲ Entities";
                result.container.style.top = "35px";
                if(!that.sceneEntitiesPanel.hidden)
                    that.sceneEntitiesPanel.hideShowBtn.click();
            }else{
                result.hidden = true;
                result.hideShowBtn.innerText = "▼ Entities";
                result.container.style.top = -window.innerHeight + 100 + "px";
            }
        }, false);
        result.container.appendChild(result.hideShowBtn);

        result.add = function(name){
            if(Entities[name] == undefined)
                return;

            for (let i = 0; i < result.entitiesLists.length; i++) {
                if(name == result.entitiesLists[i])
                    return;    
            }
            result.entitiesLists.push(name);
            
            let cont = document.createElement("div");
            cont.style.overflow = "hidden";
            cont.style.width = "100%";
            cont.style.height = "20px";
            cont.style.background = "white";
            let label = document.createElement("div");
            label.style.width = "100%";
            label.style.overflow = "hidden";
            label.style.wordBreak = "break-all";
            label.style.height = "20px";
            label.style.innerHeight = "20px";
            label.style.cursor = "pointer";
            label.innerText = "▼ " + name;
            label.setAttribute("data", 0);
            cont.appendChild(label);
            result.list.appendChild(cont);
            label.onclick = ()=>{
                if(label.getAttribute("data") == "1"){
                    label.setAttribute("data", 0);
                    cont.style.height = "20px";
                    label.innerText = "▼ " + name;
                }else{
                    label.setAttribute("data", 1);
                    cont.style.height = "auto";
                    label.innerText = "▲ " + name;
                }
            }
            
            for (let key in Entities[name]) {
                const e = Entities[name][key];
                let b = document.createElement("button");
                b.innerText = key;
                b.style.display = "block";
                b.style.width = "100%";
                b.style.minHeight = "20px";

                b.addEventListener("click", (e) => {
                    if(that.typing)
                        return;
                    SceneEditorUI.blurElement(b);
                    that.pickEntity(e.target.innerText);
                }, false);
                cont.appendChild(b);
            }
        }
        return result;
    },

    createSceneEntitiesPanel: function(that){
        let result = {};
        result.hidden = true;
        result.container = document.createElement("div");
        this.styleContainer(result.container);
        result.container.style.top = -window.innerHeight + 100 + "px";
        result.container.style.right = "5px";
        result.container.style.width = "200px";
        result.container.style.height = window.innerHeight - 100 + "px";
        document.body.appendChild(result.container);
        ////////////////////////////////////////////////////////////
        result.list = document.createElement("div");
        result.list.style.width = "100%";
        result.list.style.height = "100%";
        result.list.style.overflowY = "scroll";
        result.container.appendChild(result.list);
        /////////////////////////////////////////////////////////////
        result.hideShowBtn = document.createElement("button");
        result.hideShowBtn.innerText = "▼ Scene";
        result.hideShowBtn.style.position = "absolute";
        result.hideShowBtn.style.width = "100px";
        result.hideShowBtn.style.height = "30px";
        result.hideShowBtn.style.bottom = "-35px";
        result.hideShowBtn.style.right = "-3px";
        result.hideShowBtn.addEventListener("click", () => {
            this.blurElement(result.hideShowBtn);
            if(result.hidden){
                result.hidden = false;
                result.hideShowBtn.innerText = "▲ Scene";
                result.container.style.top = "35px";
                if(!that.entitiesPanel.hidden)
                    that.entitiesPanel.hideShowBtn.click();
            }else{
                result.hidden = true;
                result.hideShowBtn.innerText = "▼ Scene";
                result.container.style.top = -window.innerHeight + 100 + "px";
            }
        }, false);
        result.container.appendChild(result.hideShowBtn);

        result.add = function(entity){
            let b = document.createElement("button");
            b.style.display = "block";
            b.style.width = "100%";
            b.style.minHeight = "20px";
            b.innerText = entity.name + " x: " + entity.pos.x + " y: " + entity.pos.y;
            b.setAttribute("data", entity.id);
            b.addEventListener("click", (e)=>{
                let id = +e.target.getAttribute("data");
                that.releaseEntities();
                for (let i = 0; i < that.entities.length; i++) {
                    const e = that.entities[i];
                    if(e.id == id){
                        that.grabber.pickedList.push(e);
                        that.camTarget.pos.x = e.pos.x;
                        that.camTarget.pos.y = e.pos.y;
                        that.enanbleEntityFields();
                        that.setEntityPanelFields(e.pos.x, e.pos.y, e.size.x, e.size.y, e.angle);
                    }
                        
                }
            }, false);
            result.list.appendChild(b);
        }

        result.update = function(en){
            let btns = result.list.querySelectorAll("button");
            for (let i = 0; i < btns.length; i++) {
                if(+btns[i].getAttribute("data") == en.id)
                    btns[i].innerText = en.name + " x: " + en.pos.x + " y: " + en.pos.y;
            } 
        }

        result.remove = function(id){
            let btns = result.list.querySelectorAll("button");
            for (let i = 0; i < btns.length; i++) {
                if(+btns[i].getAttribute("data") == id)
                    btns[i].remove();
            }
        }

        result.clear = function(){
            let btns = result.list.querySelectorAll("button");
            for (let i = 0; i < btns.length; i++) {
                btns[i].remove();
            }
        }
        return result;
    },

    createEntityPropsPanel: function(that){
        let result = {};
        result.active = false;
        result.container = document.createElement("div");
        this.styleContainer(result.container);
        result.container.style.top = "5px";
        result.container.style.left = "350px";
        result.container.style.height = "40px";
        document.body.appendChild(result.container);

        ///////////////// X Pos Input ////////////////////////
        let xPosContainer = document.createElement("div");
        result.container.appendChild(xPosContainer);
        xPosContainer.style.width = "60px";
        xPosContainer.style.display = "inline-block";
        xPosContainer.style.marginRight = "5px";
        result.xPos = document.createElement("input");
        result.xPos.setAttribute("id", "x-pos");
        result.xPos.setAttribute("type", "number");
        result.xPos.style.height = "20px";
        result.xPos.style.width = "60px";
        result.xPos.oninput = ()=>{
            result.setEntity({x: result.xPos.value});
        }
        let xPosLabel = document.createElement("label");
        xPosLabel.setAttribute("for", "x-pos");
        xPosLabel.innerText = "pos X";
        xPosLabel.style.display = "block";
        xPosLabel.style.height = "16px";
        xPosLabel.style.lineHeight = "16px";
        xPosLabel.style.color = "#ffffff";
        xPosContainer.appendChild(xPosLabel);
        xPosContainer.appendChild(result.xPos);
        ///////////////// Y Pos Input ////////////////////////
        let yPosContainer = document.createElement("div");
        result.container.appendChild(yPosContainer);
        yPosContainer.style.width = "60px";
        yPosContainer.style.display = "inline-block";
        yPosContainer.style.marginRight = "5px";
        result.yPos = document.createElement("input");
        result.yPos.setAttribute("id", "y-pos");
        result.yPos.setAttribute("type", "number");
        result.yPos.style.height = "20px";
        result.yPos.style.width = "60px";
        result.yPos.oninput = ()=>{
            result.setEntity({y: result.yPos.value});
        }
        let yPosLabel = document.createElement("label");
        yPosLabel.setAttribute("for", "y-pos");
        yPosLabel.innerText = "pos Y";
        yPosLabel.style.display = "block";
        yPosLabel.style.height = "16px";
        yPosLabel.style.lineHeight = "16px";
        yPosLabel.style.color = "#ffffff";
        yPosContainer.appendChild(yPosLabel);
        yPosContainer.appendChild(result.yPos);
        ///////////////// Width Input ////////////////////////
        let widthContainer = document.createElement("div");
        result.container.appendChild(widthContainer);
        widthContainer.style.width = "60px";
        widthContainer.style.display = "inline-block";
        widthContainer.style.marginRight = "5px";
        result.width = document.createElement("input");
        result.width.setAttribute("id", "width");
        result.width.setAttribute("type", "number");
        result.width.style.height = "20px";
        result.width.style.width = "60px";
        result.width.oninput = ()=>{
            result.setEntity({w: result.width.value});
        }
        let widthLabel = document.createElement("label");
        widthLabel.setAttribute("for", "width");
        widthLabel.innerText = "width";
        widthLabel.style.display = "block";
        widthLabel.style.height = "16px";
        widthLabel.style.lineHeight = "16px";
        widthLabel.style.color = "#ffffff";
        widthContainer.appendChild(widthLabel);
        widthContainer.appendChild(result.width);
        ///////////////// Height Input ////////////////////////
        let heightContainer = document.createElement("div");
        result.container.appendChild(heightContainer);
        heightContainer.style.width = "60px";
        heightContainer.style.display = "inline-block";
        heightContainer.style.marginRight = "5px";
        result.height = document.createElement("input");
        result.height.setAttribute("id", "height");
        result.height.setAttribute("type", "number");
        result.height.style.height = "20px";
        result.height.style.width = "60px";
        result.height.oninput = ()=>{
            result.setEntity({h: result.height.value});
        }
        let heightLabel = document.createElement("label");
        heightLabel.setAttribute("for", "height");
        heightLabel.innerText = "height";
        heightLabel.style.display = "block";
        heightLabel.style.height = "16px";
        heightLabel.style.lineHeight = "16px";
        heightLabel.style.color = "#ffffff";
        heightContainer.appendChild(heightLabel);
        heightContainer.appendChild(result.height);
        ///////////////// Angle Input ////////////////////////
        let angleContainer = document.createElement("div");
        result.container.appendChild(angleContainer);
        angleContainer.style.width = "60px";
        angleContainer.style.display = "inline-block";
        result.angle = document.createElement("input");
        result.angle.setAttribute("id", "angle");
        result.angle.setAttribute("step", "0.1");
        result.angle.setAttribute("type", "number");
        result.angle.style.height = "20px";
        result.angle.style.width = "60px";
        result.angle.oninput = ()=>{
            result.setEntity({angle: result.angle.value});
        }
        let angleLabel = document.createElement("label");
        angleLabel.setAttribute("for", "angle");
        angleLabel.innerText = "angle";
        angleLabel.style.display = "block";
        angleLabel.style.height = "16px";
        angleLabel.style.lineHeight = "16px";
        angleLabel.style.color = "#ffffff";
        angleContainer.appendChild(angleLabel);
        angleContainer.appendChild(result.angle);

        //////// SET FIELDS FUNC ///////////////////////////////
        result.setFields = function(x, y, w, h, angle){
            result.xPos.value = x;
            result.yPos.value = y;
            result.width.value = w;
            result.height.value = h;
            result.angle.value = angle;
        };
        //////// SET ENTITY FUNC ///////////////////////////////
        result.setEntity = function(args){
            if(that.grabber.pickedList.length == 0)
                return;

            for (let i = 0; i < that.grabber.pickedList.length; i++) {
                const e = that.grabber.pickedList[i];
                
                if(args.x != undefined){
                    e.pos.x = +args.x;
                    if(e.physics != undefined){
                        e.physics.pos = e.pos;
                        if(e.physics.type == 1){
                            e.physics.updateVertices();
                        }
                    }
                }
    
                if(args.y != undefined){
                    e.pos.y = +args.y;
                    if(e.physics != undefined){
                        e.physics.pos = e.pos;
                        if(e.physics.type == 1){
                            e.physics.updateVertices();
                        }
                    }
                }

                if(args.w != undefined){
                    e.size.x = +args.w;
                }

                if(args.h != undefined){
                    e.size.y = +args.h;
                }
                
                if(args.angle != undefined){
                    e.angle = +args.angle;
                    if(e.physics != undefined){
                        if(e.physics.type == 1){
                            e.physics.updateRefVertices();
                            e.physics.updateVertices();
                        }
                    }
                }
                that.updatePlacedEntityButton(e);
            }
        };
        //////// DISABLE FUNC ///////////////////////////////
        result.disable = function(){
            result.xPos.disabled = true;
            result.yPos.disabled = true;
            result.width.disabled = true;
            result.height.disabled = true;
            result.angle.disabled = true;
            result.container.style.display = "none";
        };
        //////// ENABLE FUNC ///////////////////////////////
        result.enable = function(){
            result.xPos.disabled = false;
            result.yPos.disabled = false;
            result.width.disabled = false;
            result.height.disabled = false;
            result.angle.disabled = false;
            result.container.style.display = "block";
        };
        return result;
    }
}