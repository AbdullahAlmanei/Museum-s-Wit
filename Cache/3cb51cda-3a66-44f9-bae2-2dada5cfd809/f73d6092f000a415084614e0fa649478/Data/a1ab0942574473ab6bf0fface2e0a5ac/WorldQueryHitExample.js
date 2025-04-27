"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewScript = void 0;
var __selfType = requireType("./WorldQueryHitExample");
function component(target) { target.getTypeName = function () { return __selfType; }; }
// import required modules
const WorldQueryModule = require("LensStudio:WorldQueryModule");
const SIK = require("SpectaclesInteractionKit/SIK").SIK;
const InteractorTriggerType = require("SpectaclesInteractionKit/Core/Interactor/Interactor").InteractorTriggerType;
// Import CameraService
const CameraService_1 = require("../ObjectDetection/Scripts/TS/CameraService");
const EPSILON = 0.01;
let NewScript = class NewScript extends BaseScriptComponent {
    onAwake() {
        // Initialize CameraService
        this.cameraService = CameraService_1.CameraService.getInstance();
        print("CameraService initialized in WorldQueryHitAdjuster");
        // create new hit session
        this.hitTestSession = this.createHitTestSession(this.filterEnabled);
        if (!this.sceneObject) {
            print("Please set Target Object input");
            return;
        }
        this.transform = this.targetObject.getTransform();
        // disable target object when surface is not detected
        this.targetObject.enabled = false;
        this.setObjectEnabled(this.indexToSpawn);
        // create update event
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }
    createHitTestSession(filterEnabled) {
        // create hit test session with options
        var options = HitTestSessionOptions.create();
        options.filter = filterEnabled;
        var session = WorldQueryModule.createHitTestSessionWithOptions(options);
        return session;
    }
    onHitTestResult(results) {
        if (results === null) {
            this.targetObject.enabled = false;
        }
        else {
            this.targetObject.enabled = true;
            // get hit information
            const hitPosition = results.position;
            const hitNormal = results.normal;
            //identifying the direction the object should look at based on the normal of the hit location.
            var lookDirection;
            if (1 - Math.abs(hitNormal.normalize().dot(vec3.up())) < EPSILON) {
                lookDirection = vec3.forward();
            }
            else {
                lookDirection = hitNormal.cross(vec3.up());
            }
            const toRotation = quat.lookAt(lookDirection, hitNormal);
            //set position and rotation
            this.targetObject.getTransform().setWorldPosition(hitPosition);
            this.targetObject.getTransform().setWorldRotation(toRotation);
        }
    }
    onUpdate() {
        const rayStart = this.getCameraPosition();
        const direction = this.cameraService
            .getCamera(CameraService_1.CameraType.Main)
            .getTransform().back;
        // Create rayEnd by manually adding scaled direction components
        const rayEnd = new vec3(rayStart.x + direction.x * 1000, rayStart.y + direction.y * 1000, rayStart.z + direction.z * 1000);
        this.hitTestSession.hitTest(rayStart, rayEnd, this.onHitTestResult.bind(this));
    }
    setObjectIndex(i) {
        this.indexToSpawn = i;
    }
    setObjectEnabled(i) {
        for (let i = 0; i < this.objectsToSpawn.length; i++)
            this.objectsToSpawn[i].enabled = i == this.indexToSpawn;
    }
    getCameraPosition() {
        const mainCamera = this.cameraService.getCamera(CameraService_1.CameraType.Main);
        return mainCamera.getTransform().getWorldPosition();
    }
};
exports.NewScript = NewScript;
exports.NewScript = NewScript = __decorate([
    component
], NewScript);
//# sourceMappingURL=WorldQueryHitExample.js.map