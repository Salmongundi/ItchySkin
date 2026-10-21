

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
    upRightCursor,
    upLeftCursor,
    downRightCursor,
    downLeftCursor
} from "./assets/ascii/cursors/arrows.js";

import { setCursor } from "./cursor.js";

import {
    createDevTools,
    updateDevCoordinateDisplay
} from "./devTools.js";

import {
    advanceMessage,
    isMessageOpen,
    showMessage
} from "./dialogue.js";

import { interactWithProp } from "./interactions.js";

import {
    drawInventoryUI,
    isInventoryLabelAt,
    isInventoryPanelAt,
    toggleInventory,
    isInventoryOpen,
    closeInventory
} from "./inventoryUI.js";

import {
    getEdgeNavigation,
    getNavigationArea,
    getNextScene
} from "./navigation.js";

import {
    normalCursor,
    interactionCursor
} from "./assets/ascii/cursors/normal.js";

import {
    getCurrentPalette,
    cyclePalette
} from "./palette.js";

import { checkDrillAssembly } from "./quests.js";

import {
    getPropAt,
    getPropArtwork
} from "./props.js";

import { SCENES } from "./scenes/index.js";

import {
    gameState
} from "./state.js";

// #endregion




// #region CONSTANTS

const NAVIGATION_EDGE_RATIO = 0.05;
const START_SCENE = "mouseHoleEntrance";
const CURSORS = {
    up: upCursor,
    right: rightCursor,
    down: downCursor,
    left: leftCursor,
    upRight: upRightCursor,
    upLeft: upLeftCursor,
    downRight: downRightCursor,
    downLeft: downLeftCursor
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


 // #region PALETTE CONTROL

const PALETTE_ART = [
    "┏━┓",
    "┗━┛"
].join("\n");

const PALETTE_LINES = PALETTE_ART.split("\n");
const PALETTE_WIDTH = Math.max(...PALETTE_LINES.map(line => line.length));
const PALETTE_HEIGHT = PALETTE_LINES.length;

function getPalettePosition() {
    const { offsetX, offsetY, characterWidth, characterHeight } =
        artworkGeometry;

    return {
        column: Math.ceil(-offsetX / characterWidth),
        row: Math.floor(
            (canvas.height - offsetY) / characterHeight
        ) - PALETTE_HEIGHT
    };
}

function isPaletteControlAt(position) {
    if (!position || !artworkGeometry) {
        return false;
    }

    const { column, row } = getPalettePosition();

    return (
        position.column >= column &&
        position.column < column + PALETTE_WIDTH &&
        position.row >= row &&
        position.row < row + PALETTE_HEIGHT
    );
}

function drawPaletteControl() {
    if (!artworkGeometry) {
        return;
    }

    const palette = getCurrentPalette();
    const { column, row } = getPalettePosition();
    const { offsetX, offsetY, characterWidth, characterHeight } =
        artworkGeometry;

    ctx.fillStyle = palette.background;
    ctx.fillRect(
        offsetX + column * characterWidth,
        offsetY + row * characterHeight,
        PALETTE_WIDTH * characterWidth,
        PALETTE_HEIGHT * characterHeight
    );

    ctx.fillStyle = palette.foreground;

    drawAsciiAt(
        ctx,
        PALETTE_ART,
        column,
        row,
        1,
        artworkGeometry
    );
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

    currentScene = {
        ...scene,
        props: (scene.props ?? []).filter(prop =>
            !gameState.props[prop.id]?.pickedUp &&
            !gameState.props[prop.id]?.removed
        )
    };

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

    if (
        isInventoryLabelAt(position, artworkGeometry) ||
        isInventoryPanelAt(position, artworkGeometry)
    ) {
        setCursor(interactionCursor);
        return;
    }

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
    if (isMessageOpen()) {
        advanceMessage();

        if (!isMessageOpen()) {
            const questMessage = checkDrillAssembly();

            if (questMessage) {
                showMessage(questMessage);
            }
        }

        return;
    }

    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const position = getArtworkPosition(
        mouseX,
        mouseY
    );

    // Cycle palette when its control is clicked.
    if (isPaletteControlAt(position)) {
        cyclePalette();
        return;
    }

    // Toggle inventory from its label.
    if (isInventoryLabelAt(position, artworkGeometry)) {
        toggleInventory();
        return;
    }

    // Clicking inside the open panel does nothing.
    if (isInventoryPanelAt(position, artworkGeometry)) {
        return;
    }

    // Close inventory, then continue processing the room click.
    if (isInventoryOpen()) {
        closeInventory();
    }

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

        currentScene.props = currentScene.props.filter(
            item => !gameState.props[item.id]?.pickedUp
        );
    }
});


// #endregion

// #region START GAME

createDevTools();

loadScene(START_SCENE);

// #endregion

// #region RENDER

function render() {
    const palette = getCurrentPalette();

    ctx.fillStyle = palette.foreground;
    artworkGeometry = drawAscii(ctx, currentAnimation.frame);

    currentScene.props = (currentScene.props ?? []).filter(
        prop =>
            !gameState.props[prop.id]?.pickedUp &&
            !gameState.props[prop.id]?.removed
    );

    for (const prop of currentScene.props) {
        const artwork = getPropArtwork(prop);

        drawAsciiAt(
            ctx,
            artwork,
            prop.column,
            prop.row,
            prop.scale,
            artworkGeometry
        );
    }

    drawInventoryUI(ctx, artworkGeometry);
    drawPaletteControl();

    requestAnimationFrame(render);
}

// #endregion

render();

