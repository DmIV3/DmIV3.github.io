const VSOURCE = 
`   #version 300 es
    precision mediump float;


    layout(location=0) in vec3 a_Pos;
    layout(location=1) in vec3 a_Normal;
    layout(location=2) in vec2 a_TexCoord;

    uniform mat4 u_Model;
    uniform mat4 u_View;
    uniform mat4 u_Projection;
    vec3 LigthDirection = vec3(-1, 1, 1);

    out float v_Brightness;
    out vec2 v_TexCoord;

    void main(){
        v_TexCoord = a_TexCoord;
        vec3 correctedNormal = normalize(mat3(u_Model) * a_Normal);
        v_Brightness = max(dot(LigthDirection, correctedNormal), 0.0);
        gl_Position = u_Projection * u_View * u_Model * vec4(a_Pos, 1.0);  
    }
`;

const FSOURCE = 
`   #version 300 es
    precision mediump float;

    uniform sampler2D u_Sampler;

    in float v_Brightness;
    in vec2 v_TexCoord;

    out vec4 fragColor;

    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);

    void main(){
        color = texture(u_Sampler, v_TexCoord);
        fragColor = (color * .2) + (color * v_Brightness * .8);
        fragColor.a = 1.0;
    }
`;