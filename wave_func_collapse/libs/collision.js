export const COLL = {
    pointRect: function(pointX, pointY, rectX, rectY, rectWidht, rectHeigth){
        if(pointX > rectX && pointX < rectX + rectWidht)
			if(pointY > rectY && pointY < rectY + rectHeigth)
				return true;
		return false;
    }
}