class Vec3{
    static create(x=0, y=0, z=0){
        return new Float32Array([
            x, y, z
        ]);
    }

    static copy(v){
        return new Float32Array([
            v[0], v[1], v[2]
        ]);
    }

    static add(a, b) {
        a[0] += b[0];
        a[1] += b[1];
        a[2] += b[2];
    }
      
    static subtract(a, b) {
        a[0] -= b[0];
        a[1] -= b[1];
        a[2] -= b[2];
    }
    static multiply(a, b) {
        a[0] *= b[0];
        a[1] *= b[1];
        a[2] *= b[2];
    }
    static divide(a, b) {
        a[0] /= b[0];
        a[1] /= b[1];
        a[2] /= b[2];
    }
    static scale(a, b) {
        a[0] *= b;
        a[1] *= b;
        a[2] *= b;
    }
    static distance(a, b) {
        let x = b[0] - a[0];
        let y = b[1] - a[1];
        let z = b[2] - a[2];
        return Math.sqrt(x * x + y * y + z * z);
    }
    static squaredDistance(a, b) {
        let x = b[0] - a[0];
        let y = b[1] - a[1];
        let z = b[2] - a[2];
        return x * x + y * y + z * z;
    }
    static length(v){
        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    }
    static squaredLength(v) {
        return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    }

    static negate(v) {
        v[0] = -v[0];
        v[1] = -v[1];
        v[2] = -v[2];
    }
    static inverse(v) {
        v[0] = 1.0 / v[0];
        v[1] = 1.0 / v[1];
        v[2] = 1.0 / v[2];
    }

    static normalize(v){
        let len = Vec3.squaredLength(v);
        if (len === 0) {
            v[0] = 0;
            v[1] = 0;
            v[2] = 0;
            return;
        }
        len = Math.sqrt(len);
        v[0] /= len;
        v[1] /= len;
        v[2] /= len;
    }

    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    static cross(a, b) {
        let ax = a[0],
          ay = a[1],
          az = a[2];
        let bx = b[0],
          by = b[1],
          bz = b[2];
      
        a[0] = ay * bz - az * by;
        a[1] = az * bx - ax * bz;
        a[2] = ax * by - ay * bx;
    }
    static lerp(out, a, b, t) {
        let ax = a[0];
        let ay = a[1];
        let az = a[2];
        out[0] = ax + t * (b[0] - ax);
        out[1] = ay + t * (b[1] - ay);
        out[2] = az + t * (b[2] - az);
        return out;
    }

    static slerp(out, a, b, t) {
        let angle = Math.acos(Math.min(Math.max(dot(a, b), -1), 1));
        let sinTotal = Math.sin(angle);
        
        let ratioA = Math.sin((1 - t) * angle) / sinTotal;
        let ratioB = Math.sin(t * angle) / sinTotal;
        out[0] = ratioA * a[0] + ratioB * b[0];
        out[1] = ratioA * a[1] + ratioB * b[1];
        out[2] = ratioA * a[2] + ratioB * b[2];
    
        return out;
    }

    static rotateX(out, a, b, rad) {
        let p = [],
        r = [];
        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];

        //perform rotation
        r[0] = p[0];
        r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
        r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);

        //translate to correct position
        out[0] = r[0] + b[0];
        out[1] = r[1] + b[1];
        out[2] = r[2] + b[2];

        return out;
    }

    static rotateY(out, a, b, rad) {
        let p = [],
        r = [];
      //Translate point to the origin
      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2];
    
      //perform rotation
      r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
      r[1] = p[1];
      r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
    
      //translate to correct position
      out[0] = r[0] + b[0];
      out[1] = r[1] + b[1];
      out[2] = r[2] + b[2];
    
      return out;
    }

    static rotateZ(out, a, b, rad) {
        let p = [],
        r = [];
      //Translate point to the origin
      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2];
    
      //perform rotation
      r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
      r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
      r[2] = p[2];
    
      //translate to correct position
      out[0] = r[0] + b[0];
      out[1] = r[1] + b[1];
      out[2] = r[2] + b[2];
    
      return out;
    }
}