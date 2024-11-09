import { useTranslation } from '../i18n'
import Hacker from '@/assets/svg/hacker.svg'
import Canvas from '@/components/Canvas'
import Menu from '@/components/Menu'
import LettersAnimation from '@/components/LettersAnimation'
import Helper from '@/components/Helper'

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = await useTranslation(lng)
    const title = t("titulo_portada")

    return (
        <main className="flex flex-col items-center justify-center w-full h-screen">
            <Helper lng={lng} />
            <Canvas r={250} g={250} b={250} />
            <Menu t={t} />
            <LettersAnimation title={title} />
            <Hacker className="absolute bottom-0 w-full opacity-90 dark:opacity-20 -z-10" />
        </main>
    )
}
