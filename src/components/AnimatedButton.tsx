"use client"
import { useTransition, useEffect } from "react";
import { useRouter, routing } from "@/i18n/routing";

interface AnimatedButtonProps {
    href: keyof typeof routing.pathnames;
    children: React.ReactNode;
    className?: string
}

export const AnimatedButton = ({ href, children, ...props }: AnimatedButtonProps) => {
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

    const handleTransition = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        startTransition(() => router.push(href));
    }
    return (
        <button
            onClick={handleTransition}
            {...props}
        >
            {children}
        </button>
    )
}
