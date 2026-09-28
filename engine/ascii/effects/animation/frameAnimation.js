// ============================================================
// ASCII FRAME ANIMATION
// ============================================================
//
// Reusable ASCII frame animation.
//
// Each element represents one ASCII frame.
//
// Example:
//
//     <pre data-ascii="ascii_0001"></pre>
//     <pre data-ascii="ascii_0002"></pre>
//     <pre data-ascii="ascii_0003"></pre>
//
// Then:
//
//     startAsciiFrameAnimation(
//         elements,
//         {
//             frameDuration: 800
//         }
//     );
//
// If frameDurations is not supplied, every frame uses
// frameDuration.
//
// ============================================================


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const ASCII_FRAME_ANIMATION_SETTINGS = {

    // --------------------------------------------------------
    // TIMING
    // --------------------------------------------------------

    // Default amount of time each frame remains visible.
    frameDuration: 1000,

    // Optional individual duration for each frame.
    //
    // If null, frameDuration is used for every frame.
    //
    // Example:
    //
    // frameDurations: [
    //     300,
    //     1000,
    //     500,
    //     2000
    // ]
    //
    frameDurations: null,

    // Overall animation speed.
    //
    // 1    = normal speed
    // 2    = twice as fast
    // 0.5  = half speed
    //
    // This affects both frameDuration and frameDurations.
    speed: 1,

    // Delay before the animation begins.
    startDelay: 0,


    // --------------------------------------------------------
    // PLAYBACK
    // --------------------------------------------------------

    // Play forward and then backward.
    reverseAtEnds: true,

    // Continue looping forever.
    loop: true,

    // Frame to begin on.
    startFrame: 0,

    // Initial playback direction.
    //
    // "forward"
    // "backward"
    direction: "forward",

    // Start the animation paused.
    paused: false,


    // --------------------------------------------------------
    // VISIBILITY
    // --------------------------------------------------------

    // Hide frames before their first activation.
    hiddenInitially: true,

    // How normal frames are hidden.
    //
    // "visibility"
    // "display"
    //
    visibilityMode: "visibility",


    // --------------------------------------------------------
    // WIND
    // --------------------------------------------------------

    // Enable character-by-character wind treatment.
    wind: false,

    // Overall wind strength.
    windStrength: 1,

    // Delay between rows.
    windDelay: -0.08,

    // Delay between characters within a row.
    windCharacterDelay: 0,

    // Wind direction.
    //
    // 1  = normal
    // -1 = reversed
    windDirection: 1,


    // --------------------------------------------------------
    // TRANSITIONS
    // --------------------------------------------------------

    // Frame transition.
    //
    // "none"
    // "fade"
    //
    transition: "none",

    // Transition duration in milliseconds.
    transitionDuration: 200,

    // CSS easing for transitions.
    transitionEasing: "ease",


    // --------------------------------------------------------
    // CALLBACKS
    // --------------------------------------------------------

    // Called whenever the active frame changes.
    //
    // function(index, element) {}
    //
    onFrameChange: null,

    // Called when a non-looping animation finishes.
    onComplete: null

};


// ============================================================
// ACTIVE INSTANCES
// ============================================================

const asciiFrameAnimationInstances = [];


// ============================================================
// LOAD ASCII FRAME
// ============================================================

function loadAsciiFrame(
    element,
    settings
) {

    const name =
        element.dataset.ascii;


    if (
        !name ||
        !window.ASCII ||
        !window.ASCII[name]
    ) {

        return;

    }


    const text =
        window.ASCII[name]
            .replace(/\r/g, "");


    if (
        settings.wind
    ) {

        renderWindFrame(
            element,
            text,
            settings
        );

    } else {

        element.textContent =
            text;

    }


    // --------------------------------------------------------
    // TRANSITION SETUP
    // --------------------------------------------------------

    if (
        settings.transition === "fade"
    ) {

        element.style.transition =
            `opacity ${settings.transitionDuration}ms ${settings.transitionEasing}`;

    }

}


// ============================================================
// RENDER WIND FRAME
// ============================================================

