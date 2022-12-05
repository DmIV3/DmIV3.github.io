class CollisionDetection{
    static pointRect(px, py, rx, ry, rw, rh){
		if(px > rx && px < rx + rw)
			if(py > ry && py < ry + rh)
				return true;
		return false;
	}

	static pointCircle(px, py, cx, cy, cr){
		return (((cx - px) * (cx - px)) + ((cy - py) * (cy - py))) <= cr * cr;
	}

    static rectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h){
		if(r1x + r1w > r2x && r1x < r2x + r2w)
			if(r1y + r1h > r2y && r1y < r2y + r2h)
				return true;
		return false;
	}

	static circleCircle(c1x, c1y, c1r, c2x, c2y, c2r){
		return (c1x - c2x) * (c1x - c2x) + (c1y - c2y) * (c1y - c2y) < (c1r + c2r) * (c1r + c2r);
	}

	static AABB(aabb1, aabb2){
		if(aabb1.right > aabb2.left && aabb1.left < aabb2.right)
			if(aabb1.bottom > aabb2.top && aabb1.top < aabb2.bottom)
				return true;
		return false;
	}

	static sat(verts1, verts2){
		if(!CollisionDetection.AABB(CollisionDetection.getPolygoneAABB(verts1), CollisionDetection.getPolygoneAABB(verts2)))
			return false;

		let points1 = verts1;
		let points2 = verts2;
		let axes1 = [];
		let axes2 = [];

		for (let i = 0; i < points1.length; i++) {
			let p1 = UMath.arrayLoop(points1, i);
			let p2 = UMath.arrayLoop(points1, i + 1);

			let aX = p2.x - p1.x;
			let aY = p2.y - p1.y;

			let len = Math.sqrt(aX * aX + aY * aY);
			aX = aX / len;
			aY = aY / len;
			axes1.push(Vec.v2(-aY, aX));
		}

		for (let i = 0; i < points2.length; i++) {
			let p1 = UMath.arrayLoop(points2, i);
			let p2 = UMath.arrayLoop(points2, i + 1);

			let aX = p2.x - p1.x;
			let aY = p2.y - p1.y;

			let len = Math.sqrt(aX * aX + aY * aY);
			aX = aX / len;
			aY = aY / len;
			axes2.push(Vec.v2(-aY, aX));
		}

		
		for (let i = 0; i < axes1.length; i++) {
			let min_r1 = Infinity, max_r1 = -Infinity;
			let min_r2 = Infinity, max_r2 = -Infinity;

			let axis = axes1[i];
			for (let p = 0; p < points1.length; p++){
				let q = (points1[p].x * axis.x + points1[p].y * axis.y);
				min_r1 = Math.min(min_r1, q);
				max_r1 = Math.max(max_r1, q);
			}

			for (let p = 0; p < points2.length; p++){
				let q = (points2[p].x * axis.x + points2[p].y * axis.y);
				min_r2 = Math.min(min_r2, q);
				max_r2 = Math.max(max_r2, q);
			}

			if (!(max_r2 >= min_r1 && max_r1 >= min_r2))
					return false;
		}

		for (let i = 0; i < axes2.length; i++) {
			let min_r1 = Infinity, max_r1 = -Infinity;
			let min_r2 = Infinity, max_r2 = -Infinity;

			let axis = axes2[i];
			for (let p = 0; p < points1.length; p++){
				let q = (points1[p].x * axis.x + points1[p].y * axis.y);
				min_r1 = Math.min(min_r1, q);
				max_r1 = Math.max(max_r1, q);
			}

			for (let p = 0; p < points2.length; p++){
				let q = (points2[p].x * axis.x + points2[p].y * axis.y);
				min_r2 = Math.min(min_r2, q);
				max_r2 = Math.max(max_r2, q);
			}

			if (!(max_r2 >= min_r1 && max_r1 >= min_r2))
					return false;
		}

		return true;
	}

	static satPC(verts, cirPos, radius){
		if(!CollisionDetection.AABB(CollisionDetection.getPolygoneAABB(verts), CollisionDetection.getCircleAABB(cirPos, radius)))
			return false;
		let polyAxes = [], cirAxis, cirVerts,
		closestVertOnPoly = verts[0], minDist = Infinity,
		min_r1 = Infinity, max_r1 = -Infinity,
		min_r2 = Infinity, max_r2 = -Infinity;

		for(let i = 0; i < verts.length; i++){
			let dist = (cirPos.x - verts[i].x) * (cirPos.x - verts[i].x) +  (cirPos.y - verts[i].y) * (cirPos.y - verts[i].y);
			if(dist < minDist){
				minDist = dist;
				closestVertOnPoly = verts[i];
			}
		}
		cirAxis = Vec.unitN(Vec.substractN(closestVertOnPoly, cirPos));
		cirVerts = [
			Vec.addN(cirPos, Vec.multiplyN(cirAxis, radius)),
			Vec.substractN(cirPos, Vec.multiplyN(cirAxis, radius))
		];
		
		for (let p = 0; p < verts.length; p++) {
			let q = (verts[p].x * cirAxis.x + verts[p].y * cirAxis.y);
			min_r1 = Math.min(min_r1, q);
			max_r1 = Math.max(max_r1, q);
		}

		for (let p = 0; p < cirVerts.length; p++) {
			let q = (cirVerts[p].x * cirAxis.x + cirVerts[p].y * cirAxis.y);
			min_r2 = Math.min(min_r2, q);
			max_r2 = Math.max(max_r2, q);
		}

		if (!(max_r2 >= min_r1 && max_r1 >= min_r2))
			return false;

		for (let i = 0; i < verts.length; i++) {
			let p1 = UMath.arrayLoop(verts, i);
			let p2 = UMath.arrayLoop(verts, i + 1);

			let aX = p2.x - p1.x;
			let aY = p2.y - p1.y;

			let len = Math.sqrt(aX * aX + aY * aY);
			aX = aX / len;
			aY = aY / len;
			polyAxes.push(Vec.v2(-aY, aX));
		}

		for (let i = 0; i < polyAxes.length; i++) {
			let axis = polyAxes[i];
			min_r1 = Infinity;
			max_r1 = -Infinity;
			min_r2 = Infinity;
			max_r2 = -Infinity;
			cirVerts = [
				Vec.addN(cirPos, Vec.multiplyN(axis, radius)),
				Vec.substractN(cirPos, Vec.multiplyN(axis, radius))
			];

			for (let p = 0; p < verts.length; p++){
				let q = (verts[p].x * axis.x + verts[p].y * axis.y);
				min_r1 = Math.min(min_r1, q);
				max_r1 = Math.max(max_r1, q);
			}

			for (let p = 0; p < cirVerts.length; p++){
				let q = (cirVerts[p].x * axis.x + cirVerts[p].y * axis.y);
				min_r2 = Math.min(min_r2, q);
				max_r2 = Math.max(max_r2, q);
			}

			

			if (!(max_r2 >= min_r1 && max_r1 >= min_r2))
				return false;
		}

		return true;
	}

	static getPolygoneAABB(verts){
		let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
		for (let i = 0; i < verts.length; i++) {
			if(minX > verts[i].x)
				minX = verts[i].x;
			if(maxX < verts[i].x)
				maxX = verts[i].x;
			if(minY > verts[i].y)
				minY = verts[i].y;
			if(maxY < verts[i].y)
				maxY = verts[i].y;
		}
		return {left: minX, right: maxX, top: minY, bottom: maxY};
	}

	static getCircleAABB(pos, radius){
		return {left: pos.x - radius, right: pos.x + radius, top: pos.y - radius, bottom: pos.y +  radius};
	}
	
    static circleRect(cx, cy, cr, rx, ry, rw, rh){
		// Find the nearest point on the
		// rectangle to the center of
		// the circle
		let Xn = Math.max(rx, Math.min(cx, rx + rw));
		let Yn = Math.max(ry, Math.min(cy, ry + rh));
		// Find the distance between the
		// nearest point and the center
		// of the circle
		// Distance between 2 points,
		// (x1, y1) & (x2, y2) in
		// 2D Euclidean space is
		// ((x1-x2)**2 + (y1-y2)**2)**0.5
		let Dx = Xn - cx;
		let Dy = Yn - cy;
		return (Dx * Dx + Dy * Dy) <= cr * cr;
    }
}

