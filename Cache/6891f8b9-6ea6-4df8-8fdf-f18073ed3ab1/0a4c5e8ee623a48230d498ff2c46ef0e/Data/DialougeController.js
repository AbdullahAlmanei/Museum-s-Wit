//@input Component.Text        dialogueText
//@input SceneObject           closeBtn
//@input SceneObject           panel

//@input Component.ScriptComponent containerFrame
//@input float   padding          = 2
//@input int   charsPerLine = 38     // wrap width (monospace-equivalent chars)
//@input float lineHeight   = 2    // cm the frame must grow per extra line
//@input float baseHeight   = 15   // cm initial height (already set in Inspector)

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
    updateFrameHeightByCount();              // ← counts chars, not bounds
    typingEvt = script.createEvent("DelayedCallbackEvent");
    typingEvt.bind(scheduleNextChar);
    typingEvt.reset(0.03);   // 30 ms per letter → ~33 cps
}

function resizeFrame(targetH) {
    const size = script.containerFrame.innerSize;   // keep width
    size.y = targetH;
    script.containerFrame.setInnerSizePreserveScale(size);
}

function updateFrameHeightByCount() {
    const lines = Math.ceil(charIndex / script.charsPerLine);
    const targetH = script.baseHeight +
                    Math.max(0, lines - 1) * script.lineHeight;
    resizeFrame(targetH);
}


function stopTyping() {           // called when we hit the end
    if (typingEvt) typingEvt.enabled = false;
    typingEvt = null;
}


// Wire the X button

