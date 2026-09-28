// ==================================================
// FIND LARGEST INTERIOR
// ==================================================

const DEFAULT_SETTINGS = {

    // How much empty space must surround a cell
    // before it can be considered part of the interior.
    minClearance: 2,

    // Prevents enormous open areas outside the artwork
    // from becoming part of the interior.
    maxClearance: 12

};


// ==================================================
// FIND INTERIOR
// ==================================================

export function findInterior(
    art,
    settings = {}
) {

    const options = {
        ...DEFAULT_SETTINGS,
        ...settings
    };


    const lines =
        art.split("\n");


    const height =
        lines.length;


    const width =
        Math.max(
            ...lines.map(
                line => [...line].length
            )
        );


    // ==================================================
    // BUILD GRID
    // ==================================================

    const grid =
        lines.map(line => {

            const chars = [...line];

            while (
                chars.length < width
            ) {
                chars.push(" ");
            }

            return chars;
        });


    // ==================================================
    // FIND ASCII BOUNDING BOX
    // ==================================================

    let minX = width;
    let maxX = -1;
    let minY = height;
    let maxY = -1;


    for (
        let y = 0;
        y < height;
        y++
    ) {

        for (
            let x = 0;
            x < width;
            x++
        ) {

            const char =
                grid[y][x];


            if (
                char !== " " &&
                char !== "\t"
            ) {

                minX =
                    Math.min(
                        minX,
                        x
                    );

                maxX =
                    Math.max(
                        maxX,
                        x
                    );

                minY =
                    Math.min(
                        minY,
                        y
                    );

                maxY =
                    Math.max(
                        maxY,
                        y
                    );
            }
        }
    }


    if (maxX === -1) {
        return [];
    }


    // ==================================================
    // DISTANCE FROM ASCII ART
    // ==================================================

    const distances =
        Array.from(
            { length: height },
            () =>
                Array(width).fill(Infinity)
        );


    const queue = [];


    // Every ASCII character starts at distance 0.
    for (
        let y = minY;
        y <= maxY;
        y++
    ) {

        for (
            let x = minX;
            x <= maxX;
            x++
        ) {

            const char =
                grid[y][x];


            if (
                char !== " " &&
                char !== "\t"
            ) {

                distances[y][x] = 0;

                queue.push({
                    x,
                    y
                });
            }
        }
    }


    // ==================================================
    // DISTANCE FLOOD FILL
    // ==================================================

    let queueIndex = 0;


    while (
        queueIndex <
        queue.length
    ) {

        const current =
            queue[queueIndex++];


        const currentDistance =
            distances[
                current.y
            ][
                current.x
            ];


        const neighbors = [

            {
                x: current.x + 1,
                y: current.y
            },

            {
                x: current.x - 1,
                y: current.y
            },

            {
                x: current.x,
                y: current.y + 1
            },

            {
                x: current.x,
                y: current.y - 1
            }

        ];


        for (
            const neighbor
            of neighbors
        ) {

            if (
                neighbor.x < minX ||
                neighbor.x > maxX ||
                neighbor.y < minY ||
                neighbor.y > maxY
            ) {
                continue;
            }


            const nextDistance =
                currentDistance + 1;


            if (
                nextDistance <
                distances[
                    neighbor.y
                ][
                    neighbor.x
                ]
            ) {

                distances[
                    neighbor.y
                ][
                    neighbor.x
                ] =
                    nextDistance;


                queue.push(
                    neighbor
                );
            }
        }
    }


    // ==================================================
    // BUILD USABLE INTERIOR
    // ==================================================

    const interiorGrid =
        Array.from(
            { length: height },
            () =>
                Array(width).fill(false)
        );


    for (
        let y = minY;
        y <= maxY;
        y++
    ) {

        for (
            let x = minX;
            x <= maxX;
            x++
        ) {

            const char =
                grid[y][x];


            if (
                char !== " " &&
                char !== "\t"
            ) {
                continue;
            }


            const distance =
                distances[y][x];


            if (
                distance >=
                options.minClearance &&
                distance <=
                options.maxClearance
            ) {

                interiorGrid[y][x] =
                    true;
            }
        }
    }


    // ==================================================
    // FIND CONNECTED INTERIOR REGIONS
    // ==================================================

    const visited =
        new Set();


    const regions = [];


    function key(x, y) {
        return `${x},${y}`;
    }


    for (
        let y = minY;
        y <= maxY;
        y++
    ) {

        for (
            let x = minX;
            x <= maxX;
            x++
        ) {

            if (
                !interiorGrid[y][x]
            ) {
                continue;
            }


            const startKey =
                key(x, y);


            if (
                visited.has(
                    startKey
                )
            ) {
                continue;
            }


            const region = [];
            const queue = [
                { x, y }
            ];


            visited.add(
                startKey
            );


            let queueIndex = 0;


            while (
                queueIndex <
                queue.length
            ) {

                const current =
                    queue[
                        queueIndex++
                    ];


                region.push(
                    current
                );


                const neighbors = [

                    {
                        x: current.x + 1,
                        y: current.y
                    },

                    {
                        x: current.x - 1,
                        y: current.y
                    },

                    {
                        x: current.x,
                        y: current.y + 1
                    },

                    {
                        x: current.x,
                        y: current.y - 1
                    }

                ];


                for (
                    const neighbor
                    of neighbors
                ) {

                    if (
                        neighbor.x < minX ||
                        neighbor.x > maxX ||
                        neighbor.y < minY ||
                        neighbor.y > maxY
                    ) {
                        continue;
                    }


                    if (
                        !interiorGrid[
                            neighbor.y
                        ][
                            neighbor.x
                        ]
                    ) {
                        continue;
                    }


                    const neighborKey =
                        key(
                            neighbor.x,
                            neighbor.y
                        );


                    if (
                        visited.has(
                            neighborKey
                        )
                    ) {
                        continue;
                    }


                    visited.add(
                        neighborKey
                    );


                    queue.push(
                        neighbor
                    );
                }
            }


            regions.push(
                region
            );
        }
    }


    // ==================================================
    // LARGEST INTERIOR REGION
    // ==================================================

    if (
        !regions.length
    ) {
        return [];
    }


    regions.sort(
        (a, b) =>
            b.length -
            a.length
    );


    return regions[0];
}