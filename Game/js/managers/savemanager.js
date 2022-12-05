class SAVER{

    static SAVES = [
        {
            name: "player_pos",
            data: {
                x: 0,
                y: 0
            }
        },
        {
            name: "id",
            data: {
                id: 0
            }
        }
    ];


    static save(){
        window.localStorage.setItem("save", JSON.stringify(this.SAVES));
    }

    static load(){
        SAVER.SAVES = JSON.parse(window.localStorage.getItem("save"));
    }

    static add(name, data){
        for (let i = 0; i < SAVER.SAVES.length; i++) {
            if(name == SAVER.SAVES[i].name){
                SAVER.SAVES[i].data = data;
                return;
            }      
        }
        SAVER.SAVES.push({
            name: name,
            data: data
        });
    }

    static remove(name){
        for (let i = 0; i < SAVER.SAVES.length; i++) {
            if(name == SAVER.SAVES[i].name){
                SAVER.SAVES.splice(i, 1);
                return;
            }      
        }
    }

    static change(name, args){
        for (let i = 0; i < SAVER.SAVES.length; i++) {
            if(name == SAVER.SAVES[i].name){
                SAVER.SAVES[i].data = args;
                return;
            }      
        }
    }

    static get(name){
        for (let i = 0; i < SAVER.SAVES.length; i++) {
            if(name == SAVER.SAVES[i].name)
                return SAVER.SAVES[i].data;
            
        }
    }
}