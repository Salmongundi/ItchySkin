import {
    bathroomEntrance_001,
    bathroomEntrance_002,
    bathroomEntrance_003,
    showerInterior_001,
    showerInterior_002,
    showerInterior_003,
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
            down: "bedWall"
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

        props: [],

        navigation: {
            down: "bathroomEntrance"
        }
    }

};