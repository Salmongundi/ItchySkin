import { gameState, getPropState } from "./state.js";
import { showMessage } from "./dialogue.js";

// #region CONDITIONS

// This file defines the logic for handling interactions with game props, including conditions and effects.

// CONDITION_HANDLERS maps condition types to their respective handler functions.
const CONDITION_HANDLERS = {
    propStateIs({ prop, condition }) {
        return getPropState(prop) === condition.state;
    }
};

// conditionsPass checks if all conditions for a given prop are satisfied.
function conditionsPass(prop, conditions) {
    for (const condition of conditions) {
        const handler =
            CONDITION_HANDLERS[condition.type];

        if (!handler) {
            console.warn(
                `Unknown condition type: ${condition.type}`
            );
            return false;
        }

        if (!handler({ prop, condition })) {
            return false;
        }
    }

    return true;
}

// #endregion

// #region EFFECTS

// EFFECT_HANDLERS maps effect types to their respective handler functions.
const EFFECT_HANDLERS = {
    incrementFact({ effect }) {
        const currentValue =
            gameState.facts[effect.fact] ?? 0;

        gameState.facts[effect.fact] =
            currentValue + effect.amount;
    },

    setPropState({ prop, effect }) {
        gameState.props[prop.id] = {
            ...gameState.props[prop.id],
            state: effect.state
        };
    },

    showMessage({ effect }) {
        showMessage(effect.pages);
    }
};

// #endregion

// #region INTERACTIONS

// interactWithProp handles the interaction logic when a prop is clicked, including checking conditions and applying effects.
export function interactWithProp(prop) {
    const onClick = prop.definition.onClick;

    if (!onClick) {
        return;
    }

    // Support both a single interaction and a list.
    const interactions = Array.isArray(onClick)
        ? onClick
        : [onClick];

    for (const interaction of interactions) {
        const conditions = interaction.conditions ?? [];

        if (!conditionsPass(prop, conditions)) {
            continue;
        }

        for (const effect of interaction.effects ?? []) {
            const handler = EFFECT_HANDLERS[effect.type];

            if (!handler) {
                console.warn(
                    `Unknown effect type: ${effect.type}`
                );
                continue;
            }

            handler({ prop, effect });
        }

        // Only the first matching interaction runs.
        return;
    }
}

// #endregion