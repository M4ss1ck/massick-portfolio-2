import { useTranslations } from "next-intl";
import { ViewTransition } from "react";

export default function Loading() {
    const t = useTranslations();
    return (
        <ViewTransition exit="fade-out">
            <main className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-4xl animate-ping text-primary animate">{t("loading")}</h1>
            </main>
        </ViewTransition>
    );
}
