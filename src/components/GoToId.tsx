"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Down } from "@/components/icons/DownAnimated";

export const GoToId = ({ id }: { id: string }) => {
    const t = useTranslations();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY < 150);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const goToProjects = (id: string) => {
        const targetElement = document.getElementById(id);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <button
            type="button"
            aria-label={t("go_to_projects")}
            title={t("go_to_projects")}
            className={`absolute bottom-2 h-12 w-12 text-primary hover:text-other transition-opacity duration-1000 ease-in-out ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => goToProjects(id)}
        >
            <Down />
        </button>
    );
};
