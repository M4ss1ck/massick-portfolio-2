import NextLink, { LinkProps } from "next/link";
import { fallbackLng } from "@/app/i18n/settings";

type MyLinkI = {
    lng?: string
    children: React.ReactNode
} & LinkProps
const replaceLocaleInPath = (locale: string, path: string) => {
    return path.replace(/^\/\w{2}/, `/${locale}`)
}
const Link = (props: MyLinkI) => {
    const lng = props.lng ?? fallbackLng
    const url = props.href.toString().startsWith('/') ? replaceLocaleInPath(lng, props.href.toString()) : props.href
    return <NextLink {...props} href={url}></NextLink>
}

export default Link
