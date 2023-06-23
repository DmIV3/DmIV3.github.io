class GLProgram{
    static create(gl, vSource, fSource){
        const program = gl.createProgram();
        const vShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, vSource);
        gl.compileShader(vShader);
        gl.attachShader(program, vShader);

        const fShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fShader, fSource);
        gl.compileShader(fShader);
        gl.attachShader(program, fShader);

        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            if(gl.getShaderInfoLog(vShader) !== ''){
                console.error("Vertext shader problem: ", gl.getShaderInfoLog(vShader));
            }
            if(gl.getShaderInfoLog(fShader) !== ''){
                console.error("Fragment shader problem: ", gl.getShaderInfoLog(fShader));
            }
        }

        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        return program;
    }

    static getUniformLocations(gl, uniformLocations, program){
        let count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < count; i++) {
            let info = gl.getActiveUniform(program, i);
            if(!info)
                break;
            uniformLocations[info.name] = gl.getUniformLocation(program, info.name);
        }
    }

    static getAttributeLocations(gl, attribLocations, program){
        let count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < count; i++) {
            let info = gl.getActiveAttrib(program, i);
            if(!info)
                break;
            attribLocations[info.name] = gl.getAttribLocation(program, info.name);
        }
    }
}