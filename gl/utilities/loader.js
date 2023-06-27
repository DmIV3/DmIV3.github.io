class Loader{

    static loadOBJ(src){
        let result = [];
        let positions = [];
        let texCoords = [];
        let normals = [];
        let faces = [];
        
        src = src.split('\n');
        for(let line of src){
            let info = line.split(' ');
            if(info[0] === 'v'){
                positions.push([+info[1], +info[2], +info[3]]);
            }else if(info[0] === 'vt'){
                texCoords.push([+info[1], +info[2]]);
            }else if(info[0] === 'vn'){
                normals.push([+info[1], +info[2], +info[3]]);
            }else if(info[0] === 'f'){
                if(info.length > 4){
                    Loader.fail('Error: Model polygones must be triangulated!');
                    return Loader.loadOBJ(DEFAULT_MODEL);
                }
                faces.push([info[1], info[2], info[3]]);
            }
        }

        if(positions.length === 0 || texCoords.length === 0 || normals.length === 0){
            Loader.fail('Error: Wrong file type. It should be in ".obj" format and contain: poisitions, texture coordinates and normals!');
            return Loader.loadOBJ(DEFAULT_MODEL);
        }
        
        for(let face of faces){
            for(let vert of face){
                let i = vert.split('/');
                
                if(positions[+i[0]-1] === undefined ||
                        normals[+i[2]-1] === undefined ||
                        texCoords[+i[1]-1] === undefined){
                    Loader.fail('Error: File missing some data!');
                    return Loader.loadOBJ(DEFAULT_MODEL);
                }

                result.push(...positions[+i[0]  -1]);
                result.push(...normals[+i[2]    -1]);
                result.push(...texCoords[+i[1]  -1]);
            }
        }
    
        return new Float32Array(result).buffer;
    }

    static fail(msg){
        Messanger.push(msg);
    }

    static loadDefaultModel(callback){ 
        let model = Loader.loadOBJ(DEFAULT_MODEL);
        callback(model);
    }

    static loadDefaultTexture(callback){
        let img = document.createElement('img');
        img.onload = ()=>{
            callback(img);
        }
        img.src = 'assets/defaultTexture.jpg';
    }
}