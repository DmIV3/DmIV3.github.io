import { Vec } from './vector.js';
export const Ray = {
    /** Cheap RayCasting algorhytm in tile-based world
     *  which represented as 2D array of 0(empty) and 1(wall)
     * @param {Array} arrMap 2d array of map
     * @param {Vec} vRayStart start ray position
     * @param {Vec} vRayDir normalized ray direction
     * @param {float} fMaxDistance Maximal ray distance in tiles
     * @returns intersection point or undefined
     */
    DDA: function(arrMap, vRayStart, vRayDir, fMaxDistance=10){
        fMaxDistance--;
        let vRayUnitStepSize = Vec.create( Math.sqrt(1 + (vRayDir.y / vRayDir.x) * (vRayDir.y / vRayDir.x)), 
                                           Math.sqrt(1 + (vRayDir.x / vRayDir.y) * (vRayDir.x / vRayDir.y)));
        let vMapCheck = Vec.create(Math.floor(vRayStart.x), Math.floor(vRayStart.y));
        let vRayLength1D = Vec.create();
        let vStep = Vec.create();
    
        // Establish Starting Conditions
        if (vRayDir.x < 0){
            vStep.x = -1;
            vRayLength1D.x = (vRayStart.x - vMapCheck.x) * vRayUnitStepSize.x;
        }
        else{
            vStep.x = 1;
            vRayLength1D.x = ((vMapCheck.x + 1) - vRayStart.x) * vRayUnitStepSize.x;
        }
    
        if (vRayDir.y < 0){
            vStep.y = -1;
            vRayLength1D.y = (vRayStart.y - vMapCheck.y) * vRayUnitStepSize.y;
        }
        else{
            vStep.y = 1;
            vRayLength1D.y = ((vMapCheck.y + 1) - vRayStart.y) * vRayUnitStepSize.y;
        }
    
        // Perform "Walk" until collision or range check
        let bTileFound = false;
        let fDistance = 0.0;
        while (!bTileFound && fDistance < fMaxDistance){
            // Walk along shortest path
            if (vRayLength1D.x < vRayLength1D.y){
                vMapCheck.x += vStep.x;
                fDistance = vRayLength1D.x;
                vRayLength1D.x += vRayUnitStepSize.x;
            }else{
                vMapCheck.y += vStep.y;
                fDistance = vRayLength1D.y;
                vRayLength1D.y += vRayUnitStepSize.y;
            }
            // Test tile at new test point
            if (vMapCheck.x >= 0 && vMapCheck.x < arrMap[0].length && vMapCheck.y >= 0 && vMapCheck.y < arrMap.length){
                if (arrMap[vMapCheck.y][vMapCheck.x] == 1){
                    bTileFound = true;
                }
            }
        }
    
        // Calculate intersection location
        if (bTileFound){
            return Vec.create(
                vRayStart.x + vRayDir.x * fDistance,
                vRayStart.y + vRayDir.y * fDistance);
        }
        return undefined;
    }
}