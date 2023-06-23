class Shader{

    constructor(vSource, fSource){
        this.create(vSource, fSource);
    }

    use(){
        gl.useProgram(this.program)
    }

    create(vSource, fSource){
        this.program = gl.createProgram();
        this.vertex = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertex, vSource);
        gl.compileShader(this.vertex);
        gl.attachShader(this.program, this.vertex);

        this.fragment = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragment, fSource);
        gl.compileShader(this.fragment);
        gl.attachShader(this.program, this.fragment);

        gl.linkProgram(this.program);

        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
            console.error("Vertext shader problem: ", gl.getShaderInfoLog(this.vertex));
            console.error("Fragment shader problem: ", gl.getShaderInfoLog(this.fragment));
        }
    }
}

