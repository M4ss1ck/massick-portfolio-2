import { useTranslation } from '../i18n'
import Hacker from '@/assets/svg/hacker.svg'
import Canvas from '@/components/Canvas'
import Menu from '@/components/Menu'
import LettersAnimation from '@/components/LettersAnimation'
import Helper from '@/components/Helper'

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    const { t } = await useTranslation(lng)
    const title = t("titulo_portada")
    const letrasTitulo = [...title]

    return (
        <main className="flex flex-col items-center justify-center w-full h-screen">
            <Helper lng={lng} />
            <Canvas r={250} g={250} b={250} />
            <LettersAnimation />
            <Menu t={t} />
            <h1
                aria-label={title}
                className="flex absolute z-10 flex-wrap justify-center items-center text-2xl text-center uppercase md:text-5xl lg:text-7xl font-rammetto"
            >
                {letrasTitulo.map((letra, index) => {
                    return (
                        <span
                            key={index}
                            className={
                                letra === " "
                                    ? "min-w-[1rem] mr-auto w-full"
                                    : "animateletter transition duration-300 hover:skew-y-12 hover:even:-skew-y-12 hover:-translate-y-16 hover:even:-translate-y-14 hover:scale-150 text-primario dark:text-secundario min-w-[1rem] cursor-default"
                            }
                        >
                            {letra}
                        </span>
                    )
                })}
            </h1>
            <Hacker className="absolute bottom-0 w-full opacity-90 dark:opacity-20 -z-10" />
        </main>
    )
}
