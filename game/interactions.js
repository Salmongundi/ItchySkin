
import { gameState, getPropState } from "./state.js";
import { showMessage, showMenu } from "./dialogue.js";
import {
    addItem,
    removeItem as removeInventoryItem,
    hasItem
} from "./inventory.js";

// #region CONDITIONS

const CONDITION_HANDLERS = {
    propStateIs({ prop, condition }) {
        return getPropState(prop) === condition.state;
    },

    hasItem({ condition }) {
        return hasItem(condition.itemId);
    }
};

function conditionsPass(prop, conditions = []) {
    for (const condition of conditions) {
        const handler = CONDITION_HANDLERS[condition.type];

        if (!handler) {
            console.warn(`Unknown condition type: ${condition.type}`);
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

function runEffects(prop, effects = []) {
    for (const effect of effects) {
        const handler = EFFECT_HANDLERS[effect.type];

        if (!handler) {
            console.warn(`Unknown effect type: ${effect.type}`);
            continue;
        }

        handler({ prop, effect });
    }
}

function openMenu(prop, effect) {
    const choices = effect.choices.filter(choice =>
        conditionsPass(prop, choice.conditions)
    );

    showMenu(choices, choice => {
        showMessage(choice.pages, null, {
            onComplete() {
                runEffects(prop, choice.effects);

                if (choice.returnToMenu !== false) {
                    openMenu(prop, effect);
                }
            }
        });
    });
}

const EFFECT_HANDLERS = {
    incrementFact({ effect }) {
        const currentValue = gameState.facts[effect.fact] ?? 0;

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
        showMessage(effect.pages, effect.propId);
    },

    showMenu({ prop, effect }) {
        openMenu(prop, effect);
    },

    pickUpItem({ prop }) {
        const item = prop.definition.inventoryItem;

        if (!item) {
            console.warn(
                `Prop "${prop.id}" has no inventory item definition.`
            );
            return;
        }

        addItem(item);

        gameState.props[prop.id] = {
            ...gameState.props[prop.id],
            pickedUp: true
        };
    },

    addItem({ effect }) {
        addItem(effect.item);
    },

    removeItem({ effect }) {
        removeInventoryItem(effect.itemId);
    },

    removeProp({ prop }) {
        gameState.props[prop.id] = {
            ...gameState.props[prop.id],
            removed: true
        };
    }
};

// #endregion

// #region INTERACTIONS

export function interactWithProp(prop) {
    const onClick = prop.definition.onClick;

    if (!onClick) {
        return;
    }

    const interactions = Array.isArray(onClick)
        ? onClick
        : [onClick];

    for (const interaction of interactions) {
        if (!conditionsPass(prop, interaction.conditions)) {
            continue;
        }

        runEffects(prop, interaction.effects);
        return;
    }
}

// #endregion
