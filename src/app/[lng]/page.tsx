import Hacker from '@/assets/svg/hacker.svg'
import Canvas from '@/components/Canvas'
import Menu from '@/components/Menu'
import LettersAnimation from '@/components/LettersAnimation'
import { useTranslations } from 'next-intl'

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    const t = useTranslations()
    const title = t("titulo_portada")

    return (
        <main className="flex flex-col items-center justify-center w-full h-screen font-body">
            <Canvas r={250} g={250} b={250} />
            <Menu t={t} />
            <LettersAnimation title={title} />
            <Hacker className="absolute bottom-0 w-full opacity-90 dark:opacity-20 -z-10" />
        </main>
    )
}
