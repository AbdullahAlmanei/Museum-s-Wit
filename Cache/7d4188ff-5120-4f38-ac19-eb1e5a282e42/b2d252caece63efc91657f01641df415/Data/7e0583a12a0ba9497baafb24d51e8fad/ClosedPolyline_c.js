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
// @input SceneObject[] points
checkUndefined("points", []);
// @input Asset.Material lineMaterial
checkUndefined("lineMaterial", []);
// @input vec3 _color = "{1, 1, 0}" {"widget":"color"}
checkUndefined("_color", []);
// @input float lineWidth = 0.5
checkUndefined("lineWidth", []);
// @input float lineStyle {"widget":"combobox", "values":[{"label":"Full", "value":0}, {"label":"Split", "value":1}, {"label":"FadedEnd", "value":2}]}
checkUndefined("lineStyle", []);
// @input bool continuousLine = true
checkUndefined("continuousLine", []);
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
var Module = require("../../../../../../Modules/Src/Assets/ObjectDetection/Scripts/TS/ClosedPolyline");
Object.setPrototypeOf(script, Module.ClosedPolyline.prototype);
script.__initialize();
if (script.onAwake) {
   script.onAwake();
}
