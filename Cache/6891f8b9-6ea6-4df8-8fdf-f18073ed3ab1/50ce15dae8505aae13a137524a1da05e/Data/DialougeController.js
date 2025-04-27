//@input Component.Text        dialogueText
//@input SceneObject           closeBtn
//@input SceneObject           panel

//@input Component.ScriptComponent containerFrame
//@input float   padding          = 2.0
//@input int   charsPerLine = 38     // wrap width (monospace-equivalent chars)
//@input float lineHeight   = 1.0    // cm the frame must grow per extra line
//@input float baseHeight   = 5.0   // cm initial height (already set in Inspector)

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

function resizeFrameKeepingTop(targetH) {

    // … existing code …
    // 1) remember current height
    var curSize = script.containerFrame.innerSize;
    var curH    = curSize.y;

    // 2) enlarge
    curSize.y = targetH;
    script.containerFrame.setInnerSizePreserveScale(curSize);

    // 3) shift the frame upward by ΔH/2
    var dy = 0.5 * (targetH - curH);
    var t  = script.getSceneObject().getTransform();
    t.setLocalPosition(t.getLocalPosition().add(new vec3(0, dy, 0)));

    // 4) compensate the text so it stays in place
    var txtT = script.dialogueText.getTransform();
    txtT.setLocalPosition(txtT.getLocalPosition().sub(new vec3(0, dy, 0)));
}



function updateFrameHeightByCount() {
    const lines = Math.ceil(charIndex / script.charsPerLine);
    const targetH = script.baseHeight +
                    Math.max(0, lines - 1) * script.lineHeight;
                    resizeFrameKeepingTop(targetH);
}


function stopTyping() {           // called when we hit the end
    if (typingEvt) typingEvt.enabled = false;
    typingEvt = null;
}


// Wire the X button

