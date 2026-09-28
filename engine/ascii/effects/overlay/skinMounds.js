// ==================================================
// DEFAULT SETTINGS
// ==================================================

const MOUND_SETTINGS = {

    maxActive: 3,
    maxTotal: 12,

    spawnDelayMin: 1000,
    spawnDelayMax: 5000,

    startTimeMin: 1500,
    startTimeMax: 4000,

    moveTimeMin: 700,
    moveTimeMax: 1500,

    pauseMin: 900,
    pauseMax: 2800,

    maxMoveX: 3,
    maxMoveY: 2,

    moundScaleMin: 0.8,
    moundScaleMax: 1.3,

    stillFrameTimeMin: 180,
    stillFrameTimeMax: 450,

    moveFrameTimeMin: 100,
    moveFrameTimeMax: 250,

    popFrameTime: 180,
    crushFrameTime: 150,
    burrowFrameTime: 180,

    burrowTimeMin: 4000,
    burrowTimeMax: 12000,

    respawnDelayMin: 1000,
    respawnDelayMax: 5000,

    crawl: true,
    avoidActiveCells: true,

    arts: {

        still: [],

        right: [],
        left: [],
        up: [],
        down: [],

        pop: [],
        crush: [],
        burrow: [],
        scar: []

    }

};


// ==================================================
// START
// ==================================================

