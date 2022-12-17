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
	renderer.clear();
	GM.render(renderer);
	UI.render(renderer);
}
let canvas = document.getElementById("main-canvas");
let renderer;

window.addEventListener("blur", ()=> {GM.pause(); Input.clearKeyInput();}, false);
window.addEventListener("focus", ()=> {GM.unpause();}, false);

function loop(timestamp){
	
	Time.update(timestamp);

	update();
	render();

	Input.update();
	requestAnimationFrame(loop);
}
create();
loop(0);
}