// ============================================================
// PARTICLE GRAIN
// ============================================================
//
// Reusable animated ASCII-style particle grain effect.
//
// This effect creates a layer of randomly positioned characters
// over or behind the target. It can be applied to:
//
//     "page"
//     "#element"
//     ".classname"
//     ["#one", ".two"]
//
// Page-specific settings can be passed into
// startParticleGrain().
//
// ============================================================


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const PARTICLE_GRAIN_SETTINGS = {

    // --------------------------------------------------------
    // TARGET
    // --------------------------------------------------------

    // "page"
    // "#ascii"
    // ".classname"
    // ["#one", ".two"]

    target: "page",


    // --------------------------------------------------------
    // GRAIN
    // --------------------------------------------------------

    // Percentage of available positions that contain particles.

    density: 0.5,


    // Overall particle visibility.

    opacity: 0.1,


    // Approximate spacing between particles.

    cellSize: 10,


    // Characters used by the particle grain.

    characters:
        " .,:;i1tfLCG08@",


    // --------------------------------------------------------
    // ANIMATION
    // --------------------------------------------------------

    // Overall animation speed.

    speed: 1,


    // How often the particle pattern changes.

    updateInterval: 100,


    // Amount individual particles vary in opacity.

    flickerAmount: 0.35,


    // --------------------------------------------------------
    // APPEARANCE
    // --------------------------------------------------------

    // Particle color.
    //
    // Accepts any CSS color.
    //
    // Examples:
    //
    // "#ffffff"
    // "#ff0000"
    // "white"
    // "rgb(255, 255, 255)"

    color:
        "#ffffff",


    // CSS font size multiplier.

    fontScale: 1,


    // CSS font family.

    fontFamily:
        "monospace",


    // CSS blend mode.

    blendMode:
        "normal",


    // --------------------------------------------------------
    // LAYER
    // --------------------------------------------------------

    // "front" = in front of target
    // "back"  = behind target

    layer:
        "front",


    // Used when determining the stacking order.
    //
    // The layer setting decides the general position.
    // This controls the actual z-index.

    zIndex:
        10000,


    // --------------------------------------------------------
    // POSITION
    // --------------------------------------------------------

    // Small random positional movement.

    positionJitter: 0,


    // --------------------------------------------------------
    // PERFORMANCE
    // --------------------------------------------------------

    // Prevent enormous numbers of particles on large targets.

    maxParticles: 5000

};


// ============================================================
// ACTIVE INSTANCES
// ============================================================

const particleGrainInstances = [];


// ============================================================
// TARGET RESOLUTION
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
// CREATE INSTANCE
// ============================================================

