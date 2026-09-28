// ==================================================
// DEFAULT SETTINGS
// ==================================================

const MITE_SETTINGS = {

    // HOW MANY CAN EXIST AT ONCE
    maxActive: 35,

    // HOW OFTEN A NEW MITE APPEARS
    spawnDelayMin: 100,
    spawnDelayMax: 500,

    // HOW LONG A MITE STAYS VISIBLE
    visibleTimeMin: 300,
    visibleTimeMax: 3500,

    // HOW LONG IT TAKES TO FADE IN / OUT
    appearTime: 0,
    disappearTime: 0,

    // CRAWLING
    crawl: true,
    moveTimeMin: 120,
    moveTimeMax: 750,
    pauseMin: 100,
    pauseMax: 500,

    // HOW FAR A MITE CAN MOVE
    maxMoveX: 3,
    maxMoveY: 3,

    // CHARACTERS
    characters: [
        ".",
        "'",
        ",",
        "·",
        ":"
    ],

    // DON'T SPAWN ON AN ACTIVE CELL
    avoidActiveCells: true
};


// ==================================================
// START MITES
// ==================================================

export function startMites(
    asciiElement,
    interiorCells,
    settings = {}
) {

    const options = {
        ...MITE_SETTINGS,
        ...settings
    };


    // ==================================================
    // RANDOM NUMBER
    // ==================================================

    function randomBetween(min, max) {

        return min +
            Math.random() * (max - min);
    }


    // ==================================================
    // RANDOM ITEM
    // ==================================================

    function randomItem(array) {

        if (!array.length) {
            return null;
        }

        return array[
            Math.floor(
                Math.random() * array.length
            )
        ];
    }


    // ==================================================
    // POSITION EFFECT
    // ==================================================

    function positionEffect(
        effect,
        cell
    ) {

        effect.style.left =
            `${cell.x}ch`;

        effect.style.top =
            `${cell.y}em`;
    }


    // ==================================================
    // FIND RANDOM CELL
    // ==================================================

    function getRandomCell(
        cells,
        activeCells,
        settings
    ) {

        if (!cells.length) {
            return null;
        }


        let available = cells;


        if (settings.avoidActiveCells) {

            available =
                cells.filter(cell => {

                    return !activeCells.some(
                        active =>
                            active.x === cell.x &&
                            active.y === cell.y
                    );
                });


            // If every cell is occupied,
            // allow a duplicate rather than stopping.
            if (!available.length) {
                available = cells;
            }
        }


        return randomItem(
            available
        );
    }


    // ==================================================
    // FIND NEIGHBORS
    // ==================================================

    function getNeighbors(
        cell,
        interiorCells,
        settings
    ) {

        return interiorCells.filter(other => {

            const dx =
                Math.abs(
                    other.x - cell.x
                );

            const dy =
                Math.abs(
                    other.y - cell.y
                );


            return (
                dx <= settings.maxMoveX &&
                dy <= settings.maxMoveY &&
                !(dx === 0 && dy === 0)
            );
        });
    }


    // ==================================================
    // CREATE SPORADIC EFFECT
    // ==================================================

    function createSporadicEffect(
        cells,
        activeCells,
        settings,
        onRemove
    ) {

        if (!cells.length) {
            return null;
        }


        // --------------------------------------------------
        // PICK STARTING LOCATION
        // --------------------------------------------------

        const startingCell =
            getRandomCell(
                cells,
                activeCells,
                settings
            );


        if (!startingCell) {
            return null;
        }


        // --------------------------------------------------
        // CREATE ELEMENT
        // --------------------------------------------------

        const effect =
            document.createElement("span");


        effect.className =
            "itch-mite";


        effect.textContent =
            randomItem(
                settings.characters
            );


        asciiElement.appendChild(
            effect
        );


        // --------------------------------------------------
        // TRACK ACTIVE CELL
        // --------------------------------------------------

        let current =
            startingCell;


        activeCells.push(
            current
        );


        positionEffect(
            effect,
            current
        );


        // --------------------------------------------------
        // APPEAR
        // --------------------------------------------------

        if (
            settings.appearTime > 0
        ) {

            effect.style.opacity =
                "0";


            effect.style.transition =
                `opacity ${settings.appearTime}ms linear`;


            requestAnimationFrame(() => {

                effect.style.opacity =
                    "1";

            });

        } else {

            effect.style.opacity =
                "1";
        }


        // --------------------------------------------------
        // CLEAN UP ACTIVE CELL
        // --------------------------------------------------

        function removeActiveCell(
            cell
        ) {

            const index =
                activeCells.indexOf(
                    cell
                );


            if (index !== -1) {

                activeCells.splice(
                    index,
                    1
                );
            }
        }


        // --------------------------------------------------
        // MOVE
        // --------------------------------------------------

        function crawl() {

            if (
                !effect.isConnected
            ) {
                return;
            }


            const neighbors =
                getNeighbors(
                    current,
                    cells,
                    settings
                );


            if (
                !neighbors.length
            ) {
                return;
            }


            const next =
                randomItem(
                    neighbors
                );


            removeActiveCell(
                current
            );


            current =
                next;


            activeCells.push(
                current
            );


            effect.textContent =
                randomItem(
                    settings.characters
                );


            const moveTime =
                randomBetween(
                    settings.moveTimeMin,
                    settings.moveTimeMax
                );


            effect.style.transition =
                `left ${moveTime}ms linear,
                 top ${moveTime}ms linear`;


            positionEffect(
                effect,
                current
            );


            const pauseTime =
                randomBetween(
                    settings.pauseMin,
                    settings.pauseMax
                );


            setTimeout(
                crawl,
                moveTime + pauseTime
            );
        }


        // --------------------------------------------------
        // START CRAWLING
        // --------------------------------------------------

        if (
            settings.crawl
        ) {

            const firstMoveDelay =
                randomBetween(
                    settings.pauseMin,
                    settings.pauseMax
                );


            setTimeout(
                crawl,
                firstMoveDelay
            );
        }


        // --------------------------------------------------
        // DISAPPEAR
        // --------------------------------------------------

        const visibleTime =
            randomBetween(
                settings.visibleTimeMin,
                settings.visibleTimeMax
            );


        setTimeout(() => {

            removeActiveCell(
                current
            );


            if (
                !effect.isConnected
            ) {

                onRemove();

                return;
            }


            if (
                settings.disappearTime > 0
            ) {

                effect.style.transition =
                    `opacity ${settings.disappearTime}ms linear`;


                effect.style.opacity =
                    "0";


                setTimeout(() => {

                    if (
                        effect.isConnected
                    ) {
                        effect.remove();
                    }


                    onRemove();

                }, settings.disappearTime);

            } else {

                effect.remove();

                onRemove();
            }

        }, visibleTime);


        return effect;
    }


    // ==================================================
    // SPORADIC EFFECT LOOP
    // ==================================================

    const activeCells = [];
    const activeEffects = new Set();


    function scheduleNext() {

        const delay =
            randomBetween(
                options.spawnDelayMin,
                options.spawnDelayMax
            );


        setTimeout(() => {

            if (
                activeEffects.size <
                options.maxActive
            ) {

                let effect;


                effect =
                    createSporadicEffect(
                        interiorCells,
                        activeCells,
                        options,
                        () => {

                            activeEffects.delete(
                                effect
                            );

                        }
                    );


                if (effect) {

                    activeEffects.add(
                        effect
                    );
                }
            }


            scheduleNext();

        }, delay);
    }


    scheduleNext();
}