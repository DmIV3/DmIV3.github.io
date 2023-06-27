let mX=0, mY=0, mW=0, mLD=false, mRD=false, sW=0, sH=0;
let canvas, modelFileInput, textureFileInput;
let prevMX=0, prevMY=0;

function start(){
  canvas = document.querySelector('#main-canvas');
  modelFileInput = document.querySelector('#model-file-input');
  modelFileInput.onchange = loadModel;
  textureFileInput = document.querySelector('#texture-file-input');
  textureFileInput.onchange = loadTexture;

  Messanger.init();
  
  GL.init(canvas, VSOURCE, FSOURCE);

  Loader.loadDefaultModel(GL.setBuffer);
  Loader.loadDefaultTexture(GL.setTexture);

  resize();

  loop();
}

function loop(){
  if(mLD){
    let diffX = (mX - prevMX) / sW * Math.PI;
    let diffY = -(mY - prevMY) / sH;

    Mat4.rotateY(GL.model, diffX);
    GL.camera.scale(diffY, diffY);
  }
  prevMX = mX;
  prevMY = mY;

  GL.camera.applyTransforms();

  GL.clear();
  GL.render();

  mW = 0;
  requestAnimationFrame(loop);
}



function resize(){
  sW = window.innerWidth;
  sH = window.innerHeight;
  canvas.width = sW;
  canvas.height = sH;
  GL.resize(sW, sH);
}

function loadModel(){
  let fileReader = new FileReader();
  fileReader.onload = function(){
    const data = Loader.loadOBJ(this.result);
    GL.setBuffer(data);
    modelFileInput.value = '';
  }
  if(this.files[0] !== undefined){
    fileReader.readAsText(this.files[0]);
  }
}

function loadTexture(){
  let fileReader = new FileReader();
  fileReader.onload = function(){
    const img = document.createElement('img');
    img.onload = ()=>{GL.setTexture(img)}
    img.src = this.result;
    textureFileInput.value = '';
  }
  if(this.files[0] !== undefined){
    fileReader.readAsDataURL(this.files[0]);
  }
}

window.onload = start;
window.onresize = resize;
window.onmousemove = function(e){
  mX = e.clientX;
  mY = e.clientY;
}
window.onwheel = (e)=>{mW = e.deltaY > 0 ? 1 : -1}
window.onmouseleave = e=> mD = false;
window.oncontextmenu = e=> e.preventDefault();
window.onmousedown = e=>{
  e.preventDefault();
  if(e.button === 0)
    mLD = true;
  else if(e.button === 2)
    mRD = true;
}
window.onmouseup = e=> {
  e.preventDefault();
  if(e.button === 0)
    mLD = false;
  else if(e.button === 2)
    mRD = false;
}

window.addEventListener('touchstart', e=>{
  e.preventDefault();
  if(e.touches[0] !== undefined){
    prevMX = mX = e.touches[0].clientX;
    prevMY = mY = e.touches[0].clientY;
    mLD = true;
  }
}, {passive: false});

window.addEventListener('touchend', e=>{
  e.preventDefault();
  if(e.touches[0] !== undefined){
    mLD = false;
  }
}, {passive: false});

window.addEventListener('touchcancel', e=>{
  e.preventDefault();
  if(e.touches[0] !== undefined){
    mLD = false;
  }
}, {passive: false});

window.addEventListener('touchmove', e=>{
  e.preventDefault();
  if(e.touches[0] !== undefined){
    mX = e.touches[0].clientX;
    mY = e.touches[0].clientY;
  }
}, {passive: false});