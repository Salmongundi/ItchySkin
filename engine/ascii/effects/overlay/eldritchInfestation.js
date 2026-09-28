// ============================================================
// ELDRITCH INFESTATION
//
// Visual distortion system.
//
// This does NOT create ASCII creatures.
//
// It takes the existing ASCII artwork and makes its geometry
// increasingly impossible through:
//   - turbulent displacement
//   - localized distortion fields
//   - spatial stretching
//   - refraction
//   - tearing
//   - ghosted displacement
//   - boundary violation
//   - nonlinear movement
//
// Intensity is deliberately exposed because this is intended
// to be driven by game state.
// ============================================================


const DEFAULTS = {

    // --------------------------------------------------------
    // MASTER
    // --------------------------------------------------------

    intensity: 0.65,

    animated: true,

    fps: 30,

    // --------------------------------------------------------
    // OVERALL VISUAL STRENGTH
    // --------------------------------------------------------

    opacity: 0.90,

    distortion: 0.85,

    displacement: 18,

    turbulenceScale: 0.018,

    turbulenceStrength: 0.75,

    // --------------------------------------------------------
    // SECONDARY DISTORTION
    //
    // Creates regions which behave as though the artwork
    // has been pulled through something invisible.
    // --------------------------------------------------------

    secondaryDistortion: 0.55,

    secondaryDisplacement: 11,

    secondaryScale: 0.045,

    // --------------------------------------------------------
    // LOCAL "PRESSURE" FIELDS
    //
    // These are not visible objects.
    //
    // They create areas where the surrounding ASCII appears
    // to buckle around an invisible presence.
    // --------------------------------------------------------

    fieldCountMin: 2,
    fieldCountMax: 7,

    fieldRadiusMin: 18,
    fieldRadiusMax: 95,

    fieldStrengthMin: 0.20,
    fieldStrengthMax: 0.80,

    fieldDrift: 0.25,

    // --------------------------------------------------------
    // REFRACTION
    // --------------------------------------------------------

    refraction: 0.55,

    refractionOffset: 10,

    refractionOpacity: 0.22,

    // --------------------------------------------------------
    // TEARING
    //
    // Horizontal sections of the artwork temporarily disagree
    // about where they are.
    // --------------------------------------------------------

    tearing: 0.45,

    tearCountMin: 1,
    tearCountMax: 5,

    tearWidthMin: 2,
    tearWidthMax: 15,

    tearOffsetMin: 2,
    tearOffsetMax: 24,

    // --------------------------------------------------------
    // GHOSTING
    //
    // Slightly displaced versions of the artwork interfere
    // with the primary image.
    // --------------------------------------------------------

    ghosting: 0.40,

    ghostCount: 2,

    ghostOffset: 9,

    ghostOpacity: 0.14,

    // --------------------------------------------------------
    // BOUNDARY VIOLATION
    //
    // At high intensity the distortion stops respecting the
    // interior and begins affecting the surrounding artwork.
    // --------------------------------------------------------

    boundaryEscape: 0.85,

    boundaryThreshold: 0.55,

    boundaryStrength: 0.75,

    // --------------------------------------------------------
    // HIGH INTENSITY
    // --------------------------------------------------------

    nightmareThreshold: 0.78,

    nightmareDistortion: 1.8,

    nightmareDisplacement: 32,

    nightmareTurbulence: 0.035,

    // --------------------------------------------------------
    // COLOR / BLENDING
    // --------------------------------------------------------

    color: "#7B5265",

    blendMode: "normal",

    zIndex: 4,

    // --------------------------------------------------------
    // RANDOMNESS
    // --------------------------------------------------------

    seed: Math.random() * 100000

};


// ============================================================
// HELPERS
// ============================================================

function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


function lerp(a, b, amount) {

    return a + (b - a) * amount;

}


function random(min, max) {

    return min + Math.random() * (max - min);

}


function randomInt(min, max) {

    return Math.floor(
        random(min, max + 1)
    );

}


function hash(value) {

    const x =
        Math.sin(value * 127.1) *
        43758.5453123;

    return x - Math.floor(x);

}


function choose(min, max) {

    return min + hash(
        Math.floor(Math.random() * 1000000)
    ) * (max - min);

}


// ============================================================
// NORMALIZE INTERIOR
//
// Supports the common findInterior() formats:
//   { x, y }
//   [x, y]
// ============================================================