class Ray{

	static cast(pos, angle, distance, collisionGroups){
		let rayStart = Vec.copy(pos);
		let rayEnd = Vec.copy(pos);
		Vec.setMagnitude(rayEnd, distance);
		Vec.setAngle(rayEnd, angle);
		Vec.add(rayEnd, rayStart);

		let results = this.castPierceTo(rayStart, rayEnd, collisionGroups);
		let closest = this.#findClosest(rayStart, results);
		return closest;
	}

	static castTo(startPos, endPos, collisionGroups){
		let results = this.castPierceTo(startPos, endPos, collisionGroups);
		let closest = this.#findClosest(startPos, results);
		return closest;
	}

	
	static #findClosest(rayStart, collisions){
		if(collisions.length == 0)
			return undefined;

		let closest = undefined, minDistance = Infinity;
		
		for (let i = 0; i < collisions.length; i++) {
			const c = collisions[i];
			let dist = UMath.distanceSq(rayStart.x, rayStart.y, collisions[i].point.x, collisions[i].point.y);
			if(dist < minDistance){
				minDistance = dist;
				closest = {target: c.target, point: c.point};
			}
		}

		return closest;
	}

	static castPierce(pos, angle, distance, collisionGroups){
		let rayStart = Vec.copy(pos);
		let rayEnd = Vec.copy(pos);
		Vec.setMagnitude(rayEnd, distance);
		Vec.setAngle(rayEnd, angle);
		Vec.add(rayEnd, rayStart);

		let results = this.castPierceTo(rayStart, rayEnd, collisionGroups);
		return results;
	}

	static castPierceTo(pos1, pos2, collisionGroups){
		let objs = GM.getObjects();
		let rayStart = Vec.copy(pos1);
		let rayEnd = Vec.copy(pos2);

		let results = [];

		for (let i = 0; i < objs.length; i++) {
			const e = objs[i];
			if(!e.physics)
				continue;

			if(!e.physics.active)
				continue;

			if(this.#checkGroups(collisionGroups, e.physics.groups))
				continue;

			if(e.physics.type == 0){
				let coll = this.#toCircle(rayStart, rayEnd, e.physics);
				if(coll){
					results.push({
						target: e,
						point: coll
					});
				}
			}

			if(e.physics.type == 1){
				let coll = this.#toBox(rayStart, rayEnd, e.physics);
				if(coll){
					results.push({
						target: e,
						point: coll
					});
				}
			}
		}
		return results;
	}

	static #toCircle(rayStart, rayEnd, physics){
		let axis = Vec.substractN(rayEnd, rayStart);
		Vec.unit(axis);
		let axisCopy = Vec.copy(axis);
		let axis2 = Vec.substractN(physics.pos, rayStart);
		let proj = Vec.dot(axis2, axis);
		Vec.multiply(axis, proj);
		Vec.add(axis, rayStart);

		let distVec = Vec.substractN(axis, physics.pos);
		let dist = Vec.magnitude(distVec);
		let interSection = physics.radius * physics.radius - dist * dist;

		if(interSection < 0)
			return undefined;

		interSection = Math.sqrt(interSection);
		
		let normalToStart = Vec.normal(Vec.substractN(rayStart, rayEnd));
		let normalToEnd = Vec.normal(Vec.substractN(rayEnd, rayStart));
		let dirToStart = Vec.substractN(rayEnd, physics.pos);
		let dirToEnd = Vec.substractN(rayStart, physics.pos);

		if(Vec.cross(normalToStart, dirToStart) < 0){
			if(UMath.distanceSq(rayEnd.x, rayEnd.y, physics.pos.x, physics.pos.y) <= physics.radius * physics.radius){
				let itx = proj - interSection;
				return Vec.v2(axisCopy.x * itx + rayStart.x, axisCopy.y * itx + rayStart.y);
			}
		}else if(Vec.cross(normalToEnd, dirToEnd) < 0){
			if(UMath.distanceSq(rayStart.x, rayStart.y, physics.pos.x, physics.pos.y) <= physics.radius * physics.radius){
				let itx = proj + interSection;
				return Vec.v2(axisCopy.x * itx + rayStart.x, axisCopy.y * itx + rayStart.y);
			}
		}else{
			let itx = proj - interSection;
			if(UMath.distanceSq(physics.pos.x, physics.pos.y, rayStart.x, rayStart.y) <= physics.radius * physics.radius)
				itx = proj + interSection;

			return Vec.v2(axisCopy.x * itx + rayStart.x, axisCopy.y * itx + rayStart.y);
		}
		return undefined;
	}

	static #toBox(rayStart, rayEnd, physics){
		let points = physics.getVertices();
		let rayDir = Vec.substractN(rayEnd, rayStart);
		
		let closest = undefined, minDistance = Infinity;

		for (let i = 0; i < points.length; i++) {
			let segStart = UMath.arrayLoop(points, i);
			let segEnd = UMath.arrayLoop(points, i+1);

			let segDir = Vec.substractN(segEnd, segStart);

			let divider = Vec.cross(rayDir, segDir);

			if(divider == 0)
				continue;

			let u = ((segStart.x - rayStart.x) * rayDir.y - (segStart.y - rayStart.y) * rayDir.x) / divider;
			let t = ((segStart.x - rayStart.x) * segDir.y - (segStart.y - rayStart.y) * segDir.x) / divider;

			if(u >= 0 && u <= 1 && t >= 0 && t <= 1) {
				let collisionPoint = Vec.v2(rayStart.x + t * rayDir.x, rayStart.y + t * rayDir.y);
				let dist = UMath.distanceSq(rayStart.x, rayStart.y, collisionPoint.x, collisionPoint.y);
				if(dist < minDistance){
					minDistance = dist;
					closest = collisionPoint;
				}
			}
		}
		return closest;
	}

	static #checkGroups(g1, g2){
		for (let i = 0; i < g1.length; i++) {
			for (let j = 0; j < g2.length; j++) {
				if(g1[i] == g2[j])
					return false;	
			}
		}
		return true;
	}
}