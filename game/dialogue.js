// #region DOM

const dialogueBox = document.createElement("div");
dialogueBox.className = "dialogue-box";
dialogueBox.hidden = true;

const dialogueText = document.createElement("p");
dialogueText.className = "dialogue-text";

const dialogueHint = document.createElement("span");
dialogueHint.className = "dialogue-hint";

dialogueBox.append(dialogueText, dialogueHint);
document.body.append(dialogueBox);

// #endregion

// #region STATE

let pages = [];
let currentPage = 0;

// #endregion

// #region DIALOGUE

function updateDialogue() {
    dialogueText.textContent = pages[currentPage];

    dialogueHint.textContent =
        currentPage < pages.length - 1
            ? "Click to continue"
            : "Click to close";
}

export function showMessage(messagePages) {
    pages = Array.isArray(messagePages)
        ? messagePages
        : [messagePages];

    if (pages.length === 0) {
        return;
    }

    currentPage = 0;
    dialogueBox.hidden = false;

    updateDialogue();
}

export function isMessageOpen() {
    return !dialogueBox.hidden;
}

export function advanceMessage() {
    if (!isMessageOpen()) {
        return;
    }

    if (currentPage < pages.length - 1) {
        currentPage++;
        updateDialogue();
        return;
    }

    dialogueBox.hidden = true;
    pages = [];
    currentPage = 0;
}

// #endregion