function normalizeInterior(cells) {

    if (!Array.isArray(cells)) {
        return [];
    }

    return cells
        .map(cell => {

            if (
                cell &&
                typeof cell === "object" &&
                Number.isFinite(cell.x) &&
                Number.isFinite(cell.y)
            ) {

                return {
                    x: cell.x,
                    y: cell.y
                };

            }

            if (
                Array.isArray(cell) &&
                Number.isFinite(cell[0]) &&
                Number.isFinite(cell[1])
            ) {

                return {
                    x: cell[0],
                    y: cell[1]
                };

            }

            return null;

        })
        .filter(Boolean);

}


// ============================================================
// SVG FILTER FACTORY
// ============================================================

function createFilterSet(svg, settings) {

    const idBase =
        "eldritch_" +
        Math.random()
            .toString(36)
            .slice(2);

    const primaryId =
        idBase + "_primary";

    const secondaryId =
        idBase + "_secondary";

    const nightmareId =
        idBase + "_nightmare";

    // --------------------------------------------------------
    // PRIMARY
    // --------------------------------------------------------

    const primary =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "filter"
        );

    primary.setAttribute("id", primaryId);

    primary.setAttribute(
        "x",
        "-30%"
    );

    primary.setAttribute(
        "y",
        "-30%"
    );

    primary.setAttribute(
        "width",
        "160%"
    );

    primary.setAttribute(
        "height",
        "160%"
    );

    const turbulence =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feTurbulence"
        );

    turbulence.setAttribute(
        "type",
        "fractalNoise"
    );

    turbulence.setAttribute(
        "baseFrequency",
        settings.turbulenceScale
    );

    turbulence.setAttribute(
        "numOctaves",
        "3"
    );

    turbulence.setAttribute(
        "seed",
        String(settings.seed)
    );

    turbulence.setAttribute(
        "result",
        "noise"
    );

    const displacement =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feDisplacementMap"
        );

    displacement.setAttribute(
        "in",
        "SourceGraphic"
    );

    displacement.setAttribute(
        "in2",
        "noise"
    );

    displacement.setAttribute(
        "scale",
        String(settings.displacement)
    );

    displacement.setAttribute(
        "xChannelSelector",
        "R"
    );

    displacement.setAttribute(
        "yChannelSelector",
        "G"
    );

    primary.appendChild(turbulence);
    primary.appendChild(displacement);

    svg.appendChild(primary);


    // --------------------------------------------------------
    // SECONDARY
    // --------------------------------------------------------

    const secondary =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "filter"
        );

    secondary.setAttribute(
        "id",
        secondaryId
    );

    secondary.setAttribute(
        "x",
        "-40%"
    );

    secondary.setAttribute(
        "y",
        "-40%"
    );

    secondary.setAttribute(
        "width",
        "180%"
    );

    secondary.setAttribute(
        "height",
        "180%"
    );


    const turbulence2 =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feTurbulence"
        );

    turbulence2.setAttribute(
        "type",
        "turbulence"
    );

    turbulence2.setAttribute(
        "baseFrequency",
        settings.secondaryScale
    );

    turbulence2.setAttribute(
        "numOctaves",
        "2"
    );

    turbulence2.setAttribute(
        "seed",
        String(settings.seed + 91)
    );

    turbulence2.setAttribute(
        "result",
        "noise2"
    );


    const displacement2 =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feDisplacementMap"
        );

    displacement2.setAttribute(
        "in",
        "SourceGraphic"
    );

    displacement2.setAttribute(
        "in2",
        "noise2"
    );

    displacement2.setAttribute(
        "scale",
        String(settings.secondaryDisplacement)
    );

    displacement2.setAttribute(
        "xChannelSelector",
        "R"
    );

    displacement2.setAttribute(
        "yChannelSelector",
        "B"
    );

    secondary.appendChild(turbulence2);
    secondary.appendChild(displacement2);

    svg.appendChild(secondary);


    // --------------------------------------------------------
    // NIGHTMARE
    // --------------------------------------------------------

    const nightmare =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "filter"
        );

    nightmare.setAttribute(
        "id",
        nightmareId
    );

    nightmare.setAttribute(
        "x",
        "-60%"
    );

    nightmare.setAttribute(
        "y",
        "-60%"
    );

    nightmare.setAttribute(
        "width",
        "220%"
    );

    nightmare.setAttribute(
        "height",
        "220%"
    );


    const turbulence3 =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feTurbulence"
        );

    turbulence3.setAttribute(
        "type",
        "fractalNoise"
    );

    turbulence3.setAttribute(
        "baseFrequency",
        settings.nightmareTurbulence
    );

    turbulence3.setAttribute(
        "numOctaves",
        "4"
    );

    turbulence3.setAttribute(
        "seed",
        String(settings.seed + 777)
    );

    turbulence3.setAttribute(
        "result",
        "nightmareNoise"
    );


    const displacement3 =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feDisplacementMap"
        );

    displacement3.setAttribute(
        "in",
        "SourceGraphic"
    );

    displacement3.setAttribute(
        "in2",
        "nightmareNoise"
    );

    displacement3.setAttribute(
        "scale",
        String(settings.nightmareDisplacement)
    );

    displacement3.setAttribute(
        "xChannelSelector",
        "R"
    );

    displacement3.setAttribute(
        "yChannelSelector",
        "G"
    );

    nightmare.appendChild(turbulence3);
    nightmare.appendChild(displacement3);

    svg.appendChild(nightmare);


    return {
        primary,
        secondary,
        nightmare,
        primaryId,
        secondaryId,
        nightmareId
    };

}


