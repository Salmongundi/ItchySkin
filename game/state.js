
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

export function getPropTalking(prop) {
    return gameState.props[prop.id]?.talking ?? false;
}

export function setPropTalking(propId, isTalking) {
    gameState.props[propId] = {
        ...gameState.props[propId],
        talking: isTalking
    };
}
