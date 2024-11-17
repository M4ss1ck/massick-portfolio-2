export const fallbackLng = 'en'
export const languages = ['en', 'es']
export const defaultNS = 'translation'
export const cookieName = 'i18next'

export function getOptions(lng = fallbackLng, ns = defaultNS) {
    return {
        // debug: true,
        supportedLngs: languages,
        fallbackLng,
        lng,
        fallbackNS: defaultNS,
        defaultNS,
        ns,
        saveMissing: true,
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
            addPath: '/locales/{{lng}}/{{ns}}.missing.json'
        }
    }
}
