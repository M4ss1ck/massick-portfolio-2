"use server";
import { useTranslations } from 'next-intl'
import { Link } from '@/components/AnimatedLink';
import { ProjectList } from '@/components/ProjectList'

const Page = async () => {

    return (
        <main className="flex flex-col items-center justify-start w-full h-screen gap-2">
            <PageTitle />
            <ProjectList />
            <Back />
        </main>
    )
}

const PageTitle = () => {
    const t = useTranslations()

    return (
        <h1 className="mt-4 text-lg uppercase lg:text-2xl font-rammetto text-primario dark:text-secundario">
            <span>{t("projects")}</span>
        </h1>
    )
}

const Back = () => {
    const t = useTranslations()

    return (
        <Link href="/" className='font-thin font-mono underline-animation'>
            {t("back")}
        </Link>
    )
}

export default Page