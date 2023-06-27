class GL{
    static gl;
    static buffer;
    static vertexCount = 0;
    static shaderProgram;
    static uniformLocations = {};
    static attribLocations = {};
    static texture;
    static projMatrix;
    static camera;
    static W = 0;
    static H = 0;
    static viewType = 0;

    static init(canvas, vSource, fSource){
        GL.gl = canvas.getContext('webgl2');
        GL.buffer = GlBuffer.create(GL.gl);
        GL.shaderProgram = GLProgram.create(GL.gl, vSource, fSource);
        GL.gl.useProgram(GL.shaderProgram);
        GLProgram.getUniformLocations(GL.gl, GL.uniformLocations, GL.shaderProgram);
        GLProgram.getAttributeLocations(GL.gl, GL.attribLocations, GL.shaderProgram);
        GL.texture = GLTexure.create(GL.gl);

        GL.camera = new Camera();

        GL.gl.enable(GL.gl.BLEND);
        GL.gl.blendFunc(GL.gl.SRC_ALPHA, GL.gl.ONE_MINUS_SRC_ALPHA);
        GL.gl.pixelStorei(GL.gl.UNPACK_FLIP_Y_WEBGL, true);
        GL.gl.enable(GL.gl.CULL_FACE);
        GL.gl.cullFace(GL.gl.BACK);
        GL.gl.enable(GL.gl.DEPTH_TEST);
        GL.gl.clearColor(0, 0.25, 0.53, 1);

        GL.model = Mat4.create();
    }

    static clear(){
        GL.gl.clear(GL.gl.COLOR_BUFFER_BIT);
    }

    static render(){
        GL.gl.uniformMatrix4fv(GL.uniformLocations.u_Model, false, GL.model);
        GL.gl.uniformMatrix4fv(GL.uniformLocations.u_View, false, GL.camera.matrix);
        GL.gl.uniformMatrix4fv(GL.uniformLocations.u_Projection, false, GL.projMatrix);

        GL.gl.drawArrays(GL.gl.TRIANGLES, 0, GL.vertexCount);
    }

    static setBuffer(data){
        GL.vertexCount = data.byteLength / 32;
        GL.setCamera(data);
        GlBuffer.putData(GL.gl, GL.buffer, data);
    }

    static setTexture(img){
        GLTexure.putData(GL.gl, GL.texture, img);
    }

    static setCamera(data){
        const arr = new Float32Array(data);
        let max = -Infinity;

        let summX = 0, summY = 0;

        for (let i = 0; i < arr.length; i+=8) {
            if(Math.abs(arr[i]) > max)
                max = Math.abs(arr[i]);
            if(Math.abs(arr[i+1]) > max)
                max = Math.abs(arr[i+1]);
            if(Math.abs(arr[i+2]) > max)
                max = Math.abs(arr[i+2]);

            summX += arr[i];
            summY += arr[i+1];
        }
        GL.camera.setX(summX / (arr.length / 8));
        GL.camera.setY(-summY / (arr.length / 8));
        GL.camera.setZ(-max-2);
    }

    static resize(width, height){
        GL.W = width;
        GL.H = height;
        GL.gl.viewport(0, 0, width, height);
        GL.setView(GL.viewType);
    }

    static setView(veiwType){
        GL.viewType = veiwType;
        let aspectRatio = GL.W / GL.H;
        if(veiwType === 0){
            GL.projMatrix = Mat4.perspective(0.471239, aspectRatio, 0.1, 200);
        }else{
            GL.projMatrix = Mat4.orthographic(-aspectRatio, aspectRatio, -1, 1, 0, 1000);
        }
    }
}