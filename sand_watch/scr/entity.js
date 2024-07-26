export const Watch = {
    create: function(){
        const newWatch = {
            init: function(){
                let h1 = document.createElement('h1');
                h1.style.color = 'white';
                h1.innerText = 'Hello'
                document.body.appendChild(h1)

                
                this.acl = new Accelerometer({ frequency: 60 });
                this.acl.addEventListener("reading", (function(e) {

                    this.rotation = Vec.angle({x: this.acl.x, y: -this.acl.y});
                    if(this.rotation < 0)
                        this.rotation = M.TWO_PI + this.rotation;

                    // this.rotation -= M.QUATER_PI;
                    // this.rotation = (this.rotation % M.TWO_PI + M.TWO_PI) % M.TWO_PI;
        
                    h1.innerText = 'x: ' +  this.acl.x.toFixed(2) + '  y:' + this.acl.y.toFixed(2) + '  r: ' + this.rotation.toFixed(2);

                    this.stepRotation();
                }).bind(this));
                this.acl.start();

                ////////////////////
                this.fWidth = 30;
                this.fHeight = 30;
                this.cSize = 8;
                let takenCells = 200;

                this.angleSteps = [];
                for(let i = Math.PI / 8, j = 0; i < M.TWO_PI; i += Math.PI / 4, j++){
                    this.angleSteps[j] = i;
                }
                this.index = 0;
                this.neigbourByIndex = [
                    
                    [ 1,  0,     1,  1,     1, -1],    //0
                    [ 1,  1,     0,  1,     1,  0],    //1
                    [ 0,  1,    -1,  1,     1,  1],    //2
                    [-1,  1,    -1,  0,     0,  1],    //3
                    [-1,  0,    -1, -1,    -1,  1],    //4
                    [-1, -1,     0, -1,    -1,  0],    //5
                    [ 0, -1,     1, -1,    -1, -1],    //6
                    [ 1, -1,     1,  0,     0, -1],    //7s
                ];

                this.rotation = 0;
                
                this.ctx1 = W_Canvas.create(this.fWidth * this.cSize, this.fHeight * this.cSize);
                this.ctx2 = W_Canvas.create(this.fWidth * this.cSize, this.fHeight * this.cSize);

                this.field_1 = M.create2dArray(this.fWidth, this.fHeight, 0);
                this.field_2 = M.create2dArray(this.fWidth, this.fHeight, 0);
                
                this.bufferField_1 = M.create2dArray(this.fWidth, this.fHeight, 0);
                this.bufferField_2 = M.create2dArray(this.fWidth, this.fHeight, 0);
                
                this.fillField(this.field_1, takenCells);
                this.fillField(this.field_2, takenCells);

                
            },
            update: function(deltaTime){
                    this.moveToNextField();

                    this.newStateUpdate(this.field_1, this.bufferField_1);
                    this.newStateUpdate(this.field_2, this.bufferField_2);


                    this.swapBuffers();
                    this.clearBuffers();
                    // log('upd:    ' + this.countCells())
                /////////////////////////
                if(MOUSE.middlePressed){
                }


                if(MOUSE.left){
                    this.rotation -= 0.1;
                    this.rotation = (this.rotation % M.TWO_PI + M.TWO_PI) % M.TWO_PI;
                    this.stepRotation();
                }
                if(MOUSE.right){
                    this.rotation += 0.1;
                    this.rotation = (this.rotation % M.TWO_PI + M.TWO_PI) % M.TWO_PI;
                    this.stepRotation();
                }
                if(MOUSE.rightReleased){}
            },
            render: function(){
                this.ctx1.fillStyle = this.ctx2.fillStyle = 'black';
                this.ctx1.fillRect(0, 0, this.ctx1.canvas.width, this.ctx1.canvas.height);
                this.ctx2.fillRect(0, 0, this.ctx2.canvas.width, this.ctx2.canvas.height);

                for(let y = 0; y < this.fHeight; y++){
                    for(let x = 0; x < this.fWidth; x++){
                        const color = ~~((1 - y / this.fHeight) * 255);
                        this.ctx1.fillStyle = this.field_1[y][x] === 0 ? 'white' : `rgb(${color}, ${5}, ${175})`;
                        this.ctx1.fillRect(x*this.cSize+1, y*this.cSize+1, this.cSize-2, this.cSize-2);
                    }
                }

                for(let y = 0; y < this.fHeight; y++){
                    for(let x = 0; x < this.fWidth; x++){
                        const color = ~~((1 - y / this.fHeight) * 255);
                        this.ctx2.fillStyle = this.field_2[y][x] === 0 ? 'white' : `rgb(${color}, ${5}, ${175})`;
                        this.ctx2.fillRect(x*this.cSize+1, y*this.cSize+1, this.cSize-2, this.cSize-2);
                    }
                }

                let v = Vec.fromAngle(this.rotation);
                Vec.scale(v, 50);
                this.ctx1.strokeStyle = 'orange';
                this.ctx1.lineWidth = 3;
                this.ctx1.beginPath();
                this.ctx1.moveTo(100, 100);
                this.ctx1.lineTo(100 + v.x, 100 + v.y);
                this.ctx1.stroke();
            },
            swapBuffers: function(){
                let tmp = this.field_1;
                this.field_1 = this.bufferField_1;
                this.bufferField_1 = tmp;

                tmp = this.field_2;
                this.field_2 = this.bufferField_2;
                this.bufferField_2 = tmp;
            },

            clearBuffers: function(){
                for(let y = 0; y < this.fHeight; y++){
                    for(let x = 0; x < this.fWidth; x++){
                        this.bufferField_1[y][x] = 0;
                        this.bufferField_2[y][x] = 0;
                    }
                }
            },
            fillField: function(field, num){
                while(num > 0){
                    let y = M.rndi(0, field.length-1);
                    let x = M.rndi(0, field[0].length-1);
                    if(field[y][x] === 0){
                        field[y][x] = 1;
                        num--;
                    }
                }
            },
            countCells: function(){
                let count1 = 0;
                let count2 = 0;
                for(let y = 0; y < this.field_1.length; y++){
                    for(let x = 0; x < this.field_1[0].length; x++){
                        if(this.field_1[y][x] === 1)
                            count1++;
                    }
                }
                for(let y = 0; y < this.field_2.length; y++){
                    for(let x = 0; x < this.field_2[0].length; x++){
                        if(this.field_2[y][x] === 1)
                            count2++;
                    }
                }
                return `field 1: ${count1},  field 2: ${count2},  total: ${count1 + count2} cells`;
            },
            stepRotation: function(){
                if(this.rotation >= this.angleSteps[7] || this.rotation < this.angleSteps[0])
                    this.index = 0;
                else if(this.rotation >= this.angleSteps[0] && this.rotation < this.angleSteps[1])
                    this.index = 1;
                else if(this.rotation >= this.angleSteps[1] && this.rotation < this.angleSteps[2])
                    this.index = 2;
                else if(this.rotation >= this.angleSteps[2] && this.rotation < this.angleSteps[3])
                    this.index = 3;
                else if(this.rotation >= this.angleSteps[3] && this.rotation < this.angleSteps[4])
                    this.index = 4;
                else if(this.rotation >= this.angleSteps[4] && this.rotation < this.angleSteps[5])
                    this.index = 5;
                else if(this.rotation >= this.angleSteps[5] && this.rotation < this.angleSteps[6])
                    this.index = 6;
                else if(this.rotation >= this.angleSteps[6] && this.rotation < this.angleSteps[7])
                    this.index = 7;
            },
            getNeighbour: function(field, x, y, dir){
                let x1 = this.neigbourByIndex[this.index][0 + dir * 2]+x;
                let y1 = this.neigbourByIndex[this.index][1 + dir * 2]+y;

                
                if(x1 < 0 || y1 < 0 || y1 >= this.fHeight || x1 >= this.fWidth) {
                    return [1, y1, x1];
                }

                return [field[y1][x1], y1, x1];
            },
            newStateUpdate: function(field, buffer){
                for(let y = 0; y < this.fHeight; y++){
                    for(let x = 0; x < this.fWidth; x++){
                        if(field[y][x] === 1){
                            let botNeighbour = this.getNeighbour(field, x, y, 0);
                            let nextDirection = M.rndi(1, 2);
                            let rndNextNeightbour_1 = this.getNeighbour(field, x, y, nextDirection);
                            let rndNextNeightbour_2 = this.getNeighbour(field, x, y, 3-nextDirection);

                            if(botNeighbour[0] === 0 && buffer[botNeighbour[1]][botNeighbour[2]] === 0){
                                buffer[botNeighbour[1]][botNeighbour[2]] = 1;
                                continue;
                            }
                            
                            if(rndNextNeightbour_1[0] === 0 && buffer[rndNextNeightbour_1[1]][rndNextNeightbour_1[2]] === 0){
                                buffer[rndNextNeightbour_1[1]][rndNextNeightbour_1[2]] = 1;
                                continue;
                            }
                            if(rndNextNeightbour_2[0] === 0 && buffer[rndNextNeightbour_2[1]][rndNextNeightbour_2[2]] === 0){
                                buffer[rndNextNeightbour_2[1]][rndNextNeightbour_2[2]] = 1;
                                continue;
                            }
                            buffer[y][x] = 1;
                        }
                    }
                }

            },
            moveToNextField: function(){
                let moveUp = this.rotation < 5.497787143782138 && this.rotation >= 2.356194490192345;
                if(this.field_1[this.fHeight-1][this.fWidth-1] === 1 && this.field_2[0][0] === 0 && !moveUp){
                    this.field_1[this.fHeight-1][this.fWidth-1] = 0;
                    this.field_2[0][0] = 1;
                }
                if(this.field_1[this.fHeight-1][this.fWidth-1] === 0 && this.field_2[0][0] === 1 && moveUp){
                    this.field_1[this.fHeight-1][this.fWidth-1] = 1;
                    this.field_2[0][0] = 0;
                }
            }
        }

        newWatch.init();
        return newWatch;
    }
}

const W_Canvas = {
    container: undefined,
    createCenteredDiv: function(){
        this.container = document.createElement('div');
        this.container.style.width = '0';
        this.container.style.margin = 'auto';
        document.body.style.background = 'black';
        document.body.appendChild(this.container);
    },
    create: function(w, h){
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.style.display = 'block';
        if(this.container === undefined){
            canvas.style.transform = 'translate(-50%, 22%) rotate(45deg)';
            this.createCenteredDiv();
        }else{
            canvas.style.transform = 'translate(-50%, 62%) rotate(45deg)';
        }
        this.container.appendChild(canvas);
        return canvas.getContext('2d');
    }
}
