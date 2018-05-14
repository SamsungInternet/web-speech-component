var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let recognition = null;
let bgcol = '#0096FF';

//-- defines the custom element 
class WebSpeechWrapper extends HTMLElement {   

    static get observedAttributes() {
        return ['vr', 'bgcolor'];
    }

    get vr() {
        return this.hasAttribute('vr');
    }
    
    set vr(val) {
        // Reflect the value of `vr` as an attribute.
        if (val) {
            this.setAttribute('vr', '');
        } else {
            this.removeAttribute('vr');
        }
    }

    get bgcolor() {
        return this.hasAttribute('bgcolor');
    }
    
    set bgcolor(val) {
        // Reflect the value of `bgcolor` as an attribute.
        if (val) {
            this.setAttribute('bgcolor', '');
        } else {
            this.removeAttribute('bgcolor');
        }
    }

    constructor(){
        super();

        //shadow dom
        var shadow = this.attachShadow({mode:'open'});
        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        //UI for component
        if(!this.hasAttribute('vr')){
            let btn_mic_2d = document.createElement('div');
            btn_mic_2d.setAttribute('class', 'btn-mic-2d');
            let ico_dom_2d = document.createElement('img');
            ico_dom_2d.setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 228.02 401.56"><path fill="%23FFF" d="M57.764 371.565h41.248v-52.967C43.134 311.254 0 263.446 0 205.564v-86.528c1.067-5.821 6.166-10.232 12.295-10.232 6.616 0 12.032 5.141 12.47 11.646v81.353c0 49.289 39.957 89.246 89.246 89.246 49.289 0 89.246-39.957 89.246-89.246v-83.746c1.516-5.341 6.43-9.253 12.256-9.253 6.208 0 11.378 4.439 12.51 10.316v86.444c0 57.882-43.134 105.69-99.012 113.034v52.967h41.248c8.284 0 14.999 6.715 14.999 14.999s-6.715 15-14.999 15H57.764c-8.284 0-14.999-6.716-14.999-15 0-8.284 6.715-14.999 15-14.999zm-13.88-246.32V75.839C43.884 33.954 75.28 0 114.01 0c38.731 0 70.128 33.954 70.128 75.84v47.372c-.247.941-.38 1.935-.38 2.963v56.099c0 1.027.133 2.021.38 2.963v9.141c0 41.884-31.397 75.839-70.128 75.839-38.73 0-70.127-33.955-70.127-75.839v-11.175l.022-.725v-56.507l-.022-.726z"/></svg>');
            ico_dom_2d.setAttribute('class', 'ico-mic-2d');
            btn_mic_2d.appendChild(ico_dom_2d);
            btn_mic_2d.onclick = function() {
                recognition.start();
                document.querySelector('web-speech').shadowRoot.querySelector('.btn-mic-2d').style.backgroundColor = 'red';
                console.log('Ready to receive a command.');
            }
            
            if(this.hasAttribute('bgcolor')){
                bgcol = this.getAttribute('bgcolor');
            }
            //style for shadow dom
            var style = document.createElement('style');
            style.textContent = `.btn-mic-2d{
                                    background-color: ${bgcol};
                                    border-radius: 50%;
                                    padding:7%;
                                    width:50px;
                                    height:50px;
                                    border: none;
                                    transition: color .5s ease-in, background-color .5s ease-in, border .5s ease-in;
                                }
                                .ico-mic-2d{
                                    width:100%;
                                    height:100%;
                                    object-fit:contain;
                                }
                                `;
            wrapper.appendChild(btn_mic_2d);
            shadow.appendChild(style);
            shadow.appendChild(wrapper);
        }
        else{
            console.log('no lolo');
        }
                
        this.init_speech();
    }

    init_speech(){
    
        let colors = ['red', 'blue'];
        let grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
    
        recognition = new SpeechRecognition();
        let speechRecognitionList = new SpeechGrammarList();
    
        speechRecognitionList.addFromString(grammar, 1);
    
        recognition.grammars = speechRecognitionList;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
    
        recognition.onspeechend = function() {
            recognition.stop();
            document.querySelector('web-speech').shadowRoot.querySelector('.btn-mic-2d').style.backgroundColor = bgcol;
            wsc_onspeechend();
        }
    
        recognition.onnomatch = function(event) {
            diagnostic.textContent = 'I didnt recognise that color.';
        }
    
        recognition.onerror = function(event) {
            diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
            wsc_onerror(err);
        }
    
        recognition.onresult = function(event) {
            let last = event.results.length - 1;
            let word = event.results[last][0].transcript;
            console.log(word + ', Confidence: ' + event.results[0][0].confidence);
            wsc_onresult(word);
        }
    }
}

//registers the custom element
customElements.define('web-speech', WebSpeechWrapper);