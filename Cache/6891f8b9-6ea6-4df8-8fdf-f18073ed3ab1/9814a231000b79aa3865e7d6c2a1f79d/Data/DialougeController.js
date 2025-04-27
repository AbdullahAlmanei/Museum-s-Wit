//@input Component.Text        dialogueText
//@input SceneObject           closeBtn

script.api.open  = openDialogue;
script.api.close = closeDialogue;

var fullText   = "";
var charIndex  = 0;
var typingEvt  = null;   // DelayedCallbackEvent handle


// Kick off typewriter effect --------------------------------------------------
function openDialogue(text) {
    fullText          = text;
    charIndex         = 0;
    script.dialogueText.text = "";        // clear
    script.getSceneObject().enabled = true;
    const interactable = (this.closeButton).interactable;
if (!interactable) {
    print("CloseButton has no Interactable!");
    return;
}

    scheduleNextChar();
}

// Close + clean-up ------------------------------------------------------------
function closeDialogue() {
    if (typingEvt) typingEvt.enabled = false;
    script.getSceneObject().enabled = false;
}

function scheduleNextChar() {
    if (charIndex > fullText.length) return;

    script.dialogueText.text = fullText.substr(0, charIndex++);
    typingEvt = script.createEvent("DelayedCallbackEvent");
    typingEvt.bind(scheduleNextChar);
    typingEvt.reset(0.03);   // 30 ms per letter → ~33 cps
}

// Wire the X button

