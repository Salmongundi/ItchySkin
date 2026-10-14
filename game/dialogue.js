import { setPropTalking } from "./state.js";

// DOM

const box = document.createElement("div");
box.className = "dialogue-box";
box.hidden = true;

const text = document.createElement("p");
text.className = "dialogue-text";

const choicesBox = document.createElement("div");
choicesBox.className = "dialogue-choices";
choicesBox.hidden = true;

const hint = document.createElement("span");
hint.className = "dialogue-hint";

box.append(text, choicesBox, hint);
document.body.append(box);

// State

let pages = [];
let pageIndex = 0;
let speakerId = null;
let mode = "closed";
let onComplete = null;

// Helpers

function setSpeaker(propId) {
    if (speakerId === propId) return;

    if (speakerId) setPropTalking(speakerId, false);

    speakerId = propId;

    if (speakerId) setPropTalking(speakerId, true);
}

function closeDialogue() {
    setSpeaker(null);
    box.hidden = true;
    choicesBox.replaceChildren();
    choicesBox.hidden = true;
    text.hidden = false;
    hint.hidden = false;
    pages = [];
    pageIndex = 0;
    mode = "closed";
    onComplete = null;
}

function showPage() {
    const page = pages[pageIndex];

    setSpeaker(page.propId);
    text.textContent = page.text;
    hint.textContent =
        pageIndex < pages.length - 1
            ? "Click to continue"
            : "Click to close";
}

// Messages

export function showMessage(messagePages, defaultPropId = null, options = {}) {
    closeDialogue();

    const list = Array.isArray(messagePages)
        ? messagePages
        : [messagePages];

    pages = list.map(page =>
        typeof page === "string"
            ? { text: page, propId: defaultPropId }
            : {
                text: page.text,
                propId: Object.prototype.hasOwnProperty.call(page, "propId")
                    ? page.propId
                    : defaultPropId
            }
    );

    if (!pages.length) {
        options.onComplete?.();
        return;
    }

    onComplete = options.onComplete ?? null;
    mode = "message";
    box.hidden = false;
    choicesBox.hidden = true;
    showPage();
}

export function isMessageOpen() {
    return mode !== "closed";
}

export function advanceMessage() {
    if (mode !== "message") return;

    if (pageIndex < pages.length - 1) {
        pageIndex++;
        showPage();
        return;
    }

    const complete = onComplete;
    closeDialogue();
    complete?.();
}

// Menus

export function showMenu(choices, onChoose) {
    closeDialogue();

    if (!choices.length) return;

    mode = "menu";
    box.hidden = false;
    text.hidden = true;
    hint.hidden = true;
    choicesBox.hidden = false;

    for (const choice of choices) {
        const button = document.createElement("button");
        button.className = "dialogue-choice";
        button.textContent = choice.label;
        button.addEventListener("click", event => {
            event.stopPropagation();
            onChoose(choice);
        });
        choicesBox.append(button);
    }
}

// Clicking outside closes menus, but not dialogue pages.

document.addEventListener("click", event => {
    if (mode === "menu" && !box.contains(event.target)) {
        closeDialogue();
        event.stopImmediatePropagation();
    }
}, true);

box.addEventListener("click", () => {
    if (mode === "message") {
        advanceMessage();
    }
});