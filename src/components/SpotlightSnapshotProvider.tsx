"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

type Source = { render: () => ReactNode; className?: string };

// Two contexts so subscribers (SpotlightSource) can depend on a *stable*
// `register` reference without re-running their effect every time the
// `sources` array changes — which would cause an unregister/register loop
// (the registration itself updates state, which updates context).
const RegisterContext = createContext<((source: Source) => () => void) | null>(
    null,
);
const SourcesContext = createContext<Source[]>([]);

/**
 * `true` when the current subtree is being rendered inside a spotlight
 * overlay (i.e. the alternate-locale clone). Components read this to
 * disable behaviour that doesn't make sense in the preview — e.g. a
 * nested SpotlightPreview short-circuits so we don't render recursive
 * overlays, and the Navbar skips its `viewTransitionName` so the clone
 * doesn't fight the real navbar for the shared transition name.
 */
const InSpotlightOverlayContext = createContext(false);

export function useInSpotlightOverlay(): boolean {
    return useContext(InSpotlightOverlayContext);
}

export function SpotlightOverlayMarker({ children }: { children: ReactNode }) {
    return (
        <InSpotlightOverlayContext.Provider value={true}>
            {children}
        </InSpotlightOverlayContext.Provider>
    );
}

export function SpotlightSnapshotProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [sources, setSources] = useState<Source[]>([]);

    const register = useCallback((source: Source) => {
        setSources((prev) => [...prev, source]);
        return () => {
            setSources((prev) => prev.filter((s) => s !== source));
        };
    }, []);

    return (
        <RegisterContext.Provider value={register}>
            <SourcesContext.Provider value={sources}>
                {children}
            </SourcesContext.Provider>
        </RegisterContext.Provider>
    );
}

export function useSpotlightSources(): Source[] {
    return useContext(SourcesContext);
}

/**
 * Marks a subtree as participating in the locale spotlight preview.
 *
 * `children` MUST be a function returning a *component element* (e.g.
 * `() => <Inner />`), not inline JSX that calls hooks. The function is
 * invoked at the original site for the normal render, and again inside
 * the overlay's alternate-locale provider — so the rendered component's
 * hooks (useTranslations, etc.) re-run against the other locale.
 *
 * `className` is applied both to a transparent (display:contents) wrapper
 * around the normal render AND to the corresponding wrapper in the overlay
 * clone. Because `display:contents` doesn't create a box, the element is
 * layout-invisible but still contributes to inheritance — so font-family
 * and other inherited styles set via this class flow to both renders
 * identically. This is how each source keeps its own font in the clone
 * (e.g. Menu is `font-body`; Navbar inherits the page default).
 *
 * No-op when already inside the overlay (prevents recursive registration).
 */
export function SpotlightSource({
    children,
    className,
}: {
    children: () => ReactNode;
    className?: string;
}) {
    const register = useContext(RegisterContext);
    const inOverlay = useInSpotlightOverlay();
    const fnRef = useRef(children);

    useEffect(() => {
        fnRef.current = children;
    });

    useEffect(() => {
        if (!register || inOverlay) return;
        const source: Source = {
            render: () => fnRef.current(),
            className,
        };
        return register(source);
    }, [register, inOverlay, className]);

    // display:contents means the wrapper disappears from the layout tree
    // but its class still participates in CSS inheritance for descendants.
    // Skip the wrapper entirely when there's no class to apply, to avoid
    // adding extra DOM nodes.
    return className ? (
        <div style={{ display: "contents" }} className={className}>
            {children()}
        </div>
    ) : (
        <>{children()}</>
    );
}
