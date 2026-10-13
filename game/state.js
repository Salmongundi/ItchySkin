
export const gameState = {
    facts: {
        foodEaten: 0
    },

    inventory: [],

    props: {}
};

export function getPropState(prop) {
    return gameState.props[prop.id]?.state
        ?? prop.definition.initialState;
}
