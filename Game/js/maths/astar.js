class PF{
    static findPath(map, startPos, endPos){
        let path = [];
        let start = PF.getCell(map, startPos.x, startPos.y);
        let end = PF.getCell(map, endPos.x, endPos.y);
        if(start == undefined || end == undefined)
            return path;
        if(start == end)
            return path;

        
        for (let y = 0; y < map.rows; y++) {
            for (let x = 0; x < map.colls; x++) {
                map.nodes[y][x].f = Infinity;
                map.nodes[y][x].g = Infinity;
                map.nodes[y][x].parent = undefined;
            }
        }
        start.f = UMath.distanceSq(start.pos.x, start.pos.y, end.pos.x, end.pos.y);
        start.g = 0;
        let current = start;
        let openedList = [];
        let closedList = [];
        openedList.push(current);
    
        while(openedList.length > 0){
            openedList.sort((a, b)=>{return a.f - b.f;});
            current = openedList.shift();

            if(current == end){
                let pNode = end;

                while(pNode.parent != undefined){
                    path.push(pNode.pos);
                    pNode = pNode.parent;
                }
                path.push(start.pos);
                path.push(Vec.copy(startPos));
                path.reverse();
            }

            closedList.push(current);
            let neighbours = [];

            if(current.x > 0 ){
                if(!map.nodes[current.y][current.x-1].obstacle)
                    neighbours.push(map.nodes[current.y][current.x-1]);
                if(current.y > 0)
                    if(!map.nodes[current.y-1][current.x-1].obstacle && !map.nodes[current.y][current.x-1].obstacle && !map.nodes[current.y-1][current.x].obstacle)
                        neighbours.push(map.nodes[current.y-1][current.x-1]);
            }
            if(current.x < map.colls-1){
                if(!map.nodes[current.y][current.x+1].obstacle)
                    neighbours.push(map.nodes[current.y][current.x+1]);
                if(current.y < map.rows-1)
                    if(!map.nodes[current.y+1][current.x+1].obstacle && !map.nodes[current.y][current.x+1].obstacle && !map.nodes[current.y+1][current.x].obstacle )
                        neighbours.push(map.nodes[current.y+1][current.x+1]);
            }
            if(current.y > 0){
                if(!map.nodes[current.y-1][current.x].obstacle)
                    neighbours.push(map.nodes[current.y-1][current.x]);
                if(current.x < map.colls-1)
                    if(!map.nodes[current.y-1][current.x+1].obstacle && !map.nodes[current.y-1][current.x].obstacle && !map.nodes[current.y][current.x+1].obstacle )
                        neighbours.push(map.nodes[current.y-1][current.x+1]);
            }
            if(current.y < map.rows-1){
                if(!map.nodes[current.y+1][current.x].obstacle)
                    neighbours.push(map.nodes[current.y+1][current.x]);
                if(current.x > 0)
                    if(!map.nodes[current.y+1][current.x-1].obstacle && !map.nodes[current.y+1][current.x].obstacle && !map.nodes[current.y][current.x-1].obstacle)
                        neighbours.push(map.nodes[current.y+1][current.x-1]);
            }

            for (let i = 0; i < neighbours.length; i++) {
                const neighbour = neighbours[i];
                let tentativeG = current.g + UMath.distance(current.x, current.y, neighbour.x, neighbour.y);
                if(tentativeG < neighbour.g){
                    neighbour.parent = current;
                    neighbour.g = tentativeG;
                    neighbour.f = tentativeG + UMath.distanceSq(neighbour.pos.x, neighbour.pos.y, end.pos.x, end.pos.y);
                }
                
                if(!openedList.includes(neighbour) && !closedList.includes(neighbour))
                    openedList.push(neighbour);
            }
        }
        
            
        return path;
    }

    static generateMap(collGroups, cellSize, x, y, w, h){
        let map = {};
        map.collGroups = collGroups;
        map.cellSize = cellSize;
        map.pos = Vec.v2(x-cellSize/2, y-cellSize/2);
        map.size = Vec.v2(w, h);
        map.nodes = [];
        map.colls = w / cellSize;
        map.rows = h / cellSize;
        for (let i = 0; i < map.rows; i++) {
            map.nodes.push(new Array(map.colls));
        }
        for (let y = 0; y < map.rows; y++) {
            for (let x = 0; x < map.colls; x++) {
                let xPos = map.pos.x + cellSize / 2 + x * cellSize;
                let yPos = map.pos.y + cellSize / 2 + y * cellSize;
                map.nodes[y][x] = {
                    pos: Vec.v2(xPos, yPos),
                    x: x, 
                    y: y,
                    f: Infinity,
                    g: Infinity,
                    obstacle: PF.#checkCollision(xPos, yPos, cellSize, collGroups),
                    parent: undefined
                };
            }
        }
        return map;
    }

    static getCell(map, x, y){
        if(!CollisionDetection.pointRect(x, y, map.pos.x, map.pos.y, map.size.x, map.size.y))
           return;

        return map.nodes[Math.floor((y - map.pos.y) / map.cellSize)][Math.floor((x - map.pos.x) / map.cellSize)];
    }

    static #checkCollision(xPos, yPos, cellSize, collGroups){
        let obstacle = false;
        let nodeRect = [
            Vec.v2(xPos - cellSize / 2 + 1, yPos - cellSize / 2 + 1),
            Vec.v2(xPos + cellSize / 2 - 1, yPos - cellSize / 2 + 1),
            Vec.v2(xPos + cellSize / 2 - 1, yPos + cellSize / 2 - 1),
            Vec.v2(xPos - cellSize / 2 + 1, yPos + cellSize / 2 - 1)
        ];
        for (let i = 0; i < GM.objects.length; i++) {
            const entity = GM.objects[i];
            if(entity.physics == undefined)
                continue;
            if(!PF.#hasSharedGroups(entity.physics.groups, collGroups))
                continue;

            
            if(obstacle)
                break;
            if(entity.physics.type == 1){
                obstacle = CollisionDetection.sat(nodeRect, entity.physics.getVertices());
            }
            if(entity.physics.type == 0){
                obstacle = CollisionDetection.satPC(nodeRect, entity.physics.pos, entity.physics.radius);
            }
        }

        for (let i = 0; i < GM.justCreatedEntities.length; i++) {
            const entity = GM.justCreatedEntities[i].ref;
            if(entity.physics == undefined)
                continue;
            if(!PF.#hasSharedGroups(entity.physics.groups, collGroups))
                continue;

            if(obstacle)
                break;
            if(entity.physics.type == 1){
                entity.physics.updateVertices();
                obstacle = CollisionDetection.sat(nodeRect, entity.physics.getVertices());

            }
            if(entity.physics.type == 0){
                obstacle = CollisionDetection.satPC(nodeRect, entity.physics.pos, entity.physics.radius);
            }
        }
        return obstacle;
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