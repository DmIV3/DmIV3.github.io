class UI{
    static buttons = [];
	static joysticks = [];
	static textButtons = [];
	static textPanels = [];
	static scrollablePanels = [];
	
	static update(){

		for(let i = 0; i < UI.scrollablePanels.length; i++){
			UI.scrollablePanels[i].update();
		}

		for(let i = 0; i < UI.buttons.length; i++){
			UI.buttons[i].update();
		}
		
		for(let i = 0; i < UI.joysticks.length; i++){
			UI.joysticks[i].update();
		}

		for(let i = 0; i < UI.textButtons.length; i++){
			UI.textButtons[i].update();
		}
	}
	
	static render(renderer){

		for(let i = 0; i < UI.textPanels.length; i++){
			UI.textPanels[i].render(renderer);
		}

		for(let i = 0; i < UI.textButtons.length; i++){
			UI.textButtons[i].render(renderer);
		}

		for(let i = 0; i < UI.buttons.length; i++){
			UI.buttons[i].render(renderer);
		}

		for(let i = 0; i < UI.joysticks.length; i++){
			UI.joysticks[i].render(renderer);
		}

		for(let i = 0; i < UI.scrollablePanels.length; i++){
			UI.scrollablePanels[i].render(renderer);
		}
	}
	
    static clear(){
        UI.buttons = [];
        UI.joysticks = [];
		UI.textButtons = [];
		UI.textPanels = [];
		UI.scrollablePanels = [];
    }

	static hideAll(){
		for(let i = 0; i < UI.textButtons.length; i++){
			UI.textButtons[i].setVisible(false);
		}

		for(let i = 0; i < UI.buttons.length; i++){
			UI.buttons[i].setVisible(false);
		}

		for(let i = 0; i < UI.joysticks.length; i++){
			UI.joysticks[i].setVisible(false);
		}

		for(let i = 0; i < UI.textPanels.length; i++){
			UI.textPanels[i].setVisible(false);
		}
	}

	static showAll(){
		for(let i = 0; i < UI.textButtons.length; i++){
			UI.textButtons[i].setVisible(true);
		}

		for(let i = 0; i < UI.buttons.length; i++){
			UI.buttons[i].setVisible(true);
		}

		for(let i = 0; i < UI.joysticks.length; i++){
			UI.joysticks[i].setVisible(true);
		}

		for(let i = 0; i < UI.textPanels.length; i++){
			UI.textPanels[i].setVisible(true);
		}
	}

	static addButton(name, x, y, w, h, img1, img2){
		let b = new Button(name, x, y, w, h, img1, img2);
		UI.buttons.push(b);
		return b;
	}
	
	static removeButton(name){
		for(let i = 0; i < UI.buttons.length; i++){
			if(UI.buttons[i].name == name)
				UI.buttons.splice(i, 1);
		}
	}
	static getButton(name){
		for(let i = 0; i < UI.buttons.length; i++){
			if(UI.buttons[i].name == name)
				return UI.buttons[i];
		}
		for(let i = 0; i < UI.textButtons.length; i++){
			if(UI.textButtons[i].name == name)
				return UI.textButtons[i];
		}
	}
	
	static getButtonPressed(name){
		for(let i = 0; i < UI.buttons.length; i++){
			if(UI.buttons[i].name == name)
				return UI.buttons[i].getPressed();
		}
		for(let i = 0; i < UI.textButtons.length; i++){
			if(UI.textButtons[i].name == name)
				return UI.textButtons[i].getPressed();
		}
	}
	
	static getButtonDown(name){
		for(let i = 0; i < UI.buttons.length; i++){
			if(UI.buttons[i].name == name)
				return UI.buttons[i].getDown();
		}
		for(let i = 0; i < UI.textButtons.length; i++){
			if(UI.textButtons[i].name == name)
				return UI.textButtons[i].getDown();
		}
	}
	static getButtonReleased(name){
		for(let i = 0; i < UI.buttons.length; i++){
			if(UI.buttons[i].name == name)
				return UI.buttons[i].getReleased();
		}
		for(let i = 0; i < UI.textButtons.length; i++){
			if(UI.textButtons[i].name == name)
				return UI.textButtons[i].getReleased();
		}
	}

    static addJoystick(name, x, y, w, h, r, img1, img2){
		let j = new Joystick(name, x, y, w, h, r, img1, img2);
		UI.joysticks.push(j);
		return j;
	}
	
	static removeJoystick(name){
		for(let i = 0; i < UI.joysticks.length; i++){
			if(UI.joysticks[i].name == name)
				UI.joysticks.splice(i, 1);
		}
	}

	static getJoystick(name){
		for(let i = 0; i < UI.joysticks.length; i++){
			if(UI.joysticks[i].name == name)
				return UI.joysticks[i];
		}
	}

	static getJoystickInput(name){
		for(let i = 0; i < UI.joysticks.length; i++){
			if(UI.joysticks[i].name == name)
				return UI.joysticks[i].getInput();
		}
	}

	static addTextButton(name, text, x, y, w, h, img1, img2){
		let ta = new TextButton(name, text, x, y, w, h, img1, img2);
		UI.textButtons.push(ta);
		return ta;
	}
	
	static removeTextButton(name){
		for(let i = 0; i < UI.textButtons.length; i++){
			if(UI.textButtons[i].name == name)
				UI.textButtons.splice(i, 1);
		}
	}

	static configureTextButton(name, config){
		for(let i = 0; i < UI.textButtons.length; i++){
			if(UI.textButtons[i].name == name)
				UI.textButtons[i].configure(config);
		}
	}


	static configureTextButtons(config){
		for(let i = 0; i < UI.textButtons.length; i++){
			UI.textButtons[i].configure(config);
		}
	}


	static addTextPanel(name, text, x, y, w, h, img1){
		let ta = new TextPanel(name, text, x, y, w, h, img1);
		UI.textPanels.push(ta);
		return ta;
	}
	
	static removeTextPanel(name){
		for(let i = 0; i < UI.textPanels.length; i++){
			if(UI.textPanels[i].name == name)
				UI.textPanels.splice(i, 1);
		}
	}
	static getTextPanel(name){
		for(let i = 0; i < UI.textPanels.length; i++){
			if(UI.textPanels[i].name == name)
				return UI.textPanels[i];
		}
	}

	static configureTextPanel(name, config){
		for(let i = 0; i < UI.textPanels.length; i++){
			if(UI.textPanels[i].name == name)
				UI.textPanels[i].configure(config);
		}
	}


	static configureTextPanels(config){
		for(let i = 0; i < UI.textPanels.length; i++){
			UI.textPanels[i].configure(config);
		}
	}

	static addScrollablePanel(name, x, y, w, h, type){
		let sp;
		if(type == 1){
			console.log("TODO: add Horizontal");
		}else{
			sp = new VerticalScrollableContainer(name, x, y, w, h);
		}
		UI.scrollablePanels.push(sp);
		return sp;
	}

	static removeScrollablePanel(name){
		for(let i = 0; i < UI.scrollablePanels.length; i++){
			if(UI.scrollablePanels[i].name == name)
				UI.scrollablePanels.splice(i, 1);
		}
	}
}