function renderWindFrame(
    element,
    text,
    settings
) {

    const lines =
        text.split("\n");


    const maxRows =
        Math.max(
            lines.length - 1,
            1
        );


    element.replaceChildren();


    lines.forEach(
        (
            line,
            row
        ) => {

            const rowElement =
                document.createElement(
                    "span"
                );


            rowElement.className =
                "ascii-wind-row";


            // More movement toward the top.
            const strength =
                (
                    (
                        row -
                        maxRows
                    ) /
                    maxRows
                ) *
                -1 *
                settings.windStrength;


            const delay =
                row *
                settings.windDelay *
                settings.windDirection;


            rowElement.style.setProperty(
                "--wind-strength",
                strength
            );


            rowElement.style.setProperty(
                "--wind-delay",
                `${delay}s`
            );


            for (
                let col = 0;
                col < line.length;
                col++
            ) {

                const char =
                    document.createElement(
                        "span"
                    );


                char.className =
                    "ascii-wind-char";


                char.textContent =
                    line[col] === " "
                        ? "\u00A0"
                        : line[col];


                if (
                    settings.windCharacterDelay !== 0
                ) {

                    char.style.setProperty(
                        "--wind-character-delay",
                        `${
                            col *
                            settings.windCharacterDelay *
                            settings.windDirection
                        }s`
                    );

                }


                rowElement.appendChild(
                    char
                );

            }


            element.appendChild(
                rowElement
            );


            element.appendChild(
                document.createElement(
                    "br"
                )
            );

        }
    );

}


// ============================================================
// SET FRAME VISIBILITY
// ============================================================

function setFrameVisibility(
    element,
    visible,
    settings
) {

    // Panic canvas elements have their own visibility system.
    if (
        element.dataset.panicCanvas
    ) {

        element.dataset.panicVisible =
            visible
                ? "visible"
                : "hidden";

        return;

    }


    // Fade transition.
    if (
        settings.transition === "fade"
    ) {

        element.style.opacity =
            visible
                ? "1"
                : "0";

        return;

    }


    // Display-based visibility.
    if (
        settings.visibilityMode ===
        "display"
    ) {

        element.style.display =
            visible
                ? ""
                : "none";

        return;

    }


    // Default behavior.
    element.style.visibility =
        visible
            ? "visible"
            : "hidden";

}


// ============================================================
// GET FRAME DURATION
// ============================================================
//
// If frameDurations is not supplied, this simply returns
// frameDuration.
//
// If frameDurations exists, the duration for the current
// frame is used instead.
//
// Speed is applied afterward so it affects either method.
//
// ============================================================

function getFrameDuration(
    index,
    settings
) {

    let duration =
        settings.frameDuration;


    if (
        Array.isArray(
            settings.frameDurations
        ) &&
        settings.frameDurations.length > 0
    ) {

        duration =
            settings.frameDurations[
                index %
                settings.frameDurations.length
            ];

    }


    return (
        Math.max(
            1,
            duration
        ) /
        Math.max(
            0.01,
            settings.speed
        )
    );

}


// ============================================================
// GET NEXT FRAME
// ============================================================

function getNextFrame(
    currentIndex,
    direction,
    frameCount,
    reverseAtEnds
) {

    if (
        frameCount <= 1
    ) {

        return {

            index: 0,

            direction

        };

    }


    let nextIndex =
        currentIndex +
        direction;


    let nextDirection =
        direction;


    // --------------------------------------------------------
    // REVERSE AT ENDS
    // --------------------------------------------------------

    if (
        reverseAtEnds
    ) {

        if (
            nextIndex >= frameCount
        ) {

            nextDirection =
                -1;

            nextIndex =
                frameCount - 2;

        }


        if (
            nextIndex < 0
        ) {

            nextDirection =
                1;

            nextIndex =
                1;

        }

    }


    // --------------------------------------------------------
    // LOOP FORWARD / BACKWARD
    // --------------------------------------------------------

    else {

        nextIndex =
            (
                nextIndex +
                frameCount
            ) %
            frameCount;

    }


    return {

        index: nextIndex,

        direction:
            nextDirection

    };

}


// ============================================================
// CREATE INSTANCE
// ============================================================

