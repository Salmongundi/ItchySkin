// ============================================================
// DITHER
// ============================================================
//
// Reusable animated visual dither effect.
//
// This version does NOT modify the target's textContent.
//
// Instead, it reads the ASCII artwork and creates a transparent
// canvas containing geometric dither marks over areas occupied
// by the ASCII.
//
// Supported patterns:
//
//     "x"
//     "diamond"
//     "cross"
//     "checker"
//     "mixed"
//
// Supported targets:
//
//     "page"
//     "#ascii"
//     ".classname"
//     ["#one", ".two"]
//
// ============================================================


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DITHER_SETTINGS = {

    // --------------------------------------------------------
    // TARGET
    // --------------------------------------------------------

    // "page"
    // "#ascii"
    // ".classname"
    // ["#one", ".two"]

    target: "#ascii",


    // --------------------------------------------------------
    // DENSITY
    // --------------------------------------------------------

    // How much of the ASCII receives dither marks.

    density: 0.35,


    // --------------------------------------------------------
    // OPACITY
    // --------------------------------------------------------

    // Visibility of the dither marks.

    opacity: 0.35,


    // --------------------------------------------------------
    // CELL SIZE
    // --------------------------------------------------------

    // Size of each dither cell in pixels.

    cellSize: 5,


    // --------------------------------------------------------
    // PATTERN
    // --------------------------------------------------------

    // "x"
    // "diamond"
    // "cross"
    // "checker"
    // "mixed"

    pattern: "mixed",


    // --------------------------------------------------------
    // MARK SIZE
    // --------------------------------------------------------

    // Size of the geometric mark relative to the cell.

    markSize: 0.7,


    // --------------------------------------------------------
    // MARK STYLE
    // --------------------------------------------------------

    // "stroke" = outlined X / diamond / cross
    // "fill"   = filled geometric marks

    markStyle: "stroke",


    // --------------------------------------------------------
    // TONE
    // --------------------------------------------------------

    // "dark"
    // "light"
    // "both"

    tone: "dark",


    // --------------------------------------------------------
    // ANIMATION
    // --------------------------------------------------------

    // Overall animation speed.

    speed: 1,


    // Time between pattern changes.

    updateInterval: 150,


    // --------------------------------------------------------
    // SOURCE THRESHOLD
    // --------------------------------------------------------

    // Determines how strongly a character counts as
    // occupied by ASCII.
    //
    // 0 = any non-space character
    // 1 = only dense characters

    threshold: 0,


    // --------------------------------------------------------
    // PATTERN OFFSET
    // --------------------------------------------------------

    // Amount the dither pattern shifts between updates.

    movement: 0.35,


    // --------------------------------------------------------
    // BLEND MODE
    // --------------------------------------------------------

    blendMode: "normal",


    // --------------------------------------------------------
    // Z-INDEX
    // --------------------------------------------------------

    // Dither sits above the ASCII.
    //
    // Keep this below any effects that need to appear above
    // the dither.

    zIndex: 10,


    // --------------------------------------------------------
    // PERFORMANCE
    // --------------------------------------------------------

    maxCells: 50000

};


// ============================================================
// ACTIVE INSTANCES
// ============================================================

const ditherInstances = [];


// ============================================================
// RESOLVE TARGETS
// ============================================================

function resolveTargets(
    target
) {

    if (
        target === "page"
    ) {

        return [
            document.body
        ];

    }


    if (
        Array.isArray(target)
    ) {

        return target.flatMap(
            item =>
                resolveTargets(item)
        );

    }


    if (
        target instanceof Element
    ) {

        return [
            target
        ];

    }


    if (
        typeof target === "string"
    ) {

        return [
            ...document.querySelectorAll(
                target
            )
        ];

    }


    return [];

}


// ============================================================
// CHARACTER DENSITY
// ============================================================

function getCharacterDensity(
    character
) {

    if (
        character === " "
    ) {

        return 0;

    }


    const densityMap = {

        ".": 0.10,
        ",": 0.10,
        "'": 0.10,

        ":": 0.20,
        ";": 0.25,

        "-": 0.25,
        "_": 0.25,

        "+": 0.35,
        "=": 0.40,

        "*": 0.50,

        "#": 0.65,
        "%": 0.75,

        "@": 1,

        "█": 1

    };


    if (
        densityMap[
            character
        ] !== undefined
    ) {

        return densityMap[
            character
        ];

    }


    return 0.5;

}


