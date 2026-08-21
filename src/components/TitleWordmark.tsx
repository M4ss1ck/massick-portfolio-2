"use client";

import { useEffect, useRef, useState } from "react";
import { parseArt, randomGlyph } from "./asciiBanner.helpers";

const BASE = { r: 244, g: 172, b: 28 };
const MONO_ASPECT = 0.6;
const LINE_HEIGHT = 1;
const COLUMN_STEP_MS = 24;
const MAX_REVEAL_MS = 1200;
const FLICKER_LEAD_MS = 220;
const FLICKER_INTERVAL_MS = 55;
const SETTLED_ALPHA = 0.5;
const MAX_COLUMN_PX = 240;
const REPEAT_GAP_COLS = 6;
const MAX_REPEATS = 12;

// The title starts at the edge the column reads from, so the cut always falls
// at the far end and only that edge is faded.
const FADE = {
    left: "linear-gradient(to bottom, transparent 0%, #000 18%)",
    right: "linear-gradient(to top, transparent 0%, #000 18%)",
};

// ANSI Shadow only covers printable ASCII, so accented titles are folded down
// rather than rendered as gaps.
function toFigletText(title: string) {
    return title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[^\x20-\x7E]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Tiling the rendered art sideways avoids re-running figlet every time the
// gutter resizes.
function repeatArt(art: string, times: number) {
    if (times <= 1) return art;
    const lines = art.replace(/\r\n/g, "\n").split("\n");
    const width = lines.reduce((max, line) => Math.max(max, line.length), 0);
    const gap = " ".repeat(REPEAT_GAP_COLS);
    return lines
        .map((line) =>
            Array.from({ length: times }, () => line.padEnd(width, " ")).join(
                gap,
            ),
        )
        .join("\n");
}

export default function TitleWordmark({
    title,
    side,
}: {
    title: string;
    side: "left" | "right";
}) {
    const gutterRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [art, setArt] = useState<string | null>(null);

    useEffect(() => {
        const text = toFigletText(title);
        if (!text) return;

        let cancelled = false;
        Promise.all([
            import("figlet/browser"),
            import("figlet/fonts/ANSI Shadow"),
        ])
            .then(([figlet, font]) => {
                if (cancelled) return;
                figlet.default.parseFont("ANSI Shadow", font.default);
                setArt(figlet.default.textSync(text, { font: "ANSI Shadow" }));
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [title]);

    useEffect(() => {
        const gutter = gutterRef.current;
        const wrapper = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!art || !gutter || !wrapper || !canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const base = parseArt(art);
        const rows = base.rows;
        const reduceMotion = matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        let repeats = 0;
        let cols = 0;
        let cells: string[][] = [];
        let lockAt: number[][] = [];
        let flickerGlyphs: string[][] = [];
        let totalDuration = 0;

        const buildGrid = (count: number) => {
            repeats = count;
            const grid = parseArt(repeatArt(art, count));
            cols = grid.cols;
            cells = grid.cells;

            const step = Math.min(COLUMN_STEP_MS, MAX_REVEAL_MS / cols);
            lockAt = cells.map((row) =>
                row.map((_, column) =>
                    reduceMotion ? 0 : column * step + Math.random() * 90,
                ),
            );
            totalDuration = Math.max(...lockAt.flat()) + 50;
            flickerGlyphs = cells.map((row) => row.map(() => randomGlyph()));
        };

        let cssWidth = 0;
        let cssHeight = 0;
        let cellWidth = 0;
        let rowHeight = 0;
        let fontSize = 0;
        let animationFrame = 0;
        let startedAt = 0;
        let lastFlicker = 0;

        const layout = () => {
            const gutterWidth = gutter.clientWidth;
            const gutterHeight = gutter.clientHeight;
            if (!gutterWidth || !gutterHeight) return;

            rowHeight = Math.min(gutterWidth, MAX_COLUMN_PX) / rows;
            fontSize = rowHeight / LINE_HEIGHT;
            context.font = `${fontSize}px "Kode Mono Variable", monospace`;
            cellWidth =
                context.measureText("M").width || fontSize * MONO_ASPECT;

            const unitCols = base.cols + REPEAT_GAP_COLS;
            const needed = Math.ceil(gutterHeight / cellWidth / unitCols);
            const wanted = Math.min(Math.max(needed, 1), MAX_REPEATS);
            if (wanted !== repeats) buildGrid(wanted);

            cssWidth = cols * cellWidth;
            cssHeight = rows * rowHeight;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(cssWidth * dpr);
            canvas.height = Math.round(cssHeight * dpr);
            canvas.style.width = `${cssWidth}px`;
            canvas.style.height = `${cssHeight}px`;

            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            context.font = `${fontSize}px "Kode Mono Variable", monospace`;
            context.textBaseline = "top";

            // Rotating about the centre leaves the layout box unrotated, so
            // both axes are placed by hand: the stripe sits centred in its
            // gutter, and the title starts on the edge the column reads from.
            const centreX = gutterWidth / 2;
            const centreY =
                side === "left" ? gutterHeight - cssWidth / 2 : cssWidth / 2;

            wrapper.style.left = `${centreX - cssWidth / 2}px`;
            wrapper.style.top = `${centreY}px`;
            wrapper.style.transform = `translateY(-50%) rotate(${
                side === "left" ? -90 : 90
            }deg)`;
        };

        const draw = (now: number) => {
            const elapsed = reduceMotion ? totalDuration : now - startedAt;
            const shouldRefreshFlicker =
                now - lastFlicker >= FLICKER_INTERVAL_MS;

            context.clearRect(0, 0, cssWidth, cssHeight);

            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < cols; column++) {
                    const remaining = lockAt[row][column] - elapsed;
                    let glyph = cells[row][column];
                    let alpha = SETTLED_ALPHA;

                    if (remaining > FLICKER_LEAD_MS) continue;

                    if (remaining > 0) {
                        if (shouldRefreshFlicker) {
                            flickerGlyphs[row][column] = randomGlyph();
                        }
                        glyph = flickerGlyphs[row][column];
                        alpha =
                            0.08 +
                            (1 - remaining / FLICKER_LEAD_MS) *
                                (SETTLED_ALPHA - 0.08);
                    } else if (glyph === " ") {
                        continue;
                    }

                    context.fillStyle = `rgba(${BASE.r},${BASE.g},${BASE.b},${alpha})`;
                    context.fillText(
                        glyph,
                        column * cellWidth,
                        row * rowHeight,
                    );
                }
            }

            if (shouldRefreshFlicker) lastFlicker = now;
            if (elapsed < totalDuration) {
                animationFrame = requestAnimationFrame(draw);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            cancelAnimationFrame(animationFrame);
            layout();
            draw(reduceMotion ? totalDuration : performance.now());
        });

        let cancelled = false;
        document.fonts.ready.then(() => {
            if (cancelled) return;

            layout();
            startedAt = performance.now();
            resizeObserver.observe(gutter);
            animationFrame = requestAnimationFrame(draw);
        });

        return () => {
            cancelled = true;
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
        };
    }, [art, side]);

    return (
        <div
            ref={gutterRef}
            aria-hidden="true"
            className="pointer-events-none relative hidden w-full select-none overflow-hidden lg:block"
            style={{ maskImage: FADE[side], WebkitMaskImage: FADE[side] }}
        >
            <div
                ref={wrapperRef}
                className="absolute"
                style={{ lineHeight: 0 }}
            >
                <canvas ref={canvasRef} className="block" />
            </div>
        </div>
    );
}
