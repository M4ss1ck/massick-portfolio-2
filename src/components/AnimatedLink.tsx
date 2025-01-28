"use client"
import { useTransition, useEffect } from "react";
import { Link as I18nLink, useRouter, routing } from "@/i18n/routing";
import type { LinkProps } from "next/link";

interface AnimatedLinkProps extends LinkProps {
    href: keyof typeof routing.pathnames;
    children: React.ReactNode;
    locale?: string;
    className?: string
}
export const Link = ({ href, children, ...props }: AnimatedLinkProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const body = document.querySelector("body");
        if (isPending) {
            body?.classList.add("page-transition");
        } else {
            const timer = setTimeout(() => {
                body?.classList.remove("page-transition");
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isPending]);

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        startTransition(() => router.push(href));
    }
    return (
        <I18nLink onClick={handleTransition} href={href} {...props}>
            {children}
        </I18nLink>
    )
}
