const BASE_FONT_SIZE = 16;
const FONT_FAMILY = "monospace";

export function resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
}

export function drawAscii(ctx, ascii) {
    const lines = ascii.split("\n");

    // Remove the empty line created by the template literal.
    while (lines.length && lines[0] === "") {
        lines.shift();
    }

    while (lines.length && lines[lines.length - 1] === "") {
        lines.pop();
    }

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

    ctx.clearRect(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );

    ctx.save();

    ctx.font = `${BASE_FONT_SIZE * scale}px ${FONT_FAMILY}`;
    ctx.textBaseline = "top";

    for (let row = 0; row < lines.length; row++) {
        const line = lines[row];

        for (let column = 0; column < line.length; column++) {
            const character = line[column];

            if (character === " ") {
                continue;
            }

            ctx.fillText(
                character,
                offsetX + column * scaledCharacterWidth,
                offsetY + row * scaledCharacterHeight
            );
        }
    }

    ctx.restore();
}