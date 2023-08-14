export const Mat4 = {
    create: function(){
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    },

    perspective: function(out, fovy, aspect, near, far) {
        const f = 1.0 / Math.tan(fovy / 2);
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[15] = 0;
        if (far != null && far !== Infinity) {
          const nf = 1 / (near - far);
          out[10] = (far + near) * nf;
          out[14] = 2 * far * near * nf;
        } else {
          out[10] = -1;
          out[14] = -2 * near;
        }
        return out;
    },

    ortho(out, left, right, bottom, top, near, far) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
    },

    lookAt(out, eye, center, up) {
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        let eyex = eye.x;
        let eyey = eye.y;
        let eyez = eye.z;
        let upx = up.x;
        let upy = up.y;
        let upz = up.z;
        let centerx = center.x;
        let centery = center.y;
        let centerz = center.z;
      
        if (
          Math.abs(eyex - centerx) <= 0 &&
          Math.abs(eyey - centery) <= 0 &&
          Math.abs(eyez - centerz) <= 0
        ) {
          return this.identity(out);
        }
      
        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
      
        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
      
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
          x0 = 0;
          x1 = 0;
          x2 = 0;
        } else {
          len = 1 / len;
          x0 *= len;
          x1 *= len;
          x2 *= len;
        }
      
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
      
        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
          y0 = 0;
          y1 = 0;
          y2 = 0;
        } else {
          len = 1 / len;
          y0 *= len;
          y1 *= len;
          y2 *= len;
        }
      
        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;
        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;
        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;
      
        return out;
    },

    targetTo(out, eye, target, up) {
        let eyex = eye.x,
          eyey = eye.y,
          eyez = eye.z,
          upx = up.x,
          upy = up.y,
          upz = up.z;
      
        let z0 = eyex - target.x,
          z1 = eyey - target.y,
          z2 = eyez - target.z;
      
        let len = z0 * z0 + z1 * z1 + z2 * z2;
        if (len > 0) {
          len = Math.sqrt(len);
          z0 /= len;
          z1 /= len;
          z2 /= len;
        }
      
        let x0 = upy * z2 - upz * z1,
          x1 = upz * z0 - upx * z2,
          x2 = upx * z1 - upy * z0;
      
        len = x0 * x0 + x1 * x1 + x2 * x2;
        if (len > 0) {
          len = Math.sqrt(len);
          x0 /= len;
          x1 /= len;
          x2 /= len;
        }
      
        out[0] = x0;
        out[1] = x1;
        out[2] = x2;
        out[3] = 0;
        out[4] = z1 * x2 - z2 * x1;
        out[5] = z2 * x0 - z0 * x2;
        out[6] = z0 * x1 - z1 * x0;
        out[7] = 0;
        out[8] = z0;
        out[9] = z1;
        out[10] = z2;
        out[11] = 0;
        out[12] = eyex;
        out[13] = eyey;
        out[14] = eyez;
        out[15] = 1;
        return out;
    },

    clone: function(m){
        let out = this.create();

        out[0] = m[0]; out[1] = m[1]; out[2] = m[2]; out[3] = m[3];
        out[4] = m[4]; out[5] = m[5]; out[6] = m[6]; out[7] = m[7];
        out[8] = m[8]; out[9] = m[9]; out[10] = m[10]; out[11] = m[11];
        out[12] = m[12]; out[13] = m[13]; out[14] = m[14]; out[15] = m[15];
        
        return out;
    },

    copy: function(out, m){
        out[0] = m[0]; out[1] = m[1]; out[2] = m[2]; out[3] = m[3];
        out[4] = m[4]; out[5] = m[5]; out[6] = m[6]; out[7] = m[7];
        out[8] = m[8]; out[9] = m[9]; out[10] = m[10]; out[11] = m[11];
        out[12] = m[12]; out[13] = m[13]; out[14] = m[14]; out[15] = m[15];
        
        return out;
    },

    set: function(out, m00,m01,m02,m03,m10,m11,m12,m13,m20,m21,m22,m23,m30,m31,m32,m33){
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m03;
        out[4] = m10;
        out[5] = m11;
        out[6] = m12;
        out[7] = m13;
        out[8] = m20;
        out[9] = m21;
        out[10] = m22;
        out[11] = m23;
        out[12] = m30;
        out[13] = m31;
        out[14] = m32;
        out[15] = m33;
        return out;
    },

    identity: function(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    },

    transpose: function(out, a) {
        if (out === a) {
            let a01 = a[1],
              a02 = a[2],
              a03 = a[3];
            let a12 = a[6],
              a13 = a[7];
            let a23 = a[11];
        
            out[1] = a[4];
            out[2] = a[8];
            out[3] = a[12];
            out[4] = a01;
            out[6] = a[9];
            out[7] = a[13];
            out[8] = a02;
            out[9] = a12;
            out[11] = a[14];
            out[12] = a03;
            out[13] = a13;
            out[14] = a23;
        } else {
            out[0] = a[0];
            out[1] = a[4];
            out[2] = a[8];
            out[3] = a[12];
            out[4] = a[1];
            out[5] = a[5];
            out[6] = a[9];
            out[7] = a[13];
            out[8] = a[2];
            out[9] = a[6];
            out[10] = a[10];
            out[11] = a[14];
            out[12] = a[3];
            out[13] = a[7];
            out[14] = a[11];
            out[15] = a[15];
        }
      
        return out;
    },

    invert: function(out, a) {
        let a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
        let a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
        let a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
        let a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15];
      
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;
      
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
          
        if (!det) {
            return null;
        }

        det = 1.0 / det;
      
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
      
        return out;
    },

    adjoint: function(out, a) {
        let a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
        let a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
        let a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
        let a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15];
      
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;
      
        out[0] = a11 * b11 - a12 * b10 + a13 * b09;
        out[1] = a02 * b10 - a01 * b11 - a03 * b09;
        out[2] = a31 * b05 - a32 * b04 + a33 * b03;
        out[3] = a22 * b04 - a21 * b05 - a23 * b03;
        out[4] = a12 * b08 - a10 * b11 - a13 * b07;
        out[5] = a00 * b11 - a02 * b08 + a03 * b07;
        out[6] = a32 * b02 - a30 * b05 - a33 * b01;
        out[7] = a20 * b05 - a22 * b02 + a23 * b01;
        out[8] = a10 * b10 - a11 * b08 + a13 * b06;
        out[9] = a01 * b08 - a00 * b10 - a03 * b06;
        out[10] = a30 * b04 - a31 * b02 + a33 * b00;
        out[11] = a21 * b02 - a20 * b04 - a23 * b00;
        out[12] = a11 * b07 - a10 * b09 - a12 * b06;
        out[13] = a00 * b09 - a01 * b07 + a02 * b06;
        out[14] = a31 * b01 - a30 * b03 - a32 * b00;
        out[15] = a20 * b03 - a21 * b01 + a22 * b00;
        return out;
    },

    determinant: function(a) {
        let a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
        let a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
        let a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
        let a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15];
      
        let b0 = a00 * a11 - a01 * a10;
        let b1 = a00 * a12 - a02 * a10;
        let b2 = a01 * a12 - a02 * a11;
        let b3 = a20 * a31 - a21 * a30;
        let b4 = a20 * a32 - a22 * a30;
        let b5 = a21 * a32 - a22 * a31;
        let b6 = a00 * b5 - a01 * b4 + a02 * b3;
        let b7 = a10 * b5 - a11 * b4 + a12 * b3;
        let b8 = a20 * b2 - a21 * b1 + a22 * b0;
        let b9 = a30 * b2 - a31 * b1 + a32 * b0;
      
        return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
    },

    multiply: function(out, a, b){
        if(out === a)a = this.clone(a);
        else if(out === b)b = this.clone(b);

        out[0] =  a[0]  * b[0] + a[1]  * b[4] + a[2]  *  b[8]  +  a[3]  * b[12];
        out[1] =  a[0]  * b[1] + a[1]  * b[5] + a[2]  *  b[9]  +  a[3]  * b[13];
        out[2] =  a[0]  * b[2] + a[1]  * b[6] + a[2]  *  b[10] +  a[3]  * b[14];
        out[3] =  a[0]  * b[3] + a[1]  * b[7] + a[2]  *  b[11] +  a[3]  * b[15];
        out[4] =  a[4]  * b[0] + a[5]  * b[4] + a[6]  *  b[8]  +  a[7]  * b[12];
        out[5] =  a[4]  * b[1] + a[5]  * b[5] + a[6]  *  b[9]  +  a[7]  * b[13];
        out[6] =  a[4]  * b[2] + a[5]  * b[6] + a[6]  *  b[10] +  a[7]  * b[14];
        out[7] =  a[4]  * b[3] + a[5]  * b[7] + a[6]  *  b[11] +  a[7]  * b[15];
        out[8] =  a[8]  * b[0] + a[9]  * b[4] + a[10] *  b[8]  +  a[11] * b[12];
        out[9] =  a[8]  * b[1] + a[9]  * b[5] + a[10] *  b[9]  +  a[11] * b[13];
        out[10] = a[8]  * b[2] + a[9]  * b[6] + a[10] *  b[10] +  a[11] * b[14];
        out[11] = a[8]  * b[3] + a[9]  * b[7] + a[10] *  b[11] +  a[11] * b[15];
        out[12] = a[12] * b[0] + a[13] * b[4] + a[14] *  b[8]  +  a[15] * b[12];
        out[13] = a[12] * b[1] + a[13] * b[5] + a[14] *  b[9]  +  a[15] * b[13];
        out[14] = a[12] * b[2] + a[13] * b[6] + a[14] *  b[10] +  a[15] * b[14];
        out[15] = a[12] * b[3] + a[13] * b[7] + a[14] *  b[11] +  a[15] * b[15];

        return out;
    },

    translate: function(out, a, v) {
        if (a !== out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            out[9] = a[9];
            out[10] = a[10];
            out[11] = a[11];
        }
        out[12] = a[0] * v.x + a[4] * v.y + a[8] *  v.z + a[12];
        out[13] = a[1] * v.x + a[5] * v.y + a[9] *  v.z + a[13];
        out[14] = a[2] * v.x + a[6] * v.y + a[10] * v.z + a[14];
        out[15] = a[3] * v.x + a[7] * v.y + a[11] * v.z + a[15];
        return out;
    },

    scale: function(out, a, v) {
        out[0] =  a[0]  * v.x;
        out[1] =  a[1]  * v.x;
        out[2] =  a[2]  * v.x;
        out[3] =  a[3]  * v.x;
        out[4] =  a[4]  * v.y;
        out[5] =  a[5]  * v.y;
        out[6] =  a[6]  * v.y;
        out[7] =  a[7]  * v.y;
        out[8] =  a[8]  * v.z;
        out[9] =  a[9]  * v.z;
        out[10] = a[10] * v.z;
        out[11] = a[11] * v.z;
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
    },

    rotate: function(out, a, rad, axis) {
        let x = axis.x;
        let y = axis.y;
        let z = axis.z;
        let len = x * x + y * y + z * z;
        let s, c, t;
        
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let b00, b01, b02;
        let b10, b11, b12;
        let b20, b21, b22;
      
        if (len <= 0) {
          out = this.clone(a);
          return out;
        }

        len = Math.sqrt(len);

        x /= len;
        y /= len;
        z /= len;
      
        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;
      
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
      
        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c;

        out[0] =  a00 * b00 + a10 * b01 + a20 * b02;
        out[1] =  a01 * b00 + a11 * b01 + a21 * b02;
        out[2] =  a02 * b00 + a12 * b01 + a22 * b02;
        out[3] =  a03 * b00 + a13 * b01 + a23 * b02;
        out[4] =  a00 * b10 + a10 * b11 + a20 * b12;
        out[5] =  a01 * b10 + a11 * b11 + a21 * b12;
        out[6] =  a02 * b10 + a12 * b11 + a22 * b12;
        out[7] =  a03 * b10 + a13 * b11 + a23 * b12;
        out[8] =  a00 * b20 + a10 * b21 + a20 * b22;
        out[9] =  a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;
      
        if (a !== out) {
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }
        return out;
    },

    rotateX: function(out, a, rad) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a10 = a[4];
        let a11 = a[5];
        let a12 = a[6];
        let a13 = a[7];
        let a20 = a[8];
        let a21 = a[9];
        let a22 = a[10];
        let a23 = a[11];
    
        if (a !== out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        out[4] = a10 * c + a20 * s;
        out[5] = a11 * c + a21 * s;
        out[6] = a12 * c + a22 * s;
        out[7] = a13 * c + a23 * s;
        out[8] = a20 * c - a10 * s;
        out[9] = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
        return out;
    },

    rotateY: function(out, a, rad) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a00 = a[0];
        let a01 = a[1];
        let a02 = a[2];
        let a03 = a[3];
        let a20 = a[8];
        let a21 = a[9];
        let a22 = a[10];
        let a23 = a[11];
      
        if (a !== out) {
          out[4] = a[4];
          out[5] = a[5];
          out[6] = a[6];
          out[7] = a[7];
          out[12] = a[12];
          out[13] = a[13];
          out[14] = a[14];
          out[15] = a[15];
        }

        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[2] = a02 * c - a22 * s;
        out[3] = a03 * c - a23 * s;
        out[8] = a00 * s + a20 * c;
        out[9] = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        return out;
    },

    rotateZ: function(out, a, rad) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a00 = a[0];
        let a01 = a[1];
        let a02 = a[2];
        let a03 = a[3];
        let a10 = a[4];
        let a11 = a[5];
        let a12 = a[6];
        let a13 = a[7];
      
        if (a !== out) {
            out[8] = a[8];
            out[9] = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }
        
        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        return out;
    },

    fromTranslation: function(out, v) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = v.x;
        out[13] = v.y;
        out[14] = v.z;
        out[15] = 1;
        return out;
    },

    fromScaling: function(out, v) {
        out[0] = v.x;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = v.y;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = v.z;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    },

    fromRotation: function(out, rad, axis) {
        let x = axis.x,
          y = axis.y,
          z = axis.z;
        let len = x * x + y * y + z * z;
        let s, c, t;
      
        if (len <= 0) {
            out = this.create();
            return out;
        }
      
        len = Math.sqrt(len);
        x /= len;
        y /= len;
        z /= len;
      
        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        out[0] = x * x * t + c;
        out[1] = y * x * t + z * s;
        out[2] = z * x * t - y * s;
        out[3] = 0;
        out[4] = x * y * t - z * s;
        out[5] = y * y * t + c;
        out[6] = z * y * t + x * s;
        out[7] = 0;
        out[8] = x * z * t + y * s;
        out[9] = y * z * t - x * s;
        out[10] = z * z * t + c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    },

    fromXRotation: function(out, rad) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);

        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = c;
        out[6] = s;
        out[7] = 0;
        out[8] = 0;
        out[9] = -s;
        out[10] = c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    },

    fromYRotation: function(out, rad) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
      
        out[0] = c;
        out[1] = 0;
        out[2] = -s;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = s;
        out[9] = 0;
        out[10] = c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    },

    fromZRotation(out, rad) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);

        out[0] = c;
        out[1] = s;
        out[2] = 0;
        out[3] = 0;
        out[4] = -s;
        out[5] = c;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    },

    str: function(m){
        return "Matrix 4x4:\n"+
        m[0] + "  " + m[1] + "  " + m[2] + "  " + m[3] + "\n"+
        m[4] + "  " + m[5] + "  " + m[6] + "  " + m[7] + "\n"+
        m[8] + "  " + m[9] + "  " + m[10] + "  " + m[11] + "\n"+
        m[12] + "  " + m[13] + "  " + m[14] + "  " + m[15];
    }
}


