class Mat4{
    static EPSILON = 0.000001;
    static create(data=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){
        return new Float32Array(data);
    }

    static lookAt(pos, targetPos, upDir){
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        let out = Mat4.create();
        let eyex = pos[0];
        let eyey = pos[1];
        let eyez = pos[2];
        let upx = upDir[0];
        let upy = upDir[1];
        let upz = upDir[2];
        let centerx = targetPos[0];
        let centery = targetPos[1];
        let centerz = targetPos[2];

        if (
            Math.abs(eyex - centerx) < Mat4.EPSILON &&
            Math.abs(eyey - centery) < Mat4.EPSILON &&
            Math.abs(eyez - centerz) < Mat4.EPSILON
          ) {
            return out;
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
    }

    static perspective(fovy, aspect, near, far){
        let out = Mat4.create();
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
    }

    static orthographic(left, right, bottom, top, near, far){
        let out = Mat4.create();
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
    }

    static frustum(left, right, bottom, top, near, far) {
        let out = Mat4.create();
        let rl = 1 / (right - left);
        let tb = 1 / (top - bottom);
        let nf = 1 / (near - far);
        out[0] = near * 2 * rl;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = near * 2 * tb;
        out[6] = 0;
        out[7] = 0;
        out[8] = (right + left) * rl;
        out[9] = (top + bottom) * tb;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = far * near * 2 * nf;
        out[15] = 0;
        return out;
    }

    static identity(m){
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = 1;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = 1;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
    }

    static copy(m){
        return new Float32Array([
            m[0], m[1], m[2], m[3],
            m[4], m[5], m[6], m[7],
            m[8], m[9], m[10], m[11],
            m[12], m[13], m[14], m[15]
        ]);
    }

    static translation(x, y, z){
        let m = Mat4.create();
        m[12] = x;
        m[13] = y;
        m[14] = z;
        return m;
    }

    static rotationX(angle){
        let m = Mat4.create();
        m[5] = Math.cos(angle);
        m[6] = Math.sin(angle);
        m[9] = -Math.sin(angle);
        m[10] = Math.cos(angle);
        return m;
    }

    static rotationY(angle){
        let m = Mat4.create();
        m[0] = Math.cos(angle);
        m[2] = -Math.sin(angle);
        m[8] = Math.sin(angle);
        m[10] = Math.cos(angle);
        return m;
    }

    static rotationZ(angle){
        let m = Mat4.create();
        m[0] = Math.cos(angle);
        m[1] = Math.sin(angle);
        m[4] = -Math.sin(angle);
        m[5] = Math.cos(angle);
        return m;
    }

    static rotation(x, y, z){
        let rx = Mat4.rotationX(x);
        let ry = Mat4.rotationY(y);
        let rz = Mat4.rotationZ(z);
        Mat4.multiply(rz, ry)
        Mat4.multiply(rz, rx);
        return rz;
    }

    static scalation(x, y, z){
        let m = Mat4.create();
        m[0] *= x;
        m[1] *= x;
        m[2] *= x;
        m[3] *= x;
        m[4] *= y;
        m[5] *= y;
        m[6] *= y;
        m[7] *= y;
        m[8] *= z;
        m[9] *= z;
        m[10] *= z;
        m[11] *= z;
        return m;
    }

    static setScale(m, x, y, z){
        m[0] = x;
        m[5] = y;
        m[10] = z;
    }

    static translate(m, x, y, z){
        m[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
        m[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
        m[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
        m[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
    }

    static rotateX(m, angle){
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        let a10 = m[4];
        let a11 = m[5];
        let a12 = m[6];
        let a13 = m[7];
        let a20 = m[8];
        let a21 = m[9];
        let a22 = m[10];
        let a23 = m[11];

        m[4] = a10 * c + a20 * s;
        m[5] = a11 * c + a21 * s;
        m[6] = a12 * c + a22 * s;
        m[7] = a13 * c + a23 * s;
        m[8] = a20 * c - a10 * s;
        m[9] = a21 * c - a11 * s;
        m[10] = a22 * c - a12 * s;
        m[11] = a23 * c - a13 * s;
    }

    static rotateY(m, angle){
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        let a00 = m[0];
        let a01 = m[1];
        let a02 = m[2];
        let a03 = m[3];
        let a20 = m[8];
        let a21 = m[9];
        let a22 = m[10];
        let a23 = m[11];

        m[0] = a00 * c - a20 * s;
        m[1] = a01 * c - a21 * s;
        m[2] = a02 * c - a22 * s;
        m[3] = a03 * c - a23 * s;
        m[8] = a00 * s + a20 * c;
        m[9] = a01 * s + a21 * c;
        m[10] = a02 * s + a22 * c;
        m[11] = a03 * s + a23 * c;
    }

    static rotateZ(m, angle){
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        let a00 = m[0];
        let a01 = m[1];
        let a02 = m[2];
        let a03 = m[3];
        let a10 = m[4];
        let a11 = m[5];
        let a12 = m[6];
        let a13 = m[7];

        m[0] = a00 * c + a10 * s;
        m[1] = a01 * c + a11 * s;
        m[2] = a02 * c + a12 * s;
        m[3] = a03 * c + a13 * s;
        m[4] = a10 * c - a00 * s;
        m[5] = a11 * c - a01 * s;
        m[6] = a12 * c - a02 * s;
        m[7] = a13 * c - a03 * s;
    }

    static rotate(m, x, y, z){
        Mat4.rotateX(m, x);
        Mat4.rotateY(m, y);
        Mat4.rotateZ(m, z);
    }

    static scale(m, x, y, z){
        m[0] *= x;
        m[1] *= x;
        m[2] *= x;
        m[3] *= x;
        m[4] *= y;
        m[5] *= y;
        m[6] *= y;
        m[7] *= y;
        m[8] *= z;
        m[9] *= z;
        m[10] *= z;
        m[11] *= z;
    }

    static multiply(m1, m2){
        let m = Mat4.copy(m1);
        m1[0] =  m[0]*m2[0] +  m[1]*m2[4] +  m[2]*m2[8]  +  m[3]*m2[12];
        m1[1] =  m[0]*m2[1] +  m[1]*m2[5] +  m[2]*m2[9]  +  m[3]*m2[13];
        m1[2] =  m[0]*m2[2] +  m[1]*m2[6] +  m[2]*m2[10] +  m[3]*m2[14];
        m1[3] =  m[0]*m2[3] +  m[1]*m2[7] +  m[2]*m2[11] +  m[3]*m2[15];
        m1[4] =  m[4]*m2[0] +  m[5]*m2[4] +  m[6]*m2[8]  +  m[7]*m2[12];
        m1[5] =  m[4]*m2[1] +  m[5]*m2[5] +  m[6]*m2[9]  +  m[7]*m2[13];
        m1[6] =  m[4]*m2[2] +  m[5]*m2[6] +  m[6]*m2[10] +  m[7]*m2[14];
        m1[7] =  m[4]*m2[3] +  m[5]*m2[7] +  m[6]*m2[11] +  m[7]*m2[15];
        m1[8] =  m[8]*m2[0] +  m[9]*m2[4] +  m[10]*m2[8] +  m[11]*m2[12];
        m1[9] =  m[8]*m2[1] +  m[9]*m2[5] +  m[10]*m2[9] +  m[11]*m2[13];
        m1[10] = m[8]*m2[2] +  m[9]*m2[6] +  m[10]*m2[10] + m[11]*m2[14];
        m1[11] = m[8]*m2[3] +  m[9]*m2[7] +  m[10]*m2[11] + m[11]*m2[15];
        m1[12] = m[12]*m2[0] + m[13]*m2[4] + m[14]*m2[8]  + m[15]*m2[12];
        m1[13] = m[12]*m2[1] + m[13]*m2[5] + m[14]*m2[9]  + m[15]*m2[13];
        m1[14] = m[12]*m2[2] + m[13]*m2[6] + m[14]*m2[10] + m[15]*m2[14];
        m1[15] = m[12]*m2[3] + m[13]*m2[7] + m[14]*m2[11] + m[15]*m2[15];
    }

    static toString(m){
        return `
------ Matrix 4 x 4 ------
${m[0].toFixed(3)}  ${m[1].toFixed(3)}  ${m[2].toFixed(3)}  ${m[3].toFixed(3)}
${m[4].toFixed(3)}  ${m[5].toFixed(3)}  ${m[6].toFixed(3)}  ${m[7].toFixed(3)}
${m[8].toFixed(3)}  ${m[9].toFixed(3)}  ${m[10].toFixed(3)}  ${m[11].toFixed(3)}
${m[12].toFixed(3)}  ${m[13].toFixed(3)}  ${m[14].toFixed(3)}  ${m[15].toFixed(3)}
`
    }
}