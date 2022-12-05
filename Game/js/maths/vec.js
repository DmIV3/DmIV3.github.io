class V2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Vec{
    static zero(){
        return new V2(0, 0);
    }

    static v2(x, y){
        return new V2(x, y);
    }

    static copy(vec){
        return new V2(vec.x, vec.y);
    }

    static magnitude(vec){
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    }

    static angle(vec){
        return Math.atan2(vec.y, vec.x);
    }

    static angleVecToVec(vec1, vec2){
        let den = Vec.magnitude(vec1) * Vec.magnitude(vec2);
        if(den == 0)return 0;
        let dls = Vec.dot(vec1, vec2) / den;
		if (dls < -1) dls = -1;
        else if (dls > 1) dls = 1;
		return Math.acos(dls);
    }

    static negate(vec) {
        vec.x = -vec.x;
        vec.y = -vec.y;
	}

    static add(vec, vec2){
        vec.x = vec.x + vec2.x;
        vec.y = vec.y + vec2.y;
    }

    static substract(vec, vec2){
        vec.x = vec.x - vec2.x;
        vec.y = vec.y - vec2.y;
    }

    static addN(vec, vec2){
        return new V2(vec.x + vec2.x, vec.y + vec2.y);
    }

    static substractN(vec, vec2){
        return new V2(vec.x - vec2.x, vec.y - vec2.y);
    }

    static multiply(vec, val){
        vec.x = vec.x * val;
        vec.y = vec.y * val;
    }

    static divide(vec, val){
        vec.x = vec.x / val;
        vec.y = vec.y / val;
    }

    static multiplyN(vec, val){
        return new V2(vec.x * val, vec.y * val);
    }

    static divideN(vec, val){
        return new V2(vec.x / val, vec.y / val);
    }

    static unit(vec){
        let len = Vec.magnitude(vec);
        if(len != 0){
            vec.x = vec.x / len;
            vec.y = vec.y / len;
        }else{
            vec.x = 0;
            vec.y = 0;
        }
    }

    static unitN(vec){
        let len = Vec.magnitude(vec);
        if(len != 0){
            return new V2(vec.x / len, vec.y / len);
        }else{
            return new V2(0, 0);
        }
    }

    static dot(vec1, vec2){
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }

    static cross(vec1, vec2){
		return vec1.x * vec2.y - vec1.y * vec2.x;
	}

    static normal(vec){
        return new V2(-vec.y, vec.x);
    }

    static transform(vec, translateX, translateY, angle){
        let output = Vec.v2(0, 0);
		output.x = (Math.cos(angle) * vec.x - Math.sin(angle) * vec.y) + translateX;
		output.y = (Math.sin(angle) * vec.x + Math.cos(angle) * vec.y) + translateY;
        return output;
	}

    static translate(vec, x, y){
        vec.x = vec.x + x;
        vec.y = vec.y + y;
    }

    static setMagnitude(vec, mag){
        let angle = Vec.angle(vec);
        vec.x = mag * Math.cos(angle);
        vec.y = mag * Math.sin(angle);
    }

    static setAngle(vec, angle){
        let mag = Vec.magnitude(vec);
        vec.x = mag * Math.cos(angle);
        vec.y = mag * Math.sin(angle);
    }

    static lerp(vec1, vec2, t){
        let output = new V2(0, 0);
        if(t <= 0){
            output.x = vec1.x;
            output.y = vec1.y;
        }else if(t >= 1){
            output.x = vec2.x;
            output.y = vec2.y;
        }else{
            output.x = (1 - t) * vec1.x + t * vec2.x;
            output.y = (1 - t) * vec1.y + t * vec2.y;
        }
        return output;
    }
}