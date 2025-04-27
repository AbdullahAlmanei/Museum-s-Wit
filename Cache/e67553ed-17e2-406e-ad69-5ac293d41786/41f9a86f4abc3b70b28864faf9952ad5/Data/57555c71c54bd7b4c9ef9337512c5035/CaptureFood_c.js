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
// @input Interactable buttonForImageAndText
checkUndefined("buttonForImageAndText", []);
// @input Interactable buttonForText
checkUndefined("buttonForText", []);
// @input Component.Text responseText
checkUndefined("responseText", []);
// @input string imagePromptText = "Describe the contents of this image."
checkUndefined("imagePromptText", []);
// @input string promptText = "Roast me as a snapchat user."
checkUndefined("promptText", []);
// @input string openAIClientID = "YOUR_OPENAI_API_KEY_HERE"
checkUndefined("openAIClientID", []);
// @input string imgurClientID = "YOUR_IMGUR_CLIENT_ID_HERE"
checkUndefined("imgurClientID", []);
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
var Module = require("../../../Modules/Src/Assets/CaptureFood");
Object.setPrototypeOf(script, Module.CaptureFood.prototype);
script.__initialize();
if (script.onAwake) {
   script.onAwake();
}
