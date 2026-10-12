// #region IMPORTS

import {
    bathroomEntrance_001,
    bathroomEntrance_002,
    bathroomEntrance_003,
    bathroomInteriorLeft_001,
    bathroomInteriorLeft_002,
    bathroomInteriorLeft_003,
    showerInterior_001,
    showerInterior_002,
    showerInterior_003,
    bathroomExit_001,
    bathroomExit_002,
    bathroomExit_003,
    bathroomDrywallPanel_001,
    bathroomDrywallPanel_002,
    bathroomDrywallPanel_003
} from "../assets/ascii/environments/bathroom.js";


import { 
    pizzaDefinition
} from "../assets/ascii/props/pizza.js";

// #endregion

// #region SCENES
export const bathroomScenes = {

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
            down: "bathroomExit",
            right: "bathroomExit",
            left: "bathroomInteriorLeft"
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
                definition: pizzaDefinition,
                column: 61,
                row: 36,
                scale: 0.35
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
            down: "bathroomEntrance",
            left: "bathroomEntrance",
            right: "bathroomInteriorLeft"
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

    bathroomInteriorLeft: {
        animation: {
            frames: [
                bathroomInteriorLeft_002,
                bathroomInteriorLeft_003
            ],
            frameDuration: 1000
        },

        props: [],

        navigation: {
            down: "bathroomExit",
            left: "bathroomExit",
            right: "bathroomEntrance"
        },

        navigationAreas: [
            {
                destination: "bathroomDrywallPanel",

                area: {
                    column: 65,
                    row: 23,
                    width: 25,
                    height: 12
                },

                cursor: "up"
            }
        ]
    },

    bathroomDrywallPanel: {
        animation: {
            frames: [
                bathroomDrywallPanel_001,
                bathroomDrywallPanel_002,
                bathroomDrywallPanel_003,
                bathroomDrywallPanel_002
            ],
            frameDuration: 550
        },

        props: [],

        navigation: {
            down: "bathroomInteriorLeft"
        }
    },

};
// #endregion
