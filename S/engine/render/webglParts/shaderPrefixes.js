export const PrefVert =
`#version 300 es
precision mediump float;


layout(location=0) in vec3 a_Pos;
layout(location=1) in vec3 a_Normal;
layout(location=2) in vec2 a_TexCoord;

uniform UBO_Data {
    mat4 u_View;
    mat4 u_Projection;
    float u_Frame;
};

uniform mat4 u_Model;

vec3 LigthDirection = vec3(-1, 0, 1);

out float v_Brightness;
out vec2 v_TexCoord;

`;

export const PrefFrag = 
`#version 300 es
precision mediump float;
precision mediump sampler2D;

uniform sampler2D u_Sampler;

in float v_Brightness;
in vec2 v_TexCoord;

out vec4 fragColor;

`;