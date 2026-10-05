import { normalCursor } from "./assets/ascii/cursors/normal.js";

const CURSOR_FONT_FAMILY = "monospace";

let cursorElement = null;
let currentCursor = null;

let characterWidth = 0;
let characterHeight = 0;


// ==================================================
// SETUP
// ==================================================

function createCursorElement() {
    cursorElement = document.createElement("pre");

    cursorElement.style.position = "fixed";
    cursorElement.style.margin = "0";
    cursorElement.style.padding = "0";

    cursorElement.style.fontFamily = CURSOR_FONT_FAMILY;
    cursorElement.style.lineHeight = "1";

    cursorElement.style.pointerEvents = "none";
    cursorElement.style.zIndex = "9999";

    cursorElement.style.whiteSpace = "pre";

    document.body.style.cursor = "none";

    document.body.appendChild(cursorElement);
}


// ==================================================
// MEASUREMENT
// ==================================================

function measureCharacterSize(fontSize) {
    const measurementCanvas = document.createElement("canvas");
    const measurementContext = measurementCanvas.getContext("2d");

    measurementContext.font =
        `${fontSize}px ${CURSOR_FONT_FAMILY}`;

    characterWidth =
        measurementContext.measureText("M").width;

    characterHeight = fontSize;
}


// ==================================================
// CURSOR
// ==================================================

export function setCursor(cursor) {
    currentCursor = cursor;

    cursorElement.textContent = cursor.artwork;

    cursorElement.style.fontSize =
        `${cursor.fontSize}px`;

    measureCharacterSize(cursor.fontSize);
}


// ==================================================
// MOUSE
// ==================================================

function updatePosition(event) {
    if (!currentCursor) {
        return;
    }

    const offsetX =
        currentCursor.hotspot.column * characterWidth;

    const offsetY =
        currentCursor.hotspot.row * characterHeight;

    cursorElement.style.left =
        `${event.clientX - offsetX}px`;

    cursorElement.style.top =
        `${event.clientY - offsetY}px`;
}


// ==================================================
// START
// ==================================================

createCursorElement();

setCursor(normalCursor);

window.addEventListener("mousemove", updatePosition);