function createParticleGrain(
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


    // ========================================================
    // CANVAS POSITIONING
    // ========================================================

    canvas.style.position =
        isPage
            ? "fixed"
            : "absolute";


    canvas.style.pointerEvents =
        "none";


    canvas.style.display =
        "block";


    canvas.style.margin =
        "0";


    canvas.style.padding =
        "0";


    canvas.style.width =
        isPage
            ? "100vw"
            : "auto";


    canvas.style.height =
        isPage
            ? "100vh"
            : "auto";


    canvas.style.mixBlendMode =
        settings.blendMode;


    // ========================================================
    // LAYER
    // ========================================================

    canvas.style.zIndex =
        settings.layer === "front"
            ? String(
                settings.zIndex
            )
            : String(
                settings.zIndex - 1
            );


    // ========================================================
    // INSERT CANVAS
    // ========================================================

    let container;


    if (
        isPage
    ) {

        container =
            document.body;


        canvas.style.left =
            "0";


        canvas.style.top =
            "0";


        document.body.appendChild(
            canvas
        );

    } else {

        container =
            target.parentElement ||
            document.body;


        const containerStyle =
            window.getComputedStyle(
                container
            );


        if (
            containerStyle.position ===
            "static"
        ) {

            container.style.position =
                "relative";

        }


        container.appendChild(
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


    // ========================================================
    // POSITION / RESIZE
    // ========================================================

    function resize() {

        const targetRect =
            isPage

                ? {
                    left: 0,
                    top: 0,
                    width:
                        window.innerWidth,
                    height:
                        window.innerHeight
                }

                : target.getBoundingClientRect();


        const containerRect =
            isPage

                ? {
                    left: 0,
                    top: 0
                }

                : container.getBoundingClientRect();


        const width =
            Math.max(
                1,
                Math.ceil(
                    targetRect.width
                )
            );


        const height =
            Math.max(
                1,
                Math.ceil(
                    targetRect.height
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


        canvas.style.width =
            `${width}px`;


        canvas.style.height =
            `${height}px`;


        if (
            isPage
        ) {

            canvas.style.left =
                "0px";


            canvas.style.top =
                "0px";

        } else {

            canvas.style.left =
                `${
                    targetRect.left -
                    containerRect.left
                }px`;


        canvas.style.top =
            `${
                targetRect.top -
                containerRect.top
            }px`;

        }


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
    // DRAW PARTICLE GRAIN
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


        const cellSize =
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


        const totalCells =
            columns *
            rows;


        const particleCount =
            Math.min(
                settings.maxParticles,
                Math.floor(
                    totalCells *
                    settings.density
                )
            );


        context.font =
            `${cellSize * settings.fontScale}px ${settings.fontFamily}`;


        context.textAlign =
            "center";


        context.textBaseline =
            "middle";


        const characters =
            settings.characters;


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const x =
                Math.random() *
                width;


            const y =
                Math.random() *
                height;


            const character =
                characters[
                    Math.floor(
                        Math.random() *
                        characters.length
                    )
                ];


            const flicker =
                1 -
                (
                    Math.random() *
                    settings.flickerAmount
                );


            context.globalAlpha =
                settings.opacity *
                flicker;


            const jitter =
                settings.positionJitter;


            const offsetX =
                jitter
                    ? (
                        Math.random() *
                        jitter * 2
                    ) - jitter
                    : 0;


            const offsetY =
                jitter
                    ? (
                        Math.random() *
                        jitter * 2
                    ) - jitter
                    : 0;


            context.fillStyle =
                settings.color;


            context.fillText(
                character,
                x + offsetX,
                y + offsetY
            );

        }


        context.globalAlpha =
            1;

    }


    // ========================================================
    // ANIMATION LOOP
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
        "ResizeObserver" in window
    ) {

        resizeObserver =
            new ResizeObserver(
                resize
            );


        resizeObserver.observe(
            isPage
                ? document.body
                : target
        );

    }


    // ========================================================
    // WINDOW RESIZE
    // ========================================================

    window.addEventListener(
        "resize",
        resize
    );


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


        window.removeEventListener(
            "resize",
            resize
        );


        canvas.remove();

    }


    return {
        canvas,
        stop
    };

}


// ============================================================
// START PARTICLE GRAIN
// ============================================================

function startParticleGrain(
    overrides = {}
) {

    const settings = {

        ...PARTICLE_GRAIN_SETTINGS,

        ...overrides

    };


    const targets =
        resolveTargets(
            settings.target
        );


    const instances =
        targets.map(
            target =>
                createParticleGrain(
                    target,
                    settings
                )
        );


    particleGrainInstances.push(
        ...instances
    );


    return instances;

}


// ============================================================
// STOP PARTICLE GRAIN
// ============================================================

function stopParticleGrain() {

    for (
        const instance
        of particleGrainInstances
    ) {

        instance.stop();

    }


    particleGrainInstances.length =
        0;

}


// ============================================================
// GLOBAL ACCESS
// ============================================================

window.PARTICLE_GRAIN_SETTINGS =
    PARTICLE_GRAIN_SETTINGS;


window.startParticleGrain =
    startParticleGrain;


window.stopParticleGrain =
    stopParticleGrain;