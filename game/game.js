import { SCENES } from "./scenes.js";

import {
    startAsciiAnimation
} from "../engine/ascii/effects/animation/asciiAnimation.js";

import {
    resizeCanvas,
    drawAscii
} from "../engine/ascii/effects/visual/asciiRenderer.js";


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

function navigate(direction) {
    const nextScene = currentScene.exits?.[direction];

    if (!nextScene) {
        return;
    }

    loadScene(nextScene);
}

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        navigate("left");
    }

    if (event.key === "ArrowRight") {
        navigate("right");
    }
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