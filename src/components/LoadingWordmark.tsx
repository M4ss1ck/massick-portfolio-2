"use client";

import { useEffect, useRef } from "react";
import { m4ss1ckArt } from "@/assets/ascii/m4ss1ck";
import { parseArt, randomGlyph } from "./asciiBanner.helpers";

const BASE = { r: 244, g: 172, b: 28 };
const MONO_ASPECT = 0.6;
const LINE_HEIGHT = 1;
const COLUMN_STEP_MS = 24;
const FLICKER_LEAD_MS = 220;
const FLICKER_INTERVAL_MS = 55;

export default function LoadingWordmark() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const { rows, cols, cells } = parseArt(m4ss1ckArt);
        const reduceMotion = matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const lockAt = cells.map((row) =>
            row.map((_, column) =>
                reduceMotion
                    ? 0
                    : column * COLUMN_STEP_MS + Math.random() * 90,
            ),
        );
        const totalDuration = Math.max(...lockAt.flat()) + 50;
        const flickerGlyphs = cells.map((row) =>
            row.map(() => randomGlyph()),
        );

        let cssWidth = 0;
        let cellWidth = 0;
        let rowHeight = 0;
        let fontSize = 0;
        let animationFrame = 0;
        let startedAt = 0;
        let lastFlicker = 0;

        const layout = () => {
            cssWidth = container.clientWidth;
            if (!cssWidth) return;

            cellWidth = cssWidth / cols;
            fontSize = cellWidth / MONO_ASPECT;
            context.font = `${fontSize}px "Kode Mono Variable", monospace`;

            const advance = context.measureText("M").width || cellWidth;
            fontSize *= cellWidth / advance;
            rowHeight = fontSize * LINE_HEIGHT;

            const cssHeight = rows * rowHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(cssWidth * dpr);
            canvas.height = Math.round(cssHeight * dpr);
            canvas.style.width = `${cssWidth}px`;
            canvas.style.height = `${cssHeight}px`;

            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            context.font = `${fontSize}px "Kode Mono Variable", monospace`;
            context.textBaseline = "top";
        };

        const draw = (now: number) => {
            const elapsed = reduceMotion ? totalDuration : now - startedAt;
            const shouldRefreshFlicker =
                now - lastFlicker >= FLICKER_INTERVAL_MS;

            context.clearRect(0, 0, cssWidth, rows * rowHeight);

            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < cols; column++) {
                    const remaining = lockAt[row][column] - elapsed;
                    let glyph = cells[row][column];
                    let alpha = 0.88;

                    if (remaining > FLICKER_LEAD_MS) continue;

                    if (remaining > 0) {
                        if (shouldRefreshFlicker) {
                            flickerGlyphs[row][column] = randomGlyph();
                        }
                        glyph = flickerGlyphs[row][column];
                        alpha =
                            0.15 +
                            (1 - remaining / FLICKER_LEAD_MS) * 0.55;
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
            resizeObserver.observe(container);
            animationFrame = requestAnimationFrame(draw);
        });

        return () => {
            cancelled = true;
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2 select-none"
            style={{ lineHeight: 0 }}
        >
            <canvas ref={canvasRef} className="block" />
        </div>
    );
}
