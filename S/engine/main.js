import { Input } from "./input/input.js";
import { SETTINGS } from "../assets/settings.js";
import { GL } from "./render/glr.js"
import { Loader } from "./resourceManagers/loader.js";
import { Mat4 } from "./maths/matrix.js";
import { Vec3 } from "./maths/vector.js";


window.onload = start;
function start(){

    let canvasGL = document.querySelector('#canvas-gl');

    let canvas2D = document.querySelector('#canvas-2d');
    canvas2D.width = window.innerWidth;
    canvas2D.height = window.innerHeight;
    window.addEventListener('resize', ()=>{
        canvas2D.width = window.innerWidth;
        canvas2D.height = window.innerHeight;
    }, false);
    let ctx = canvas2D.getContext('2d');

    
    Input.init(canvasGL);
    GL.init(canvasGL);
    GL.setClearColor(SETTINGS.clearColor[0], SETTINGS.clearColor[1], SETTINGS.clearColor[2]);

    Loader.init(GL);
    
    Loader.loadShaders(['testShader', 'shaderrr']);
    Loader.loadSprites(['testSprite0', 'testSprite1', 'plane']);
    Loader.loadModels(['testModel1']);
    Loader.loadImages(['ground_tiles', 'decorations', 'cstexture', 'cube', 'mage_char']);

    let camMat = Mat4.translate(Mat4.create(), Mat4.create(), Vec3.create(0, 0, -GL.h));
    let modelMat = Mat4.scale(Mat4.create(), Mat4.create(), Vec3.create(GL.h/2, GL.h/2, GL.h/2));
    const shaders = ['std', 'testShader', 'shaderrr'];
    let iter = 2;

    function loop(){

        if(Loader.resourcesLoaded){
            if(Input.touchStarted(0)){
                iter++;
                if(iter > 2)iter = 0;
                GL.models['testModel1'].shader = shaders[iter];
            }

            ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);
            GL.clear(camMat);

            Mat4.rotateY(modelMat, modelMat, 0.01);
            GL.render('testModel1', modelMat);

            document.querySelector('h1').innerHTML = GL.gl;
        }else{
            ctx.fillStyle = 'green';
            ctx.fillRect(0, 0, canvas2D.width, canvas2D.height);
        }
        
        
        Input.update();

        requestAnimationFrame(loop);
    }
    loop();
}
