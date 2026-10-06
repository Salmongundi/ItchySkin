// #region IMPORTS

import { startAsciiAnimation
} from "../engine/ascii/effects/animation/asciiAnimation.js";

import {
    resizeCanvas,
    drawAscii,
    drawAsciiAt
} from "../engine/ascii/effects/visual/asciiRenderer.js";

import {
    upCursor,
    rightCursor,
    downCursor,
    leftCursor,
    upRightCursor
} from "./assets/ascii/cursors/arrows.js";

import { setCursor } from "./cursor.js";

import {
    createDevTools,
    updateDevCoordinateDisplay
} from "./devTools.js";

import { interactWithProp } from "./interactions.js";

import {
    getEdgeNavigation,
    getNavigationArea,
    getNextScene
} from "./navigation.js";

import {
    normalCursor,
    interactionCursor
} from "./assets/ascii/cursors/normal.js";

import { getPropAt } from "./props.js";
import { SCENES } from "./scenes.js";

import {
    gameState,
    getPropState
} from "./state.js";

// #endregion

// #region CONSTANTS

const NAVIGATION_EDGE_RATIO = 0.05;
const START_SCENE = "showerInterior";
const CURSORS = {
    up: upCursor,
    right: rightCursor,
    down: downCursor,
    left: leftCursor,
    upRight: upRightCursor
};

// #endregion

// #region DOM / STATE

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let artworkGeometry = null;
let currentScene = null;
let currentAnimation = null;

let devCoordinateDisplay = null;

// #endregion

// #region CANVAS

resizeCanvas(canvas);

window.addEventListener("resize", () => {
    resizeCanvas(canvas);
});

// #endregion

// #region DEVELOPER TOOLS

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

// #endregion

// #region NAVIGATION

function navigate(direction) {
    const nextScene =
        getNextScene(
            currentScene,
            direction
        );

    if (!nextScene) {
        return;
    }

    loadScene(nextScene);
}

// #endregion

// #region CURSOR

function updateCursorState(mouseX, mouseY) {
    const direction =
        getEdgeNavigation(
            mouseX,
            mouseY,
            canvas,
            NAVIGATION_EDGE_RATIO
        );

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

// #endregion

// #region SCENES

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

// #endregion

// #region MOUSE EVENTS
canvas.addEventListener("mousemove", (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const position = getArtworkPosition(
        mouseX,
        mouseY
    );

    updateDevCoordinateDisplay(position);

    const edgeDirection = getEdgeNavigation(
        mouseX,
        mouseY,
        canvas,
        NAVIGATION_EDGE_RATIO
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
        mouseX,
        mouseY,
        currentScene,
        getArtworkPosition
    );

    if (navigationArea) {
        setCursor(CURSORS[navigationArea.cursor]);
        return;
    }

    const prop = getPropAt(
        mouseX,
        mouseY,
        currentScene,
        getArtworkPosition
    );

    if (prop) {
        setCursor(interactionCursor);
        return;
    }

    setCursor(normalCursor);
});


canvas.addEventListener("click", (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const direction = getEdgeNavigation(
        mouseX,
        mouseY,
        canvas,
        NAVIGATION_EDGE_RATIO
    );

    if (direction) {
        navigate(direction);

        updateCursorState(
            mouseX,
            mouseY
        );

        return;
    }

    const navigationArea = getNavigationArea(
        mouseX,
        mouseY,
        currentScene,
        getArtworkPosition
    );

    if (navigationArea) {
        loadScene(navigationArea.destination);

        updateCursorState(
            mouseX,
            mouseY
        );

        return;
    }

    const prop = getPropAt(
        mouseX,
        mouseY,
        currentScene,
        getArtworkPosition
    );

    if (prop) {
        interactWithProp(prop);
    }
});

// #endregion

// #region START GAME

createDevTools();

loadScene(START_SCENE);

// #endregion

// #region RENDER

function render() {
    artworkGeometry = drawAscii(
        ctx,
        currentAnimation.frame
    );

    for (const prop of currentScene.props ?? []) {
        const propState = getPropState(prop);

        const artwork =
            prop.artwork.states[propState];

        drawAsciiAt(
            ctx,
            artwork,
            prop.column,
            prop.row,
            prop.scale,
            artworkGeometry
        );
    }

    requestAnimationFrame(render);
}

render();

// #endregion


