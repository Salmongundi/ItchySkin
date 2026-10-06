// Navigation utility functions for edge-based and area-based navigation.


// Function to determine the edge-based navigation direction based on mouse position.
export function getEdgeNavigation(
    mouseX,
    mouseY,
    canvas,
    navigationEdgeRatio
) {
    const rect = canvas.getBoundingClientRect();

    const edgeSize =
        rect.width * navigationEdgeRatio;

    const nearLeft = mouseX <= edgeSize;
    const nearRight = mouseX >= rect.width - edgeSize;
    const nearTop = mouseY <= edgeSize;
    const nearBottom = mouseY >= rect.height - edgeSize;

    // Corners are dead zones.
    if (
        (nearLeft || nearRight) &&
        (nearTop || nearBottom)
    ) {
        return null;
    }

    if (nearLeft) {
        return "left";
    }

    if (nearRight) {
        return "right";
    }

    if (nearTop) {
        return "up";
    }

    if (nearBottom) {
        return "down";
    }

    return null;
}

// Function to determine the navigation area based on mouse position.
export function getNavigationArea(
    mouseX,
    mouseY,
    currentScene,
    getArtworkPosition
) {
    if (!currentScene.navigationAreas) {
        return null;
    }

    const position =
        getArtworkPosition(mouseX, mouseY);

    if (!position) {
        return null;
    }

    for (const navigationArea of currentScene.navigationAreas) {
        const area = navigationArea.area;

        if (
            position.column >= area.column &&
            position.column < area.column + area.width &&
            position.row >= area.row &&
            position.row < area.row + area.height
        ) {
            return navigationArea;
        }
    }

    return null;
}

// Function to get the next scene based on the current scene and navigation direction.
export function getNextScene(currentScene, direction) {
    return currentScene.navigation?.[direction] ?? null;
}