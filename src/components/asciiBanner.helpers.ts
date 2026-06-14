// Pure helpers for AsciiBanner — no DOM, no canvas.

// ASCII-only mutation pool (kept to glyphs any monospace font covers, so the
// shimmer never renders tofu). The art's own block glyphs come from the art
// string, not from here.
export const CHARSET = "0123456789@#$%&*<>/\\|=+-M4SS1CK".split("");

export interface Grid {
    rows: number;
    cols: number;
    cells: string[][]; // target glyph per [row][col]; " " marks an empty cell
}

/** Parse a figlet block into a padded rectangular grid. */
export function parseArt(art: string): Grid {
    const lines = art.replace(/\r\n/g, "\n").split("\n");
    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
    const cols = lines.reduce((max, line) => Math.max(max, line.length), 0);
    const cells = lines.map((line) => line.padEnd(cols, " ").split(""));
    return { rows: cells.length, cols, cells };
}

/** Cursor-proximity falloff: 1 at the cursor, 0 at/after `radius`. */
export function cellIntensity(distance: number, radius: number): number {
    if (distance >= radius) return 0;
    const t = 1 - distance / radius;
    return t * t; // ease-in
}

/** A random glyph from the mutation pool. */
export function randomGlyph(): string {
    return CHARSET[(Math.random() * CHARSET.length) | 0];
}