function createAsciiFrameAnimation(
    elements,
    settings
) {

    if (
        !elements ||
        !elements.length
    ) {

        return {

            stop() {},

            pause() {},

            resume() {},

            restart() {}

        };

    }


    const frames =
        Array.from(
            elements
        );


    // --------------------------------------------------------
    // LOAD ALL ART
    // --------------------------------------------------------

    frames.forEach(
        element => {

            loadAsciiFrame(
                element,
                settings
            );


            if (
                settings.hiddenInitially
            ) {

                setFrameVisibility(
                    element,
                    false,
                    settings
                );

            }

        }
    );


    // --------------------------------------------------------
    // INITIAL STATE
    // --------------------------------------------------------

    let currentIndex =
        Math.min(
            Math.max(
                0,
                settings.startFrame
            ),
            frames.length - 1
        );


    let direction =
        settings.direction ===
        "backward"
            ? -1
            : 1;


    let running =
        !settings.paused;


    let completed =
        false;


    let startTime =
        performance.now() +
        Math.max(
            0,
            settings.startDelay
        );


    let lastTime =
        performance.now();


    let elapsed =
        0;


    let animationFrame =
        null;


    // --------------------------------------------------------
    // SHOW INITIAL FRAME
    // --------------------------------------------------------

    setFrameVisibility(
        frames[currentIndex],
        true,
        settings
    );


    if (
        settings.onFrameChange
    ) {

        settings.onFrameChange(
            currentIndex,
            frames[currentIndex]
        );

    }


    // ========================================================
    // ANIMATION LOOP
    // ========================================================

    function animate(
        timestamp
    ) {

        animationFrame =
            requestAnimationFrame(
                animate
            );


        if (
            !running ||
            completed
        ) {

            lastTime =
                timestamp;

            return;

        }


        if (
            timestamp <
            startTime
        ) {

            return;

        }


        const delta =
            timestamp -
            lastTime;


        lastTime =
            timestamp;


        elapsed +=
            delta;


        const duration =
            getFrameDuration(
                currentIndex,
                settings
            );


        if (
            elapsed <
            duration
        ) {

            return;

        }


        elapsed -=
            duration;


        // ----------------------------------------------------
        // CHECK FOR END OF NON-LOOPING ANIMATION
        // ----------------------------------------------------

        if (
            !settings.loop &&
            (
                (
                    direction > 0 &&
                    currentIndex ===
                        frames.length - 1
                ) ||
                (
                    direction < 0 &&
                    currentIndex === 0
                )
            )
        ) {

            completed =
                true;


            if (
                settings.onComplete
            ) {

                settings.onComplete();

            }


            return;

        }


        // ----------------------------------------------------
        // GET NEXT FRAME
        // ----------------------------------------------------

        const next =
            getNextFrame(
                currentIndex,
                direction,
                frames.length,
                settings.reverseAtEnds
            );


        // ----------------------------------------------------
        // HIDE CURRENT
        // ----------------------------------------------------

        setFrameVisibility(
            frames[currentIndex],
            false,
            settings
        );


        // ----------------------------------------------------
        // UPDATE INDEX
        // ----------------------------------------------------

        currentIndex =
            next.index;


        direction =
            next.direction;


        // ----------------------------------------------------
        // SHOW NEXT
        // ----------------------------------------------------

        setFrameVisibility(
            frames[currentIndex],
            true,
            settings
        );


        // ----------------------------------------------------
        // CALLBACK
        // ----------------------------------------------------

        if (
            settings.onFrameChange
        ) {

            settings.onFrameChange(
                currentIndex,
                frames[currentIndex]
            );

        }

    }


    // ========================================================
    // START
    // ========================================================

    animationFrame =
        requestAnimationFrame(
            animate
        );


    // ========================================================
    // CONTROLS
    // ========================================================

    function pause() {

        running =
            false;

    }


    function resume() {

        if (
            completed
        ) {

            return;

        }


        running =
            true;

        lastTime =
            performance.now();

    }


    function restart() {

        completed =
            false;


        running =
            true;


        currentIndex =
            Math.min(
                Math.max(
                    0,
                    settings.startFrame
                ),
                frames.length - 1
            );


        direction =
            settings.direction ===
            "backward"
                ? -1
                : 1;


        elapsed =
            0;


        frames.forEach(
            (
                element,
                index
            ) => {

                setFrameVisibility(
                    element,
                    index === currentIndex,
                    settings
                );

            }
        );


        lastTime =
            performance.now();

    }


    function stop() {

        if (
            animationFrame !== null
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        animationFrame =
            null;


        running =
            false;

    }


    return {

        pause,

        resume,

        restart,

        stop

    };

}


// ============================================================
// START ASCII FRAME ANIMATION
// ============================================================

function startAsciiFrameAnimation(
    elements,
    overrides = {}
) {

    const settings = {

        ...ASCII_FRAME_ANIMATION_SETTINGS,

        ...overrides

    };


    const instance =
        createAsciiFrameAnimation(
            elements,
            settings
        );


    asciiFrameAnimationInstances.push(
        instance
    );


    return instance;

}


// ============================================================
// STOP ALL
// ============================================================

function stopAsciiFrameAnimations() {

    asciiFrameAnimationInstances.forEach(
        instance => {

            instance.stop();

        }
    );


    asciiFrameAnimationInstances.length =
        0;

}


// ============================================================
// GLOBAL ACCESS
// ============================================================

window.ASCII_FRAME_ANIMATION_SETTINGS =
    ASCII_FRAME_ANIMATION_SETTINGS;


window.startAsciiFrameAnimation =
    startAsciiFrameAnimation;


window.stopAsciiFrameAnimations =
    stopAsciiFrameAnimations;