// ============================================================
// GET PATTERN
// ============================================================

function getPattern(
    settings
) {

    if (
        settings.pattern !== "mixed"
    ) {

        return settings.pattern;

    }


    const patterns = [

        "x",
        "diamond",
        "cross",
        "checker"

    ];


    return patterns[
        Math.floor(
            Math.random() *
            patterns.length
        )
    ];

}


// ============================================================
// DRAW X
// ============================================================

function drawX(
    context,
    x,
    y,
    size
) {

    context.beginPath();

    context.moveTo(
        x - size,
        y - size
    );

    context.lineTo(
        x + size,
        y + size
    );

    context.moveTo(
        x + size,
        y - size
    );

    context.lineTo(
        x - size,
        y + size
    );

    context.stroke();

}


// ============================================================
// DRAW DIAMOND
// ============================================================

function drawDiamond(
    context,
    x,
    y,
    size
) {

    context.beginPath();

    context.moveTo(
        x,
        y - size
    );

    context.lineTo(
        x + size,
        y
    );

    context.lineTo(
        x,
        y + size
    );

    context.lineTo(
        x - size,
        y
    );

    context.closePath();

    context.stroke();

}


// ============================================================
// DRAW CROSS
// ============================================================

function drawCross(
    context,
    x,
    y,
    size
) {

    context.beginPath();

    context.moveTo(
        x - size,
        y
    );

    context.lineTo(
        x + size,
        y
    );

    context.moveTo(
        x,
        y - size
    );

    context.lineTo(
        x,
        y + size
    );

    context.stroke();

}


// ============================================================
// DRAW CHECKER
// ============================================================

function drawChecker(
    context,
    x,
    y,
    size
) {

    context.fillRect(
        x - size,
        y - size,
        size,
        size
    );

    context.fillRect(
        x,
        y,
        size,
        size
    );

}


// ============================================================
// DRAW MARK
// ============================================================

function drawMark(
    context,
    pattern,
    x,
    y,
    size,
    style
) {

    if (
        style === "fill"
    ) {

        context.fillStyle =
            context.strokeStyle;

    }


    switch (
        pattern
    ) {

        case "x":

            if (
                style === "fill"
            ) {

                drawX(
                    context,
                    x,
                    y,
                    size
                );

            } else {

                drawX(
                    context,
                    x,
                    y,
                    size
                );

            }

            break;


        case "diamond":

            if (
                style === "fill"
            ) {

                drawDiamond(
                    context,
                    x,
                    y,
                    size
                );

                context.fill();

            } else {

                drawDiamond(
                    context,
                    x,
                    y,
                    size
                );

            }

            break;


        case "cross":

            drawCross(
                context,
                x,
                y,
                size
            );

            break;


        case "checker":

            drawChecker(
                context,
                x,
                y,
                size
            );

            break;

    }

}


// ============================================================
// CREATE INSTANCE
// ============================================================

