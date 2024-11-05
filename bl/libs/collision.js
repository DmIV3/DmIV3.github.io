export const COLL = {
    pointRect: function(pointX, pointY, rectX, rectY, rectWidht, rectHeigth){
        if(pointX > rectX && pointX < rectX + rectWidht)
			if(pointY > rectY && pointY < rectY + rectHeigth)
				return true;
		return false;
    },

    pointCircle: function(pointX, pointY, circleX, circleY, circleRadius){
        return Math.sqrt(Math.pow(pointX - circleX, 2) + Math.pow(pointY - circleY, 2)) < circleRadius;
    },

    circleCircle: function(c1X, c1Y, c1Radius, c2X, c2Y, c2Radius){
        return Math.sqrt(Math.pow(c1X - c2X, 2) + Math.pow(c1Y - c2Y, 2)) < c1Radius + c2Radius;
    },

    cirleRect: function(circleX, circleY, circleRadius, rectX, rectY, rectWidth, rectHeigth){
		let closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
		let closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeigth));
		let distanceX = closestX - circleX;
		let distanceY = closestY - circleY;
		return (distanceX * distanceX + distanceY * distanceY) <= circleRadius * circleRadius;
    },

    circlesPenetrationResolve: function(circle1, circle2){
        let directionX = circle1.x - circle2.x;
        let directionY = circle1.y - circle2.y;

        if(directionX === 0 && directionY === 0){
            directionX = Math.random() * 2 - 1;
            directionY = Math.random() * 2 - 1;
        }

        let distance = Math.sqrt(directionX * directionX + directionY * directionY);
        let overlap = (circle1.radius + circle2.radius - distance) / 2;

        directionX /= distance;
        directionY /= distance;
        directionX *= overlap;
        directionY *= overlap;

        circle1.x += directionX;
        circle1.y += directionY;
        circle2.x -= directionX;
        circle2.y -= directionY;
    },

    circlesResponce(circle1, circle2){
        let normalX = circle2.x - circle1.x;
        let normalY = circle2.y - circle1.y;

        if(normalX === 0 && normalY === 0){
            normalX = Math.random() * 2 - 1;
            normalY = Math.random() * 2 - 1;
        }
        let dist = Math.sqrt(normalX * normalX + normalY * normalY);
        normalX /= dist;
        normalY /= dist;

        let tangentX = -normalY;
        let tangentY = normalX;

        let dotTangent1 = circle1.vel.x * tangentX + circle1.vel.y * tangentY;
        let dotTangent2 = circle2.vel.x * tangentX + circle2.vel.y * tangentY;

        let dotNormal1 = circle1.vel.x * normalX + circle1.vel.y * normalY;
        let dotNormal2 = circle2.vel.x * normalX + circle2.vel.y * normalY;

        let momentum1 = circle1.elasticity * (dotNormal1 * (circle1.mass - circle2.mass) + 2 * circle2.mass * dotNormal2) / (circle1.mass + circle2.mass);
        let momentum2 = circle2.elasticity * (dotNormal2 * (circle2.mass - circle1.mass) + 2 * circle1.mass * dotNormal1) / (circle1.mass + circle2.mass);

        circle1.vel.x = tangentX * dotTangent1 + normalX * momentum1;
        circle1.vel.y = tangentY * dotTangent1 + normalY * momentum1;

        circle2.vel.x = tangentX * dotTangent2 + normalX * momentum2;
        circle2.vel.y = tangentY * dotTangent2 + normalY * momentum2;
    }
}