class Button{
    constructor(name, x, y, w, h, img1, img2){
        this.name = name;
        this.visible = true;
        this.img1 = img1;
        this.img2 = img2;
        this.pos = Vec.v2(x, y);
        this.size = Vec.v2(w, h);
        this.inpId = -1;
        this.down = false;
        this.released = false;
        this.pressed = false;
    }
    
    update(){
        if(this.visible){
			this.pressed = false;
			this.released = false;
			this.chekPressed();
            this.chekReleased();
        }
    }
    
    render(renderer){
        if(this.visible){
            if(this.down){
				let g = this.img2.getSprite();
				renderer.drawCroppedImage(g.image, g.x, g.y, g.w, g.h, this.pos.x, this.pos.y, this.size.x, this.size.y);
            }else{
                let g = this.img1.getSprite();
                renderer.drawCroppedImage(g.image, g.x, g.y, g.w, g.h, this.pos.x, this.pos.y, this.size.x, this.size.y);
            }
        }
    }

    chekPressed(){
        if(!this.down){
            for (let i = 0; i < Input.touches.length; i++) {
                if(!Input.touches[i].active)
                    continue;
                if(CollisionDetection.pointRect(Input.touches[i].start.x, Input.touches[i].start.y,  this.pos.x, this.pos.y, this.size.x, this.size.y)){
                    this.down = true;
                    this.released = false;
                    this.pressed = true; 
                    this.inpId = Input.touches[i].id;
                }
                
            }
        }
    }

