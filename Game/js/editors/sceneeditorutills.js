class SceneObjectsGrabber{
    constructor(sceneEditor){
        this.editor = sceneEditor;
        this.moveList = [];
        this.pickedList = [];
        this.startPos = Vec.zero();
        this.diffPos = Vec.zero();
        this.active = false;
        this.editingInvWalls = {
            active: false,
            dragging: false,
            start: Vec.zero(),
            current: Vec.zero(),
            startPos: Vec.zero(),
            startSize: Vec.zero(),
            corner: "lt"
        };
        this.boxSelector = {
            active: false,
            finish: false,
            start: Vec.zero(),
            current: Vec.zero(),
            end: Vec.zero()
        }
    }

    update(){
        this.grab();
        this.moveEntities();
        this.editWall();
    }

    moveEntities(){
        if(!this.active)
            return;

        if(this.editor.pickedEntity != undefined){
            this.cancel();
            return;
        }

        if(Input.mousePressed(2)){
            this.cancel();
            return;
        }

        this.diffPos = Vec.substractN(this.startPos, Vec.v2(VP.worldX(Input.mouseX()), VP.worldY(Input.mouseY())));

        if(this.moveList.length == 1){
            if(this.editor.controlPanel.snap.active){
                this.moveList[0].ref.pos.x = Math.floor(VP.worldX(Input.mouseX() + this.editor.controlPanel.snap.width / 2) / this.editor.controlPanel.snap.width) * this.editor.controlPanel.snap.width;
                this.moveList[0].ref.pos.y = Math.floor(VP.worldY(Input.mouseY() + this.editor.controlPanel.snap.height / 2) / this.editor.controlPanel.snap.height) * this.editor.controlPanel.snap.height;
                if(this.moveList[0].ref.name == "std_inv_wall"){
                    this.moveList[0].ref.pos.x -= this.editor.controlPanel.snap.width / 2;
                    this.moveList[0].ref.pos.y -= this.editor.controlPanel.snap.height / 2;
                    
                }
            }else{
                this.moveList[0].ref.pos = Vec.substractN(this.moveList[0].start, this.diffPos);
                this.moveList[0].ref.pos.x = Math.floor(this.moveList[0].ref.pos.x);
                this.moveList[0].ref.pos.y = Math.floor(this.moveList[0].ref.pos.y);
            }
            if(this.moveList[0].ref.physics){
                this.moveList[0].ref.physics.pos = this.moveList[0].ref.pos;
                if(this.moveList[0].ref.physics.type == 1){
                    this.moveList[0].ref.physics.updateVertices();
                }
            }
        }else{
            for (let i = 0; i < this.moveList.length; i++) {
                const e = this.moveList[i];
                e.ref.pos = Vec.substractN(e.start, this.diffPos);
                e.ref.pos.x = Math.floor(e.ref.pos.x);
                e.ref.pos.y = Math.floor(e.ref.pos.y);
                if(e.ref.physics){
                    e.ref.physics.pos = e.ref.pos;
                    if(e.ref.physics.type == 1){
                        e.ref.physics.updateVertices();
                    }
                }
            }
        }

        let en = this.moveList[0];
        this.editor.setEntityPanelFields(
            en.ref.pos.x, 
            en.ref.pos.y,
            en.ref.size.x,
            en.ref.size.y,
            en.ref.angle);

        if(Input.mousePressed(0))
            this.stop();
    }

    render(r){
        this.highlightGrabbed(r);

        this.drawInitPositions(r);

        this.drawBoxSelector(r);
    }

    drawBoxSelector(r){
        if(this.boxSelector.active){
            r.setLineWidth(2);
            r.setColor("orange");
            r.drawRect(this.boxSelector.start.x,this.boxSelector.start.y, this.boxSelector.current.x - this.boxSelector.start.x, this.boxSelector.current.y - this.boxSelector.start.y);
            r.setColor("#00ff2a");
            r.drawLine(Input.mouseX(), Input.mouseY() - 20, Input.mouseX(), Input.mouseY() + 20);
            r.setColor("#00c8ff");
            r.drawLine(Input.mouseX() - 20, Input.mouseY(), Input.mouseX() + 20, Input.mouseY());
        }
    }

    drawInitPositions(r){
        if(!this.active)
            return;
        for (let i = 0; i < this.moveList.length; i++) {
            let e = this.moveList[i].ref;
            let pos = Vec.copy(this.moveList[i].start);
            pos.x = VP.screenX(pos.x);
            pos.y = VP.screenY(pos.y);
            r.setColor("rgba(255, 0, 0, 0.3)");
            let vertices = [];
            if(e.name == "std_inv_wall"){
                vertices.push(Vec.v2(pos.x, pos.y));       
                vertices.push(Vec.v2(pos.x + e.size.x, pos.y));       
                vertices.push(Vec.v2(pos.x + e.size.x, pos.y + e.size.y));       
                vertices.push(Vec.v2(pos.x, pos.y + e.size.y));       
                r.fillPolygone(vertices);
            }else{
                vertices.push(Vec.transform(Vec.v2(-e.size.x / 2, -e.size.y / 2), pos.x, pos.y, e.angle));
                vertices.push(Vec.transform(Vec.v2(e.size.x / 2, -e.size.y / 2), pos.x, pos.y, e.angle));
                vertices.push(Vec.transform(Vec.v2(e.size.x / 2, e.size.y / 2), pos.x, pos.y, e.angle));
                vertices.push(Vec.transform(Vec.v2(-e.size.x / 2, e.size.y / 2), pos.x, pos.y, e.angle));
                r.fillPolygone(vertices);
            }
        }
    }

    highlightGrabbed(r){
        for (let i = 0; i < this.pickedList.length; i++) {
            const e = this.pickedList[i];
            let pos = Vec.copy(e.pos);
            pos.x = VP.screenX(pos.x);
            pos.y = VP.screenY(pos.y);
            r.setColor("orange");
            r.setLineWidth(1);
            let vertices = [];
            if(e.name == "std_inv_wall"){
                vertices.push(Vec.v2(pos.x, pos.y));       
                vertices.push(Vec.v2(pos.x + e.size.x, pos.y));       
                vertices.push(Vec.v2(pos.x + e.size.x, pos.y + e.size.y));       
                vertices.push(Vec.v2(pos.x, pos.y + e.size.y));       
                r.drawPolygone(vertices);
                if(this.editingInvWalls.active){
                    r.setColor("red");
                    r.fillCircle(pos.x, pos.y, 10);
                    r.setColor("green");
                    r.fillCircle(pos.x + e.size.x, pos.y, 10);
                    r.setColor("blue");
                    r.fillCircle(pos.x + e.size.x, pos.y + e.size.y, 10);
                    r.setColor("yellow");
                    r.fillCircle(pos.x, pos.y + e.size.y, 10);
                    r.setColor("orange");
                    r.drawCircle(pos.x, pos.y, 10);
                    r.drawCircle(pos.x + e.size.x, pos.y, 10);
                    r.drawCircle(pos.x + e.size.x, pos.y + e.size.y, 10);
                    r.drawCircle(pos.x, pos.y + e.size.y, 10);
                }
            }else{
                vertices.push(Vec.transform(Vec.v2(-e.size.x / 2, -e.size.y / 2), pos.x, pos.y, e.angle));
                vertices.push(Vec.transform(Vec.v2(e.size.x / 2, -e.size.y / 2), pos.x, pos.y, e.angle));
                vertices.push(Vec.transform(Vec.v2(e.size.x / 2, e.size.y / 2), pos.x, pos.y, e.angle));
                vertices.push(Vec.transform(Vec.v2(-e.size.x / 2, e.size.y / 2), pos.x, pos.y, e.angle));
                r.drawPolygone(vertices);
            }

        }
    }

    run(){
        if(this.active){
            this.cancel();
            return;
        }

        if(this.pickedList.length == 0)
            return;

        this.active = true;
        for (let i = 0; i < this.pickedList.length; i++) {
            const e = this.pickedList[i];
            
            this.moveList.push({
                ref: e,
                start: Vec.copy(e.pos)
            });
        }

        let avgX = 0, avgY = 0;
        for(let i = 0;  i < this.moveList.length; i++){
            const e = this.moveList[i].ref;
            avgX += e.pos.x;
            avgY += e.pos.y;
        }

        avgX /= this.moveList.length;
        avgY /= this.moveList.length;
        this.startPos = Vec.v2(avgX, avgY);
    }

    stop(){
        this.active = false;
        for (let i = 0; i < this.moveList.length; i++) {
            const e = this.moveList[i];
            e.ref.pos.x = Math.floor(e.ref.pos.x);
            e.ref.pos.y = Math.floor(e.ref.pos.y);
            if(e.ref.physics){
                e.ref.physics.pos = e.ref.pos;
                if(e.ref.physics.type == 1){
                    e.ref.physics.updateVertices();
                }
            }
        }
        for (let i = 0; i < this.moveList.length; i++) {
            const en = this.moveList[i].ref;
            this.editor.updatePlacedEntityButton(en);
        }
        this.moveList = [];
    }

    cancel(){
        this.active = false;
        for (let i = 0; i < this.moveList.length; i++) {
            const e = this.moveList[i];
            e.ref.pos = Vec.copy(e.start); 
            if(e.ref.physics){
                e.ref.physics.pos = e.ref.pos;
                if(e.ref.physics.type == 1){
                    e.ref.physics.updateVertices();
                }
            }
        }
        for (let i = 0; i < this.moveList.length; i++) {
            const en = this.moveList[i].ref;
            this.editor.updatePlacedEntityButton(en);
        }
        this.moveList = [];
    }

    grab(){
        if(this.editor.pickedEntity != undefined)
            return;

        if(this.active)
            return;

        if(this.editor.controlPanel.wallEdit.active)
            this.#grabInvWalls();
        else
            this.#grabEntity();
    }

    #grabInvWalls(){
        let tempPicked = [];
        if(Input.mousePressed(0) && !this.editingInvWalls.active){
            this.editor.releaseEntities();

            for (let i = 0; i < this.editor.invWalls.length; i++) {
                const e = this.editor.invWalls[i];
                if(CollisionDetection.pointRect(VP.worldX(Input.mouseX()), VP.worldY(Input.mouseY()), e.pos.x, e.pos.y, e.size.x, e.size.y))
                    tempPicked.push(e);
            }

            if(tempPicked.length == 1)
                this.pickedList.push(tempPicked[0]);
            else if(tempPicked.length > 1)
                this.pickedList.push(tempPicked[UMath.randomInt(0, tempPicked.length-1)]);
            else
                return;

            this.editor.enanbleEntityFields();
            this.editor.setEntityPanelFields(
                this.pickedList[0].pos.x, 
                this.pickedList[0].pos.y,
                this.pickedList[0].size.x,
                this.pickedList[0].size.y,
                this.pickedList[0].angle);
        }
    }

    #grabEntity(){
        let tempPicked = [];

        if(Input.keyPressed(66)){
            if(this.boxSelector.active){
                this.boxSelector.active = false;
            }else{
                this.boxSelector.active = true;
                this.boxSelector.start = Vec.zero();
                this.boxSelector.current = Vec.zero();
            }
        }

        if(Input.mousePressed(0) && this.boxSelector.active){
            this.boxSelector.start = Vec.v2(Input.mouseX(), Input.mouseY());
        }

        if(Input.mousePressed(2) && this.boxSelector.active){
            this.boxSelector.active = false;
        }


        if(Input.mouseDown(0) && this.boxSelector.active){
            this.boxSelector.current = Vec.v2(Input.mouseX(),Input.mouseY());
        }

        if(Input.mouseReleased(0) && this.boxSelector.active){
            this.boxSelector.active = false;
            this.boxSelector.finish = true;
            this.boxSelector.end = Vec.v2(Input.mouseX(), Input.mouseY());
        }

        if(this.boxSelector.finish){
            this.boxSelector.finish = false;

            let fac = (this.boxSelector.end.x - this.boxSelector.start.x)*(this.boxSelector.end.y - this.boxSelector.start.y);
            let boxRect = [
                Vec.v2(this.boxSelector.start.x, this.boxSelector.start.y),
                undefined,
                Vec.v2(this.boxSelector.end.x, this.boxSelector.end.y),
                undefined
            ];

            if(fac > 0){
                boxRect[1] = Vec.v2(this.boxSelector.end.x, this.boxSelector.start.y);
                boxRect[3] = Vec.v2(this.boxSelector.start.x, this.boxSelector.end.y);
            }else if(fac < 0){
                boxRect[1] = Vec.v2(this.boxSelector.start.x, this.boxSelector.end.y);
                boxRect[3] = Vec.v2(this.boxSelector.end.x, this.boxSelector.start.y);
            }else{
                return;
            }

            for (let i = 0; i < this.editor.entities.length; i++) {
                const e = this.editor.entities[i];
                let pos = Vec.copy(e.pos);
                pos.x = VP.screenX(pos.x);
                pos.y = VP.screenY(pos.y);
                let entityRect = [
                    Vec.transform(Vec.v2(-e.size.x / 2, -e.size.y / 2), pos.x, pos.y, e.angle),
                    Vec.transform(Vec.v2(e.size.x / 2, -e.size.y / 2), pos.x, pos.y, e.angle),
                    Vec.transform(Vec.v2(e.size.x / 2, e.size.y / 2), pos.x, pos.y, e.angle),
                    Vec.transform(Vec.v2(-e.size.x / 2, e.size.y / 2), pos.x, pos.y, e.angle)
                ];

                if(CollisionDetection.sat(boxRect, entityRect))
                    tempPicked.push(e);
            }

            for (let y = 0; y < this.pickedList.length; y++) {
                const inListEntity = this.pickedList[y];
                for (let j = 0; j < tempPicked.length; j++) {
                    const pickedEntity = tempPicked[j];
                    if(pickedEntity == inListEntity)
                        tempPicked.splice(j, 1);
                }
            }
            this.pickedList = this.pickedList.concat(tempPicked);
            if(this.pickedList.length > 0){
                this.editor.enanbleEntityFields();
                this.editor.setEntityPanelFields(
                    this.pickedList[0].pos.x, 
                    this.pickedList[0].pos.y,
                    this.pickedList[0].size.x,
                    this.pickedList[0].size.y,
                    this.pickedList[0].angle);
            }
        }

        if(Input.mousePressed(0) && !this.boxSelector.active){
            if(!Input.keyDown(16)){
                this.editor.releaseEntities();
            }

            let mouseRect = [
                Vec.v2(Input.mouseX() - 2, Input.mouseY() - 2),
                Vec.v2(Input.mouseX() + 2, Input.mouseY() - 2),
                Vec.v2(Input.mouseX() + 2, Input.mouseY() + 2),
                Vec.v2(Input.mouseX() - 2, Input.mouseY() + 2)
            ];

            for (let i = 0; i < this.editor.entities.length; i++) {
                const e = this.editor.entities[i];
                let pos = Vec.copy(e.pos);
                pos.x = VP.screenX(pos.x);
                pos.y = VP.screenY(pos.y);
                let entityRect = [
                    Vec.transform(Vec.v2(-e.size.x / 2, -e.size.y / 2), pos.x, pos.y, e.angle),
                    Vec.transform(Vec.v2(e.size.x / 2, -e.size.y / 2), pos.x, pos.y, e.angle),
                    Vec.transform(Vec.v2(e.size.x / 2, e.size.y / 2), pos.x, pos.y, e.angle),
                    Vec.transform(Vec.v2(-e.size.x / 2, e.size.y / 2), pos.x, pos.y, e.angle)
                ];

                if(CollisionDetection.sat(mouseRect, entityRect))
                    tempPicked.push(e);
            }
            tempPicked.sort(function(a, b){
                return b.z - a.z;
            });

            if(tempPicked.length > 0){
                for (let i = 0; i < this.pickedList.length; i++) {
                    if(this.pickedList[i] == tempPicked[0])
                        return;
                }
                this.pickedList.push(tempPicked[0]);
            }
            
            if(this.pickedList.length > 0){
                this.editor.enanbleEntityFields();
                this.editor.setEntityPanelFields(
                    this.pickedList[0].pos.x, 
                    this.pickedList[0].pos.y,
                    this.pickedList[0].size.x,
                    this.pickedList[0].size.y,
                    this.pickedList[0].angle);
            }
        }
    }

    switchEditingWalls(){
        if(this.pickedList.length != 0)
            this.editingInvWalls.active = !this.editingInvWalls.active;
    }

    editWall(){
        if(!this.editingInvWalls.active)
            return;
        
        if(this.pickedList.length == 0)
            return;
        
        let e = this.pickedList[0];
        let lt = Vec.v2(e.pos.x, e.pos.y);
        let rt = Vec.v2(e.pos.x + e.size.x, e.pos.y);
        let rb = Vec.v2(e.pos.x + e.size.x, e.pos.y + e.size.y);
        let lb = Vec.v2(e.pos.x, e.pos.y + e.size.y);

        if(Input.mousePressed(0)){
            this.editingInvWalls.startPos = Vec.copy(e.pos);
            this.editingInvWalls.startSize = Vec.copy(e.size);

            if(CollisionDetection.pointCircle(VP.worldX(Input.mouseX()), VP.worldY(Input.mouseY()), lt.x, lt.y, 10)){
                this.editingInvWalls.dragging = true;
                this.editingInvWalls.start = Vec.v2(Input.mouseX(), Input.mouseY());
                this.editingInvWalls.corner = "lt";
            }
            if(CollisionDetection.pointCircle(VP.worldX(Input.mouseX()), VP.worldY(Input.mouseY()), rt.x, rt.y, 10)){
                this.editingInvWalls.dragging = true;
                this.editingInvWalls.start = Vec.v2(Input.mouseX(), Input.mouseY());
                this.editingInvWalls.corner = "rt";
            }
            if(CollisionDetection.pointCircle(VP.worldX(Input.mouseX()), VP.worldY(Input.mouseY()), rb.x, rb.y, 10)){
                this.editingInvWalls.dragging = true;
                this.editingInvWalls.start = Vec.v2(Input.mouseX(), Input.mouseY());
                this.editingInvWalls.corner = "rb";

            }
            if(CollisionDetection.pointCircle(VP.worldX(Input.mouseX()), VP.worldY(Input.mouseY()), lb.x, lb.y, 10)){
                this.editingInvWalls.dragging = true;
                this.editingInvWalls.start = Vec.v2(Input.mouseX(), Input.mouseY());
                this.editingInvWalls.corner = "lb";
            }
        }

        if(Input.mouseReleased(0))
            this.editingInvWalls.dragging = false;
        

        if(this.editingInvWalls.dragging){
            let snap = this.editor.controlPanel.snap;
            if(snap.active){
                let newPos = Vec.v2(
                    Math.floor(VP.worldX(Input.mouseX() + snap.width) / snap.width) * snap.width - snap.width / 2,
                    Math.floor(VP.worldY(Input.mouseY() + snap.height) / snap.height) * snap.height - snap.height / 2);
                if(this.editingInvWalls.corner == "lt"){
                    e.pos = newPos;
                    e.size = Vec.addN(this.editingInvWalls.startSize, Vec.substractN(this.editingInvWalls.startPos, newPos));
                }else if(this.editingInvWalls.corner == "rt"){
                    e.pos.y = newPos.y;
                    e.size.x = newPos.x - this.editingInvWalls.startPos.x;
                    e.size.y = this.editingInvWalls.startSize.y + this.editingInvWalls.startPos.y - newPos.y;
                }else if(this.editingInvWalls.corner == "rb"){
                    e.size.x = newPos.x - this.editingInvWalls.startPos.x;
                    e.size.y = newPos.y - this.editingInvWalls.startPos.y;
                }
                else if(this.editingInvWalls.corner == "lb"){
                    e.pos.x = newPos.x;
                    e.size.x = this.editingInvWalls.startSize.x + this.editingInvWalls.startPos.x - newPos.x;
                    e.size.y = newPos.y - this.editingInvWalls.startPos.y;
                }
            }else{
                this.editingInvWalls.current = Vec.v2(Input.mouseX(), Input.mouseY());
                let diff = Vec.substractN(this.editingInvWalls.current, this.editingInvWalls.start);
                if(this.editingInvWalls.corner == "lt"){
                    e.pos.x = this.editingInvWalls.startPos.x + diff.x;
                    e.pos.y = this.editingInvWalls.startPos.y + diff.y;
                    e.size.x = this.editingInvWalls.startSize.x - diff.x;
                    e.size.y = this.editingInvWalls.startSize.y - diff.y;
                }else if(this.editingInvWalls.corner == "rt"){
                    e.pos.y = this.editingInvWalls.startPos.y + diff.y;
                    e.size.x = this.editingInvWalls.startSize.x + diff.x;
                    e.size.y = this.editingInvWalls.startSize.y - diff.y;
                }else if(this.editingInvWalls.corner == "rb"){
                    e.size.x = this.editingInvWalls.startSize.x + diff.x;
                    e.size.y = this.editingInvWalls.startSize.y + diff.y;
                }
                else if(this.editingInvWalls.corner == "lb"){
                    e.pos.x = this.editingInvWalls.startPos.x + diff.x;
                    e.size.x = this.editingInvWalls.startSize.x - diff.x;
                    e.size.y = this.editingInvWalls.startSize.y + diff.y;
                }
            }

            if(e.size.x < 10)
                e.size.x = 10;
            if(e.size.y < 10)
                e.size.y = 10;

            this.editor.setEntityPanelFields(
                e.pos.x, 
                e.pos.y,
                e.size.x,
                e.size.y,
                e.angle);
        }
    }

    reset(){
        this.editingInvWalls.active = false;
        this.editingInvWalls.dragging = false;
        this.boxSelector.active = false;
        this.pickedList = [];
    }
}