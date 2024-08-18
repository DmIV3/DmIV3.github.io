export const M = {
    PI: Math.PI,
    QUATER_PI: Math.PI / 4,
    THREE_QUATERS_PI: (Math.PI / 4) * 3,
    HALF_PI: Math.PI / 2,
    TWO_PI: Math.PI * 2,
    angle: function(x1, y1, x2, y2){return Math.atan2(y2 - y1, x2 - x1)},
    dist: function(x1, y1, x2, y2){return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)},
    distSq: function(x1, y1, x2, y2){return (x2 - x1)**2 + (y2 - y1)**2},
    rndi: function(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min},
    rndf: function(min, max){ return Math.random() * (max - min) + min},
    rndColor: function(){ return `rgb(${this.rndi(0, 255)},${this.rndi(0, 255)},${this.rndi(0, 255)})`},
    arrayLoop: function(array, index){return array[(index % array.length + array.length) % array.length]},
    rndWeighted: function(choises){         // Expects array of objects with properties: 'value', 'weight'
        let total = 0;
        for(let i = 0; i < choises.length; i++){
            total += choises[i].weight;
        }
        let random = Math.random() * total;

        for(let i = 0; i < choises.length; i++){
            if(random < choises[i].weight)
                return choises[i].value;
            else
                random -= choises[i].weight;
        }
    },
    create2dArray: function(width=0, height=0, fill=0){
        let arr = [];
        for(let y = 0; y < height; y++){
            arr[y] = [];
            for(let x = 0; x < width; x++){
                arr[y][x] = fill;
            }
        }
        return arr;
    },
}