    chekReleased(){
        if(this.down){
            if(!Input.touch(this.inpId).active){
                this.down = false;
                this.released = true;
                this.inpId = -1;
            }
        }
    }

    getPressed(){
        return this.pressed;
    }

    getDown(){
        return this.down;
    }

    getReleased(){
        return this.released;
    }

    setVisible(v){
        this.visible = v;
        this.down = false;
        this.released = false;
        this.pressed = false;
    }

	swapImages(){
		let tmp = this.img1;
		this.img1 = this.img2;
		this.img2 = tmp;
	}
}

class Joystick{

    constructor(name, x, y, w, h, radius, img1, img2){
        this.visible = true;
        this.name = name;
        this.pos = Vec.v2(x, y);
        this.size = Vec.v2(w, h);
        this.radius = radius;
        this.img1 = img1;
        this.img2 = img2;
        this.image1Size = this.radius * 2;
        this.image2Size = this.radius;
        this.start = Vec.v2(0, 0);
        this.current = Vec.v2(0, 0);
        this.active = false;
        this.inpId = -1;
        this.pressed = false;
        this.dir = Vec.v2(0, 0);
    }
	
	update(){
		if(this.visible){
			this.chekPressed();
			this.chekReleased();
			
			if(this.pressed){
				if(!this.active){
					this.active = true;
					this.start.x = Input.touch(this.inpId).start.x;
					this.start.y = Input.touch(this.inpId).start.y;
				}else{
					this.current.x = Input.touch(this.inpId).current.x;
					this.current.y = Input.touch(this.inpId).current.y;
					
					if(UMath.distanceSq(this.start.x, this.start.y, this.current.x, this.current.y) > this.radius * this.radius){
						this.dir = Vec.unitN(Vec.substractN(this.current, this.start));
					}else{
						this.dir = Vec.divideN(Vec.substractN(this.current, this.start), this.radius);
					}
				}
			}else{
				this.active = false;
				this.start.x = 0;
				this.start.y = 0;
				this.current.x = 0;
				this.current.y = 0;
				this.dir.x = 0;
				this.dir.y = 0;
			}
		}
	}
	
	render(renderer){
		if(this.visible){
			if(this.pressed){
                let g = this.img1.getSprite();
                renderer.drawCroppedImage(g.image, g.x, g.y, g.w, g.h, this.start.x - this.image1Size / 2, this.start.y - this.image1Size / 2, this.image1Size, this.image1Size);
                g = this.img2.getSprite();
                renderer.drawCroppedImage(g.image, g.x, g.y, g.w, g.h, this.start.x - this.image2Size / 2 + this.dir.x * this.radius, this.start.y - this.image2Size / 2 + this.dir.y * this.radius, this.image2Size, this.image2Size);
			}
		}
	}
	chekPressed(){
		if(!this.pressed){
            for (let i = 0; i < Input.touches.length; i++) {
                if(!Input.touches[i].active)
                    continue;
                if(CollisionDetection.pointRect(Input.touches[i].start.x, Input.touches[i].start.y,  this.pos.x, this.pos.y, this.size.x, this.size.y)){
                    this.pressed = true; 
                    this.inpId = Input.touches[i].id;
                }
                
            }
		}
	}

	chekReleased(){
		if(this.pressed){
			if(!Input.touches[this.inpId].active){
				this.pressed = false;
				this.inpId = -1;
			}
		}
	}

	getInput(){
		return this.dir;
	}

	setVisible(v){
		this.visible = v;
		this.dir.x = 0;
		this.dir.y = 0;
	}
}

class TextButton{
	constructor(name, text, x, y, w, h, img1, img2){
        this.visible = true;
        this.name = name;
		this.text = text;
		this.fontSize = 16;
		this.color = "black";
		this.activeColor = "white";
		this.textAlign = "center";
		this.textBaseline = "middle";
		this.textPos = Vec.v2(w / 2, h / 2);
        this.pos = Vec.v2(x, y);
        this.size = Vec.v2(w, h);
        this.img1 = img1;
        this.img2 = img2;
        this.inpId = -1;
		this.down = false;
        this.released = false;
        this.pressed = false;
    }

