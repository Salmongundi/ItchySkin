import {
    bathroomEntrance_001,
    bathroomEntrance_002,
    bathroomEntrance_003,
    showerInterior_001,
    showerInterior_002,
    showerInterior_003,
    bathroomExit_001,
    bathroomExit_002,
    bathroomExit_003,
} from "./assets/ascii/environments/bathroom.js";

import {
    bedWall_001,
    bedWall_002,
    bedWall_003
} from "./assets/ascii/environments/bedWall.js";

import {
    bedWindow_001
} from "./assets/ascii/environments/bedWindow.js";

import {
    ceilingFan_001,
    ceilingFan_003
} from "./assets/ascii/environments/ceiling.js";

import {
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
    mouseHoleEntrance_003
} from "./assets/ascii/environments/livingRoom.js";

import { 
    pizzaSlice_001,
    pizzaSlice_002
} from "./assets/ascii/props/pizza.js";



export const SCENES = {

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

    bedWindow: {
        animation: {
            frames: [
                bedWindow_001
            ],
            frameDuration: 1000
        },

        props: [],

        navigation: {
            right: "bedWall"
        }
    },

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

    bathroomEntrance: {
        animation: {
            frames: [
                bathroomEntrance_001,
                bathroomEntrance_002,
                bathroomEntrance_003,
                bathroomEntrance_002
            ],
            frameDuration: 550
        },

        props: [],

        navigation: {
            down: "bathroomExit"
        },

        navigationAreas: [
            {
                destination: "showerInterior",

                area: {
                    column: 88,
                    row: 4,
                    width: 55,
                    height: 45
                },

                cursor: "upRight"
            }
        ]
    },

    showerInterior: {
        animation: {
            frames: [
                showerInterior_001,
                showerInterior_002,
                showerInterior_003,
                showerInterior_002
            ],
            frameDuration: 550
        },

        props: [
            {
                id: "pizza",
                artwork: pizzaSlice_001,
                column: 61,
                row: 36,
                scale: 0.35,
                interaction: "eat",
                foodAmount: 1,
                initialState: "whole",
                nextState: "eaten"
            }
        ],

        navigation: {
            down: "bathroomEntrance"
        }
    },

    bathroomExit: {
        animation: {
            frames: [
                bathroomExit_001,
                bathroomExit_002,
                bathroomExit_003,
                bathroomExit_002
            ],
            frameDuration: 550
        },

        props: [],

        navigation: {
            down: "bathroomEntrance"
        },

        navigationAreas: [
            {
                destination: "underBed",

                area: {
                    column: 36,
                    row: 44,
                    width: 22,
                    height: 16
                },

                cursor: "downLeft"
            },

            {
                destination: "livingRoomNorth",

                area: {
                    column: 48,
                    row: 28,
                    width: 28,
                    height: 14
                },

                cursor: "up"
            }
        ]
    },

    underBed: {
        animation: {
            frames: [
                bathroomExit_001,
                bathroomExit_002,
                bathroomExit_003,
                bathroomExit_002
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
            down: "bathroomExit"
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

    mouseHoleEntrance: {
        animation: {
            frames: [
                mouseHoleEntrance_001,
                mouseHoleEntrance_002,
                mouseHoleEntrance_003,
                mouseHoleEntrance_002
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
    }

};