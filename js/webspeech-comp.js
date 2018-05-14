let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
let SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
let SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

let colors = ['red', 'blue'];
let grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

let recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1; 