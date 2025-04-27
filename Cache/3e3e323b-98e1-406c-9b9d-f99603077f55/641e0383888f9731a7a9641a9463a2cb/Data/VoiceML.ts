@component
export class SpeechToText extends BaseScriptComponent {
  // Remote service module for fetching data
  private voiceMLModule: VoiceMLModule = require("LensStudio:VoiceMLModule");

  onAwake() {
    let options = VoiceML.ListeningOptions.create();
    options.shouldReturnAsrTranscription = true;
    options.shouldReturnInterimAsrTranscription = true;
    this.voiceMLModule.onListeningEnabled.add(() => {
      this.voiceMLModule.startListening(options);
      this.voiceMLModule.onListeningUpdate.add(this.onListenUpdate);
    });
  }

  onListenUpdate = (eventData: VoiceML.ListeningUpdateEventArgs) => {
    if (eventData.isFinalTranscription) {
        print(eventData.transcription)
        const url = 'https://meet-gopher-moving.ngrok-free.app/voice'

        print("sending request")
    
        // Create a request with the image data included
        const request = new Request(url, {
            method: 'POST',
            body: JSON.stringify({
                voiceText: eventData.transcription 
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        print("sent request")
        
        const response = await remoteServiceModule.fetch(request);
        print("got response ")
        
        if (!script.buttonMesh) {
          print("No MeshVisual on this object!");
          return;
      }
      
        script.buttonMesh.clearMaterials();
        if(script.loadingMaterial)
        {script.buttonMesh.addMaterial(script.idleMaterial);}
      
    
        if (response.status === 200) {
          const responseJson = await response.json();
          print("API response received");
          
          if (responseJson && responseJson.choices && 
              responseJson.choices[0] && responseJson.choices[0].message) {
              script.dialogueCtrl.api.open(responseJson.choices[0].message.content);
          } else {
              // Otherwise just show a success message
              script.dialogueCtrl.api.open("Pondering on art...");
          }
        }
    
    }
  };
}