class PHYS{
	static CIRCLE = 0;
	static BOX = 1;

	static createBox(owner, size, groups, resolution){
		return new BoxCollider(owner, size, groups, resolution);
	}

	static createCircle(owner, radius, groups, resolution){
		return new CircleCollider(owner, radius, groups, resolution);
	}


	static SATBBCollision(obj1, obj2){
		if(this.#hasSharedGroups(obj1.groups, obj2.groups))
			return;
			
		if(!obj1.active || !obj2.active)
			return;

		if(!CollisionDetection.AABB(CollisionDetection.getPolygoneAABB(obj1.getVertices()), CollisionDetection.getPolygoneAABB(obj2.getVertices())))
			return;
		
		let axes, verts1, verts2, overlap, proj1, proj2, normal, depth = Infinity;
		axes = obj1.getAxes(obj2);
		verts1 = obj1.getVertices();
		verts2 = obj2.getVertices();
		for(let i = 0; i < axes.length; i++) {
			proj1 = this.#projectVertices(axes[i], verts1);
			proj2 = this.#projectVertices(axes[i], verts2);

			overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
			if( overlap < 0)
				return;

			if(overlap < depth){
				depth = overlap;
				normal = axes[i];
				if(proj1.max < proj2.max)
					Vec.negate(normal);
			}
		}

		axes = obj2.getAxes(obj1);
		for (let i = 0; i < axes.length; i++) {
			proj1 = this.#projectVertices(axes[i], verts1);
			proj2 = this.#projectVertices(axes[i], verts2);

			overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
			if( overlap < 0)
				return;

			if(overlap < depth){
				depth = overlap;
				normal = axes[i];
				if(proj1.max < proj2.max)
					Vec.negate(normal);
			}
		}
		
		obj1.collisionObjects.push(obj2.owner);
		obj2.collisionObjects.push(obj1.owner);

		if(obj1.resolution > 0 && obj2.resolution > 0){
			if(obj1.invMass == 0 && obj2.invMass == 0)
				return;
			this.#penetrationResolution(obj1, obj2, normal, depth);
			obj1.updateVertices();
			obj2.updateVertices();
			

			if(obj1.resolution > 1 || obj2.resolution > 1)
				this.#collisionResponse(obj1, obj2, normal);
		}
	}

	static SATBCCollision(box, circle){
		if(this.#hasSharedGroups(box.groups, circle.groups))
			return;

		if(!box.active || !circle.active)
			return;

		if(!CollisionDetection.AABB(CollisionDetection.getPolygoneAABB(box.getVertices()), CollisionDetection.getCircleAABB(circle.pos, circle.radius)))
			return;

		let axis, boxVerts, cirVerts, overlap, proj1, proj2, normal, depth = Infinity;

		
		boxVerts = box.getVertices();
		let closetsVertexToCircle = this.#closestVertexToPoint(circle.pos, boxVerts);
		axis = Vec.unitN(Vec.substractN(closetsVertexToCircle, circle.pos));
		cirVerts = [
			Vec.addN(circle.pos, Vec.multiplyN(axis, circle.radius)),
			Vec.substractN(circle.pos, Vec.multiplyN(axis, circle.radius))
		];
		proj1 = this.#projectVertices(axis, boxVerts);
		proj2 = this.#projectVertices(axis, cirVerts);

		overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
		if( overlap < 0)
			return;

		if(overlap < depth){
			depth = overlap;
			normal = axis;
			if(proj1.max < proj2.max)
				Vec.negate(normal);
		}

		axis = box.getAxes();
		for(let i = 0; i < axis.length; i++){
			cirVerts = [
				Vec.addN(circle.pos, Vec.multiplyN(axis[i], circle.radius)),
				Vec.substractN(circle.pos, Vec.multiplyN(axis[i], circle.radius))
			];

			proj1 = this.#projectVertices(axis[i], boxVerts);
			proj2 = this.#projectVertices(axis[i], cirVerts);

			overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
			if( overlap < 0)
				return;

			if(overlap < depth){
				depth = overlap;
				normal = axis[i];
				if(proj1.max < proj2.max)
					Vec.negate(normal);
			}
		}

		box.collisionObjects.push(circle.owner);
		circle.collisionObjects.push(box.owner);

		if(box.resolution > 0 && circle.resolution > 0){
			if(box.invMass == 0 && circle.invMass == 0)
				return;
			this.#penetrationResolution(box, circle, normal, depth);
			

			if(box.resolution > 1 || circle.resolution > 1)
				this.#collisionResponse(box, circle, normal);
		}
	}

	static SATCCCollision(obj1, obj2){
		if(this.#hasSharedGroups(obj1.groups, obj2.groups))
			return;

		if(!obj1.active || !obj2.active)
			return;
			
		let dir = Vec.substractN(obj1.pos, obj2.pos);
		let radii = obj1.radius + obj2.radius;

		if(radii * radii <= dir.x * dir.x + dir.y * dir.y)
			return;
		
		obj1.collisionObjects.push(obj2.owner);
		obj2.collisionObjects.push(obj1.owner);

		let depth = radii - Math.sqrt(dir.x * dir.x + dir.y * dir.y);
		let normal = Vec.unitN(dir);
		if(obj1.resolution > 0 && obj2.resolution > 0){
			if(obj1.invMass == 0 && obj2.invMass == 0)
				return;
			this.#penetrationResolution(obj1, obj2, normal, depth);
			

			if(obj1.resolution > 1 || obj2.resolution > 1)
				this.#collisionResponse(obj1, obj2, normal);
		}
	}

	static #penetrationResolution(obj1, obj2, normal, depth){
		if((normal.x == 0) && (normal.y == 0)){
			normal.x = UMath.random(-1, 1);
			normal.y = UMath.random(-1, 1);
		}
		let penRes =  Vec.multiplyN(normal, depth / (obj1.invMass + obj2.invMass));
		Vec.add(obj1.pos, Vec.multiplyN(penRes, obj1.invMass));
		Vec.add(obj2.pos, Vec.multiplyN(penRes, -obj2.invMass));
	}

	static #collisionResponse(obj1, obj2, normal){
		let relVel = Vec.substractN(obj1.vel, obj2.vel);
		let sepVel = Vec.dot(relVel, normal);
		let newSepVel = -sepVel * Math.min(obj1.elasticity, obj2.elasticity);
		let sepVelDiff = newSepVel - sepVel;
		let impulse = sepVelDiff / (obj1.invMass + obj2.invMass);
		let impulseVec = Vec.multiplyN(normal, impulse);

		
		if(Vec.dot(relVel, normal) > 0)
			return;

		if(obj1.resolution > 1)
			Vec.add(obj1.vel, Vec.multiplyN(impulseVec, obj1.invMass));
		if(obj2.resolution > 1)
			Vec.add(obj2.vel, Vec.multiplyN(impulseVec, -obj2.invMass));
	}

	static #projectVertices(axis, verts){
		let min = Infinity;
		let max = -Infinity;
		for(let i = 0; i < verts.length; i++){
			let proj =  Vec.dot(verts[i], axis);
			if(proj < min) min = proj;
			if(proj > max) max = proj;
		}
		return {min: min, max: max};
	}

