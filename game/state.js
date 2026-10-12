
export const gameState = {
    facts: {
        foodEaten: 0
    },

    props: {}
};

export function getPropState(prop) {
    return gameState.props[prop.id]?.state
        ?? prop.definition.initialState;
}
