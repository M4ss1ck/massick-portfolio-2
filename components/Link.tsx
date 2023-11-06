import NextLink, { LinkProps } from "next/link";
import { fallbackLng } from "@/app/i18n/settings";

type MyLinkI = {
    lng?: string
    children: React.ReactNode
} & LinkProps & Omit<React.HTMLProps<HTMLAnchorElement>, "ref">
const replaceLocaleInPath = (locale: string, path: string) => {
    if (/^\/\w{2}$/.test(path)) return path.replace(/^\/\w{2}$/, `/${locale}`)
    if (/^\/\w{2}\//.test(path)) return path.replace(/^\/\w{2}\//, `/${locale}/`)
    return `/${locale}${path}`
}
const Link = (props: MyLinkI) => {
    console.log(props)
    const lng = props.lng ?? fallbackLng
    const url = props.href.toString().startsWith('/') ? replaceLocaleInPath(lng, props.href.toString()) : props.href
    return <NextLink {...props} href={url}></NextLink>
}

export default Link
