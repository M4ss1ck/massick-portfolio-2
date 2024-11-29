"use server";
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server';
import { Link } from '@/components/AnimatedLink';
import { ProjectList } from '@/components/ProjectList'

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
            <PageTitle />
            <ProjectList />
            <Back />
        </main>
    )
}

const PageTitle = () => {
    const t = useTranslations()

    return (
        <h1 className="mt-4 text-lg uppercase lg:text-2xl font-display text-primario dark:text-secundario">
            <span>{t("projects")}</span>
        </h1>
    )
}

const Back = () => {
    const t = useTranslations()

    return (
        <Link href="/" className='font-thin font-mono underline-animation pb-4'>
            {t("back")}
        </Link>
    )
}

export default Page