// ============================================================
// GRID METRICS
// ============================================================

function getGridMetrics(element) {

    const style =
        getComputedStyle(element);

    const fontSize =
        parseFloat(style.fontSize) || 16;

    const lineHeight =
        style.lineHeight === "normal"
            ? fontSize * 1.2
            : parseFloat(style.lineHeight);

    const probe =
        document.createElement("span");

    probe.textContent = "M";

    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.whiteSpace = "pre";
    probe.style.fontFamily = style.fontFamily;
    probe.style.fontSize = style.fontSize;
    probe.style.fontWeight = style.fontWeight;
    probe.style.fontStyle = style.fontStyle;
    probe.style.letterSpacing = style.letterSpacing;

    document.body.appendChild(probe);

    const width =
        probe.getBoundingClientRect().width;

    probe.remove();

    return {
        charWidth: Math.max(1, width),
        lineHeight: Math.max(1, lineHeight)
    };

}


// ============================================================
// CREATE SVG FILTER DEFINITION
// ============================================================

function createFilterSvg(settings) {

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

    svg.setAttribute(
        "width",
        "0"
    );

    svg.setAttribute(
        "height",
        "0"
    );

    svg.style.position = "absolute";
    svg.style.pointerEvents = "none";

    const filters =
        createFilterSet(
            svg,
            settings
        );

    document.body.appendChild(svg);

    return {
        svg,
        filters
    };

}


// ============================================================
// BUILD DISTORTION LAYER
// ============================================================

function createLayer(
    asciiElement,
    className
) {

    const layer =
        document.createElement("pre");

    layer.className =
        "eldritch-infestation-layer " +
        className;

    layer.textContent =
        asciiElement.textContent;

    layer.setAttribute(
        "aria-hidden",
        "true"
    );

    layer.style.position =
        "absolute";

    layer.style.pointerEvents =
        "none";

    layer.style.margin =
        "0";

    layer.style.padding =
        "0";

    layer.style.whiteSpace =
        "pre";

    layer.style.background =
        "transparent";

    layer.style.color =
        "inherit";

    layer.style.overflow =
        "visible";

    layer.style.transformOrigin =
        "50% 50%";

    layer.style.willChange =
        "transform, filter, opacity";

    return layer;

}


// ============================================================
// POSITION LAYERS
// ============================================================

function syncLayerGeometry(
    asciiElement,
    layer
) {

    const style =
        getComputedStyle(asciiElement);

    const rect =
        asciiElement.getBoundingClientRect();

    layer.style.left =
        "0";

    layer.style.top =
        "0";

    layer.style.width =
        rect.width + "px";

    layer.style.height =
        rect.height + "px";

    layer.style.fontFamily =
        style.fontFamily;

    layer.style.fontSize =
        style.fontSize;

    layer.style.fontWeight =
        style.fontWeight;

    layer.style.fontStyle =
        style.fontStyle;

    layer.style.lineHeight =
        style.lineHeight;

    layer.style.letterSpacing =
        style.letterSpacing;

}


// ============================================================
// BUILD LOCAL DISTORTION FIELDS
//
// These are purely mathematical regions of distortion.
// Nothing visible is spawned.
// ============================================================

