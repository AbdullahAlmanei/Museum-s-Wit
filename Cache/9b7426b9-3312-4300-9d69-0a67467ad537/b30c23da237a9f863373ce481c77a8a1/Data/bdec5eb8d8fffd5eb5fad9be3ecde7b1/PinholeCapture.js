"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinholeCapture = void 0;
var __selfType = requireType("./PinholeCapture");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit/Providers/CameraProvider/WorldCameraFinderProvider");
const PinholeCameraModel_1 = require("./PinholeCameraModel");
let PinholeCapture = class PinholeCapture extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(() => {
            // Initialize camera module and its dependencies
            this.cameraRequest = CameraModule.createCameraRequest();
            this.cameraRequest.cameraId = CameraModule.CameraId.Right_Color;
            const cameraTexture = this.cameraModule.requestCamera(this.cameraRequest);
            this.cameraDevice = global.deviceInfoSystem.getTrackingCameraForId(this.cameraRequest.cameraId);
            this.cameraModel = PinholeCameraModel_1.PinholeCameraModel.create(this.cameraDevice);
            // crop to match the aspect ratio of the camera
            // 0.15 is the offset frm the resized vertex 
            /*
            this.cameraModel.crop(
              this.cameraModel.resolution.uniformScale(0.15),
              this.cameraModel.resolution.uniformScale(0.7)
            )
              this.cameraModel.resize(new vec2(640, 480))
              */
            this.mainCamera = WorldCameraFinderProvider_1.default.getInstance().getComponent();
        });
    }
    /*
     saveMatrix()  {
        this.viewToWorld = this.mainCamera
          .getTransform()
          .getWorldTransform();
          print("Called saveMatrix")
      }
          */
    saveMatrix() {
        if (!this.mainCamera) {
            print("Error: mainCamera is not initialized");
            return false;
        }
        try {
            this.viewToWorld = this.mainCamera.getTransform().getWorldTransform();
            print("Matrix saved successfully");
            return true;
        }
        catch (e) {
            print("Error saving matrix: " + e);
            return false;
        }
    }
    worldToCapture(worldPos) {
        const viewPos = this.viewToWorld.inverse().multiplyPoint(worldPos);
        const capturePos = this.cameraDevice.pose.multiplyPoint(viewPos);
        const captureUV = this.cameraModel.projectToUV(capturePos);
        return captureUV;
    }
    /*
      captureToWorld(captureUV: vec2, depth: number): vec3 {
        const capturePos = this.cameraModel.unprojectFromUV(captureUV, depth);
        const viewPos = this.cameraDevice.pose.inverse().multiplyPoint(capturePos);
        const worldPos = this.viewToWorld.multiplyPoint(viewPos);
        r
        */
    captureToWorld(captureUV, depth) {
        if (!this.viewToWorld) {
            print("Error: viewToWorld matrix is undefined. Call saveMatrix() first.");
            // Return a default position or null
            return new vec3(0, 0, 0);
        }
        const capturePos = this.cameraModel.unprojectFromUV(captureUV, depth);
        const viewPos = this.cameraDevice.pose.inverse().multiplyPoint(capturePos);
        const worldPos = this.viewToWorld.multiplyPoint(viewPos);
        return worldPos;
    }
    __initialize() {
        super.__initialize();
        this.cameraModule = require("LensStudio:CameraModule");
    }
};
exports.PinholeCapture = PinholeCapture;
exports.PinholeCapture = PinholeCapture = __decorate([
    component
], PinholeCapture);
//# sourceMappingURL=PinholeCapture.js.map