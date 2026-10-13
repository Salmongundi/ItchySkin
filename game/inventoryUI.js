import { getInventoryItems } from "./inventory.js";
import { getCurrentPalette } from "./palette.js";
import { drawAsciiAt } from "../engine/ascii/effects/visual/asciiRenderer.js";

const LABEL = "Inventory";
const RIGHT_MARGIN = 2;
const TOP_MARGIN = 2;

let inventoryOpen = false;

function getInventoryLayout(geometry) {
    const items = getInventoryItems();
    const names = items.length
        ? items.map(item => item.name)
        : ["(empty)"];

    const contentWidth = Math.max(
        LABEL.length,
        ...names.map(name => name.length)
    );

    const width = contentWidth + 4;
    const height = names.length + 2;

    // Position the label relative to the canvas edges,
    // accounting for the centered artwork's offset.
    const labelColumn =
        Math.floor(
            (geometry.offsetX + geometry.width) /
            geometry.characterWidth
        ) - LABEL.length - RIGHT_MARGIN;

    const labelRow =
        Math.ceil(-geometry.offsetY / geometry.characterHeight) +
        TOP_MARGIN;

    return {
        names,
        contentWidth,
        width,
        height,
        labelColumn,
        labelRow,
        panelColumn: labelColumn + LABEL.length - width,
        panelRow: labelRow + 1
    };
}

function isInside(position, column, row, width, height) {
    return (
        position.column >= column &&
        position.column < column + width &&
        position.row >= row &&
        position.row < row + height
    );
}

export function isInventoryLabelAt(position, geometry) {
    if (!position || !geometry) return false;

    const layout = getInventoryLayout(geometry);

    return isInside(
        position,
        layout.labelColumn,
        layout.labelRow,
        LABEL.length,
        1
    );
}

export function isInventoryPanelAt(position, geometry) {
    if (!position || !geometry || !inventoryOpen) return false;

    const layout = getInventoryLayout(geometry);

    return isInside(
        position,
        layout.panelColumn,
        layout.panelRow,
        layout.width,
        layout.height
    );
}

export function isInventoryOpen() {
    return inventoryOpen;
}

export function toggleInventory() {
    inventoryOpen = !inventoryOpen;
}

export function closeInventory() {
    inventoryOpen = false;
}

function drawInventory(ctx, geometry, layout, palette) {
    const { names, contentWidth, width, height } = layout;

    const lines = [
        `┌${"─".repeat(width - 2)}┐`,
        ...names.map(name => `│ ${name.padEnd(contentWidth)} |`),
        `└${"─".repeat(width - 2)}┘`
    ];
    const x = geometry.offsetX +
        layout.panelColumn * geometry.characterWidth;

    const y = geometry.offsetY +
        layout.panelRow * geometry.characterHeight;

    // Opaque panel using the current palette.
    ctx.fillStyle = palette.background;
    ctx.fillRect(
        x,
        y,
        width * geometry.characterWidth,
        height * geometry.characterHeight
    );

    ctx.fillStyle = palette.foreground;

    drawAsciiAt(
        ctx,
        lines.join("\n"),
        layout.panelColumn,
        layout.panelRow,
        1,
        geometry
    );
}

export function drawInventoryUI(ctx, geometry) {
    if (!geometry) return;

    const layout = getInventoryLayout(geometry);
    const palette = getCurrentPalette();

    ctx.fillStyle = palette.foreground;

    drawAsciiAt(
        ctx,
        LABEL,
        layout.labelColumn,
        layout.labelRow,
        1,
        geometry
    );

    if (inventoryOpen) {
        drawInventory(ctx, geometry, layout, palette);
    }
}