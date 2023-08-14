export const SHADERS = {
    testShader: {
        vert:
        `
        void main(){
            v_TexCoord = a_TexCoord;
            vec3 correctedNormal = normalize(mat3(u_Model) * a_Normal);
            v_Brightness = max(dot(LigthDirection, correctedNormal), 0.0);
            gl_Position = u_Projection * u_View * u_Model * vec4(a_Pos, 1.0);
        }`,
        frag:
         `
         float br(float c){
            float res;
            if(c >= 0.66){
                res = 0.83;
            }else if(c < 0.66 && c >= 0.33){
                res = 0.5;
            }else{
                res = 0.0;
            }
            return res;
        }

        void main(){
            vec4 color = texture(u_Sampler, v_TexCoord);
            fragColor = color * v_Brightness;
            fragColor.r = br(fragColor.r);
            fragColor.g = br(fragColor.g);
            fragColor.b = br(fragColor.b);
            fragColor.a = color.a;
        }
        
        `
    },
    shaderrr: {
        vert:
        `
        out float v_Frame;
        out vec3 v_CorrectedNormal;
        void main(){
            v_Frame = u_Frame;
            v_TexCoord = a_TexCoord;
            v_CorrectedNormal = normalize(mat3(u_Model) * a_Normal);
            v_Brightness = max(dot(LigthDirection, v_CorrectedNormal), 0.0);
            gl_Position = u_Projection * u_View * u_Model * vec4(a_Pos, 1.0);
        }`,
        frag:
         `
        in float v_Frame;
        in vec3 v_CorrectedNormal;

        void main(){
            vec4 col = vec4(0, 0, 0, 1);
            float dp = max(0., dot(v_CorrectedNormal, vec3(0, 0, 1)));
            col.rgb += (1.-dp) / 2.;
            fragColor = col;
        }
        
        `
    }
}