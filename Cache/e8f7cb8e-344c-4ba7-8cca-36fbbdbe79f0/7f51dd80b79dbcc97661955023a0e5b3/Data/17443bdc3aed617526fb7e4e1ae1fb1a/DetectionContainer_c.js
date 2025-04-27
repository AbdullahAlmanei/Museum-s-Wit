if (script.onAwake) {
	script.onAwake();
	return;
};
function checkUndefined(property, showIfData){
   for (var i = 0; i < showIfData.length; i++){
       if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]){
           return;
       }
   }
   if (script[property] == undefined){
      throw new Error('Input ' + property + ' was not provided for the object ' + script.getSceneObject().name);
   }
}
// @input Component.Text categoryAndConfidence
checkUndefined("categoryAndConfidence", []);
// @input Component.Text distanceFromCamera
checkUndefined("distanceFromCamera", []);
// @input ClosedPolyline polyline
checkUndefined("polyline", []);
// @input Billboard billboard
checkUndefined("billboard", []);
// @input SceneObject[] polylinePoints
checkUndefined("polylinePoints", []);
var scriptPrototype = Object.getPrototypeOf(script);
if (!global.BaseScriptComponent){
   function BaseScriptComponent(){}
   global.BaseScriptComponent = BaseScriptComponent;
   global.BaseScriptComponent.prototype = scriptPrototype;
   global.BaseScriptComponent.prototype.__initialize = function(){};
   global.BaseScriptComponent.getTypeName = function(){
       throw new Error("Cannot get type name from the class, not decorated with @component");
   }
}
var Module = require("../../../../../../Modules/Src/Assets/ObjectDetection/Scripts/TS/DetectionContainer");
Object.setPrototypeOf(script, Module.DetectionContainer.prototype);
script.__initialize();
if (script.onAwake) {
   script.onAwake();
}
