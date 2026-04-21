"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";
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

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * Renders a circular spotlight that, on hover, previews the registered
 * SpotlightSource subtrees in the alternate locale.
 *
 * Grow animation: `clip-path` is driven by three CSS custom properties —
 * `--spotlight-r` (registered via @property so it's animatable) plus
 * `--spotlight-x/y`. Only `--spotlight-r` is transitioned, so enter/leave
 * animate the radius smoothly while cursor-follow updates (x/y) apply
 * instantly.
 *
 * Event routing: the overlay is pointer-events-enabled so the cloned
 * button receives `:hover` (the real one is under the overlay and can't
 * drive the underline animation). Because the portal lives inside this
 * component's React tree, React's `onMouseEnter/Leave` on the span still
 * fires correctly — entering the clone counts as entering the span.
 */
export function SpotlightPreview({
    target,
    children,
}: {
    target: Locale;
    children: React.ReactNode;
}) {
    const sources = useSpotlightSources();
    const inOverlay = useInSpotlightOverlay();
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    // Alt-locale content is mounted on hover, kept mounted through the
    // close transition, then torn down on transitionend so idle overlays
    // don't cost render cycles.
    const [contentMounted, setContentMounted] = useState(false);
    const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const hoveredRef = useRef(false);

    // Nested previews (the cloned LanguageSwitcher inside the overlay) must
    // not render their own overlays or wrap anything extra — just pass
    // through so the clone renders identically to the real component.
    if (inOverlay) return <>{children}</>;

    const handleEnter = (e: React.MouseEvent) => {
        hoveredRef.current = true;
        setPos({ x: e.clientX, y: e.clientY });
        setHovered(true);
        setContentMounted(true);
    };

    const handleMove = (e: React.MouseEvent) => {
        if (!hoveredRef.current) return;
        setPos({ x: e.clientX, y: e.clientY });
    };

    const handleLeave = () => {
        hoveredRef.current = false;
        setHovered(false);
    };

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        // Only react to the radius transition; x/y don't transition so they
        // won't fire this, but guard anyway for forwards-compat.
        if (e.propertyName !== "--spotlight-r") return;
        if (!hoveredRef.current) setContentMounted(false);
    };

    const altMessages = ALT_MESSAGES[target];

    const overlayStyle: CSSVars = {
        "--spotlight-r": hovered ? `${SPOTLIGHT_RADIUS}px` : "0px",
        "--spotlight-x": `${pos.x}px`,
        "--spotlight-y": `${pos.y}px`,
    };

    return (
        <span
            onMouseEnter={handleEnter}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="inline-flex"
        >
            {children}
            {mounted
                ? createPortal(
                    <div
                        aria-hidden="true"
                        onTransitionEnd={handleTransitionEnd}
                        className="spotlight-overlay"
                        style={overlayStyle}
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
                    </div>,
                    document.body,
                )
                : null}
        </span>
    );
}