function createFields(settings) {

    const count =
        randomInt(
            settings.fieldCountMin,
            settings.fieldCountMax
        );

    const fields = [];

    for (let i = 0; i < count; i++) {

        fields.push({

            x: Math.random(),
            y: Math.random(),

            radius:
                random(
                    settings.fieldRadiusMin,
                    settings.fieldRadiusMax
                ),

            strength:
                random(
                    settings.fieldStrengthMin,
                    settings.fieldStrengthMax
                ),

            phase:
                random(
                    0,
                    Math.PI * 2
                ),

            speed:
                random(
                    -settings.fieldDrift,
                    settings.fieldDrift
                ),

            angle:
                random(
                    0,
                    Math.PI * 2
                )

        });

    }

    return fields;

}


// ============================================================
// UPDATE TURBULENCE
// ============================================================

function updateTurbulence(
    filters,
    settings,
    intensity,
    time
) {

    const nightmare =
        intensity >= settings.nightmareThreshold;

    const primaryAmount =
        settings.displacement *
        intensity *
        settings.distortion;

    const secondaryAmount =
        settings.secondaryDisplacement *
        intensity *
        settings.secondaryDistortion;

    const nightmareAmount =
        nightmare
            ? settings.nightmareDisplacement *
              intensity *
              settings.nightmareDistortion
            : 0;


    const primary =
        filters.primary
            .querySelector(
                "feDisplacementMap"
            );

    const secondary =
        filters.secondary
            .querySelector(
                "feDisplacementMap"
            );

    const nightmareMap =
        filters.nightmare
            .querySelector(
                "feDisplacementMap"
            );


    const primaryNoise =
        filters.primary
            .querySelector(
                "feTurbulence"
            );

    const secondaryNoise =
        filters.secondary
            .querySelector(
                "feTurbulence"
            );

    const nightmareNoise =
        filters.nightmare
            .querySelector(
                "feTurbulence"
            );


    const slow =
        time * 0.00012;

    const medium =
        time * 0.00027;


    primaryNoise.setAttribute(
        "baseFrequency",
        (
            settings.turbulenceScale *
            (
                0.72 +
                intensity * 0.8
            )
        ).toFixed(5)
    );

    secondaryNoise.setAttribute(
        "baseFrequency",
        (
            settings.secondaryScale *
            (
                0.65 +
                intensity * 1.25
            )
        ).toFixed(5)
    );


    primaryNoise.setAttribute(
        "seed",
        String(
            settings.seed +
            Math.floor(
                slow * 100
            )
        )
    );


    secondaryNoise.setAttribute(
        "seed",
        String(
            settings.seed +
            1000 +
            Math.floor(
                medium * 150
            )
        )
    );


    primary.setAttribute(
        "scale",
        String(
            primaryAmount *
            (
                0.78 +
                Math.sin(slow) * 0.22
            )
        )
    );


    secondary.setAttribute(
        "scale",
        String(
            secondaryAmount *
            (
                0.75 +
                Math.sin(medium * 2.1) * 0.25
            )
        )
    );


    if (nightmare) {

        nightmareNoise.setAttribute(
            "baseFrequency",
            (
                settings.nightmareTurbulence *
                (
                    0.7 +
                    intensity
                )
            ).toFixed(5)
        );

        nightmareNoise.setAttribute(
            "seed",
            String(
                settings.seed +
                5000 +
                Math.floor(
                    time * 0.003
                )
            )
        );

        nightmareMap.setAttribute(
            "scale",
            String(
                nightmareAmount *
                (
                    0.75 +
                    Math.sin(
                        time * 0.0021
                    ) * 0.25
                )
            )
        );

    }

}


// ============================================================
// APPLY FIELD-BASED WARP
//
// CSS transforms are deliberately subtle.
//
// The SVG turbulence handles the actual visual corruption.
// These transforms make the whole region feel spatially unstable.
// ============================================================

