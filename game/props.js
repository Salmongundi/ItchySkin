
import {
    getPropState,
    getPropTalking
} from "./state.js";

// Get the current artwork frame for a prop.
export function getPropArtwork(prop, time = performance.now()) {
    const state = getPropState(prop);
    const artwork = prop.definition.artwork.states[state];

    let frames = artwork;

    // Character artwork can have separate idle and talking frames.
    if (artwork && typeof artwork === "object" && !Array.isArray(artwork)) {
        frames = getPropTalking(prop)
            ? artwork.talking
            : artwork.idle;
    }

    // A single string is treated as a one-frame animation.
    if (typeof frames === "string") {
        return frames;
    }

    if (!Array.isArray(frames) || frames.length === 0) {
        console.warn(`No artwork frames available for prop "${prop.id}".`);
        return "";
    }

    const frameDuration =
        prop.definition.animation?.frameDuration ?? 300;

    const frameIndex =
        Math.floor(time / frameDuration) % frames.length;

    return frames[frameIndex];
}

export function getPropAt(
    mouseX,
    mouseY,
    currentScene,
    getArtworkPosition
) {
    if (!currentScene.props) {
        return null;
    }

    const position = getArtworkPosition(mouseX, mouseY);

    if (!position) {
        return null;
    }

    for (const prop of currentScene.props) {
        const artwork = getPropArtwork(prop);
        const lines = artwork.split("\n");

        const width = Math.max(
            ...lines.map(line => line.length)
        );

        const height = lines.length;

        const propWidth = width * prop.scale;
        const propHeight = height * prop.scale;

        if (
            position.column >= prop.column &&
            position.column < prop.column + propWidth &&
            position.row >= prop.row &&
            position.row < prop.row + propHeight
        ) {
            return prop;
        }
    }

    return null;
}
