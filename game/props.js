import { getPropState } from "./state.js";

export function getPropAt(
    mouseX,
    mouseY,
    currentScene,
    getArtworkPosition
) {
    if (!currentScene.props) {
        return null;
    }

    const position =
        getArtworkPosition(mouseX, mouseY);

    if (!position) {
        return null;
    }

    for (const prop of currentScene.props) {
        const propState = getPropState(prop);

        const artwork =
            prop.artwork.states[propState];

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