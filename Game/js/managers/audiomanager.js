class SFX{
    static sounds = [];
    static readySounds = [];
    static playRequests = [];

    static loadSounds(soundsToLoad){
        SFX.sounds = [];
        SFX.readySounds = new Array(soundsToLoad.length).fill(false);

        for (let i = 0; i < soundsToLoad.length; i++) {
            let sound = new Audio(soundsToLoad[i].src);
            
            sound.volume =  SETTINGS.audioVolume;
            sound.loop = soundsToLoad[i].loop || false;
            SFX.sounds.push({
                name: soundsToLoad[i].name,
                sound: sound,
                start: soundsToLoad[i].start || 0,
                end: soundsToLoad[i].end,
                loop: soundsToLoad[i].loop || false,
                paused: false
            });

            SFX.sounds[i].sound.addEventListener("canplay", SFX.#playListener, false);
        }
    }

    static #playListener(){
        for (let i = 0; i < SFX.sounds.length; i++) {
            SFX.readySounds[i] = true;
            if(SFX.sounds[i].sound == this){
                if(SFX.sounds[i].end == undefined){
                    SFX.sounds[i].end = this.duration;
                }
            }
            
        }
        this.removeEventListener("canplay", SFX.#playListener, false);
    }

    static soundsLoaded(){
        for (let i = 0; i < SFX.readySounds.length; i++) {
            if(!SFX.readySounds[i])
                return false;  
        }
        return true;
    }

    static play(name){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name)
                this.playRequests.push(
                    SFX.sounds[i]
                ); 
        }
    }

    static isPlaying(name){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name)
                return !SFX.sounds[i].sound.paused;
        }
    }

    static stop(name){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name){
                if(!SFX.sounds[i].sound.paused)
                    SFX.sounds[i].paused = true;
                SFX.sounds[i].sound.currentTime = SFX.sounds[i].start;
                SFX.sounds[i].sound.pause();
            }
        }
    }

    static stopAll(){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(!SFX.sounds[i].sound.paused)
                SFX.sounds[i].paused = true;
            SFX.sounds[i].sound.currentTime = SFX.sounds[i].start;
            SFX.sounds[i].sound.pause();
        }
    }

    static pause(name){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name){
                if(!SFX.sounds[i].sound.paused)
                    SFX.sounds[i].paused = true;
                SFX.sounds[i].sound.pause();
            }
        }
    }

    static pauseAll(){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(!SFX.sounds[i].sound.paused)
                SFX.sounds[i].paused = true;
            SFX.sounds[i].sound.pause();  
        }
    }

    static resume(name){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name){
                if(SFX.sounds[i].paused)
                    SFX.sounds[i].paused = false;
                SFX.sounds[i].sound.play();
            }
        }
    }

    static resumeAll(){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].paused){
                SFX.sounds[i].sound.play();
                SFX.sounds[i].paused = false;
            }
        }
    }

    static reset(name){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name){
                SFX.sounds[i].sound.currentTime = SFX.sounds[i].start;
            }
        }
    }
    
    static setStart(name, t){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name){
                if(t < 0 || t > SFX.sounds[i].sound.duration || t > SFX.sounds[i].end){
                    SFX.sounds[i].start = 0;
                    return;
                }
                SFX.sounds[i].start = t;
            }
        }
    }

    static setEnd(name, t){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name){
                if(t < 0 || t > SFX.sounds[i].sound.duration){
                    SFX.sounds[i].end = SFX.sounds[i].sound.duration;
                    return;
                }
                SFX.sounds[i].end = t;
            }
        }
    }

    static setLoop(name, l){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name){
                SFX.sounds[i].sound.loop = l;
                SFX.sounds[i].loop = l;
            }
        }
    }

    static setVolume(name, v){
        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].name == name){
                if(v < 0)
                    SFX.sounds[i].sound.volume = 0;
                else if(v > 1)
                    SFX.sounds[i].sound.volume = 1;
                else
                    SFX.sounds[i].sound.volume = v;
            }
        }
    }

    static clearRequests(){
        SFX.playRequests = [];
    }

    static update(){
        for (let i = 0; i < SFX.playRequests.length; i++) {
            SFX.playRequests[i].sound.currentTime = SFX.playRequests[i].start;
            SFX.playRequests[i].sound.play().catch(function(ex){
                console.log(ex);
            });
        }

        for (let i = 0; i < SFX.sounds.length; i++) {
            if(SFX.sounds[i].sound.currentTime >= SFX.sounds[i].end){
                if(SFX.sounds[i].loop){
                    SFX.sounds[i].sound.currentTime = SFX.sounds[i].start;
                    SFX.sounds[i].sound.play().catch(function(ex){
                        console.log(ex);
                    });
                }else{
                    SFX.sounds[i].sound.currentTime = SFX.sounds[i].start;
                    SFX.sounds[i].sound.pause();
                }
            }
        }
        SFX.clearRequests();
    }

    static getSounds(){
        return SFX.sounds;
    }
}