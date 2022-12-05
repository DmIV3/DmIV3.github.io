class UMath{

	static PIx2 = Math.PI * 2;
	
    static arrayLoop(array, index){
		return array[(index % array.length + array.length) % array.length];
    }

	static map(val, min, max){
		return (val - min) / (max - min);
	}

    static clamp(val, min, max){
		if(min == max)
		    return min;
		if(val > max)
		    return max;
		if(val < min)
		    return min;
		return val;
	}

    static random(min, max){
		return Math.random()*(max - min)+min;
	}

	static randomInt(min, max){
		return Math.floor(Math.random()*(max - min + 1) + min);
	}

	static randomRGB(){
		return  `rgb(${UMath.randomInt(0, 255)}, ${UMath.randomInt(0, 255)}, ${UMath.randomInt(0, 255)})`;
	}
		
	static distance(x1, y1, x2, y2){
		return Math.sqrt((x2 - x1)**2 + (y2-y1)**2);
	}

	static distanceSq(x1, y1, x2, y2){
		return (x2 - x1)**2 + (y2 - y1)**2;
	}

	static angle(x1, y1, x2, y2){
		return Math.atan2(y2 - y1, x2 - x1);
	}
}