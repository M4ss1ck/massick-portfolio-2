"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;
import {
    NextIntlClientProvider,
    type AbstractIntlMessages,
} from "next-intl";
import {
    SpotlightOverlayMarker,
    useInSpotlightOverlay,
    useSpotlightSources,
} from "./SpotlightSnapshotProvider";
import enMessages from "../../messages/en.json";
import esMessages from "../../messages/es.json";
import type { Locale } from "@/stores/locale";

const ALT_MESSAGES: Record<Locale, AbstractIntlMessages> = {
    en: enMessages as AbstractIntlMessages,
    es: esMessages as AbstractIntlMessages,
};

const SPOTLIGHT_RADIUS = 150;

const readScroll = () => ({
    y: window.scrollY,
    height: document.documentElement.scrollHeight,
});

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * Renders a circular spotlight that, on hover, previews the registered
 * SpotlightSource subtrees in the alternate locale.
 *
 * Grow animation: `clip-path` is driven by three CSS custom properties —
 * `--spotlight-r` (registered via @property so it's animatable) plus
 * `--spotlight-x/y`. Only `--spotlight-r` is transitioned, so hover and click
 * animate the radius smoothly while cursor-follow updates (x/y) apply
 * instantly.
 *
 * Event routing: the overlay is pointer-events-enabled so the cloned
 * button receives `:hover` (the real one is under the overlay and can't
 * drive the underline animation). Because the portal lives inside this
 * component's React tree, React's `onMouseEnter/Leave` on the span still
 * fires correctly — entering the clone counts as entering the span.
 *
 * Alignment: the overlay is viewport-fixed, so a clone positioned against
 * it would resolve `top` against the viewport while its original resolves
 * against the document (e.g. Menu's `absolute top-[60vh]` inside a page
 * Block) — drifting by exactly scrollY. The inner wrapper restores the
 * document coordinate system (`top: -scrollY`, document-height box) so
 * clones land over their originals at any scroll offset; sticky clones
 * still clamp to the overlay's scrollport, matching a sticky original.
 */
export function SpotlightPreview({
    target,
    onReveal,
    children,
}: {
    target: Locale;
    onReveal: () => void;
    children: React.ReactNode;
}) {
    const sources = useSpotlightSources();
    const inOverlay = useInSpotlightOverlay();
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [revealing, setRevealing] = useState(false);
    const [revealRadius, setRevealRadius] = useState(SPOTLIGHT_RADIUS);
    // Alt-locale content is mounted on hover, kept mounted through the
    // close transition, then torn down on transitionend so idle overlays
    // don't cost render cycles.
    const [contentMounted, setContentMounted] = useState(false);
    const [scroll, setScroll] = useState({ y: 0, height: 0 });
    const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const hoveredRef = useRef(false);
    const navigationStartedRef = useRef(false);

    useEffect(() => {
        if (!contentMounted) return;
        const onScroll = () => setScroll(readScroll());
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [contentMounted]);

    // Nested previews (the cloned LanguageSwitcher inside the overlay) must
    // not render their own overlays or wrap anything extra — just pass
    // through so the clone renders identically to the real component.
    if (inOverlay) return <>{children}</>;

    const handleEnter = (e: React.MouseEvent) => {
        hoveredRef.current = true;
        setPos({ x: e.clientX, y: e.clientY });
        setScroll(readScroll());
        setHovered(true);
        setContentMounted(true);
    };

    const handleMove = (e: React.MouseEvent) => {
        if (!hoveredRef.current) return;
        setPos({ x: e.clientX, y: e.clientY });
    };

    const handleLeave = () => {
        hoveredRef.current = false;
        if (!revealing) setHovered(false);
    };

    const handleClick = (e: React.MouseEvent) => {
        if (revealing) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const keyboardClick = e.detail === 0;
        const x = keyboardClick ? rect.left + rect.width / 2 : e.clientX;
        const y = keyboardClick ? rect.top + rect.height / 2 : e.clientY;
        hoveredRef.current = true;
        setPos({ x, y });
        setRevealRadius(
            Math.ceil(
                Math.hypot(
                    Math.max(x, window.innerWidth - x),
                    Math.max(y, window.innerHeight - y),
                ),
            ),
        );
        setScroll(readScroll());
        setHovered(true);
        setContentMounted(true);
        setRevealing(true);
    };

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        // Only react to the radius transition; x/y don't transition so they
        // won't fire this, but guard anyway for forwards-compat.
        if (e.propertyName !== "--spotlight-r") return;
        if (revealing && !navigationStartedRef.current) {
            navigationStartedRef.current = true;
            onReveal();
            return;
        }
        if (!hoveredRef.current) setContentMounted(false);
    };

    const altMessages = ALT_MESSAGES[target];

    const overlayStyle: CSSVars = {
        "--spotlight-r": revealing
            ? `${revealRadius}px`
            : hovered
                ? `${SPOTLIGHT_RADIUS}px`
                : "0px",
        "--spotlight-x": `${pos.x}px`,
        "--spotlight-y": `${pos.y}px`,
    };

    return (
        <span
            onMouseEnter={handleEnter}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            onClick={handleClick}
            className="inline-flex"
        >
            {children}
            {mounted
                ? createPortal(
                    <div
                        aria-hidden="true"
                        onTransitionEnd={handleTransitionEnd}
                        className={`spotlight-overlay${revealing ? " spotlight-overlay--expanding" : ""}`}
                        style={overlayStyle}
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                width: "100%",
                                top: -scroll.y,
                                height: scroll.height,
                            }}
                        >
                            {contentMounted && sources.length > 0 ? (
                                <NextIntlClientProvider
                                    locale={target}
                                    messages={altMessages}
                                    onError={() => { }}
                                    getMessageFallback={({ key }) => `${key}`}
                                    timeZone="America/Santiago"
                                >
                                    <SpotlightOverlayMarker>
                                        {sources.map((source, i) =>
                                            source.className ? (
                                                <div
                                                    key={i}
                                                    style={{
                                                        display: "contents",
                                                    }}
                                                    className={source.className}
                                                >
                                                    {source.render()}
                                                </div>
                                            ) : (
                                                <React.Fragment key={i}>
                                                    {source.render()}
                                                </React.Fragment>
                                            ),
                                        )}
                                    </SpotlightOverlayMarker>
                                </NextIntlClientProvider>
                            ) : null}
                        </div>
                    </div>,
                    document.body,
                )
                : null}
        </span>
    );
}
