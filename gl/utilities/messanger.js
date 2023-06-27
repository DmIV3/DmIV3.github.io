class Messanger{
    static messages = [];
    static msgBox;
    static ready = true;

    static init(){
        Messanger.msgBox = document.querySelector('.msg');
    }

    static push(text){
        Messanger.messages.push(text);
        if(Messanger.ready)
            Messanger.showMessage(Messanger.messages.shift());
    }

    static showMessage(text){
        Messanger.ready = false;
        Messanger.msgBox.innerText = text;
        Messanger.msgBox.classList.add('msg-show');
        Messanger.msgBox.classList.remove('msg-hide');
        setTimeout(()=>{
            Messanger.ready = true;
            Messanger.msgBox.classList.remove('msg-show');
            Messanger.msgBox.classList.add('msg-hide');
            if(Messanger.messages.length > 0)
                Messanger.showMessage(Messanger.messages.shift());
        }, 2000);
    }

}