import { useTranslation } from '../../i18n'
import Helper from '@/src/components/Helper'
import Image from 'next/image'
import Link from 'next/link'
import profile from '@/public/images/profile.jpg'

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    const { t } = await useTranslation(lng)

    return (
        <main className="flex flex-col items-center justify-center w-full h-screen gap-2">
            <Helper lng={lng} />
            <h1 className="mt-4 text-lg uppercase lg:text-2xl font-rammetto text-primario dark:text-secundario">
                <span>{t("who_am_I")}</span>
            </h1>
            <Image
                className="rounded-full"
                src={profile}
                width={160}
                height={160}
                alt={t("Foto de perfil")}
            />
            <p className="px-4 pt-8 text-xl font-semibold font-montserrat md:w-2/3 md:pt-4 md:text-2xl max-w-prose">
                {t("about_bio")}
            </p>
            <Link href="/" className='font-thin font-mono underline'>
                {t("back")}
            </Link>
        </main>
    )
}