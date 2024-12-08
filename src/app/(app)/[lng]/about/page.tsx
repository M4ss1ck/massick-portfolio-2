import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/components/AnimatedLink'
import profile from '~/images/profile.jpg'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

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
        title: t('about'),
    };
}

export default function Page() {

    const t = useTranslations()

    return (
        <main className="flex flex-col items-center justify-start w-full h-screen gap-2">
            <Navbar />
            <h1 className="mt-4 text-lg uppercase lg:text-2xl font-display text-primary">
                <span>{t("who_am_I")}</span>
            </h1>
            <div className='fancy-border'>
                <Image
                    className="rounded-full"
                    src={profile}
                    width={160}
                    height={160}
                    alt={t("profile")}
                />
            </div>
            <p className="px-4 pt-8 text-xl font-semibold font-display md:w-2/3 md:pt-4 md:text-2xl max-w-prose text-pretty text-secondary">
                {t("about_bio")}
            </p>
            <Link href="/" className='font-thin font-body underline-animation text-primary'>
                {t("back")}
            </Link>
            <Footer />
        </main>
    )
}