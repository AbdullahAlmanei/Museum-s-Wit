"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectionContainer = void 0;
var __selfType = requireType("./DetectionContainer");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let DetectionContainer = class DetectionContainer extends BaseScriptComponent {
    onAwake() {
        if (!this.polylinePoints || this.polylinePoints.length < 4) {
            print("Warning: Insufficient polyline points in NewScript");
        }
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });
    }
    onStart() {
        // Initially enable the billboard
        this.billboard.enabled = true;
        print(`Billboard is active: ${this.billboard.enabled}`);
        // Create and setup the delayed event
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => {
            this.billboard.enabled = false;
            print(`Billboard is inactive after delay: ${this.billboard.enabled}`);
            // Apply the _billboardOnUpdate condition after delay
            if (this._billboardOnUpdate) {
                this.billboard.enabled = true;
            }
        });
        // Start the delay (2 seconds = 2)
        delayedEvent.reset(10);
        print("Billboard delay has started");
    }
    setBillboardOnUpdate(enabled) {
        this._billboardOnUpdate = enabled;
        print(`Billboard on update: ${this._billboardOnUpdate}`);
    }
};
exports.DetectionContainer = DetectionContainer;
exports.DetectionContainer = DetectionContainer = __decorate([
    component
], DetectionContainer);
//# sourceMappingURL=DetectionContainer.js.map