function updateFields(
    layers,
    fields,
    intensity,
    settings,
    time
) {

    const primary =
        layers.primary;

    const secondary =
        layers.secondary;

    let x =
        0;

    let y =
        0;

    let rotation =
        0;

    for (const field of fields) {

        const phase =
            field.phase +
            time *
            0.001 *
            field.speed;

        const influence =
            field.strength *
            intensity;

        x +=
            Math.cos(phase) *
            influence *
            settings.refractionOffset *
            0.25;

        y +=
            Math.sin(phase * 1.31) *
            influence *
            settings.refractionOffset *
            0.25;

        rotation +=
            Math.sin(
                phase * 0.71
            ) *
            influence *
            0.12;

    }


    primary.style.transform =
        `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

    secondary.style.transform =
        `translate(${-x * 1.7}px, ${-y * 1.3}px) rotate(${-rotation * 1.8}deg)`;

}


// ============================================================
// UPDATE TEARS
//
// Uses clip-path slices on a distorted duplicate.
//
// These aren't visible "bars". They are pieces of the original
// artwork which have become spatially displaced.
// ============================================================

function updateTearing(
    layer,
    settings,
    intensity
) {

    if (
        settings.tearing <= 0 ||
        intensity <= 0
    ) {

        layer.style.clipPath =
            "none";

        return;

    }


    const chance =
        settings.tearing *
        intensity;


    if (Math.random() > chance) {

        layer.style.clipPath =
            "none";

        return;

    }


    const tearCount =
        randomInt(
            settings.tearCountMin,
            settings.tearCountMax
        );


    const pieces = [];


    for (let i = 0; i < tearCount; i++) {

        const top =
            random(
                0,
                100
            );

        const height =
            random(
                settings.tearWidthMin,
                settings.tearWidthMax
            );

        const offset =
            random(
                settings.tearOffsetMin,
                settings.tearOffsetMax
            ) *
            intensity;


        pieces.push(
            `polygon(
                ${offset}px ${top}%,
                100% ${top}%,
                100% ${top + height}%,
                ${offset}px ${top + height}%
            )`
        );

    }


    layer.style.clipPath =
        pieces.length === 1
            ? pieces[0]
            : pieces.join(",");

}


// ============================================================
// COLOR INTERFERENCE
// ============================================================

function updateColorInterference(
    secondary,
    intensity,
    settings
) {

    const opacity =
        settings.ghostOpacity *
        intensity;


    secondary.style.opacity =
        clamp(
            opacity,
            0,
            1
        );


    secondary.style.color =
        settings.color;

    secondary.style.mixBlendMode =
        settings.blendMode;

}


// ============================================================
// MAIN
// ============================================================

export function startEldritchInfestation(
    asciiElement,
    interiorCells,
    userSettings = {}
) {

    const settings = {

        ...DEFAULTS,
        ...userSettings

    };


    let intensity =
        clamp(
            Number(settings.intensity) || 0,
            0,
            1
        );


    const interior =
        normalizeInterior(
            interiorCells
        );


    if (!asciiElement) {

        console.warn(
            "Eldritch infestation: ASCII element not found."
        );

        return {
            setIntensity() {},
            getIntensity() {
                return intensity;
            },
            set() {},
            stop() {}
        };

    }


    // --------------------------------------------------------
    // ENSURE POSITIONING CONTEXT
    // --------------------------------------------------------

    const computed =
        getComputedStyle(
            asciiElement
        );

    if (
        computed.position === "static"
    ) {

        asciiElement.style.position =
            "relative";

    }


    // --------------------------------------------------------
    // CREATE LAYERS
    // --------------------------------------------------------

    const primary =
        createLayer(
            asciiElement,
            "eldritch-primary"
        );

    const secondary =
        createLayer(
            asciiElement,
            "eldritch-secondary"
        );

    const nightmare =
        createLayer(
            asciiElement,
            "eldritch-nightmare"
        );


    primary.style.opacity =
        "0";

    secondary.style.opacity =
        "0";

    nightmare.style.opacity =
        "0";


    asciiElement.appendChild(
        primary
    );

    asciiElement.appendChild(
        secondary
    );

    asciiElement.appendChild(
        nightmare
    );


    // --------------------------------------------------------
    // SVG FILTERS
    // --------------------------------------------------------

    const filterSet =
        createFilterSvg(
            settings
        );


    primary.style.filter =
        `url(#${filterSet.filters.primaryId})`;

    secondary.style.filter =
        `url(#${filterSet.filters.secondaryId})`;

    nightmare.style.filter =
        `url(#${filterSet.filters.nightmareId})`;


    primary.style.zIndex =
        String(settings.zIndex);

    secondary.style.zIndex =
        String(settings.zIndex + 1);

    nightmare.style.zIndex =
        String(settings.zIndex + 2);


    // --------------------------------------------------------
    // METRICS
    // --------------------------------------------------------

    let metrics =
        getGridMetrics(
            asciiElement
        );


    // --------------------------------------------------------
    // FIELDS
    // --------------------------------------------------------

    const fields =
        createFields(
            settings
        );


    // --------------------------------------------------------
    // STATE
    // --------------------------------------------------------

    let running =
        true;

    let frame =
        0;

    let lastFrame =
        0;


    // --------------------------------------------------------
    // SYNC
    // --------------------------------------------------------

    function sync() {

        syncLayerGeometry(
            asciiElement,
            primary
        );

        syncLayerGeometry(
            asciiElement,
            secondary
        );

        syncLayerGeometry(
            asciiElement,
            nightmare
        );

        metrics =
            getGridMetrics(
                asciiElement
            );

    }


    sync();


    // --------------------------------------------------------
    // ANIMATION
    // --------------------------------------------------------

    function animate(time) {

        if (!running) {
            return;
        }


        frame =
            requestAnimationFrame(
                animate
            );


        if (
            !settings.animated
        ) {

            return;

        }


        const frameInterval =
            1000 /
            Math.max(
                1,
                settings.fps
            );


        if (
            time -
            lastFrame <
            frameInterval
        ) {

            return;

        }


        lastFrame =
            time;


        updateTurbulence(
            filterSet.filters,
            settings,
            intensity,
            time
        );


        updateFields(
            {
                primary,
                secondary
            },
            fields,
            intensity,
            settings,
            time
        );


        updateTearing(
            secondary,
            settings,
            intensity
        );


        updateColorInterference(
            secondary,
            intensity,
            settings
        );


        // ----------------------------------------------------
        // PRIMARY VISIBILITY
        // ----------------------------------------------------

        primary.style.opacity =
            clamp(
                intensity *
                settings.opacity,
                0,
                1
            );


        // ----------------------------------------------------
        // SECONDARY
        // ----------------------------------------------------

        secondary.style.opacity =
            clamp(
                intensity *
                settings.ghostOpacity *
                2,
                0,
                0.8
            );


        // ----------------------------------------------------
        // NIGHTMARE
        // ----------------------------------------------------

        const nightmareAmount =
            intensity >=
            settings.nightmareThreshold
                ? (
                    intensity -
                    settings.nightmareThreshold
                ) /
                (
                    1 -
                    settings.nightmareThreshold
                )
                : 0;


        nightmare.style.opacity =
            clamp(
                nightmareAmount *
                0.72,
                0,
                0.72
            );


        // ----------------------------------------------------
        // BOUNDARY ESCAPE
        //
        // At low intensity the effect stays relatively tame.
        //
        // As intensity approaches 1, the filter's overflow
        // becomes increasingly obvious.
        // ----------------------------------------------------

        const boundary =
            intensity >
            settings.boundaryThreshold
                ? (
                    intensity -
                    settings.boundaryThreshold
                ) /
                (
                    1 -
                    settings.boundaryThreshold
                )
                : 0;


        const expansion =
            boundary *
            settings.boundaryStrength *
            18;


        primary.style.left =
            `${-expansion}px`;

        primary.style.top =
            `${-expansion}px`;

        primary.style.width =
            `calc(100% + ${expansion * 2}px)`;

        primary.style.height =
            `calc(100% + ${expansion * 2}px)`;


        // ----------------------------------------------------
        // REFRACTION
        // ----------------------------------------------------

        if (
            settings.refraction >
            0
        ) {

            const refraction =
                settings.refraction *
                intensity;

            const rx =
                Math.sin(
                    time * 0.00071
                ) *
                settings.refractionOffset *
                refraction;

            const ry =
                Math.cos(
                    time * 0.00053
                ) *
                settings.refractionOffset *
                refraction;


            secondary.style.transform =
                `translate(${rx}px, ${ry}px)`;


            nightmare.style.transform =
                `translate(${-rx * 1.8}px, ${-ry * 1.4}px)`;

        }

    }


    // --------------------------------------------------------
    // RESIZE
    // --------------------------------------------------------

    function handleResize() {

        sync();

    }


    window.addEventListener(
        "resize",
        handleResize
    );


    // --------------------------------------------------------
    // START
    // --------------------------------------------------------

    frame =
        requestAnimationFrame(
            animate
        );


    // ========================================================
    // CONTROLLER
    // ========================================================

    return {

        setIntensity(value) {

            intensity =
                clamp(
                    Number(value) || 0,
                    0,
                    1
                );

        },


        getIntensity() {

            return intensity;

        },


        set(values = {}) {

            Object.assign(
                settings,
                values
            );

        },


        stop() {

            running =
                false;

            cancelAnimationFrame(
                frame
            );

            window.removeEventListener(
                "resize",
                handleResize
            );

            primary.remove();
            secondary.remove();
            nightmare.remove();

            filterSet.svg.remove();

        }

    };

}