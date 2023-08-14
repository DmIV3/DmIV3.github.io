import { MODELS } from "../../assets/graphics/models.js";
import { SHADERS } from "../../assets/graphics/shaders.js";
import { SPRITES } from "../../assets/graphics/sprites.js";
import { TEXTURES } from "../../assets/graphics/textures.js";
import { PrefVert, PrefFrag } from "../render/webglParts/shaderPrefixes.js";
import { STDShader} from "../render/webglParts/stdshader.js";

export const Loader = {

    init: function(gl){
        this.gl = gl;
        this.resourcesLoaded = false;
        this.loadingImages = {};
        this.loadingModels = {};
        this.loadingSprites = {};

        this.gl.loadShader('std', PrefVert+STDShader.vert, PrefFrag+STDShader.frag);
    },

    

    loadImage: function(name, path) {
        this.resourcesLoaded = false;
        const img = document.createElement('img');
        img.src = path;
        this.loadingImages[name] = false;

        img.onload = ()=>{
            this.loadingImages[name] = true;
            this.gl.loadTexture(name, img);

            this.loadSpriteModels(name, img.width, img.height);

            this.checkResourceLoadingStatus();
        }
    },

    loadImages: function(imagesArray){
        this.delUnusedTextures(imagesArray);
        this.delLoadedTexturesFromList(imagesArray);

        for (let imgName of imagesArray) {
            if(TEXTURES[imgName] !== undefined){
                this.loadImage(imgName, 'assets/images/'+TEXTURES[imgName]);
            }
        }
    },

    loadSprites: function(spritesArray){
        this.delUnusedModels(spritesArray);
        this.delLoadedModelsFromList(spritesArray);
        
        for (let name of spritesArray) {
            if(SPRITES[name] !== undefined){
                this.loadingSprites[name] = SPRITES[name];
            }
        }
    },

    loadSpriteModels: function(imgName, imgWidth, imgHeight){
        for (const name in this.loadingSprites) {
            const sprite = this.loadingSprites[name];
            if(sprite.imgName === imgName){
                const [hPad, vPad] = [0.2 / imgWidth, 0.2 / imgHeight];
                const [w, h] = [sprite.w / imgWidth, sprite.h / imgHeight];
                const [u, v] = [sprite.x / imgWidth, 1 - (sprite.y / imgHeight + h)];
                
                const data = new Float32Array([
                    -0.5,  0.5, 0,    0, 0, 1,   u+hPad,   v+h-vPad, 
                    -0.5, -0.5, 0,    0, 0, 1,   u+hPad,   v+vPad, 
                     0.5,  0.5, 0,    0, 0, 1,   u+w-hPad, v+h-vPad, 
                     0.5,  0.5, 0,    0, 0, 1,   u+w-hPad, v+h-vPad, 
                    -0.5, -0.5, 0,    0, 0, 1,   u+hPad,   v+vPad, 
                     0.5, -0.5, 0,    0, 0, 1,   u+w-hPad, v+vPad, 
                ]);
                this.gl.loadModel(name, imgName, sprite.shaderName, data);

                delete this.loadingSprites[name];
            }
        }
    },

    loadShader: function(name, vSource, fSource){
        this.gl.loadShader(name, vSource, fSource);
    },

    loadShaders: function(shadersArray){
        this.delUnusedShaders(shadersArray);
        this.delLoadedShadersFromList(shadersArray);
        
        for (let name of shadersArray) {
            if(SHADERS[name] !== undefined){
                this.loadShader(name, PrefVert+SHADERS[name].vert, PrefFrag+SHADERS[name].frag);
            }
        }
    },

    loadModel: function(name, imgName, shaderName, path){
        this.resourcesLoaded = false;
        this.loadingModels[name] = false;

        let xhttp = new XMLHttpRequest();
        xhttp.responseType = 'arraybuffer';
        xhttp.onreadystatechange = ()=> {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                this.loadingModels[name] = true;
                this.gl.loadModel(name, imgName, shaderName, xhttp.response);
                this.checkResourceLoadingStatus();
            }
        };
        xhttp.open("GET", path, true);
        xhttp.send();
    },

    loadModels: function(modelsArray){
        this.delUnusedModels(modelsArray);
        this.delLoadedModelsFromList(modelsArray);

        for (let name of modelsArray) {
            if(MODELS[name] !== undefined){
                this.loadModel(name, MODELS[name].imgName, MODELS[name].shaderName, 'assets/models/'+MODELS[name].file);
            }
        }
    },

    delLoadedModelsFromList: function(modelsArray){
        for (let i = modelsArray.length-1; i >= 0; --i) {
            const name = modelsArray[i];
            if(this.gl.models[name] !== undefined){
                modelsArray.splice(i, 1);
            }
        }
    },

    delUnusedModels: function(modelsArray){
        const unsued = [];

        for (const name in this.gl.models) {
            if(!modelsArray.includes(name)){
                unsued.push(name);
            }
        }

        for (const m of unsued) {
            this.gl.deleteModel(m);
        }
    },

    delLoadedTexturesFromList: function(imagesArray){
        for (let i = imagesArray.length-1; i >= 0; --i) {
            const imgName = imagesArray[i];
            if(this.gl.textures[imgName] !== undefined){
                imagesArray.splice(i, 1);
            }
        }
    },

    delUnusedTextures: function(imagesArray){
        const unsued = [];

        for (const name in this.gl.textures) {
            if(!imagesArray.includes(name)){
                unsued.push(name);
            }
        }

        for (const t of unsued) {
            this.gl.deleteTexture(t);
        }
    },

    delLoadedShadersFromList: function(shadersArray){
        for (let i = shadersArray.length-1; i >= 0; --i) {
            const name = shadersArray[i];
            if(this.gl.shaders[name] !== undefined){
                shadersArray.splice(i, 1);
            }
        }
    },

    delUnusedShaders: function(shadersArray){
        const unsued = [];

        for (const name in this.gl.shaders) {
            if(name !== 'std' && !shadersArray.includes(name)){
                unsued.push(name);
            }
        }

        for (const s of unsued) {
            this.gl.deleteShader(s);
        }
    },

    checkResourceLoadingStatus: function(){
        for (const name in this.loadingImages) {
            if(!this.loadingImages[name])
                return;
        }

        for(const name in this.loadingModels){
            if(!this.loadingModels[name])
                return;
        }
        

        this.resourcesLoaded = true;
    }
}