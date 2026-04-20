"use client";
import { routing } from "@/i18n/routing";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

interface AnimatedButtonProps {
    href: keyof typeof routing.pathnames;
    children: React.ReactNode;
    className?: string;
}

export const AnimatedButton = ({
    href,
    children,
    ...props
}: AnimatedButtonProps) => {
    const navigate = useNavigateWithTransition();

    const handleTransition = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        navigate(href);
    };
    return (
        <button onClick={handleTransition} {...props}>
            {children}
        </button>
    );
};
