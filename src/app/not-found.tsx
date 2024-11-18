import Hacker from '@/assets/svg/hacker.svg'
import { Link } from '@/i18n/routing'
import Canvas from '@/components/Canvas'
import { useTranslations } from 'next-intl'

export const runtime = 'edge';

export default function Loading() {
    const t = useTranslations()
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <section className='absolute top-1/2 text-center'>
                <h1 className='text-4xl font-display'>{t("not_found")}</h1>
                <Link href='/' className='text-lg hover:underline'>{t("back")}</Link>
            </section>
            <Canvas r={250} g={250} b={250} />
            <Hacker className="absolute bottom-0 w-full opacity-90 dark:opacity-20 -z-10" />
        </main>
    )
}