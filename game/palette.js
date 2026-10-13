
export const PALETTES = [
    { name: "Default", background: "#ffffff", foreground: "#000000" },
    { name: "Amber", background: "#080604", foreground: "#ffb000" },
    { name: "Inverted", background: "#000000", foreground: "#ffffff" },
    { name: "Pink", background: "#ffb6c8", foreground: "#c2185b" }
];

let currentIndex = 0;

export function getCurrentPalette() {
    return PALETTES[currentIndex];
}

export function cyclePalette() {
    currentIndex = (currentIndex + 1) % PALETTES.length;

    const { background, foreground } = getCurrentPalette();
    const root = document.documentElement;

    root.style.setProperty("--game-background", background);
    root.style.setProperty("--game-foreground", foreground);
}
