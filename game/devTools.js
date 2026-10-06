const DEV_MODE = true;

let devCoordinateDisplay = null;


export function createDevTools() {
    if (!DEV_MODE) {
        return;
    }

    devCoordinateDisplay = document.createElement("div");

    devCoordinateDisplay.style.position = "fixed";
    devCoordinateDisplay.style.top = "10px";
    devCoordinateDisplay.style.left = "10px";
    devCoordinateDisplay.style.zIndex = "10000";
    devCoordinateDisplay.style.fontFamily = "monospace";
    devCoordinateDisplay.style.fontSize = "14px";
    devCoordinateDisplay.style.color = "white";
    devCoordinateDisplay.style.background = "black";
    devCoordinateDisplay.style.padding = "4px 6px";
    devCoordinateDisplay.style.pointerEvents = "none";

    document.body.appendChild(devCoordinateDisplay);
}


export function updateDevCoordinateDisplay(position) {
    if (!DEV_MODE || !devCoordinateDisplay) {
        return;
    }

    if (!position) {
        devCoordinateDisplay.textContent = "";
        return;
    }

    devCoordinateDisplay.textContent =
        `Column: ${position.column}  Row: ${position.row}`;
}