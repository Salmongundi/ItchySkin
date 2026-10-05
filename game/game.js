import { SCENES } from "./scenes.js";

import {
    setCursor
} from "./cursor.js";

import {
    upCursor,
    rightCursor,
    downCursor,
    leftCursor
} from "./assets/ascii/cursors/arrows.js";

import { normalCursor } from "./assets/ascii/cursors/normal.js";

import {
    startAsciiAnimation
} from "../engine/ascii/effects/animation/asciiAnimation.js";

import {
    resizeCanvas,
    drawAscii
} from "../engine/ascii/effects/visual/asciiRenderer.js";


const NAVIGATION_EDGE_RATIO = 0.05;
const NAVIGATION_CURSORS = {
    up: upCursor,
    right: rightCursor,
    down: downCursor,
    left: leftCursor
};


const START_SCENE = "ceiling";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let currentScene = null;
let currentAnimation = null;

// ==================================================
// CANVAS
// ==================================================

resizeCanvas(canvas);

window.addEventListener("resize", () => {
    resizeCanvas(canvas);
});

/* 
 * Function to determine which edge of the canvas the mouse is near.
 * Returns "N", "E", "S", "W" for top, right, bottom, left respectively.
 * Returns null if the mouse is not near any edge or is in a corner.
 */

function getEdgeNavigation(mouseX, mouseY) {
    const edgeWidth = canvas.clientWidth * NAVIGATION_EDGE_RATIO;
    const edgeHeight = canvas.clientHeight * NAVIGATION_EDGE_RATIO;

    const nearLeft = mouseX < edgeWidth;
    const nearRight = mouseX > canvas.clientWidth - edgeWidth;
    const nearTop = mouseY < edgeHeight;
    const nearBottom = mouseY > canvas.clientHeight - edgeHeight;

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

/* Function to update the cursor state based on the mouse position. */
function updateCursorState(mouseX, mouseY) {
    const direction = getEdgeNavigation(mouseX, mouseY);

    if (!direction) {
        setCursor(normalCursor);
        return;
    }

    const nextScene = currentScene.navigation?.[direction];

    if (!nextScene) {
        setCursor(normalCursor);
        return;
    }

    setCursor(NAVIGATION_CURSORS[direction]);
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
// NAVIGATION
// ==================================================

/* Function to navigate to the next scene based on the given direction. */
function navigate(direction) {
    const nextScene = currentScene.navigation?.[direction];

    if (!nextScene) {
        return;
    }

    loadScene(nextScene);
}

canvas.addEventListener("mousemove", (event) => {
    updateCursorState(
        event.offsetX,
        event.offsetY
    );
});

canvas.addEventListener("click", (event) => {
    const direction = getEdgeNavigation(
        event.offsetX,
        event.offsetY
    );

    if (!direction) {
        return;
    }

    navigate(direction);
});


// ==================================================
// START GAME
// ==================================================

loadScene(START_SCENE);


// ==================================================
// RENDER
// ==================================================

function render() {
    drawAscii(ctx, currentAnimation.frame);

    requestAnimationFrame(render);
}

render();