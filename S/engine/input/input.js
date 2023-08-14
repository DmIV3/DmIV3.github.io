export const Input = {

  maxTouches: 3,
  touches: {},
  lastTouches: {},

  X: 0,
  Y: 0,
  Wheel: 0,
  buttons: undefined,
  lastButtons: undefined,

  keys: {},
  lastKeys: {},


  init: function(canvas){
    /////////////////////////////////////
    //// INITIALIZE MOUSE INPUT /////////
    this.buttons = new Array(3).fill(false);
    this.lastButtons = new Array(3).fill(false);
    canvas.addEventListener("mousemove", (e)=>{
      e.preventDefault();
      this.X = e.offsetX;
      this.Y = e.offsetY;
    }, false);

    canvas.addEventListener("mousedown", (e)=>{
      if(e.button <= 2)
        this.buttons[e.button] = true;
    }, false);

    canvas.addEventListener("mouseup", (e)=>{
      if(e.button <= 2)
        this.buttons[e.button] = false;
    }, false);

    canvas.addEventListener("contextmenu", (e)=>{
        e.preventDefault();
    }, false);

    canvas.addEventListener("mouseleave", (e)=>{
        e.preventDefault();
        this.releaseButtons();
        this.releaseKeys();
    }, false);

    canvas.addEventListener("wheel", (e)=>{
      e.preventDefault();
      if(e.deltaY > 0)
          this.Wheel = 1;
      else if(e.deltaY < 0)
          this.Wheel = -1;
    }, false);
    //// INITIALIZE MOUSE INPUT /////////
    /////////////////////////////////////


    /////////////////////////////////////
    //// INITIALIZE KEY INPUT ///////////
    this.fillKeys(this.keys);
    this.fillKeys(this.lastKeys);

    document.addEventListener("keydown", (e)=>{
      if(this.keys[e.code] !== undefined){
        this.keys[e.code] = true;
      }
      this.keys["AnyKey"] = true;
    }, true);

    document.addEventListener("keyup", (e)=>{
      if(this.keys[e.code] !== undefined){
        this.keys[e.code] = false;
      }
      this.keys["AnyKey"] = false;
    }, true);
    //// INITIALIZE KEY INPUT ///////////
    /////////////////////////////////////



    /////////////////////////////////////
    //// INITIALIZE TOUCH INPUT /////////
    for (let i = 0; i < this.maxTouches; i++) {
      this.touches[i] = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        active: false
      }
      this.lastTouches[i] = false;
    }

    canvas.addEventListener("touchstart", (e)=>{
      e.preventDefault();
      for(let i = 0; i < e.touches.length; i++){
          for(let j = 0; j < this.maxTouches; j++){
              if(j === e.touches[i].identifier &&  this.touches[j].active === false){
                this.touches[j].x = this.touches[j].startX = e.touches[i].clientX;
                this.touches[j].y = this.touches[j].startY = e.touches[i].clientY;
                this.touches[j].active = true;
              }
          }
      }
    }, {passive: false});

    canvas.addEventListener("touchmove", (e)=>{
      e.preventDefault();
      for(let i = 0; i < e.touches.length; i++){
          for(let j = 0; j < this.maxTouches; j++){
              if(j === e.touches[i].identifier){
                  this.touches[j].x = e.touches[i].clientX;
                  this.touches[j].y = e.touches[i].clientY;
              }
          }
      }
    }, {passive: false});

    canvas.addEventListener("touchend", (e)=>{
      e.preventDefault();
      for(let j = 0; j < this.maxTouches; j++){
          this.touches[j].active = false;
          for(let i = 0; i < e.touches.length; i++){
              if(j === e.touches[i].identifier){
                  this.touches[j].active = true;
              }
          }
      }

      for(let j = 0; j < this.maxTouches; j++){
        if(this.touches[j].active === false){
            this.touches[j].endX = this.touches[j].x;
            this.touches[j].endY = this.touches[j].y;
        }
      }
    }, {passive: false});

    canvas.addEventListener("touchcancel", (e)=>{
      for(let j = 0; j < this.maxTouches; j++){
          this.touches[j].active = false;
          for(let i = 0; i < e.touches.length; i++){
              if(j === e.touches[i].identifier){
                  this.touches[j].active = true;
              }
          }
      }

      for(let j = 0; j < this.maxTouches; j++){
        if(this.touches[j].active === false){
            this.touches[j].endX = this.touches[j].x;
            this.touches[j].endY = this.touches[j].y;
        }
      }
    }, {passive: false});
    //// INITIALIZE TOUCH INPUT /////////
    /////////////////////////////////////


  },

  //////////////////////////////////////////
  //// GET MOUSE INPUTS ////////////////////
  BtnPressed: function(btn){return this.buttons[btn] && !this.lastButtons[btn];},

  BtnReleased: function(btn){return !this.buttons[btn] && this.lastButtons[btn];},

  BtnDown: function(btn){return this.buttons[btn];},

  releaseButtons: function(){for (let i = 0; i < this.buttons.length; i++) this.buttons[i] = false;},
  //// GET MOUSE INPUTS ////////////////////
  //////////////////////////////////////////


  //////////////////////////////////////////
  //// GET KEYBOARD INPUTS /////////////////
  KeyPressed: function(key){return this.keys[key] && !this.lastKeys[key];},

  KeyDown: function(key){return this.keys[key];},

  KeyReleased: function(key){return !this.keys[key] && this.lastKeys[key];},

  releaseKeys: function(){for(let k in this.keys)this.keys[k] = false;},
  //// GET KEYBOARD INPUTS /////////////////
  //////////////////////////////////////////


  //////////////////////////////////////////
  //// GET TOUCH INPUTS ////////////////////
  getTouch: function(id){return this.touches[id];},

  getTouches: function(){return this.touches;},

  touchStarted: function(id){return this.touches[id].active && !this.lastTouches[id];},

  touchEnded: function(id){return !this.touches[id].active && this.lastTouches[id];},
  //// GET TOUCH INPUTS ////////////////////
  //////////////////////////////////////////

  update: function(){
    for (let i = 0; i < this.maxTouches; i++) {
        this.lastTouches[i] = this.touches[i].active;  
    }

    for (let i = 0; i < this.buttons.length; i++){
      this.lastButtons[i] = this.buttons[i];
    }
    this.Wheel = 0;

    for(let k in this.keys){
      this.lastKeys[k] = this.keys[k];
    }
  },



  /////////////////////////////////////////
  //// KEY SHORTCUTS //////////////////////
  fillKeys: function(obj){
    let variants = ["AnyKey", "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0","Minus","Equal","Escape","Backquote","Tab","CapsLock","ShiftLeft","ControlLeft","AltLeft","MetaLeft","Backspace","Delete","Backslash","Enter","ShiftRight","AltRight","ControlRight","Space","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","PageUp","PageDown","NumLock","NumpadDivide","NumpadMultiply","NumpadSubtract","Numpad7","Numpad8","Numpad9","Numpad4","Numpad5","Numpad6","Numpad1","Numpad2","Numpad3","Numpad0","NumpadAdd","NumpadDecimal","NumpadEnter"];
    for (let i = 0; i < variants.length; i++) {
        obj[variants[i]] = false;
    }
  },

  key: {
    ANY: 'AnyKey',

    Q: 'KeyQ',
    W: 'KeyW',
    E: 'KeyE',
    R: 'KeyR',
    T: 'KeyT',
    Y: 'KeyY',
    U: 'KeyU',
    I: 'KeyI',
    O: 'KeyO',
    P: 'KeyP',
    A: 'KeyA',
    S: 'KeyS',
    D: 'KeyD',
    F: 'KeyF',
    G: 'KeyG',
    H: 'KeyH',
    J: 'KeyJ',
    K: 'KeyK',
    L: 'KeyL',
    Z: 'KeyZ',
    X: 'KeyX',
    C: 'KeyC',
    V: 'KeyV',
    B: 'KeyB',
    N: 'KeyN',
    M: 'KeyM',

    D0: 'Digit0',
    D1: 'Digit1',
    D2: 'Digit2',
    D3: 'Digit3',
    D4: 'Digit4',
    D5: 'Digit5',
    D6: 'Digit6',
    D7: 'Digit7',
    D8: 'Digit8',
    D9: 'Digit9',

    N0: 'Numpad0',
    N1: 'Numpad1',
    N2: 'Numpad2',
    N3: 'Numpad3',
    N4: 'Numpad4',
    N5: 'Numpad5',
    N6: 'Numpad6',
    N7: 'Numpad7',
    N8: 'Numpad8',
    N9: 'Numpad9',

    LSHIFT: 'ShiftLeft',
    LCTRL: 'ControlLeft',
    LALT: 'AltLeft',

    RSHIFT: 'ShiftRight',
    RCTRL: 'ControlRight',
    RALT: 'AltRight',

    DMINUS: 'Minus',
    DPLUS: 'Equal',
    DEQUAL: 'Equal',
    BSP: 'Backspace',
    DEL: 'Delete',

    RBRACKET: 'BracketRight',
    LBRACKET: 'BracketLeft',
    BACKSLASH: 'Backslash',

    SEMICOLON: 'Semicolon',
    QUOTE: 'Quote',
    COMMA: 'Comma',
    PERIOD: 'Period',
    SLASH: 'Slash',

    ESC: 'Escape',
    BAKCQUOTE: 'Backquote',
    TILDA: 'Backquote',
    TAB: 'Tab',
    CAPS: 'CapsLock',
    
    ENTER: 'Enter',
    NENTER: 'NumpadEnter',
    SPACE: 'Space',
    HOME: 'Home',
    END: 'End',
    PGUP: 'PageUp',
    PGDOWN: 'PageDown',
    NUMLOCK: 'NumLock',

    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',

    NPLUS: 'NumpadAdd',
    NMINUS: 'NumpadSubtract',
    NDIVIDE: 'NumpadDivide',
    NMULTIPLY: 'NumpadMultiply',
    NDECIMAL: 'NumpadDecimal',
  }
  //// KEY SHORTCUTS //////////////////////
  /////////////////////////////////////////
}

