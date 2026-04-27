import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_ALTERNATION = routing.locales.join("|");
// Matches any path that starts with at least two consecutive locale segments,
// e.g. `/es/es/acerca-de`, `/en/es/about`, even `/en/en/en/about`. The capture
// group holds the *last* locale in the chain — the one the user intended.
const DOUBLE_LOCALE_RE = new RegExp(
    `^/(?:(?:${LOCALE_ALTERNATION})/)+(${LOCALE_ALTERNATION})(?=/|$)`,
);
const LOCALE_PREFIX_RE = new RegExp(`^/(${LOCALE_ALTERNATION})(?=/|$)`);


export default function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // Keep Payload admin outside locale prefixes: `/en/admin` -> `/admin`.
    const localePrefixMatch = pathname.match(LOCALE_PREFIX_RE);
    if (localePrefixMatch) {
        const afterLocale = pathname.slice(localePrefixMatch[0].length) || "/";
        if (afterLocale === "/admin" || afterLocale.startsWith("/admin/")) {
            const url = request.nextUrl.clone();
            url.pathname = afterLocale;
            url.search = search;
            return NextResponse.redirect(url, 308);
        }
    }

    // Safety net: collapse any `/<locale>/<locale>/...` chain down to its last
    // locale before delegating to next-intl
    const match = pathname.match(DOUBLE_LOCALE_RE);
    if (match) {
        const finalLocale = match[1];
        const rest = pathname.slice(match[0].length); // "" or "/something"
        const url = request.nextUrl.clone();
        url.pathname = `/${finalLocale}${rest}`;
        url.search = search;
        return NextResponse.redirect(url, 308);
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        "/",
        // Single-locale routes (root locale and any sub-path):
        // `/es`, `/en`, `/es/about`, `/en/projects/abc`, ...
        "/(es|en)",
        "/(es|en)/:path*",
        // Double-locale routes — caught here so the safety net above can
        // collapse them before they reach next-intl: `/es/es`, `/en/es/about`.
        "/(es|en)/(es|en)",
        "/(es|en)/(es|en)/:path*",
    ],
};
