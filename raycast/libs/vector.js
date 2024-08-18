export const Vec = {
    create: function(x=0, y=0){
        return {x: x, y: y};
    },
    random: function(scale=1){
        let r = Math.random() * M.TWO_PI;
        return {x: Math.cos(r) * scale, y: Math.sin(r) * scale};
    },
    fromAngle: function(rad){
        return {x: Math.cos(rad), y: Math.sin(rad)};
    },
    fromVector: function(a){
        return {x: a.x, y: a.y}
    },
    copy: function(a, b){
        a.x = b.x;
        a.y = b.y;
    },
    add: function(a, b){
        a.x += b.x;
        a.y += b.y;
    },
    sub: function(a, b){
        a.x -= b.x;
        a.y -= b.y;
    },
    mul: function(a, b){
        a.x *= b.x;
        a.y *= b.y;
    },
    div: function(a, b){
        a.x /= b.x;
        a.y /= b.y;
    },
    scale: function(a, s){
        a.x *= s;
        a.y *= s;
    },
    rotate: function(a, rad){
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);
        let x = a.x * cos - a.y * sin;
        let y = a.x * sin + a.y * cos;
        a.x = x;
        a.y = y;
    },
    setRotation: function(a, rad){
        let l = this.len(a);
        a.x = Math.cos(rad) * l;
        a.y = Math.sin(rad) * l;
    },
    setLength: function(a, l){
        let rad = this.angle(a);
        a.x = Math.cos(rad) * l;
        a.y = Math.sin(rad) * l;
    },
    setLengthAndRotation: function(a, l, rad){
        a.x = Math.cos(rad) * l;
        a.y = Math.sin(rad) * l;
    },
    angle: function(a){
        return Math.atan2(a.y, a.x);
    },
    len: function(a){
        return Math.sqrt(a.x * a.x + a.y * a.y);
    },
    lenSq: function(a){
        return a.x * a.x + a.y * a.y;
    },
    dot: function(a, b){
        return a.x * b.x + a.y * b.y;
    },
    cross: function(a, b){
        return a.x * b.y - a.y * b.x;
    },
    normalize: function(a){
        if(a.x == 0 && a.y == 0) return;
        let l = this.len(a);
        a.x /= l;
        a.y /= l;
    },
    normal: function(v){
        return {x: -v.y, y: v.x}
    },
    lerp: function(startPoint, endPoint, a, t){
        a.x = startPoint.x + t * (endPoint.x - startPoint.x);
        a.y = startPoint.y + t * (endPoint.y - startPoint.y);
    }
}