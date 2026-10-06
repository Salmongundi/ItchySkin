const BASE_FONT_SIZE = 16;
const FONT_FAMILY = "monospace";


// ==================================================
// CANVAS
// ==================================================

// Resize the canvas to fit the window, taking into account the device pixel ratio. */
export function resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
}


// ==================================================
// ASCII
// ==================================================

function drawAsciiLines(
    ctx,
    lines,
    column,
    row,
    geometry,
    characterWidth = geometry.characterWidth,
    characterHeight = geometry.characterHeight
) {
    for (let asciiRow = 0; asciiRow < lines.length; asciiRow++) {
        const line = lines[asciiRow];

        for (let asciiColumn = 0; asciiColumn < line.length; asciiColumn++) {
            const character = line[asciiColumn];

            if (character === " ") {
                continue;
            }

            ctx.fillText(
                character,

                geometry.offsetX +
                column * geometry.characterWidth +
                asciiColumn * characterWidth,

                geometry.offsetY +
                row * geometry.characterHeight +
                asciiRow * characterHeight
            );
        }
    }
}


// ==================================================
// ENVIRONMENT
// ==================================================

export function drawAscii(ctx, ascii) {
    const lines = ascii.split("\n");

    const maxColumns = Math.max(
        ...lines.map(line => line.length)
    );

    const rowCount = lines.length;

    ctx.font = `${BASE_FONT_SIZE}px ${FONT_FAMILY}`;

    const characterWidth = ctx.measureText("M").width;
    const characterHeight = BASE_FONT_SIZE;

    const artworkWidth = maxColumns * characterWidth;
    const artworkHeight = rowCount * characterHeight;

    const scale = Math.min(
        ctx.canvas.width / artworkWidth,
        ctx.canvas.height / artworkHeight
    );

    const scaledCharacterWidth = characterWidth * scale;
    const scaledCharacterHeight = characterHeight * scale;

    const scaledWidth = artworkWidth * scale;
    const scaledHeight = artworkHeight * scale;

    const offsetX = (ctx.canvas.width - scaledWidth) / 2;
    const offsetY = (ctx.canvas.height - scaledHeight) / 2;

    const geometry = {
        offsetX,
        offsetY,
        scale,
        characterWidth: scaledCharacterWidth,
        characterHeight: scaledCharacterHeight,
        width: scaledWidth,
        height: scaledHeight
    };

    ctx.clearRect(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );

    ctx.save();

    ctx.font = `${BASE_FONT_SIZE * scale}px ${FONT_FAMILY}`;
    ctx.textBaseline = "top";

    drawAsciiLines(
        ctx,
        lines,
        0,
        0,
        geometry
    );

    ctx.restore();

    return geometry;
}


// ==================================================
// PROPS / OVERLAYS
// ==================================================

// Draw ASCII artwork at a specific position with scaling.
export function drawAsciiAt(
    ctx,
    ascii,
    column,
    row,
    scale,
    geometry
) {
    const lines = ascii.split("\n");

    const characterWidth =
        geometry.characterWidth * scale;

    const characterHeight =
        geometry.characterHeight * scale;

    ctx.save();

    ctx.font =
        `${BASE_FONT_SIZE * geometry.scale * scale}px ${FONT_FAMILY}`;

    ctx.textBaseline = "top";

    drawAsciiLines(
        ctx,
        lines,
        column,
        row,
        geometry,
        characterWidth,
        characterHeight
    );

    ctx.restore();
}