export const Mat3 = {
    create: function(){
        return new Float32Array([
            1, 0, 0, 
            0, 1, 0, 
            0, 0, 1
        ]);
    },

    fromMat4: function(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[4];
        out[4] = a[5];
        out[5] = a[6];
        out[6] = a[8];
        out[7] = a[9];
        out[8] = a[10];
        return out;
    },

    clone: function(m){
        let out = this.create();

        out[0] = m[0];
        out[1] = m[1];
        out[2] = m[2];
        out[3] = m[3];
        out[4] = m[4];
        out[5] = m[5];
        out[6] = m[6];
        out[7] = m[7];
        out[8] = m[8];
        return out;
    },

    copy: function(out, m){
        out[0] = m[0];
        out[1] = m[1];
        out[2] = m[2];
        out[3] = m[3];
        out[4] = m[4];
        out[5] = m[5];
        out[6] = m[6];
        out[7] = m[7];
        out[8] = m[8];
        return out;
    },

    set: function(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m10;
        out[4] = m11;
        out[5] = m12;
        out[6] = m20;
        out[7] = m21;
        out[8] = m22;
        return out;
    },

    identity: function(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 1;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
        return out;
    },

    transpose: function(out, a) {
        if (out === a) {
            let a01 = a[1],
              a02 = a[2],
              a12 = a[5];
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a01;
            out[5] = a[7];
            out[6] = a02;
            out[7] = a12;
        } else {
            out[0] = a[0];
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a[1];
            out[4] = a[4];
            out[5] = a[7];
            out[6] = a[2];
            out[7] = a[5];
            out[8] = a[8];
        }
        return out;
    },

    invert: function(out, a) {
        let a00 = a[0],
            a01 = a[1],
            a02 = a[2];
        let a10 = a[3],
            a11 = a[4],
            a12 = a[5];
        let a20 = a[6],
            a21 = a[7],
            a22 = a[8];

        let b01 = a22 * a11 - a12 * a21;
        let b11 = -a22 * a10 + a12 * a20;
        let b21 = a21 * a10 - a11 * a20;

        let det = a00 * b01 + a01 * b11 + a02 * b21;

        if (det === 0) {
            out = this.create();
            return out;
        }

        out[0] = b01 / det;
        out[1] = (-a22 * a01 + a02 * a21) / det;
        out[2] = (a12 * a01 - a02 * a11) / det;
        out[3] = b11 / det;
        out[4] = (a22 * a00 - a02 * a20) / det;
        out[5] = (-a12 * a00 + a02 * a10) / det;
        out[6] = b21 / det;
        out[7] = (-a21 * a00 + a01 * a20) / det;
        out[8] = (a11 * a00 - a01 * a10) / det;
        return out;
    },

    adjoint: function(out, a) {
        let a00 = a[0],
            a01 = a[1],
            a02 = a[2];
        let a10 = a[3],
            a11 = a[4],
            a12 = a[5];
        let a20 = a[6],
            a21 = a[7],
            a22 = a[8];

        out[0] = a11 * a22 - a12 * a21;
        out[1] = a02 * a21 - a01 * a22;
        out[2] = a01 * a12 - a02 * a11;
        out[3] = a12 * a20 - a10 * a22;
        out[4] = a00 * a22 - a02 * a20;
        out[5] = a02 * a10 - a00 * a12;
        out[6] = a10 * a21 - a11 * a20;
        out[7] = a01 * a20 - a00 * a21;
        out[8] = a00 * a11 - a01 * a10;
        return out;
    },

    determinant: function(a) {
        let a00 = a[0],
            a01 = a[1],
            a02 = a[2];
        let a10 = a[3],
            a11 = a[4],
            a12 = a[5];
        let a20 = a[6],
            a21 = a[7],
            a22 = a[8];
    
        return (a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20));
    },

    multiply: function(out, a, b){
        if(out === a)a = this.clone(a);
        else if(out === b)b = this.clone(b);

        out[0] = b[0] * a[0] + b[1] * a[3] + b[2] * a[6];
        out[1] = b[0] * a[1] + b[1] * a[4] + b[2] * a[7];
        out[2] = b[0] * a[2] + b[1] * a[5] + b[2] * a[8];

        out[3] = b[3] * a[0] + b[4] * a[3] + b[5] * a[6];
        out[4] = b[3] * a[1] + b[4] * a[4] + b[5] * a[7];
        out[5] = b[3] * a[2] + b[4] * a[5] + b[5] * a[8];

        out[6] = b[6] * a[0] + b[7] * a[3] + b[8] * a[6];
        out[7] = b[6] * a[1] + b[7] * a[4] + b[8] * a[7];
        out[8] = b[6] * a[2] + b[7] * a[5] + b[8] * a[8];
        return out;
    },

    translate: function(out, a, v) {
        if (a !== out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];

            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
        }
        out[6] = v.x * a[0] + v.y * a[3] + a[6];
        out[7] = v.x * a[1] + v.y * a[4] + a[7];
        out[8] = v.x * a[2] + v.y * a[5] + a[8];
        return out;
    },

    scale: function(out, a, v) {
        out[0] = v.x * a[0];
        out[1] = v.x * a[1];
        out[2] = v.x * a[2];

        out[3] = v.y * a[3];
        out[4] = v.y * a[4];
        out[5] = v.y * a[5];

        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        return out;
    },

    rotate: function(out, a, rad) {
        let a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a10 = a[3],
        a11 = a[4],
        a12 = a[5],
        a20 = a[6],
        a21 = a[7],
        a22 = a[8],
        s = Math.sin(rad),
        c = Math.cos(rad);

        out[0] = c * a00 + s * a10;
        out[1] = c * a01 + s * a11;
        out[2] = c * a02 + s * a12;

        out[3] = c * a10 - s * a00;
        out[4] = c * a11 - s * a01;
        out[5] = c * a12 - s * a02;

        out[6] = a20;
        out[7] = a21;
        out[8] = a22;
        return out;
    },

    fromTranslation: function(out, v) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 1;
        out[5] = 0;
        out[6] = v.x;
        out[7] = v.y;
        out[8] = 1;
        return out;
    },

    fromScaling: function(out, v) {
        out[0] = v.x;
        out[1] = 0;
        out[2] = 0;

        out[3] = 0;
        out[4] = v.y;
        out[5] = 0;

        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
        return out;
    },

    fromRotation: function(out, rad) {
        let s = Math.sin(rad),
            c = Math.cos(rad);

        out[0] = c;
        out[1] = s;
        out[2] = 0;

        out[3] = -s;
        out[4] = c;
        out[5] = 0;

        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
        return out;
    },

    str: function(m){
        return "Matrix 4x4:\n"+
        m[0] + "  " + m[1] + "  " + m[2] + "  " + m[3] + "\n"+
        m[4] + "  " + m[5] + "  " + m[6] + "  " + m[7] + "\n"+
        m[8] + "  " + m[9] + "  " + m[10] + "  " + m[11] + "\n"+
        m[12] + "  " + m[13] + "  " + m[14] + "  " + m[15];
    }
}