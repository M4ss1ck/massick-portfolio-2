"use client";
import { Link as I18nLink, routing } from "@/i18n/routing";
import type { LinkProps } from "next/link";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

interface AnimatedLinkProps extends LinkProps {
    href: keyof typeof routing.pathnames;
    children: React.ReactNode;
    locale?: string;
    className?: string;
}
export const Link = ({ href, children, ...props }: AnimatedLinkProps) => {
    const navigate = useNavigateWithTransition();

    const handleTransition = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
        e.preventDefault();
        navigate(href);
    };
    return (
        <I18nLink onClick={handleTransition} href={href} {...props}>
            {children}
        </I18nLink>
    );
};
