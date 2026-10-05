import { SCENES } from "./scenes.js";

import {
    setCursor
} from "./cursor.js";

import {
    upCursor,
    rightCursor,
    downCursor,
    leftCursor,
    upRightCursor
} from "./assets/ascii/cursors/arrows.js";

import {
    normalCursor
} from "./assets/ascii/cursors/normal.js";

import {
    startAsciiAnimation
} from "../engine/ascii/effects/animation/asciiAnimation.js";

import {
    resizeCanvas,
    drawAscii
} from "../engine/ascii/effects/visual/asciiRenderer.js";


// ==================================================
// CONSTANTS
// ==================================================

const DEV_MODE = true;

const START_SCENE = "ceiling";

const NAVIGATION_EDGE_RATIO = 0.05;

const CURSORS = {
    up: upCursor,
    right: rightCursor,
    down: downCursor,
    left: leftCursor,
    upRight: upRightCursor
};


// ==================================================
// DOM / STATE
// ==================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let artworkGeometry = null;
let currentScene = null;
let currentAnimation = null;

let devCoordinateDisplay = null;


// ==================================================
// CANVAS
// ==================================================

resizeCanvas(canvas);

window.addEventListener("resize", () => {
    resizeCanvas(canvas);
});


// ==================================================
// DEVELOPER TOOLS
// ==================================================

function createDevTools() {
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


function getArtworkPosition(mouseX, mouseY) {
    if (!artworkGeometry) {
        return null;
    }

    const {
        offsetX,
        offsetY,
        characterWidth,
        characterHeight
    } = artworkGeometry;

    const column = Math.floor(
        (mouseX * window.devicePixelRatio - offsetX) /
        characterWidth
    );

    const row = Math.floor(
        (mouseY * window.devicePixelRatio - offsetY) /
        characterHeight
    );

    return {
        column,
        row
    };
}


function updateDevCoordinateDisplay(position) {
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


// ==================================================
// NAVIGATION
// ==================================================

function getEdgeNavigation(mouseX, mouseY) {
    const edgeWidth =
        canvas.clientWidth * NAVIGATION_EDGE_RATIO;

    const edgeHeight =
        canvas.clientHeight * NAVIGATION_EDGE_RATIO;

    const nearLeft =
        mouseX < edgeWidth;

    const nearRight =
        mouseX > canvas.clientWidth - edgeWidth;

    const nearTop =
        mouseY < edgeHeight;

    const nearBottom =
        mouseY > canvas.clientHeight - edgeHeight;


    // Corners are dead zones.
    if (
        (nearTop && nearLeft) ||
        (nearTop && nearRight) ||
        (nearBottom && nearLeft) ||
        (nearBottom && nearRight)
    ) {
        return null;
    }


    if (nearTop) {
        return "up";
    }

    if (nearRight) {
        return "right";
    }

    if (nearBottom) {
        return "down";
    }

    if (nearLeft) {
        return "left";
    }

    return null;
}

function getNavigationArea(mouseX, mouseY) {
    if (!currentScene.navigationAreas) {
        return null;
    }

    const position = getArtworkPosition(mouseX, mouseY);

    for (const navigationArea of currentScene.navigationAreas) {
        const { column, row, width, height } =
            navigationArea.area;

        if (
            position.column >= column &&
            position.column < column + width &&
            position.row >= row &&
            position.row < row + height
        ) {
            return navigationArea;
        }
    }

    return null;
}

function navigate(direction) {
    const nextScene =
        currentScene.navigation?.[direction];

    if (!nextScene) {
        return;
    }

    loadScene(nextScene);
}


// ==================================================
// CURSOR
// ==================================================

function updateCursorState(mouseX, mouseY) {
    const direction =
        getEdgeNavigation(mouseX, mouseY);

    if (!direction) {
        setCursor(normalCursor);
        return;
    }

    const nextScene =
        currentScene.navigation?.[direction];

    if (!nextScene) {
        setCursor(normalCursor);
        return;
    }

    setCursor(CURSORS[direction]);
}


// ==================================================
// SCENES
// ==================================================

function loadScene(sceneId) {
    const scene = SCENES[sceneId];

    if (!scene) {
        throw new Error(`Scene not found: ${sceneId}`);
    }

    currentScene = scene;

    currentAnimation?.stop();

    currentAnimation = startAsciiAnimation(
        scene.animation.frames,
        {
            frameDuration: scene.animation.frameDuration
        }
    );
}


// ==================================================
// MOUSE EVENTS
// ==================================================

canvas.addEventListener("mousemove", (event) => {
    const position = getArtworkPosition(
        event.offsetX,
        event.offsetY
    );

    updateDevCoordinateDisplay(position);

    const edgeDirection = getEdgeNavigation(
        event.offsetX,
        event.offsetY
    );

    if (edgeDirection) {
        const nextScene =
            currentScene.navigation?.[edgeDirection];

        if (nextScene) {
            setCursor(CURSORS[edgeDirection]);
            return;
        }
    }

    const navigationArea = getNavigationArea(
        event.offsetX,
        event.offsetY
    );

    if (navigationArea) {
        setCursor(CURSORS[navigationArea.cursor]);
        return;
    }

    setCursor(normalCursor);
});


canvas.addEventListener("click", (event) => {
    const direction = getEdgeNavigation(
        event.offsetX,
        event.offsetY
    );

    if (direction) {
        navigate(direction);

        updateCursorState(
            event.offsetX,
            event.offsetY
        );

        return;
    }

    const navigationArea = getNavigationArea(
        event.offsetX,
        event.offsetY
    );

    if (navigationArea) {
        loadScene(navigationArea.destination);

        updateCursorState(
            event.offsetX,
            event.offsetY
        );
    }
    });


// ==================================================
// START GAME
// ==================================================

createDevTools();

loadScene(START_SCENE);


// ==================================================
// RENDER
// ==================================================

function render() {
    artworkGeometry = drawAscii(
        ctx,
        currentAnimation.frame
    );

    requestAnimationFrame(render);
}

render();