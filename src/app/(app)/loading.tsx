import { useTranslations } from 'next-intl'

export default function Loading() {
    const t = useTranslations()
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <h1 className='text-4xl animate-ping'>{t("loading")}</h1>
        </main>
    )
}
