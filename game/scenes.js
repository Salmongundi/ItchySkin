import {
    ceilingFan_001,
    ceilingFan_003
} from "./assets/ascii/environments/ceiling.js";

import {
    bedWall_001,
    bedWall_002,
    bedWall_003
} from "./assets/ascii/environments/bedWall.js";

import {
    bedWindow_001
} from "./assets/ascii/environments/bedWindow.js";


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

        exits: {
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

        exits: {
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

        exits: {
            right: "bathroomEntrance"
        }
    }

};