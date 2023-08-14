import { Mat4 } from "../maths/matrix.js";
export const GL = {
    init: function(canvas){
        this.canvas = canvas;
        this.w = 0;
        this.h = 0;
        this.frame = new Float32Array([0]);
        this.gl = canvas.getContext('webgl2');

        this.projectionMatrix = Mat4.create();
        window.addEventListener('resize', this.resizeWindow.bind(this), false);
        this.resizeWindow();

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.clearColor(0, 0, 0, 1);

        this.ubo = undefined;
        this.uboVarriables = ['u_View', 'u_Projection', 'u_Frame'];
        this.uboBlockName = 'UBO_Data';

        this.models = {};
        this.shaders = {};
        this.textures = {};
    },

    loadModel: function(name, textureName, shaderName, float32Data){
        if(this.models[name] !== undefined){
            console.error("GL: Model loading fail. Model " + name + " already exists!");
            return;
        }

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, float32Data, this.gl.STATIC_DRAW);

        const vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);

        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 32, 0);
        this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 32, 12);
        this.gl.vertexAttribPointer(2, 2, this.gl.FLOAT, false, 32, 24);

        this.gl.enableVertexAttribArray(0);
        this.gl.enableVertexAttribArray(1);
        this.gl.enableVertexAttribArray(2);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindVertexArray(null);

        this.models[name] = {
            vao: vao,
            buffer: buffer,
            texture: textureName,
            shader: shaderName,
            vCount: float32Data.byteLength / 32
        }
    },

    loadTexture: function(name, img){
        if(this.textures[name] !== undefined){
            console.error("GL: Texture loading fail. Texture " + name + " already exists!");
            return;
        }
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, img.width, img.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);

        this.textures[name] = texture;
    },

    loadShader: function(name, vSource, fSource){
        if(this.shaders[name] !== undefined){
            console.error("GL: Shader loading fail. Shader " + name + " already exists!");
            return;
        }

        const program = this.gl.createProgram();
        const vShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vShader, vSource);
        this.gl.compileShader(vShader);
        this.gl.attachShader(program, vShader);

        const fShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fShader, fSource);
        this.gl.compileShader(fShader);
        this.gl.attachShader(program, fShader);

        this.gl.linkProgram(program);

        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){
            if(this.gl.getShaderInfoLog(vShader) !== ""){
                console.error("Vertext shader problem: ", this.gl.getShaderInfoLog(vShader));
            }
            if(this.gl.getShaderInfoLog(fShader) !== ""){
                console.error("Fragment shader problem: ", this.gl.getShaderInfoLog(fShader));
            }
        }

        this.gl.deleteShader(vShader);
        this.gl.deleteShader(fShader);


        const uboIndex = 0;

        if(this.ubo === undefined){
            this.ubo = {};
            const blockIndex = this.gl.getUniformBlockIndex(program, this.uboBlockName);
            const blockSize = this.gl.getActiveUniformBlockParameter(program, blockIndex, this.gl.UNIFORM_BLOCK_DATA_SIZE);
            const uboVariableNames = this.uboVarriables;

            const uboVariableIndices = this.gl.getUniformIndices(program, uboVariableNames);
            const uboVariableOffsets = this.gl.getActiveUniforms(program, uboVariableIndices, this.gl.UNIFORM_OFFSET);

            const uboVariableInfo = {};

            uboVariableNames.forEach((name, index) => {
                uboVariableInfo[name] = {
                    index: uboVariableIndices[index],
                    offset: uboVariableOffsets[index],
                };
            });

            const uboBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, uboBuffer);
            this.gl.bufferData(this.gl.UNIFORM_BUFFER, blockSize, this.gl.DYNAMIC_DRAW);
            this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);

            this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, uboIndex, uboBuffer);

            this.ubo.buffer = uboBuffer;
            this.ubo.locations = uboVariableInfo;
        }

        this.gl.uniformBlockBinding(program, this.gl.getUniformBlockIndex(program, "UBO_Data"), uboIndex);

        this.shaders[name] = {
            program: program,
            /////////// OLD
            model: this.gl.getUniformLocation(program, 'u_Model'),
            view: this.gl.getUniformLocation(program, 'u_View'),
            proj: this.gl.getUniformLocation(program, 'u_Projection'),
            /////////// NEW
        }
        // console.log(this.shaders[name]);
    },

    deleteModel: function(name){
        if(this.models[name] === undefined){
            console.error("GL: Model deleting fail. Model " + name + " does not exist.");
            return;
        }
        this.gl.deleteVertexArray(this.models[name].vao);
        this.gl.deleteBuffer(this.models[name].buffer);
        this.models[name] = undefined;
        delete this.models[name];
    },

    deleteTexture: function(name){
        if(this.textures[name] === undefined){
            console.error("GL: Texture deleting fail. Texture " + name + " does not exist.");
            return;
        }
        
        this.gl.deleteTexture(this.textures[name]);
        this.textures[name] = undefined;
        delete this.textures[name];
    },

    deleteShader: function(name){
        if(this.shaders[name] === undefined){
            console.error("GL: Shader deleting fail. Shader " + name + " does not exist.");
            return;
        }
        this.gl.deleteProgram(this.shaders[name].program);
        this.shaders[name] = undefined;
        delete this.shaders[name];
    },

    clear: function(cameraMatrix){
        this.frame[0]++;
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.ubo.buffer);
        this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, this.ubo.locations["u_View"].offset, cameraMatrix, 0);
        this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, this.ubo.locations["u_Projection"].offset, this.projectionMatrix, 0);
        this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, this.ubo.locations["u_Frame"].offset, this.frame, 0);
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
    },

    render: function(modelName, modelMatrix){
        const model = this.models[modelName];
        const shader = this.shaders[model.shader];

        this.gl.useProgram(shader.program);
        this.gl.bindVertexArray(model.vao);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[model.texture]);

        this.gl.uniformMatrix4fv(shader.model, false, modelMatrix);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, model.vCount);
    },

    setClearColor: function(r, g, b){
        this.gl.clearColor(r, g, b, 1);
    },

    resizeWindow: function(){
        this.canvas.width = this.w = window.innerWidth;
        this.canvas.height = this.h = window.innerHeight;
        // Mat4.ortho(this.projectionMatrix, -this.canvas.width/2, this.canvas.width/2, -this.canvas.height/2, this.canvas.height/2, -10000, 10000);
        Mat4.perspective(this.projectionMatrix, Math.PI/3, this.w / this.h, 1, 100000);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
}
