window.onload = ()=>{
function create(){
	VP.setSurface(canvas);
	VP.setCamera(new Camera2D(0, 0));
	VP.resize();
	Input.init(canvas);
	renderer = new Renderer2D();
	renderer.setImageSmoothing(false);

	ImageManager.loadImages(IMAGES);
	SFX.loadSounds(SOUNDS);
	GFX.loadAnimations(ANIMATIONS);

	GM.init();
	GM.loadObjects();
	SCM.loadScene("Main");
}

function update(){
	UI.update();
	GM.update();
	SFX.update();
	VP.update();
}

function render(){
	GM.render(renderer);
	UI.render(renderer);
}
let canvas = document.getElementById("main-canvas");
let renderer;
let fpsInfo = 0;
let fpsSpan = document.createElement("span");
fpsSpan.style.position = "fixed";
fpsSpan.style.top = "50px";
fpsSpan.style.left = "20px";
fpsSpan.style.color = "white";
document.body.appendChild(fpsSpan);


window.addEventListener("blur", ()=> {GM.pause(); Input.clearKeyInput();}, false);
window.addEventListener("focus", ()=> {GM.unpause();}, false);

function loop(timestamp){
	fpsInfo += Time.getElapsed();
	if(fpsInfo >= 100){
		fpsInfo -= 100;
		fpsSpan.innerText = `DMIV  ${~~Time.getFPS()}`;
	}


	Time.update(timestamp);
	renderer.clear();

	update();
	render();

	renderer.render();
	Input.update();
	requestAnimationFrame(loop);
}
create();
loop(0);
}
