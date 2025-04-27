"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechToText = void 0;
var __selfType = requireType("./VoiceML");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let SpeechToText = class SpeechToText extends BaseScriptComponent {
    onAwake() {
        let options = VoiceML.ListeningOptions.create();
        options.shouldReturnAsrTranscription = true;
        options.shouldReturnInterimAsrTranscription = true;
        this.voiceMLModule.onListeningEnabled.add(() => {
            this.voiceMLModule.startListening(options);
            this.voiceMLModule.onListeningUpdate.add(this.onListenUpdate);
        });
    }
    __initialize() {
        super.__initialize();
        this.voiceMLModule = require("LensStudio:VoiceMLModule");
        this.onListenUpdate = (eventData) => {
            if (eventData.isFinalTranscription) {
                this.text.text = eventData.transcription;
            }
        };
    }
};
exports.SpeechToText = SpeechToText;
exports.SpeechToText = SpeechToText = __decorate([
    component
], SpeechToText);
//# sourceMappingURL=VoiceML.js.map