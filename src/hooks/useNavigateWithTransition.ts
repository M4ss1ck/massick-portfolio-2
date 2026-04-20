"use client";
import { startTransition, addTransitionType } from "react";
import { useRouter, usePathname } from "@/i18n/routing";

function inferNavType(current: string, target: string) {
    const cur = current.split("/").filter(Boolean).length;
    const tgt = target.split("/").filter(Boolean).length;
    if (tgt > cur) return "nav-forward";
    if (tgt < cur) return "nav-back";
    return null;
}

export function useNavigateWithTransition() {
    const router = useRouter();
    const pathname = usePathname();

    return (href: string) => {
        const type = inferNavType(pathname, href);
        startTransition(() => {
            if (type) addTransitionType(type);
            router.push(href as Parameters<typeof router.push>[0]);
        });
    };
}
