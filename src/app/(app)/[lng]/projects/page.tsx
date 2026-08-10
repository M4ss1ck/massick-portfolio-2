import { getTranslations } from "next-intl/server";
import { ProjectList } from "@/components/ProjectList";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DirectionalTransition } from "@/components/DirectionalTransition";

export async function generateMetadata() {
    const t = await getTranslations();
    return {
        title: t("projects"),
    };
}

export default function Page() {
    return (
        <DirectionalTransition>
            <main className="flex flex-col items-center justify-start w-full min-h-screen gap-2">
                <Navbar />
                <ProjectList />
                <Footer />
            </main>
        </DirectionalTransition>
    );
}
