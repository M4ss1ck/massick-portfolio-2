"use server";
import { getTranslations } from 'next-intl/server';
import { ProjectList } from '@/components/ProjectList'
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export async function generateMetadata(props: {
    params: Promise<{
        lng: string
    }>
}) {
    const params = await props.params;
    const {
        lng
    } = params;
    const t = await getTranslations({ locale: lng });
    return {
        title: t('projects'),
    };
}

const Page = async () => {
    return (
        <main className="flex flex-col items-center justify-start w-full min-h-screen gap-2">
            <Navbar />
            <ProjectList />
            <Footer />
        </main>
    )
}

export default Page