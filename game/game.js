import {
    findInterior
} from "../engine/ascii/geometry/findInterior.js";

import {
    startMites
} from "../engine/ascii/effects/overlay/mites.js";

import {
    startSkinMounds
} from "../engine/ascii/effects/overlay/skinMounds.js";

import {
    itchSurface
} from "./assets/ascii/props/itchSurface.js";

import {
    skinMounds
} from "./assets/ascii/props/skinMounds.js";


// ==================================================
// SCENE
// ==================================================

const scene = {

    surface: itchSurface

};


// ==================================================
// ELEMENTS
// ==================================================

const asciiElement =
    document.getElementById("ascii");


// ==================================================
// RENDER SCENE
// ==================================================

asciiElement.textContent =
    scene.surface;


// ==================================================
// FIND INTERIOR
// ==================================================

const interior =
    findInterior(
        scene.surface,
        {
            minClearance: 2,
            maxClearance: 12
        }
    );


// ==================================================
// EFFECTS
// ==================================================

startMites(
    asciiElement,
    interior
);


startSkinMounds(
    asciiElement,
    interior,
    {
        arts: skinMounds
    }
);