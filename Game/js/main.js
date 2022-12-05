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



window.addEventListener("blur", ()=> {GM.pause(); Input.clearKeyInput();}, false);
window.addEventListener("focus", ()=> {GM.unpause();}, false);

function loop(timestamp){
	fpsInfo += Time.getElapsed();
	if(fpsInfo >= 100){
		fpsInfo -= 100;
		document.title = `DMIV  ${~~Time.getFPS()}`;
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