export const Vec3 = {
    create: function(x=0, y=0, z=0){
        return new Vector3f(x, y, z);
    },

    clone: function(a) {
        return new Vector3f(a.x, a.y, a.z);
    },

    copy: function(out, a) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        return out;
    },

    zero: function(out) {
        out.x = 0.0;
        out.y = 0.0;
        out.z = 0.0;
        return out;
    },

    len: function(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    },

    sqLen: function(a) {
        return a.x * a.x + a.y * a.y + a.z * a.z;
    },

    set: function(out, x, y, z) {
        out.x = x;
        out.y = y;
        out.z = z;
        return out;
    },

    add: function(out, a, b) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        return out;
    },

    sub: function(out, a, b) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    },

    mul: function(out, a, b) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        return out;
    },
    
    div: function(out, a, b) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        return out;
    },

    ceil: function(out, a) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        out.z = Math.ceil(a.z);
        return out;
    },

    floor: function(out, a) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        out.z = Math.floor(a.z);
        return out;
    },

    round: function(out, a) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        out.z = Math.round(a.z);
        return out;
    },

    min: function(out, a, b) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        out.z = Math.min(a.z, b.z);
        return out;
    },

    max: function(out, a, b) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.z = Math.max(a.z, b.z);
        return out;
    },

    scale: function(out, a, b) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        return out;
    },

    dist: function(a, b) {
        let x = b.x - a.x;
        let y = b.y - a.y;
        let z = b.z - a.z;
        return Math.sqrt(x * x + y * y + z * z);
    },

    sqDist: function(a, b) {
        let x = b.x - a.x;
        let y = b.y - a.y;
        let z = b.z - a.z;
        return x * x + y * y + z * z;
    },

    angle: function(a, b) {
        let mag = Math.sqrt((a.x * a.x + a.y * a.y + a.z * a.z) * (b.x * b.x + b.y * b.y + b.z * b.z));
        let cosine = mag && this.dot(a, b) / mag;
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
    },

    negate: function(out, a) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        return out;
    },

    inverse: function(out, a) {
        out.x = 1 / a.x;
        out.y = 1 / a.y;
        out.z = 1 / a.z;
        return out;
    },

    norm: function(out, a){
        let len = a.x * a.x + a.y * a.y + a.z * a.z;
        if(len === 0){
            out.x = 0;
            out.y = 0;
            out.z = 0;
            return out;
        }
        len = Math.sqrt(len);
        out.x = a.x / len;
        out.y = a.y / len;
        out.z = a.z / len;
        return out;
    },

    dot: function(a, b){
        return a.x * b.x + a.y * b.y + a.z * b.z;
    },

    cross: function(out, a, b) {
        let ax = a.x,
          ay = a.y,
          az = a.z;
        let bx = b.x,
          by = b.y,
          bz = b.z;
      
        out.x = ay * bz - az * by;
        out.y = az * bx - ax * bz;
        out.z = ax * by - ay * bx;
        return out;
    },

    lerp: function(out, a, b, t) {
        let ax = a.x;
        let ay = a.y;
        let az = a.z;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        out.z = az + t * (b.z - az);
        return out;
    },

    slerp: function(out, a, b, t) {
        let angle = Math.acos(Math.min(Math.max(this.dot(a, b), -1), 1));
        let sinTotal = Math.sin(angle);
      
        let ratioA = Math.sin((1 - t) * angle) / sinTotal;
        let ratioB = Math.sin(t * angle) / sinTotal;
        out.x = ratioA * a.x + ratioB * b.x;
        out.y = ratioA * a.y + ratioB * b.y;
        out.z = ratioA * a.z + ratioB * b.z;
      
        return out;
    },

    bezier: function(out, a, b, c, d, t) {
        let inverseFactor = 1 - t;
        let inverseFactorTimesTwo = inverseFactor * inverseFactor;
        let factorTimes2 = t * t;
        let factor1 = inverseFactorTimesTwo * inverseFactor;
        let factor2 = 3 * t * inverseFactorTimesTwo;
        let factor3 = 3 * factorTimes2 * inverseFactor;
        let factor4 = factorTimes2 * t;
        
        out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
        out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
        out.z = a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4;
        
        return out;
    },

    random: function(out, scale) {
        scale = scale === undefined ? 1.0 : scale;
      
        let r = Math.random() * 2.0 * Math.PI;
        let z = Math.random() * 2.0 - 1.0;
        let zScale = Math.sqrt(1.0 - z * z) * scale;
      
        out.x = Math.cos(r) * zScale;
        out.y = Math.sin(r) * zScale;
        out.z = z * scale;
        return out;
    },

    transformMat4: function(out, a, m) {
        let x = a.x,
          y = a.y,
          z = a.z;
        let w = m[3] * x + m[7] * y + m[11] * z + m[15];
        w = w || 1.0;
        out.x = (m[0] * x + m[4] * y + m[8]  * z + m[12]) / w;
        out.y = (m[1] * x + m[5] * y + m[9]  * z + m[13]) / w;
        out.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
        return out;
    },

    transformMat3: function(out, a, m) {
        let x = a.x,
          y = a.y,
          z = a.z;
        out.x = x * m[0] + y * m[3] + z * m[6];
        out.y = x * m[1] + y * m[4] + z * m[7];
        out.z = x * m[2] + y * m[5] + z * m[8];
        return out;
    },

    rotateX: function(out, a, b, rad) {
        let p = this.create(),
          r = this.create();

        p.x = a.x - b.x;
        p.y = a.y - b.y;
        p.z = a.z - b.z;
      
        r.x = p.x;
        r.y = p.y * Math.cos(rad) - p.z * Math.sin(rad);
        r.z = p.y * Math.sin(rad) + p.z * Math.cos(rad);
      
        out.x = r.x + b.x;
        out.y = r.y + b.y;
        out.z = r.z + b.z;
      
        return out;
    },

    rotateY: function(out, a, b, rad) {
        let p = this.create(),
          r = this.create();

        p.x = a.x - b.x;
        p.y = a.y - b.y;
        p.z = a.z - b.z;
      
        r.x = p.z * Math.sin(rad) + p.x * Math.cos(rad);
        r.y = p.y;
        r.z = p.z * Math.cos(rad) - p.x * Math.sin(rad);
      
        out.x = r.x + b.x;
        out.y = r.y + b.y;
        out.z = r.z + b.z;
      
        return out;
    },

    rotateZ: function(out, a, b, rad) {
        let p = this.create(),
          r = this.create();

        p.x = a.x - b.x;
        p.y = a.y - b.y;
        p.z = a.z - b.z;
      
        r.x = p.x * Math.cos(rad) - p.y * Math.sin(rad);
        r.y = p.x * Math.sin(rad) + p.y * Math.cos(rad);
        r.z = p.z;
      
        out.x = r.x + b.x;
        out.y = r.y + b.y;
        out.z = r.z + b.z;
      
        return out;
    }
}

