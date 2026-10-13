
import { gameState } from "./state.js";

// Add a carried item, unless it is already present.
export function addItem(item) {
    if (!item?.id || !item?.name) {
        console.warn("Inventory items need an id and name.");
        return;
    }

    if (!hasItem(item.id)) {
        gameState.inventory.push({
            id: item.id,
            name: item.name
        });
    }
}

// Remove a carried item permanently.
export function removeItem(itemId) {
    gameState.inventory = gameState.inventory.filter(
        item => item.id !== itemId
    );
}

// Check whether the player has an item.
export function hasItem(itemId) {
    return gameState.inventory.some(
        item => item.id === itemId
    );
}

// Get the items for the inventory display.
export function getInventoryItems() {
    return gameState.inventory;
}
