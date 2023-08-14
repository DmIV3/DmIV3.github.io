export const STDShader = {
    vert:
`void main(){
    v_TexCoord = a_TexCoord;
    vec3 correctedNormal = normalize(mat3(u_Model) * a_Normal);
    v_Brightness = max(dot(LigthDirection, correctedNormal), 0.0);
    gl_Position = u_Projection * u_View * u_Model * vec4(a_Pos, 1.0);
}`,
    frag:
 `void main(){
    vec4 color = texture(u_Sampler, v_TexCoord);
    fragColor = (color * 0.2) + (color * v_Brightness * 0.8);
    fragColor.a = color.a;
}`
};