export const Vec2 = {
    create: function(x=0, y=0){
        return new Vector2f(x, y);
    },

    clone: function(a) {
        return new Vector2f(a.x, a.y);
    },

    copy: function(out, a) {
        out.x = a.x;
        out.y = a.y;
        return out;
    },

    zero: function(out) {
        out.x = 0.0;
        out.y = 0.0;
        return out;
    },

    len: function(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    },

    sqLen: function(a) {
        return a.x * a.x + a.y * a.y;
    },

    set: function(out, x, y) {
        out.x = x;
        out.y = y;
        return out;
    },

    add: function(out, a, b) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    },

    sub: function(out, a, b) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    },

    mul: function(out, a, b) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
    },
    
    div: function(out, a, b) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
    },

    ceil: function(out, a) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        return out;
    },

    floor: function(out, a) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        return out;
    },

    round: function(out, a) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        return out;
    },

    min: function(out, a, b) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        return out;
    },

    max: function(out, a, b) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        return out;
    },

    scale: function(out, a, b) {
        out.x = a.x * b;
        out.y = a.y * b;
        return out;
    },

    dist: function(a, b) {
        let x = b.x - a.x;
        let y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    },

    sqDist: function(a, b) {
        let x = b.x - a.x;
        let y = b.y - a.y;
        return x * x + y * y;
    },

    angle: function(a, b) {
        let mag = Math.sqrt((a.x * a.x + a.y * a.y) * (b.x * b.x + b.y * b.y));
        let cosine = mag && (a.x * b.x + a.y * b.y) / mag;
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
    },

    negate: function(out, a) {
        out.x = -a.x;
        out.y = -a.y;
        return out;
    },

    inverse: function(out, a) {
        out.x = 1 / a.x;
        out.y = 1 / a.y;
        return out;
    },

    norm: function(out, a){
        let len = a.x * a.x + a.y * a.y;
        if(len === 0){
            out.x = 0;
            out.y = 0;
            return out;
        }
        len = Math.sqrt(len);
        out.x = a.x / len;
        out.y = a.y / len;
        return out;
    },

    dot: function(a, b){
        return a.x * b.x + a.y * b.y;
    },

    cross: function(out, a, b) {
        out.x = out.y = 0;
        out.z = a.x * b.y - a.y * b.x;
        return out;
    },

    lerp: function(out, a, b, t) {
        let ax = a.x;
        let ay = a.y;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        return out;
    },

    slerp: function(out, a, b, t) {
        let angle = Math.acos(Math.min(Math.max(this.dot(a, b), -1), 1));
        let sinTotal = Math.sin(angle);
      
        let ratioA = Math.sin((1 - t) * angle) / sinTotal;
        let ratioB = Math.sin(t * angle) / sinTotal;
        out.x = ratioA * a.x + ratioB * b.x;
        out.y = ratioA * a.y + ratioB * b.y;
      
        return out;
    },

    bezier: function(out, a, b, c, d, t) {
        let inverseFactor = 1 - t;
        let inverseFactorTimesTwo = inverseFactor * inverseFactor;
        let factorTimes2 = t * t;
        let factor1 = inverseFactorTimesTwo * inverseFactor;
        let factor2 = 3 * t * inverseFactorTimesTwo;
        let factor3 = 3 * factorTimes2 * inverseFactor;
        let factor4 = factorTimes2 * t;
        
        out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
        out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
        
        return out;
    },

    random: function(out, scale) {
        scale = scale === undefined ? 1.0 : scale;
        let r = Math.random() * 2.0 * Math.PI;
        out.x = Math.cos(r) * scale;
        out.y = Math.sin(r) * scale;
        return out;
    },

    transformMat4: function(out, a, m) {
        let x = a.x;
        let y = a.y;
        out.x = m[0] * x + m[4] * y + m[12];
        out.y = m[1] * x + m[5] * y + m[13];
        return out;
    },

    transformMat3: function(out, a, m) {
        let x = a.x,
            y = a.y;
        out.x = m[0] * x + m[3] * y + m[6];
        out.y = m[1] * x + m[4] * y + m[7];
        return out;
    },

    rotate: function(out, a, b, rad) {
        let p = Vec2.create(a.x - b.x, a.y - b.y);

        let sin = Math.sin(rad);
        let cos = Math.cos(rad);

        out.x = p.x * cos - p.y * sin + b.x;
        out.y = p.x * sin + p.y * cos + b.y;

        return out;
    }
}

class Vector3f{
    constructor(x=0, y=0, z=0){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    F32() {
        return new Float32Array([this.x, this.y, this.z]);
    }
    str(){
        return "Vec3("+this.x+", "+this.y+", "+this.z+")";
    }
}

class Vector2f{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }
    F32() {
        return new Float32Array([this.x, this.y]);
    }
    str(){
        return "Vec2("+this.x+", "+this.y+")";
    }
}