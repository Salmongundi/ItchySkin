
import { hasItem, removeItem, addItem } from "./inventory.js";

// #region Drill Assembly Quest
export function checkDrillAssembly() {
    // Drill + battery = Powered Drill.
    if (
        hasItem("drill") &&
        hasItem("powerDrillBattery")
    ) {
        removeItem("drill");
        removeItem("powerDrillBattery");

        addItem({
            id: "poweredDrill",
            name: "Powered Drill"
        });

        return [
            "You fit the battery into the drill.",
            "The drill is now powered."
        ];
    }

    // Powered Drill + bit = Powerful Drill.
    if (
        hasItem("poweredDrill") &&
        hasItem("drillBit")
    ) {
        removeItem("poweredDrill");
        removeItem("drillBit");

        addItem({
            id: "powerfulDrill",
            name: "Powerful Drill"
        });

        return [
            "You attach the drill bit.",
            "Behold: the Powerful Drill."
        ];
    }

    return null;
}
// #endregion
