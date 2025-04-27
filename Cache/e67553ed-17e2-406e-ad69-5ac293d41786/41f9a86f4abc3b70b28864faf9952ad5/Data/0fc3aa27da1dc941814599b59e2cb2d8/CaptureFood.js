"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptureFood = void 0;
var __selfType = requireType("./CaptureFood");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const validate_1 = require("./SpectaclesInteractionKit/Utils/validate");
let cameraModule = require('LensStudio:CameraModule');
let remoteServiceModule = require('LensStudio:RemoteServiceModule');
// CaptureFood.js
let CaptureFood = class CaptureFood extends BaseScriptComponent {
    async uploadBase64ImageToImgur(base64Image) {
        const url = "https://api.imgur.com/3/image";
        const clientId = this.imgurClientID;
        const request = new Request(url, {
            method: 'POST',
            body: JSON.stringify({
                image: base64Image,
                type: 'base64'
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Client-ID ${clientId}`
            }
        });
        try {
            const response = await remoteServiceModule.fetch(request);
            if (response.status === 200) {
                const responseJson = await response.json();
                return responseJson.data.link;
            }
            else {
                const errorText = await response.text();
                print('Imgur upload failed:' + errorText);
                throw new Error('Failed to upload image to Imgur');
            }
        }
        catch (error) {
            print('Error uploading image to Imgur:' + error);
            throw error;
        }
    }
    async sendImageAndPromptToOpenAI(image, prompt) {
        print("sendIMageAndPrompt");
        const url = 'https://3c00-164-67-70-232.ngrok-free.app/test';
        try {
            // Create a request with the image data included
            const request = new Request(url, {
                method: 'POST',
                body: JSON.stringify({
                    prompt: prompt,
                    image: image // Send the full base64 image data
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Send the request
            const response = await remoteServiceModule.fetch(request);
            if (response.status === 200) {
                // Just print the response without calling handleOpenAIResponse
                const responseJson = await response.json();
                print("API response received");
                // If response contains a message, display it directly
                if (responseJson && responseJson.choices &&
                    responseJson.choices[0] && responseJson.choices[0].message) {
                    this.responseText.text = responseJson.choices[0].message.content;
                }
                else {
                    // Otherwise just show a success message
                    this.responseText.text = "Image sent successfully!";
                }
            }
            else {
                const errorText = await response.text();
                print('API request failed: ' + errorText);
                this.responseText.text = "Error: " + errorText;
            }
        }
        catch (error) {
            print('Error sending image to API: ' + error);
            this.responseText.text = "Error: " + error;
        }
        // try {
        //     const imageUrl = await this.uploadBase64ImageToImgur(image);
        //     const url = "https://api.openai.com/v1/chat/completions";
        //     const request = new Request(url, {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             model: "gpt-4o",
        //             messages: [
        //                 {
        //                     role: "user",
        //                     content: [
        //                         { type: "text", text: prompt },
        //                         { type: "image_url", image_url: { url: imageUrl } }
        //                     ]
        //                 }
        //             ]
        //         }),
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${this.openAIClientID}` 
        //         }
        //     });
        //     const response = await remoteServiceModule.fetch(request);
        //     if (response.status === 200) {
        //         const responseJson = await response.json();
        //         this.handleOpenAIResponse(responseJson);
        //     } else {
        //         const errorText = await response.text();
        //         print('OpenAI request failed:'+ errorText);
        //         throw new Error('Failed to get response from OpenAI');
        //     }
        // } catch (error) {
        //     print('Error sending image and prompt to OpenAI:'+ error);
        // }
    }
    async sendPromptToOpenAI(prompt) {
        print("sendonlyprompt");
        // try {
        //     const url = "https://api.openai.com/v1/chat/completions";
        //     const request = new Request(url, {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             model: "gpt-4o",
        //             messages: [
        //                 {
        //                     role: "user",
        //                     content: prompt
        //                 }
        //             ]
        //         }),
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${this.openAIClientID}` 
        //         }
        //     });
        //     const response = await remoteServiceModule.fetch(request);
        //     if (response.status === 200) {
        //         const responseJson = await response.json();
        //         this.handleOpenAIResponse(responseJson);
        //     } else {
        //         const errorText = await response.text();
        //         print('OpenAI request failed:' + errorText);
        //         throw new Error('Failed to get response from OpenAI');
        //     }
        // } catch (error) {
        //     print('Error sending prompt to OpenAI:' + error);
        // }
    }
    handleOpenAIResponse(response) {
        print("OpenAI response: " + response.choices[0].message.content);
        this.responseText.text = response.choices[0].message.content;
    }
    onAwake() {
        (0, validate_1.validate)(this.buttonForImageAndText);
        this.buttonForImageAndText.onTriggerEnd.add(this.createCameraRequest);
        (0, validate_1.validate)(this.buttonForText);
        this.buttonForText.onTriggerEnd.add(() => this.sendPromptToOpenAI(this.promptText));
    }
    __initialize() {
        super.__initialize();
        this.
        // Create a camera request
        createCameraRequest = () => {
            let cameraRequest = CameraModule.createCameraRequest();
            cameraRequest.cameraId = CameraModule.CameraId.Left_Color;
            this.cameraTexture = cameraModule.requestCamera(cameraRequest);
            let onNewFrame = this.cameraTexture.control.onNewFrame;
            let registration = onNewFrame.add(() => {
                Base64.encodeTextureAsync(this.cameraTexture, (successFrame) => {
                    print("Success: Image captured successfully");
                    this.sendImageAndPromptToOpenAI(successFrame, this.imagePromptText);
                }, () => { }, CompressionQuality.HighQuality, EncodingType.Jpg);
                onNewFrame.remove(registration);
            });
        };
    }
};
exports.CaptureFood = CaptureFood;
exports.CaptureFood = CaptureFood = __decorate([
    component
], CaptureFood);
//# sourceMappingURL=CaptureFood.js.map