"use client";
import { useRef } from "react";

interface MagneticHoverProps {
    children: React.ReactNode;
    className?: string;
}

const MAGNETIC_OFFSET = 16;

export const MagneticHover = ({ children, className }: MagneticHoverProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const node = wrapperRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        node.style.setProperty("--magnetic-duration", "150ms");
        node.style.setProperty("--magnetic-x", `${nx * MAGNETIC_OFFSET}px`);
        node.style.setProperty("--magnetic-y", `${ny * MAGNETIC_OFFSET}px`);
        node.style.setProperty("--magnetic-opacity", "1");
    };

    const handleMouseLeave = () => {
        const node = wrapperRef.current;
        if (!node) return;
        node.style.setProperty("--magnetic-duration", "500ms");
        node.style.setProperty("--magnetic-x", "0px");
        node.style.setProperty("--magnetic-y", "0px");
        node.style.setProperty("--magnetic-opacity", "0");
    };

    return (
        <div
            ref={wrapperRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`rounded-lg ${className ?? ""}`}
            style={{
                boxShadow:
                    "var(--magnetic-x, 0px) var(--magnetic-y, 0px) 28px 2px rgba(244, 172, 28, var(--magnetic-opacity, 0))",
                transition:
                    "box-shadow var(--magnetic-duration, 150ms) ease-out",
            }}
        >
            {children}
        </div>
    );
};