export function startSkinMounds(
    asciiElement,
    interiorCells,
    settings = {}
) {

    const options = {

        ...MOUND_SETTINGS,

        ...settings,

        arts: {

            ...MOUND_SETTINGS.arts,
            ...(settings.arts || {})

        }

    };


    if (
        !asciiElement ||
        !interiorCells ||
        !interiorCells.length
    ) {

        return;

    }


    const activeMounds = [];

    let totalCreated = 0;


    // ==================================================
    // RANDOM
    // ==================================================

    function randomBetween(min, max) {

        return (
            min +
            Math.random() *
            (max - min)
        );

    }


    function randomItem(array) {

        if (
            !array ||
            !array.length
        ) {

            return null;

        }


        return array[
            Math.floor(
                Math.random() * array.length
            )
        ];

    }


    // ==================================================
    // ART
    // ==================================================

    function normalizeArt(art) {

        if (
            art === null ||
            art === undefined
        ) {

            return "";

        }


        return String(art)
            .replace(/^\n/, "")
            .replace(/\n$/, "");

    }


    // ==================================================
    // FONT SIZE
    // ==================================================

    const handFontSize =
        parseFloat(
            getComputedStyle(
                asciiElement
            ).fontSize
        );


    function applyMoundScale(
        element,
        scale
    ) {

        element.style.fontSize =
            `${handFontSize * scale}px`;

    }


    // ==================================================
    // GRID MEASUREMENT
    // ==================================================

    function getGridMetrics() {

        const style =
            getComputedStyle(
                asciiElement
            );


        const fontSize =
            parseFloat(
                style.fontSize
            );


        let lineHeight =
            parseFloat(
                style.lineHeight
            );


        if (
            Number.isNaN(lineHeight)
        ) {

            lineHeight =
                fontSize;

        }


        const canvas =
            document.createElement(
                "canvas"
            );


        const context =
            canvas.getContext(
                "2d"
            );


        context.font =
            `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;


        const charWidth =
            context.measureText(
                "M"
            ).width;


        return {

            charWidth,
            lineHeight

        };

    }


    // ==================================================
    // POSITION
    // ==================================================

    function positionMound(
        element,
        cell
    ) {

        if (
            !element
        ) {

            return;

        }


        const metrics =
            getGridMetrics();


        const parentRect =
            asciiElement.getBoundingClientRect();


        const elementRect =
            element.getBoundingClientRect();


        const anchorX =
            cell.x *
            metrics.charWidth +
            metrics.charWidth / 2;


        const anchorY =
            cell.y *
            metrics.lineHeight +
            metrics.lineHeight / 2;


        const left =
            anchorX -
            elementRect.width / 2;


        const top =
            anchorY -
            elementRect.height / 2;


        element.style.left =
            `${left}px`;

        element.style.top =
            `${top}px`;

    }


    // ==================================================
    // ART
    // ==================================================

    function setArt(
        mound,
        art
    ) {

        if (
            !mound.element ||
            !mound.element.isConnected
        ) {

            return;

        }


        mound.currentArt =
            normalizeArt(
                art
            );


        mound.element.textContent =
            mound.currentArt;


        positionMound(
            mound.element,
            mound
        );

    }


    // ==================================================
    // RANDOM INTERIOR CELL
    // ==================================================

    function getRandomCell() {

        let available =
            interiorCells;


        if (
            options.avoidActiveCells
        ) {

            available =
                interiorCells.filter(
                    cell => {

                        return !activeMounds.some(
                            mound => {

                                return (
                                    mound.x === cell.x &&
                                    mound.y === cell.y
                                );

                            }
                        );

                    }
                );


            if (
                !available.length
            ) {

                available =
                    interiorCells;

            }

        }


        return randomItem(
            available
        );

    }


    // ==================================================
    // NEIGHBORS
    // ==================================================

    function getNeighbors(
        cell
    ) {

        return interiorCells.filter(
            other => {

                const dx =
                    Math.abs(
                        other.x - cell.x
                    );

                const dy =
                    Math.abs(
                        other.y - cell.y
                    );


                return (

                    dx <= options.maxMoveX &&
                    dy <= options.maxMoveY &&

                    !(dx === 0 && dy === 0)

                );

            }
        );

    }


    // ==================================================
    // DIRECTION
    // ==================================================

    function getDirection(
        current,
        next
    ) {

        const dx =
            next.x - current.x;

        const dy =
            next.y - current.y;


        if (
            Math.abs(dx) >=
            Math.abs(dy)
        ) {

            return (
                dx >= 0
                    ? "right"
                    : "left"
            );

        }


        return (
            dy >= 0
                ? "down"
                : "up"
        );

    }


    // ==================================================
    // CLEAR ANIMATION
    // ==================================================

    function clearAnimationTimer(
        mound
    ) {

        if (
            mound.animationTimer
        ) {

            clearTimeout(
                mound.animationTimer
            );

            mound.animationTimer =
                null;

        }

    }


    // ==================================================
    // ANIMATION
    // ==================================================

    function playOrderedAnimation(
        mound,
        arts,
        frameTimeMin,
        frameTimeMax,
        onComplete,
        loop = false
    ) {

        clearAnimationTimer(
            mound
        );


        if (
            !arts ||
            !arts.length
        ) {

            if (
                onComplete
            ) {

                onComplete();

            }

            return;

        }


        let frameIndex = 0;


        function nextFrame() {

            if (
                !mound.element ||
                !mound.element.isConnected
            ) {
                return;
            }


            setArt(
                mound,
                arts[frameIndex]
            );


            frameIndex++;


            if (
                frameIndex >=
                arts.length
            ) {

                if (
                    loop
                ) {

                    frameIndex = 0;

                } else {

                    if (
                        onComplete
                    ) {

                        onComplete();

                    }

                    return;

                }

            }


            mound.animationTimer =
                setTimeout(
                    nextFrame,
                    randomBetween(
                        frameTimeMin,
                        frameTimeMax
                    )
                );

        }


        nextFrame();

    }


    // ==================================================
    // STILL
    // ==================================================

    function startStill(
        mound
    ) {

        if (
            mound.crushed ||
            mound.burrowing ||
            !mound.element ||
            !mound.element.isConnected
        ) {

            return;

        }


        mound.state =
            "still";


        const arts =
            options.arts.still;


        if (
            arts &&
            arts.length
        ) {

            playOrderedAnimation(
                mound,
                arts,
                options.stillFrameTimeMin,
                options.stillFrameTimeMax,
                null,
                true
            );

        }

    }


    // ==================================================
    // MOVE
    // ==================================================

    function moveMound(
        mound
    ) {

        if (
            mound.crushed ||
            mound.burrowing ||
            !mound.element ||
            !mound.element.isConnected
        ) {

            return;

        }


        const neighbors =
            getNeighbors(
                mound
            );


        if (
            !neighbors.length
        ) {

            startStill(
                mound
            );


            mound.moveTimer =
                setTimeout(
                    () => moveMound(mound),
                    randomBetween(
                        options.pauseMin,
                        options.pauseMax
                    )
                );


            return;

        }


        const next =
            randomItem(
                neighbors
            );


        const direction =
            getDirection(
                mound,
                next
            );


        const arts =
            options.arts[
                direction
            ];


        const moveTime =
            randomBetween(
                options.moveTimeMin,
                options.moveTimeMax
            );


        mound.state =
            direction;


        clearAnimationTimer(
            mound
        );


        if (
            arts &&
            arts.length
        ) {

            playOrderedAnimation(
                mound,
                arts,
                options.moveFrameTimeMin,
                options.moveFrameTimeMax,
                null,
                true
            );

        }


        mound.element.style.transition =
            `left ${moveTime}ms linear,
             top ${moveTime}ms linear`;


        mound.x =
            next.x;

        mound.y =
            next.y;


        positionMound(
            mound.element,
            mound
        );


        mound.moveTimer =
            setTimeout(
                () => {

                    if (
                        mound.crushed ||
                        mound.burrowing
                    ) {

                        return;

                    }


                    clearAnimationTimer(
                        mound
                    );


                    startStill(
                        mound
                    );


                    mound.moveTimer =
                        setTimeout(
                            () => moveMound(mound),
                            randomBetween(
                                options.pauseMin,
                                options.pauseMax
                            )
                        );

                },
                moveTime
            );

    }


    // ==================================================
    // BURROW
    // ==================================================

    function burrow(
        mound
    ) {

        if (
            mound.crushed ||
            mound.burrowing
        ) {

            return;

        }


        mound.burrowing =
            true;

        mound.state =
            "burrow";


        clearTimeout(
            mound.moveTimer
        );

        clearAnimationTimer(
            mound
        );


        const arts =
            options.arts.burrow;


        if (
            arts &&
            arts.length
        ) {

            playOrderedAnimation(
                mound,
                arts,
                options.burrowFrameTime,
                options.burrowFrameTime,
                () => {

                    finishBurrow(
                        mound
                    );

                }
            );

        } else {

            finishBurrow(
                mound
            );

        }

    }


    // ==================================================
    // FINISH BURROW
    // ==================================================

    function finishBurrow(
        mound
    ) {

        if (
            mound.crushed
        ) {

            return;

        }


        if (
            mound.element &&
            mound.element.isConnected
        ) {

            mound.element.remove();

        }


        const index =
            activeMounds.indexOf(
                mound
            );


        if (
            index !== -1
        ) {

            activeMounds.splice(
                index,
                1
            );

        }


        mound.element =
            null;


        mound.respawnTimer =
            setTimeout(
                () => {

                    if (
                        !mound.crushed
                    ) {

                        mound.burrowing =
                            false;

                        spawnMound(
                            mound
                        );

                    }

                },
                randomBetween(
                    options.respawnDelayMin,
                    options.respawnDelayMax
                )
            );

    }


    // ==================================================
    // SCAR
    // ==================================================

    function createScar(
        cell,
        scale
    ) {

        const arts =
            options.arts.scar;


        if (
            !arts ||
            !arts.length
        ) {

            return;

        }


        const scar =
            document.createElement(
                "span"
            );


        scar.className =
            "skin-mound-mark";


        scar.textContent =
            normalizeArt(
                randomItem(
                    arts
                )
            );


        applyMoundScale(
            scar,
            scale
        );


        asciiElement.appendChild(
            scar
        );


        positionMound(
            scar,
            cell
        );

    }


    // ==================================================
    // CRUSH
    // ==================================================

    function crush(
        mound
    ) {

        if (
            mound.crushed ||
            mound.burrowing
        ) {

            return;

        }


        mound.crushed =
            true;

        mound.state =
            "crushed";


        clearTimeout(
            mound.moveTimer
        );

        clearTimeout(
            mound.respawnTimer
        );

        clearAnimationTimer(
            mound
        );

        clearTimeout(
            mound.burrowTimer
        );


        const cell = {

            x: mound.x,
            y: mound.y

        };


        const arts =
            options.arts.crush;


        if (
            arts &&
            arts.length &&
            mound.element &&
            mound.element.isConnected
        ) {

            playOrderedAnimation(
                mound,
                arts,
                options.crushFrameTime,
                options.crushFrameTime,
                () => {

                    if (
                        mound.element &&
                        mound.element.isConnected
                    ) {

                        mound.element.remove();

                    }


                    const index =
                        activeMounds.indexOf(
                            mound
                        );


                    if (
                        index !== -1
                    ) {

                        activeMounds.splice(
                            index,
                            1
                        );

                    }


                    createScar(
                        cell,
                        mound.scale
                    );

                }
            );

        } else {

            removeMound(
                mound
            );

            createScar(
                cell,
                mound.scale
            );

        }

    }


    // ==================================================
    // REMOVE
    // ==================================================

    function removeMound(
        mound
    ) {

        clearTimeout(
            mound.moveTimer
        );

        clearTimeout(
            mound.burrowTimer
        );

        clearTimeout(
            mound.respawnTimer
        );

        clearAnimationTimer(
            mound
        );


        const index =
            activeMounds.indexOf(
                mound
            );


        if (
            index !== -1
        ) {

            activeMounds.splice(
                index,
                1
            );

        }


        if (
            mound.element &&
            mound.element.isConnected
        ) {

            mound.element.remove();

        }


        mound.element =
            null;

    }


    // ==================================================
    // SPAWN
    // ==================================================

    function spawnMound(
        mound
    ) {

        if (
            mound.crushed
        ) {

            return;

        }


        if (
            activeMounds.length >=
            options.maxActive
        ) {

            mound.respawnTimer =
                setTimeout(
                    () => spawnMound(mound),
                    randomBetween(
                        options.respawnDelayMin,
                        options.respawnDelayMax
                    )
                );

            return;

        }


        const cell =
            getRandomCell();


        if (
            !cell
        ) {

            return;

        }


        mound.x =
            cell.x;

        mound.y =
            cell.y;

        mound.burrowing =
            false;


        const element =
            document.createElement(
                "span"
            );


        element.className =
            "skin-mound";


        applyMoundScale(
            element,
            mound.scale
        );


        element.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                crush(
                    mound
                );

            }
        );


        asciiElement.appendChild(
            element
        );


        mound.element =
            element;


        activeMounds.push(
            mound
        );


        // --------------------------------------------------
        // INITIAL STILL
        // --------------------------------------------------

        if (
            options.arts.still &&
            options.arts.still.length
        ) {

            setArt(
                mound,
                options.arts.still[0]
            );

        }


        startStill(
            mound
        );


        // --------------------------------------------------
        // FIRST MOVE
        // --------------------------------------------------

        mound.moveTimer =
            setTimeout(
                () => {

                    moveMound(
                        mound
                    );

                },
                randomBetween(
                    options.startTimeMin,
                    options.startTimeMax
                )
            );


        // --------------------------------------------------
        // BURROW
        // --------------------------------------------------

        mound.burrowTimer =
            setTimeout(
                () => {

                    burrow(
                        mound
                    );

                },
                randomBetween(
                    options.burrowTimeMin,
                    options.burrowTimeMax
                )
            );

    }


    // ==================================================
    // NEW BUG
    // ==================================================

    function createMound() {

        if (
            totalCreated >=
            options.maxTotal
        ) {

            return;

        }


        if (
            activeMounds.length >=
            options.maxActive
        ) {

            return;

        }


        const mound = {

            element: null,

            x: 0,
            y: 0,

            scale:
                randomBetween(
                    options.moundScaleMin,
                    options.moundScaleMax
                ),

            state: "still",

            moveTimer: null,
            burrowTimer: null,
            respawnTimer: null,
            animationTimer: null,

            currentArt: "",

            burrowing: false,
            crushed: false

        };


        totalCreated++;


        spawnMound(
            mound
        );

    }


    // ==================================================
    // INITIAL BUG
    // ==================================================

    createMound();


    // ==================================================
    // NEW BUG LOOP
    // ==================================================

    function scheduleSpawn() {

        if (
            totalCreated >=
            options.maxTotal
        ) {

            return;

        }


        setTimeout(
            () => {

                createMound();

                scheduleSpawn();

            },
            randomBetween(
                options.spawnDelayMin,
                options.spawnDelayMax
            )
        );

    }


    scheduleSpawn();

}