	update(){
        if(this.visible){
			this.pressed = false;
			this.released = false;
            this.chekPressed();
            this.chekReleased();
        }
    }
    
    render(renderer){
        if(this.visible){
            if(this.down){
				if(this.img2 != undefined){
					let g = this.img2.getSprite();
					renderer.drawCroppedImage(g.image, g.x, g.y, g.w, g.h, this.pos.x, this.pos.y, this.size.x, this.size.y);
				}
            }else{
				if(this.img1 != undefined){
					let g = this.img1.getSprite();
					renderer.drawCroppedImage(g.image, g.x, g.y, g.w, g.h, this.pos.x, this.pos.y, this.size.x, this.size.y);
				}
            }
			if(this.down)
				renderer.setColor(this.activeColor);
			else
				renderer.setColor(this.color);
			
			renderer.setLineWidth(2);
			renderer.setFontSize(this.fontSize);
			renderer.setTextAlign(this.textAlign);
			renderer.setTextBaseline(this.textBaseline);
			renderer.fillText(this.text, this.pos.x + this.textPos.x, this.pos.y + this.textPos.y);

			if(this.img1 == undefined && this.img2 == undefined)
				renderer.drawRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
    }

    chekPressed(){
        if(!this.down){
            for (let i = 0; i < Input.touches.length; i++) {
                if(!Input.touches[i].active)
                    continue;
                if(CollisionDetection.pointRect(Input.touches[i].start.x, Input.touches[i].start.y,  this.pos.x, this.pos.y, this.size.x, this.size.y)){
                    this.down = true;
                    this.released = false;
                    this.pressed = true; 
                    this.inpId = Input.touches[i].id;
                }
                
            }
        }
    }

    chekReleased(){
        if(this.down){
            if(!Input.touch(this.inpId).active){
                this.down = false;
                this.released = true;
                this.inpId = -1;
            }
        }
    }

    getPressed(){
        return this.pressed;
    }

    getDown(){
        return this.down;
    }

    getReleased(){
        return this.released;
    }

    setVisible(v){
        this.visible = v;
        this.down = false;
        this.released = false;
        this.pressed = false;
    }

	setText(text){
		this.text = text;
	}

	configure(config){
		this.textPos = config.textPos || this.textPos;
		this.fontSize = config.fontSize || this.fontSize;
		this.color = config.color || this.color;
		this.activeColor = config.activeColor || this.activeColor;
		this.textAlign = config.textAlign || this.textAlign;
		this.textBaseline = config.textBaseline || this.textBaseline;
	}

	swapImages(){
		let tmp = this.img1;
		this.img1 = this.img2;
		this.img2 = tmp;
	}
}

class TextPanel{
	constructor(name, text, x, y, w, h, img1){
        this.visible = true;
        this.name = name;
		this.fontSize = 16;
		this.textColor = "black";
		this.textAlign = "center";
		this.textBaseline = "middle";
		this.lineheight = 16;
		this.lines = text.split('\n');
		this.textPos = Vec.v2(w / 2, h / 2);
        this.pos = Vec.v2(x, y);
        this.size = Vec.v2(w, h);
        this.img1 = img1;
    }
    
    render(renderer){
        if(this.visible){
			if(this.img1 != undefined){
				let g = this.img1.getSprite();
				renderer.drawCroppedImage(g.image, g.x, g.y, g.w, g.h, this.pos.x, this.pos.y, this.size.x, this.size.y);
			}
			renderer.setLineWidth(2);
			renderer.setFontSize(this.fontSize);
			renderer.setColor(this.textColor);
			renderer.setTextAlign(this.textAlign);
			renderer.setTextBaseline(this.textBaseline);
			for (let i = 0; i < this.lines.length; i++)
				renderer.fillText(this.lines[i], this.pos.x + this.textPos.x, this.pos.y + this.textPos.y + (i * this.lineheight));
        }
    }

    setVisible(v){
        this.visible = v;
    }

