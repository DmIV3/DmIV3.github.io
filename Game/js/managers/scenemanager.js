class SCM{
    static loadScene(name, callback){
        let loaded = false;
        SCM.currentScene = name;
        GM.clear();
        UI.clear();
        SFX.stopAll();
        if(callback)
            callback();
        for (let i = 0; i < SCENES.length; i++) {
            const scene = SCENES[i];
            if(scene.name == name){
                loaded = true;
                //// LOAD UI
                for (let j = 0; j < scene.ui.length; j++) {
                    let uiel = scene.ui[j];
                    let x, y, newEl;
                    if(uiel.pos.left != undefined){
                        x = uiel.pos.left;
                    }else if(uiel.pos.right != undefined){
                        x = VP.getWidth() - uiel.pos.right;
                    }
                    
                    if(uiel.pos.top){
                        y = uiel.pos.top;
                    }else if(uiel.pos.bottom){
                        y = VP.getHeight() - uiel.pos.bottom;
                    }
                    if(uiel.type == "button"){
                        newEl = UI.addButton(uiel.name, x, y, uiel.size.x, uiel.size.y,
                            GFX.createSprite(uiel.img1.name, uiel.img1.x, uiel.img1.y, uiel.img1.w, uiel.img1.h),
                            GFX.createSprite(uiel.img2.name, uiel.img2.x, uiel.img2.y, uiel.img2.w, uiel.img2.h));
                    }else if(uiel.type == "textbutton"){
                        newEl = UI.addTextButton(uiel.name, uiel.text, x, y, uiel.size.x, uiel.size.y,
                            GFX.createSprite(uiel.img1.name, uiel.img1.x, uiel.img1.y, uiel.img1.w, uiel.img1.h),
                            GFX.createSprite(uiel.img2.name, uiel.img2.x, uiel.img2.y, uiel.img2.w, uiel.img2.h));
                    }else if(uiel.type == "textpanel"){
                        newEl = UI.addTextPanel(uiel.name, uiel.text, x, y, uiel.size.x, uiel.size.y,
                            GFX.createSprite(uiel.img1.name, uiel.img1.x, uiel.img1.y, uiel.img1.w, uiel.img1.h));
                    }else if(uiel.type == "joystick"){
                        newEl = UI.addJoystick(uiel.name, x, y, uiel.size.x, uiel.size.y, uiel.radius, 
                            GFX.createSprite(uiel.img1.name, uiel.img1.x, uiel.img1.y, uiel.img1.w, uiel.img1.h), 
                            GFX.createSprite(uiel.img1.name, uiel.img2.x, uiel.img2.y, uiel.img2.w, uiel.img2.h));
                    }

                    if(uiel.visible != undefined)
                        newEl.setVisible(uiel.visible);
                    else
                        newEl.setVisible(true);
                }

                //// LOAD GAME OBJECTS
                for (let j = 0; j < scene.go.length; j++) {
                    const e = scene.go[j];
                    let newEnt = GM.add(e.name, e.pos.x, e.pos.y);
                    if(newEnt != undefined){
                        newEnt.size.x = e.size.x;
                        newEnt.size.y = e.size.y;
                        newEnt.angle = e.angle;
                    }
                }
            }
        }
        return loaded;
    }

    static name(){
        return SCM.currentScene;
    }
}