import { gameState } from "./state.js";

export function interactWithProp(prop) {
    switch (prop.interaction) {

        case "eat":
            gameState.foodEaten += prop.foodAmount;

        if (prop.nextState !== undefined) {
            gameState.props[prop.id] = {
                state: prop.nextState
            };
        }

            break;
    }
}