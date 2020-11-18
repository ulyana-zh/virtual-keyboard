window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

let input = document.querySelector('.use-keyboard-input');

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    input: '',
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    language: true,
    sound: true,
    record: false,
    start: 0,
    end: 0,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
  

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input    
    document.querySelectorAll(".use-keyboard-input").forEach(element => {

      element.addEventListener("focus", () => { 
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });

      //this.elements.textArea = document.querySelector('.use-keyboard-input');

      element.addEventListener('click', () => {
        this.properties.start = input.selectionStart;
        this.properties.end = input.selectionEnd;
      });

      element.addEventListener("keydown", key => {
        this.properties.value += key.key;
        this.open(element.value, currentValue => {
          if (this.properties.start > element.value.length) {
            element.value += currentValue.substring(currentValue.length - 1, currentValue.length);
          }
          else {
            element.value = element.value.substring(0, this.properties.start-1)
              + currentValue.substring(this.properties.start-1, this.properties.end) 
                + element.value.substring(this.properties.end-1, element.value.length);
          }
        });
        this.properties.start++;
        this.properties.end++;
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();

    const keyLayoutEn = [
      ['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=','+'], "Backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", ['[', '{'], [']', '}'], 'en',
      "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", [';', ':'], ["'", '"'],  "Enter",
       "Shift", "z", "x", "c", "v", "b", "n", "m", [',', '<'], ['.', '>'], ['/', '?'],
      'sound', "done", 'record', "space", 'ArrowLeft', 'ArrowRight'
    ];

    const keyLayoutRu = [
      'ё', ['1', '!'], ['2', '"'], ['3', '№'], ['4', ';'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], '-', '+', "Backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", 'х', 'ъ', 'ru',
      "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", 'ж', 'э', "Enter",
       "Shift", "я", "ч", "с", "м", "и", "т", "ь", 'б', 'ю', ['.', ','],
      'sound', "done", 'record', "space", 'ArrowLeft', 'ArrowRight'
    ];

    let keyLayout;
    if(this.properties.language) {
      keyLayout = keyLayoutEn;
    } else {
      keyLayout = keyLayoutRu; 
    }     

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["Backspace", "en", 'ru', "Enter", 'sound'].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.setAttribute("data", 'key');
      keyElement.classList.add("keyboard__key");


      //Add some music
      const playing = () => {
        if(key === 'Shift') {
          keyElement.addEventListener('click', () => {
            if(this.properties.sound) {
                const audio = document.querySelector('.audio-shift');
                audio.currentTime = 0;
                audio.play();
            }
           })   
        } else if(key === 'Backspace') {
          keyElement.addEventListener('click', () => {
            if(this.properties.sound) {
                const audio = document.querySelector('.audio-backspace');
                audio.currentTime = 0;
                audio.play();
            }
           })   
        } else if(key === 'CapsLock') {
          keyElement.addEventListener('click', () => {
            if(this.properties.sound) {
                const audio = document.querySelector('.audio-capslock');
                audio.currentTime = 0;
                audio.play();
            }
           })   
        } else if(key === 'Enter') {
          keyElement.addEventListener('click', () => {
            if(this.properties.sound) {
                const audio = document.querySelector('.audio-enter');
                audio.currentTime = 0;
                audio.play();
            }
           })   
        } else {
          keyElement.addEventListener('click', () => {
            if(this.properties.sound) {
              if(this.properties.language) {
                const audio = document.querySelector('.audio-en');
                audio.currentTime = 0;
                audio.play();
              } else {
                const audio = document.querySelector('.audio-ru');
                audio.currentTime = 0;
                audio.play();
              }
            }
           })
        }
        };

         playing();

    //Add real keyboard keydown     
    window.addEventListener("keydown", e => {
      if(typeof key === 'string') {
        if (key === e.key) {
          keyElement.classList.add("keyboard__key-active");
          setTimeout(() => {
              keyElement.classList.remove("keyboard__key-active");
          }, 100);
      }
      } else {
        if (key[0]=== e.key) {
          keyElement.classList.add("keyboard__key-active");
          setTimeout(() => {
              keyElement.classList.remove("keyboard__key-active");
          }, 100);
      } 
      }
    })

    switch (key) {

        case 'sound':

          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          if(this.properties.sound) keyElement.classList.add("keyboard__key--active"); 
          keyElement.innerHTML = `<img src='./assets/volume.svg' width='20px' height='20px'></img>`;
          keyElement.addEventListener("click", () => {
            this.properties.sound = !this.properties.sound;
            keyElement.classList.toggle("keyboard__key--active", this.properties.sound);
            playing();
            input.focus();
          });
          break;

        case 'record':
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("mic");

          keyElement.addEventListener("click", () => {
            this.properties.record = !this.properties.record;
            this.properties.record ? this._startRecord() : this._stopRecord();
            keyElement.classList.toggle("keyboard__key--active", this.properties.record);
            input.focus();
          });
        break;

        case "en":

          keyElement.innerText = 'en';
            keyElement.addEventListener("click", () => {
              this.properties.language = !this.properties.language;
              this.properties.shift = false;
              this.properties.capsLock = false;
              

              while (this.elements.keysContainer.children.length > 0) {
                this.elements.keysContainer.children[0].remove(); 
              }
              this.elements.keysContainer.appendChild(this._createKeys());
              this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");  
              input.focus(); 
          });
        
          break;

          case "ru":

            keyElement.innerText = 'ru';
            keyElement.addEventListener("click", () => {
            this.properties.language = !this.properties.language;
            this.properties.shift = false;
            this.properties.capsLock = false;
            
            
            
            while (this.elements.keysContainer.children.length > 0) {
              this.elements.keysContainer.children[0].remove();
            }
            this.elements.keysContainer.appendChild(this._createKeys());
            this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
            input.focus();
          });

          break;

        case "Backspace":

          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            
            if (this.properties.start !== this.properties.end) {
              this.properties.value = this.properties.value.substring(0, this.properties.start)
                + this.properties.value.substring(this.properties.end, this.properties.value.length);
            }
            else 
              this.properties.value = this.properties.value.substring(0, this.properties.start-1) 
                + this.properties.value.substring(this.properties.end, this.properties.value.length);
            
            this._triggerEvent("oninput");
            input.focus();

            let range = this.properties.end - this.properties.start;
            if (range > 0) {
              this.properties.end -= range;
            }
            else {
              this.properties.start--;
              this.properties.end--;
            }

            if (this.properties.start < 0) this.properties.start = 0;
            if (this.properties.end < 0) this.properties.end = 0;

            input.setSelectionRange(this.properties.start, this.properties.end);
            
          });

          break;

        case "CapsLock":

          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
            input.focus();
          });

          window.addEventListener("keydown", (e) => {
            if (e.key === 'CapsLock') {
              this._toggleCapsLock();
              keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
              input.focus();
            }
          });

          break;
      

          case "Shift":
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
            keyElement.innerText = 'Shift';
  
            keyElement.addEventListener("click", () => {
              this._toggleShift();

              for (let i = 0; i<keyLayout.length; i++) {
                if (typeof keyLayout[i] !== 'string') { 
                  keyLayout[i].reverse();
                    for (const key of this.elements.keys) {
                          if (key.textContent === keyLayout[i][1]) {
                            key.textContent = keyLayout[i][0];
                          }
                    }
                } 
              }
              input.focus();
              keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            });
            break;

        case "Enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.start) + "\n" 
            + this.properties.value.substring(this.properties.end, this.properties.value.length);

            let range = this.properties.end - this.properties.start;
            if (range > 0) this.properties.end -= range;

            this.properties.start++;
            this.properties.end++;
            
            this._triggerEvent("oninput");
            input.focus();
            input.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.start) 
            + ' ' 
              + this.properties.value.substring(this.properties.end, this.properties.value.length);
          this.properties.start++;
          this.properties.end++;
          this._triggerEvent("oninput");
          input.focus();

          let range = this.properties.end - this.properties.start;
          input.setSelectionRange(this.properties.start, this.properties.end);
          if (range > 0) this.properties.end -= range;
          });

          break;

          case 'ArrowLeft': 
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML("arrow_left");
          keyElement.addEventListener("click", () => {
            this.properties.start--;
            this.properties.end--;
            if (this.properties.start < 0) this.properties.start = 0;
            if (this.properties.end < 0) this.properties.end = 0;
            input.setSelectionRange(this.properties.start, this.properties.end);
            this._triggerEvent("oninput");
            input.focus();
          });
          break;

          case 'ArrowRight': 
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML("arrow_right");
          keyElement.addEventListener("click", () => {
            this.properties.start++;
            this.properties.end++;
            if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
            if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
            input.setSelectionRange(this.properties.start, this.properties.end);
            this._triggerEvent("oninput");
            input.focus();
          });
         

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        default:
          if(typeof key === 'string') {
            keyElement.textContent = key.toLowerCase();
            keyElement.addEventListener("click", () => {
              key = this.properties.capsLock || this.properties.shift ? key.toUpperCase() : key.toLowerCase();
              

              this.properties.value = this.properties.value.substring(0, this.properties.start) + key 
              + this.properties.value.substring(this.properties.end, this.properties.value.length);

              let range = this.properties.end - this.properties.start;
              if (range > 0) this.properties.end-=range;
                          
              this.properties.start++;
              this.properties.end++;
              
              this._triggerEvent("oninput");
              input.focus();  
              input.setSelectionRange(this.properties.start, this.properties.end);
            
            });
          } else {
            this.properties.shift ? keyElement.textContent = key[1] : keyElement.textContent = key[0];

            keyElement.addEventListener("click", () => {
              this.properties.value = this.properties.value.substring(0, this.properties.start) + keyElement.textContent 
              + this.properties.value.substring(this.properties.end, this.properties.value.length);

              let range = this.properties.end - this.properties.start;
              if (range > 0) this.properties.end-=range;
            
              this.properties.start++;
              this.properties.end++;
              
              this._triggerEvent("oninput");
              input.focus(); 
              input.setSelectionRange(this.properties.start, this.properties.end);
            });  
          }     
          break; 
  
      };

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });
    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if(key.textContent !== 'Shift' && key.textContent !== 'ru' && key.textContent !== 'en' ) {
          key.textContent = this.properties.capsLock || this.properties.shift  ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
        
      } 
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if(key.textContent !== 'Shift' && key.textContent !== 'ru' && key.textContent !== 'en' ) {
          key.textContent = this.properties.shift || this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      } 
  }
},

_recordLanguage() {
  recognition.lang = this.properties.language ? "en-US" : "ru-RU";
},

_startRecord() {
  recognition.interimResults = true;
  this._recordLanguage();

  recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join("");

      if (e.results[0].isFinal) {
        input.value += ` ${transcript}`;
      }
  });
  recognition.addEventListener("end", recognition.start);
  recognition.start();
},

_stopRecord() {
  recognition.abort();
  recognition.stop();
  recognition.removeEventListener('end', recognition.start);
},

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
