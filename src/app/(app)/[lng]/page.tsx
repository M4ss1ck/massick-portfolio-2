import Canvas from '@/components/Canvas'
import Menu from '@/components/Menu'
import LettersAnimation from '@/components/LettersAnimation'
import { useTranslations } from 'next-intl'
import Hacker from '@/components/icons/Hacker'
import { Block } from '@/components/Block'
import { ProjectList } from '@/components/ProjectList'
import { GoUp } from '@/components/GoUp'
import { Footer } from '@/components/Footer'
import { Link } from '@/components/AnimatedLink'
import { GoToId } from '@/components/GoToId'

export default function Page() {
    const t = useTranslations()
    const title = t("titulo_portada")

    return (
        <main className="flex flex-col items-center justify-center w-full min-h-screen font-body overflow-x-hidden">
            <Block>
                <Canvas r={250} g={250} b={250} text={title} />
                <Menu t={t} />
                <LettersAnimation title={title} />
                <GoToId id="projects" />
                <Hacker className="absolute bottom-0 w-full opacity-20 -z-10" />
            </Block>
            <Block id="projects">
                <Link href="/projects">
                    <h1 className='text-4xl text-primary font-body mt-4 mb-8 underline-animation'>
                        {t("projects")}
                    </h1>
                </Link>
                <ProjectList favoritesOnly limit={6} />
            </Block>
            <Footer />
            <GoUp />
        </main>
    )
}
