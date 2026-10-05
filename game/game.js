import {
    ceilingFan_001,
    ceilingFan_002,
    ceilingFan_003
} from "./assets/ascii/environments/ceiling.js";

import {
    startAsciiAnimation
} from "../engine/ascii/effects/animation/asciiAnimation.js";

import {
    resizeCanvas,
    drawAscii
} from "../engine/ascii/effects/visual/asciiRenderer.js";


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

resizeCanvas(canvas);

window.addEventListener("resize", () => {
    resizeCanvas(canvas);
});


const animation = startAsciiAnimation(
    [
        ceilingFan_001,
        ceilingFan_002,
        ceilingFan_003
    ],
    {
        frameDuration: 800
    }
);


function render() {
    drawAscii(ctx, animation.frame);
    requestAnimationFrame(render);
}

render();