"use client"
import { Link as I18nLink, useRouter, routing } from "@/i18n/routing";
import type { LinkProps } from "next/link";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AnimatedLinkProps extends LinkProps {
    href: keyof typeof routing.pathnames;
    children: React.ReactNode;
    locale?: string;
    className?: string
}
export const Link = ({ href, children, ...props }: AnimatedLinkProps) => {
    const router = useRouter();
    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const body = document.querySelector("body");
        body?.classList.add("page-transition");
        await sleep(300);
        router.push(href);
        await sleep(300);
        body?.classList.remove("page-transition");
    }
    return (
        <I18nLink onClick={handleTransition} href={href} {...props}>
            {children}
        </I18nLink>
    )
}