	configure(config){
		this.textPos = config.textPos || this.textPos;
		this.fontSize = config.fontSize || this.fontSize;
		this.textColor = config.color || this.textColor;
		this.textAlign = config.textAlign || this.textAlign;
		this.textBaseline = config.textBaseline || this.textBaseline;
		this.lineheight = config.lineheight || this.lineheight;
	}

	setImage(img){
		this.img1 = img;
	}

	setText(text){
		this.lines = text.split('\n');
	}
}

class VerticalScrollableContainer{
	constructor(name, x, y, w, h){
        this.visible = true;
        this.name = name;
        this.pos = Vec.v2(x, y);
        this.size = Vec.v2(w, h);

		this.buttons = [];
		this.buttonMargin = 5;
		this.nextButtonPos = 0;
		this.buttonHeight = 30;

		
		this.scrollDelay = 200;
		this.scrollCooldown = this.scrollDelay;
		this.scrollUp = false;
		this.scrollDown = false;
		this.lastScrollDir = -1;

		this.colors = {
			frame: "black",
			scrollBtn: "black",
			scrollBtnActive: "white",
			scrollBtnArrow: "white",
			scrollBtnArrowActive: "black"
		};

		this.upScrollBtn = {
			x: x,
			y: y,
			w: w,
			h: this.buttonHeight,
			active: false,
			arrow: {
				a: {
					x: x + w / 2,
					y: y  + 10
				},
				b: {
					x: x + w / 2 + 8,
					y: y + this.buttonHeight - 10
				},
				c: {
					x: x + w / 2 - 8,
					y: y + this.buttonHeight - 10
				}
			}
		};

		this.downScrollBtn = {
			x: x,
			y: y + h - this.buttonHeight,
			w: w,
			h: this.buttonHeight,
			active: false,
			arrow: {
				a: {
					x: x + w / 2,
					y: y + h - 10
				},
				b: {
					x: x + w / 2 + 8,
					y: y + h - this.buttonHeight + 10
				},
				c: {
					x: x + w / 2 - 8,
					y: y + h - this.buttonHeight + 10
				}
			}
		};


    }

	update(){
        if(this.visible){

			this.checkButtons();

			

			if(this.scrollUp)
				this.moveButtonsUp();

			if(this.scrollDown)
				this.moveButtonsDown();

			this.updateButtons();
			
        }
    }
    
    render(renderer){
        if(this.visible){
			renderer.setLineWidth(2);
			renderer.setColor(this.colors.frame);
			renderer.drawRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

			if(this.upScrollBtn.active)
				renderer.setColor(this.colors.scrollBtnActive);
			else
				renderer.setColor(this.colors.scrollBtn);
			renderer.fillRect(this.upScrollBtn.x, this.upScrollBtn.y, this.upScrollBtn.w, this.upScrollBtn.h);
			if(this.upScrollBtn.active)
				renderer.setColor(this.colors.scrollBtnArrowActive);
			else
				renderer.setColor(this.colors.scrollBtnArrow);
			renderer.fillPolygone([this.upScrollBtn.arrow.a, this.upScrollBtn.arrow.b, this.upScrollBtn.arrow.c]);

			if(this.downScrollBtn.active)
				renderer.setColor(this.colors.scrollBtnActive);
			else
				renderer.setColor(this.colors.scrollBtn);
			renderer.fillRect(this.downScrollBtn.x, this.downScrollBtn.y, this.downScrollBtn.w, this.downScrollBtn.h);
			if(this.downScrollBtn.active)
				renderer.setColor(this.colors.scrollBtnArrowActive);
			else
				renderer.setColor(this.colors.scrollBtnArrow);
			renderer.fillPolygone([this.downScrollBtn.arrow.a, this.downScrollBtn.arrow.b, this.downScrollBtn.arrow.c]);

			this.renderButtons(renderer);
        }
    }

