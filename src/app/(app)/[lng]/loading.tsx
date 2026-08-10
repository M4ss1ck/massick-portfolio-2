"use client";
import { useTranslations } from "next-intl";
import { ViewTransition } from "react";
import LoadingWordmark from "@/components/LoadingWordmark";

export default function Loading() {
    const t = useTranslations();
    return (
        <ViewTransition exit="fade-out">
            <main
                role="status"
                className="relative min-h-screen w-full overflow-hidden"
            >
                <span className="sr-only">{t("loading")}</span>
                <LoadingWordmark />
            </main>
        </ViewTransition>
    );
}
