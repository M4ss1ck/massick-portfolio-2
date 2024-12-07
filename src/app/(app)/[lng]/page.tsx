import Canvas from '@/components/Canvas'
import Menu from '@/components/Menu'
import LettersAnimation from '@/components/LettersAnimation'
import { useTranslations } from 'next-intl'
import Hacker from '@/components/icons/Hacker'

export default function Page() {
    const t = useTranslations()
    const title = t("titulo_portada")

    return (
        <main className="flex flex-col items-center justify-center w-full h-screen font-body">
            <Canvas r={250} g={250} b={250} text={title} />
            <Menu t={t} />
            <LettersAnimation title={title} />
            <Hacker className="absolute bottom-0 w-full opacity-90 dark:opacity-20 -z-10" />
        </main>
    )
}