	checkButtons(){
		this.scrollCooldown -= Time.getElapsed();
		this.downScrollBtn.active = false 
		this.upScrollBtn.active = false;
		this.scrollDown = false;
		this.scrollUp = false;

		if(CollisionDetection.pointRect(Input.mouseX(), Input.mouseY(), this.pos.x, this.pos.y, this.size.x, this.size.y)){
				
			if(Input.mouseWheel() > 0)
				this.downScrollBtn.active = true;
			else if(Input.mouseWheel() < 0)
				this.upScrollBtn.active = true;
			
			if(CollisionDetection.pointRect(Input.mouseX(), Input.mouseY(), this.upScrollBtn.x, this.upScrollBtn.y, this.upScrollBtn.w, this.upScrollBtn.h)){
				if(Input.mouseDown(0)){
					this.upScrollBtn.active = true;
				}
			}

			if(CollisionDetection.pointRect(Input.mouseX(), Input.mouseY(), this.downScrollBtn.x, this.downScrollBtn.y, this.downScrollBtn.w, this.downScrollBtn.h)){
				if(Input.mouseDown(0)){
					this.downScrollBtn.active = true;
				}
			}

			if(this.downScrollBtn.active){
				if(this.scrollCooldown <= 0){
					this.scrollCooldown = this.scrollDelay;
					this.scrollDown = true;
				}
			}

			if(this.upScrollBtn.active){
				if(this.scrollCooldown <= 0){
					this.scrollCooldown = this.scrollDelay;
					this.scrollUp = true;
				}
			}
		}
	}

	updateButtons(){
		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].update();	
		}
	}

	renderButtons(r){
		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].render(r);	
		}
	}

	pushButton(name){
		let b = new TextButton(name, name, this.pos.x + this.buttonMargin,  this.pos.y + this.buttonHeight + this.nextButtonPos, this.size.x - this.buttonMargin * 2, this.buttonHeight, undefined, undefined);
		this.nextButtonPos += this.buttonHeight + this.buttonMargin;
		b.setVisible(this.buttonIsInside(b));
		this.buttons.push(b);
		return b;
	}

	configureButtons(config){
		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].configure(config);	
		}
	}

	moveButtonsUp(){
		if(this.lastShowedButton() && this.lastScrollDir == 0)
			return;
		for (let i = 0; i < this.buttons.length; i++) {
			this.lastScrollDir = 0;
			this.buttons[i].pos.y -= (this.buttonHeight + this.buttonMargin);
			this.buttons[i].setVisible(this.buttonIsInside(this.buttons[i]));
		}
	}

	moveButtonsDown(){
		if(this.lastShowedButton() && this.lastScrollDir == 1)
			return;
		for (let i = 0; i < this.buttons.length; i++) {
			this.lastScrollDir = 1;
			this.buttons[i].pos.y += (this.buttonHeight + this.buttonMargin);
			this.buttons[i].setVisible(this.buttonIsInside(this.buttons[i]));
		}
	}

	buttonIsInside(b){
		return(b.pos.y >= this.pos.y + this.buttonHeight && b.pos.y + b.size.y < this.pos.y + this.size.y - this.buttonHeight);
	}

	lastShowedButton(){
		let counter = 0;
		for (let i = 0; i < this.buttons.length; i++) {
			if(this.buttons[i].visible)
				counter++;
		}
		if(counter <= 1){
			return true;
		}
		return false;
	}

	setVisible(v){
        this.visible = v;
    }

	setColors(c){
		this.colors.frame = c.frame || this.colors.frame;
		this.colors.scrollBtn = c.scrollBtn || this.colors.scrollBtn;
		this.colors.scrollBtnActive = c.scrollBtnActive || this.colors.scrollBtnActive;
		this.colors.scrollBtnArrow = c.scrollBtnArrow || this.colors.scrollBtnArrow;
		this.colors.scrollBtnArrowActive = c.scrollBtnArrowActive || this.colors.scrollBtnArrowActive;
	}

	getButtonPressed(name){
		for(let i = 0; i < this.buttons.length; i++){
			if(this.buttons[i].name == name)
				return this.buttons[i].getPressed();
		}this
	}
	
	getButtonDown(name){
		for(let i = 0; i < this.buttons.length; i++){
			if(this.buttons[i].name == name)
				return this.buttons[i].getDown();
		}
	}

	getButtonReleased(name){
		for(let i = 0; i < this.buttons.length; i++){
			if(this.buttons[i].name == name)
				return this.buttons[i].getReleased();
		}
	}
}