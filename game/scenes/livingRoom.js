// #region IMPORTS


import {
    bedTop_001,
    bedTop_002,
    bedTop_003,
    bedWall_001,
    bedWall_002,
    bedWall_003,
    bedWindow_001,
    bedWindow_002,
    bedWindow_003,
    ceilingFan_001,
    ceilingFan_003,
    jerboaTent_001,
    livingRoomNorth_001,
    livingRoomNorth_002,
    livingRoomNorth_003,
    exitDoor_001,
    exitDoor_002,
    exitDoor_003,
    fridgeInterior_001,
    fridgeInterior_002,
    fridgeInterior_003,
    mouseHoleEntrance_001,
    mouseHoleEntrance_002,
    neighborWindow_001,
    neighborWindow_002
} from "../assets/ascii/environments/livingRoom.js";

import {bouncerMouseDefinition} from "../assets/ascii/props/bouncerMouse.js";
import {drillBitDefinition} from "../assets/ascii/props/drillBit.js";
import {drillDefinition} from "../assets/ascii/props/powerDrill.js";
import {jerboaDefinition} from "../assets/ascii/props/jerboa.js";
import {neighborDefinition} from "../assets/ascii/props/neighbor.js";
import {waterPipeDefinition} from "../assets/ascii/props/waterPipe.js";


// #endregion




// #region SCENES


export const livingRoomScenes = {

    // MARK: Ceiling
    ceiling: {
        animation: {
            frames: [
                ceilingFan_001,
                ceilingFan_003
            ],
            frameDuration: 150
        },

        props: [],

        navigation: {
            left: "bedWindow",
            right: "bedWall"
        }
    },


    // MARK: Bed Window
    bedWindow: {
        animation: {
            frames: [
                bedWindow_001,
                bedWindow_002,
                bedWindow_003,
                bedWindow_002
            ],
            frameDuration: 1000
        },

        props: [],

        navigation: {
            right: "bedWall"
        }
    },


    // MARK: Bed Wall
    bedWall: {
        animation: {
            frames: [
                bedWall_001,
                bedWall_002,
                bedWall_003,
                bedWall_002
            ],
            frameDuration: 550
        },

        props: [],

        navigation: {
            right: "bedTop"
        },

        navigationAreas: [
            {
                destination: "bathroomEntrance",

                area: {
                    column: 90,
                    row: 11,
                    width: 14,
                    height: 26
                },

                cursor: "upRight"
            }
        ]
    },


    // MARK: Under Bed
    underBed: {
        animation: {
            frames: [
                bedWall_001,
                bedWall_002,
                bedWall_003,
                bedWall_002
            ],
            frameDuration: 550
        },

        props: [],

        navigation: {
            down: "bathroomExit"
        },

        navigationAreas: [
            {
                destination: "bathroomExit",

                area: {
                    column: 88,
                    row: 4,
                    width: 55,
                    height: 45
                },

                cursor: "up"
            }
        ]
    },


    // MARK: Bed Top
    bedTop: {
        animation: {
            frames: [
                bedTop_001,
                bedTop_002,
                bedTop_003,
                bedTop_002
            ],
            frameDuration: 550
        },

        props: [],

        navigation: {
            down: "bathroomExit",
            left: "bedWall"
        },

        navigationAreas: [
            {
                destination: "jerboaTent",

                area: {
                    column: 78,
                    row: 14,
                    width: 33,
                    height: 18
                },

                cursor: "downLeft"
            }
        ]
    },

    // MARK: Jerboa Tent
    jerboaTent: {
        animation: {
            frames: [
                jerboaTent_001
            ],
            frameDuration: 550
        },

        props: [
            {
                id: "drillBit",
                definition: drillBitDefinition,
                column: 100,
                row: 3,
                scale: .18
            },
            {
                id: "jerboa",
                definition: jerboaDefinition,
                column: 45,
                row: 15,
                scale: .5
            },
        ],

        navigation: {
            down: "bedTop"
        }
    },


    // MARK: Living Room North
    livingRoomNorth: {
        animation: {
            frames: [
                livingRoomNorth_001,
                livingRoomNorth_002,
                livingRoomNorth_003,
                livingRoomNorth_002
            ],
            frameDuration: 550
        },

        props: [],

        navigation: {
            down: "bathroomExit",
            right: "neighborWindow"
        },

        navigationAreas: [
            {
                destination: "exitDoor",

                area: {
                    column: 19,
                    row: 16,
                    width: 11,
                    height: 27
                },

                cursor: "upLeft"
            },

            {
                destination: "fridgeInterior",

                area: {
                    column: 70,
                    row: 17,
                    width: 20,
                    height: 18
                },

                cursor: "up"
            },

            {
                destination: "mouseHoleEntrance",

                area: {
                    column: 88,
                    row: 32,
                    width: 12,
                    height: 8
                },

                cursor: "downRight"
            }
        ]
    },


    // MARK: Exit Door
    exitDoor: {
        animation: {
            frames: [
                exitDoor_001,
                exitDoor_002,
                exitDoor_003,
                exitDoor_002
            ],
            frameDuration: 550
        },

        props: [],

        navigation: {
            down: "livingRoomNorth"
        },

        navigationAreas: [
            {
                destination: "livingRoomNorth",

                area: {
                    column: 88,
                    row: 4,
                    width: 55,
                    height: 45
                },

                cursor: "up"
            }
        ]
    },


    // MARK: Fridge Interior
    fridgeInterior: {
        animation: {
            frames: [
                fridgeInterior_001,
                fridgeInterior_002,
                fridgeInterior_003,
                fridgeInterior_002
            ],
            frameDuration: 550
        },

        props: [
                    {
                        id: "drill",
                        definition: drillDefinition,
                        column: 53,
                        row: 14,
                        scale: 0.25
                    }
                ],

        navigation: {
            down: "livingRoomNorth"
        },

        navigationAreas: [
            {
                destination: "livingRoomNorth",

                area: {
                    column: 88,
                    row: 4,
                    width: 55,
                    height: 45
                },

                cursor: "up"
            }
        ]
    },


    // MARK: Mouse Hole Entrance
    mouseHoleEntrance: {
        animation: {
            frames: [
                mouseHoleEntrance_001,
                mouseHoleEntrance_002
            ],
            frameDuration: 550
        },

        props: [
            {
                id: "bouncerMouse",
                definition: bouncerMouseDefinition,
                column: 133,
                row: 52,
                scale: .6
            }
        ],

        navigation: {
            down: "livingRoomNorth"
        },

        navigationAreas: [
            {
                destination: "livingRoomNorth",

                area: {
                    column: 88,
                    row: 4,
                    width: 55,
                    height: 45
                },

                cursor: "up"
            }
        ]
    },


    // MARK: Neighbor Window
    neighborWindow: {
        animation: {
            frames: [
                neighborWindow_001,
                neighborWindow_002
            ],
            frameDuration: 550
        },

        props: [
            {
                id: "neighbor",
                definition: neighborDefinition,
                column: 145,
                row: 18,
                scale: .9
            },

            {
                id: "waterPipe",
                definition: waterPipeDefinition,
                column: 16,
                row: 5,
                scale: .5
            }
        ],

        navigation: {
            down: "bathroomExit",
            left: "livingRoomNorth"
        }
    },

};
// #endregion