	static #closestVertexToPoint = function(pos, verts){
		let minDist = Infinity;
		let res;
		for(let i = 0; i < verts.length; i++){
			let dist = (pos.x - verts[i].x) * (pos.x - verts[i].x) +  (pos.y - verts[i].y) * (pos.y - verts[i].y);
			if(dist < minDist){
				minDist = dist;
				res = verts[i];
			}
		}
		return res;
	}

	static #hasSharedGroups(g1, g2){
		for (let i = 0; i < g1.length; i++) {
			for (let j = 0; j < g2.length; j++) {
				if(g1[i] == g2[j])
					return true;	
			}
		}
		return false;
	}

}

class BoxCollider{
	constructor(owner, size, groups, resolution){
		this.type = 1;
		this.owner = owner;
		this.pos = owner.pos;

		if(this.owner.vel != undefined)
			this.vel = this.owner.vel;
		else
			this.owner.vel = this.vel =  Vec.zero();

		this.size = Vec.copy(size);

		this.mass = size.x * size.y;
		this.invMass = 1 / this.mass;
		this.elasticity = 1;

		this.resolution = resolution;
		this.groups = groups;
		this.active = true;

		this.collisionObjects = [];

		this.verticesRef = [
			Vec.v2(-this.size.x / 2, -this.size.y / 2),
			Vec.v2(this.size.x / 2, -this.size.y / 2),
			Vec.v2(this.size.x / 2, this.size.y / 2),
			Vec.v2(-this.size.x / 2, this.size.y / 2)
		];

		this.vertices = [
			Vec.zero(),
			Vec.zero(),
			Vec.zero(),
			Vec.zero()
		];

		this.axes = [
			Vec.zero(),
			Vec.zero()
		];
	}