function createDither(
    target,
    settings
) {

    const isPage =
        target === document.body;


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.setAttribute(
        "aria-hidden",
        "true"
    );


    canvas.style.position =
        isPage
            ? "fixed"
            : "absolute";


    canvas.style.left =
        "0";

    canvas.style.top =
        "0";

    canvas.style.width =
        "100%";

    canvas.style.height =
        "100%";

    canvas.style.pointerEvents =
        "none";

    canvas.style.zIndex =
        settings.zIndex;

    canvas.style.mixBlendMode =
        settings.blendMode;

    canvas.style.display =
        "block";


    if (
        !isPage
    ) {

        const computedStyle =
            window.getComputedStyle(
                target
            );


        if (
            computedStyle.position ===
            "static"
        ) {

            target.style.position =
                "relative";

        }


        target.appendChild(
            canvas
        );

    } else {

        document.body.appendChild(
            canvas
        );

    }


    const context =
        canvas.getContext(
            "2d"
        );


    context.imageSmoothingEnabled =
        false;


    let animationFrame =
        null;


    let lastUpdate =
        0;


    let patternOffsetX =
        0;


    let patternOffsetY =
        0;


    // ========================================================
    // RESIZE
    // ========================================================

    function resize() {

        const rect =
            isPage

                ? {
                    width:
                        window.innerWidth,

                    height:
                        window.innerHeight
                }

                : target.getBoundingClientRect();


        const width =
            Math.max(
                1,
                Math.ceil(
                    rect.width
                )
            );


        const height =
            Math.max(
                1,
                Math.ceil(
                    rect.height
                )
            );


        const pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            width *
            pixelRatio;


        canvas.height =
            height *
            pixelRatio;


        context.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );


        canvas._width =
            width;


        canvas._height =
            height;

    }


    // ========================================================
    // GET ASCII SOURCE
    // ========================================================

    function getSourceText() {

        if (
            target.id === "ascii"
        ) {

            return target.textContent;

        }


        return target.textContent;

    }


    // ========================================================
    // DRAW
    // ========================================================

    function draw() {

        const width =
            canvas._width || 1;


        const height =
            canvas._height || 1;


        context.clearRect(
            0,
            0,
            width,
            height
        );


        const source =
            getSourceText();


        if (
            !source
        ) {

            return;

        }


        const lines =
            source.split(
                "\n"
            );


        // ----------------------------------------------------
        // ASCII CHARACTER DIMENSIONS
        // ----------------------------------------------------

        const computedStyle =
            window.getComputedStyle(
                target
            );


        const fontSize =
            parseFloat(
                computedStyle.fontSize
            ) || 16;


        const lineHeight =
            parseFloat(
                computedStyle.lineHeight
            ) ||
            fontSize *
            1.2;


        const fontFamily =
            computedStyle.fontFamily ||
            "monospace";


        const measureCanvas =
            document.createElement(
                "canvas"
            );


        const measureContext =
            measureCanvas.getContext(
                "2d"
            );


        measureContext.font =
            `${fontSize}px ${fontFamily}`;


        const characterWidth =
            measureContext.measureText(
                "M"
            ).width;


        // ----------------------------------------------------
        // DITHER CELLS
        // ----------------------------------------------------

        let cellSize =
            Math.max(
                1,
                settings.cellSize
            );


        const columns =
            Math.ceil(
                width /
                cellSize
            );


        const rows =
            Math.ceil(
                height /
                cellSize
            );


        if (
            columns * rows >
            settings.maxCells
        ) {

            cellSize *=
                Math.sqrt(
                    (
                        columns *
                        rows
                    ) /
                    settings.maxCells
                );

        }


        const pattern =
            getPattern(
                settings
            );


        // ----------------------------------------------------
        // APPEARANCE
        // ----------------------------------------------------

        context.globalAlpha =
            settings.opacity;


        context.lineWidth =
            Math.max(
                0.5,
                cellSize * 0.12
            );


        context.lineCap =
            "square";


        // ----------------------------------------------------
        // CELLS
        // ----------------------------------------------------

        for (
            let row = 0;
            row <
            Math.ceil(
                height /
                cellSize
            );
            row++
        ) {

            for (
                let column = 0;
                column <
                Math.ceil(
                    width /
                    cellSize
                );
                column++
            ) {

                // --------------------------------------------
                // PATTERN POSITION
                // --------------------------------------------

                const patternX =
                    Math.floor(
                        column +
                        patternOffsetX
                    );


                const patternY =
                    Math.floor(
                        row +
                        patternOffsetY
                    );


                // --------------------------------------------
                // DENSITY
                // --------------------------------------------

                if (
                    Math.random() >
                    settings.density
                ) {

                    continue;

                }


                // --------------------------------------------
                // APPROXIMATE ASCII POSITION
                // --------------------------------------------

                const pixelX =
                    column *
                    cellSize;


                const pixelY =
                    row *
                    cellSize;


                const asciiX =
                    Math.floor(
                        pixelX /
                        characterWidth
                    );


                const asciiY =
                    Math.floor(
                        pixelY /
                        lineHeight
                    );


                if (
                    asciiY < 0 ||
                    asciiY >= lines.length
                ) {

                    continue;

                }


                const line =
                    lines[
                        asciiY
                    ];


                if (
                    asciiX < 0 ||
                    asciiX >= line.length
                ) {

                    continue;

                }


                const character =
                    line[
                        asciiX
                    ];


                // --------------------------------------------
                // ONLY DITHER WHERE ASCII EXISTS
                // --------------------------------------------

                const characterDensity =
                    getCharacterDensity(
                        character
                    );


                if (
                    characterDensity <=
                    settings.threshold
                ) {

                    continue;

                }


                // --------------------------------------------
                // PATTERN
                // --------------------------------------------

                const patternSize =
                    Math.max(
                        2,
                        settings.patternSize ||
                        4
                    );


                const localX =
                    (
                        patternX %
                        patternSize +
                        patternSize
                    ) %
                    patternSize;


                const localY =
                    (
                        patternY %
                        patternSize +
                        patternSize
                    ) %
                    patternSize;


                let active =
                    false;


                switch (
                    pattern
                ) {

                    case "x":

                        active =
                            localX === localY ||
                            (
                                localX +
                                localY
                            ) ===
                            patternSize - 1;

                        break;


                    case "diamond":

                        active =
                            Math.abs(
                                localX -
                                (
                                    patternSize - 1
                                ) / 2
                            )
                            +
                            Math.abs(
                                localY -
                                (
                                    patternSize - 1
                                ) / 2
                            )
                            <=
                            patternSize / 2;

                        break;


                    case "cross":

                        active =
                            localX ===
                                Math.floor(
                                    patternSize / 2
                                )
                            ||
                            localY ===
                                Math.floor(
                                    patternSize / 2
                                );

                        break;


                    case "checker":

                        active =
                            (
                                localX +
                                localY
                            ) % 2 === 0;

                        break;

                }


                if (
                    !active
                ) {

                    continue;

                }


                // --------------------------------------------
                // TONE
                // --------------------------------------------

                let tone =
                    settings.tone;


                if (
                    tone === "both"
                ) {

                    tone =
                        Math.random() < 0.5
                            ? "dark"
                            : "light";

                }


                context.strokeStyle =
                    tone === "light"
                        ? "#fff"
                        : "#000";


                context.fillStyle =
                    tone === "light"
                        ? "#fff"
                        : "#000";


                // --------------------------------------------
                // MARK
                // --------------------------------------------

                const centerX =
                    pixelX +
                    cellSize / 2;


                const centerY =
                    pixelY +
                    cellSize / 2;


                const markSize =
                    cellSize *
                    settings.markSize;


                drawMark(
                    context,
                    pattern,
                    centerX,
                    centerY,
                    markSize,
                    settings.markStyle
                );

            }

        }


        context.globalAlpha =
            1;

    }


    // ========================================================
    // ANIMATION
    // ========================================================

    function animate(
        timestamp
    ) {

        const interval =
            settings.updateInterval /
            Math.max(
                0.01,
                settings.speed
            );


        if (
            timestamp -
            lastUpdate >=
            interval
        ) {

            patternOffsetX +=
                settings.movement;


            patternOffsetY +=
                settings.movement;


            draw();


            lastUpdate =
                timestamp;

        }


        animationFrame =
            requestAnimationFrame(
                animate
            );

    }


    // ========================================================
    // RESIZE OBSERVER
    // ========================================================

    let resizeObserver =
        null;


    if (
        !isPage &&
        "ResizeObserver" in window
    ) {

        resizeObserver =
            new ResizeObserver(
                resize
            );


        resizeObserver.observe(
            target
        );

    }


    // ========================================================
    // WINDOW RESIZE
    // ========================================================

    if (
        isPage
    ) {

        window.addEventListener(
            "resize",
            resize
        );

    }


    // ========================================================
    // START
    // ========================================================

    resize();

    draw();

    animationFrame =
        requestAnimationFrame(
            animate
        );


    // ========================================================
    // STOP
    // ========================================================

    function stop() {

        if (
            animationFrame !== null
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        if (
            resizeObserver
        ) {

            resizeObserver.disconnect();

        }


        if (
            isPage
        ) {

            window.removeEventListener(
                "resize",
                resize
            );

        }


        canvas.remove();

    }


    return {
        canvas,
        stop
    };

}


// ============================================================
// START DITHER
// ============================================================

function startDither(
    overrides = {}
) {

    const settings = {

        ...DITHER_SETTINGS,
        ...overrides

    };


    const targets =
        resolveTargets(
            settings.target
        );


    const instances =
        targets.map(
            target =>
                createDither(
                    target,
                    settings
                )
        );


    ditherInstances.push(
        ...instances
    );


    return instances;

}


// ============================================================
// STOP DITHER
// ============================================================

function stopDither() {

    for (
        const instance
        of ditherInstances
    ) {

        instance.stop();

    }


    ditherInstances.length =
        0;

}


// ============================================================
// GLOBAL ACCESS
// ============================================================

window.DITHER_SETTINGS =
    DITHER_SETTINGS;


window.startDither =
    startDither;


window.stopDither =
    stopDither;