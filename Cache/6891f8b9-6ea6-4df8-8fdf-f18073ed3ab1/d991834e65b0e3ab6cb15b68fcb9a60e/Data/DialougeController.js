//@input Component.Text        dialogueText
//@input SceneObject           closeBtn
//@input SceneObject           panel

//@input Component.ScriptComponent containerFrame

script.api.open = openDialogue;
script.api.close = closeDialogue;

var fullText = "";
var charIndex = 0;
var typingEvt = null;   // DelayedCallbackEvent handle


// Kick off typewriter effect --------------------------------------------------
function openDialogue(text) {
    script.panel.enabled = true;
    fullText = text;
    charIndex = 0;
    script.dialogueText.text = "";        // clear

    scheduleNextChar();
}

// Close + clean-up ------------------------------------------------------------
function closeDialogue() {
    if (typingEvt) typingEvt.enabled = false;
    script.getSceneObject().enabled = false;
}

function scheduleNextChar() {
    if (charIndex > fullText.length) { stopTyping(); return; }

    script.dialogueText.text = fullText.substr(0, charIndex++);
    updateFrameHeight();
    typingEvt = script.createEvent("DelayedCallbackEvent");
    typingEvt.bind(scheduleNextChar);
    typingEvt.reset(0.03);   // 30 ms per letter → ~33 cps
}

function updateFrameHeight() {
    // force Lens Studio to re-evaluate text bounds this frame
    script.dialogueText.refresh();

    // bounds = [xMin, yMin, xMax, yMax]
    const b = script.dialogueText.bounds;
    const textHeight = (b.z - b.y);

    // keep original width, only change Y
    const size = script.containerFrame.innerSize;   // vec2
    const minH = 30.0;                              // your initial height
    size.y = Math.max(textHeight + script.padding, minH);

    // resize but keep global scale intact
    script.containerFrame.setInnerSizePreserveScale(size);
}

function stopTyping() {           // called when we hit the end
    if (typingEvt) typingEvt.enabled = false;
    typingEvt = null;
}


// Wire the X button