	updateVertices(){
		for (let i = 0; i < this.verticesRef.length; i++) {
			this.vertices[i] = Vec.transform(this.verticesRef[i], this.pos.x, this.pos.y, this.owner.angle);
		}
	}

	updateRefVertices(){
		this.verticesRef = [
			Vec.v2(-this.size.x / 2, -this.size.y / 2),
			Vec.v2(this.size.x / 2, -this.size.y / 2),
			Vec.v2(this.size.x / 2, this.size.y / 2),
			Vec.v2(-this.size.x / 2, this.size.y / 2)
		];
	}

	updateAxes(){
		this.axes[0] = Vec.unitN(Vec.normal(Vec.substractN(this.vertices[0], this.vertices[1])));
		this.axes[1] = Vec.unitN(Vec.normal(Vec.substractN(this.vertices[1], this.vertices[2])));
	}

	update(){
		this.pos = this.owner.pos;
		Vec.add(this.pos, Vec.multiplyN(this.vel, Time.deltaSeconds()));
		this.updateVertices();
		this.updateAxes();
	}

	getVertices(){
		return this.vertices;
	}

	getAxes(){
		return this.axes;
	}

	hasCollision(){
		return this.collisionObjects.length != 0;
	}

	hasCollisionWith(name){
		for (let i = 0; i < this.collisionObjects.length; i++) {
			const obj = this.collisionObjects[i];
			if(obj.name == name)
				return true;
		}
		return false;
	}

	setMass(mass){
		this.mass = mass;
		if(this.mass == 0)
			this.invMass = 0;
		else
			this.invMass = 1 / this.mass;
	}

	setStatic(){
		this.mass = 0;
		this.invMass = 0;
	}
	
	getCollisions(){
		return this.collisionObjects;
	}

	setElasticity(el){
		this.elasticity = el;
	}

	setActive(a){
		this.active = a;
	}

	setSize(size){
		this.size = size;
		this.updateRefVertices();
	}
}

class CircleCollider{
	constructor(owner, radius, groups, resolution){
		this.type = 0;
		this.owner = owner;
		this.pos = owner.pos;

		if(this.owner.vel != undefined)
			this.vel = this.owner.vel;
		else
			this.owner.vel = this.vel =  Vec.zero();


		this.radius = radius;

		this.mass = this.radius * this.radius * Math.PI;
		this.invMass = 1 / this.mass;
		this.elasticity = 1;

		this.resolution = resolution;
		this.groups = groups;

		this.collisionObjects = [];
		this.active = true;
	}


	update(){
		this.pos = this.owner.pos;
		Vec.add(this.pos, Vec.multiplyN(this.vel, Time.deltaSeconds()));
	}

	hasCollision(){
		return this.collisionObjects.length != 0;
	}

	hasCollisionWith(name){
		for (let i = 0; i < this.collisionObjects.length; i++) {
			const obj = this.collisionObjects[i];
			if(obj.name == name)
				return true;
		}
		return false;
	}

	setMass(mass){
		this.mass = mass;
		if(this.mass == 0)
			this.invMass = 0;
		else
			this.invMass = 1 / this.mass;
	}

	setStatic(){
		this.mass = 0;
		this.invMass = 0;
	}

	getCollisions(){
		return this.collisionObjects;
	}

	setElasticity(el){
		this.elasticity = el;
	}

	setActive(a){
		this.active = a;
	}

	setRadius(r){
		this.radius = r;
	}
}