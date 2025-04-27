//-----------------------------------------------
//  Inspector inputs
//-----------------------------------------------
//@input Component.MeshVisual          buttonMesh
//@input Asset.Material                idleMaterial
//@input Asset.Material                loadingMaterial
//@input Component.ScriptComponent     dialogueCtrl   // DialogueController.js

//-----------------------------------------------
//  Imports
//-----------------------------------------------
var VoiceMLModule       = require('LensStudio:VoiceMLModule');
var RemoteServiceModule = require('LensStudio:RemoteServiceModule');

//-----------------------------------------------
//  Voice-ML options (one-time)
//-----------------------------------------------
var listenOpts = VoiceML.ListeningOptions.create();
listenOpts.languageCode                      = 'en_US';
listenOpts.shouldReturnAsrTranscription      = true;
listenOpts.shouldReturnInterimAsrTranscription = true;
listenOpts.addSpeechContext(["wit"], 4);

//-----------------------------------------------
//  Life-cycle: start mic as soon as Lens starts
//-----------------------------------------------
script.createEvent('OnStartEvent').bind(function () {

    VoiceMLModule.onListeningEnabled.add(function () {
        VoiceMLModule.startListening(listenOpts);
        swapMaterial(script.idleMaterial);               // visual “live” cue
    });

    VoiceMLModule.onListeningUpdate.add(onListeningUpdate);
});

//-----------------------------------------------
//  Speech-to-backend callback
//-----------------------------------------------
async function onListeningUpdate(eventArgs) {

    // ignore interim strings; wait for final transcript
    if (!eventArgs.isFinalTranscription) { return; }

    if (eventArgs.transcription.toLowerCase().indexOf("wit") === -1) {
        return;
    }
    
    var req = new Request('https://meet-gopher-moving.ngrok-free.app/voice', {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify({ voiceText : eventArgs.transcription })
    });

    swapMaterial(script.loadingMaterial);                   // spinner

    try {
        var resp  = await RemoteServiceModule.fetch(req);
        if (resp.status === 200) {

            var data = await resp.json();
            var text = data.voiceText

            script.dialogueCtrl.api.open(text);             // open dialog box
        }
    } catch (e) {
        print('Fetch failed: ' + e);
    }

    swapMaterial(script.idleMaterial);                      // back to idle
}

//-----------------------------------------------
//  Helper: switch button material
//-----------------------------------------------
function swapMaterial(mat) {
    if (!script.buttonMesh || !mat) { return; }
    script.buttonMesh.clearMaterials();
    script.buttonMesh.addMaterial(mat);
}
