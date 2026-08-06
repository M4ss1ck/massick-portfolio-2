import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Form } from "@/payload-types";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export const toLocale = (lng: string): Locale =>
    routing.locales.includes(lng as Locale)
        ? (lng as Locale)
        : routing.defaultLocale;

const readForm = unstable_cache(
    async (id: number, locale: Locale): Promise<Form> => {
        const payload = await getPayload({ config });
        return (await payload.findByID({
            collection: "forms",
            id,
            locale,
        })) as Form;
    },
    ["contact-form"],
    { revalidate: false, tags: ["forms"] },
);

export const getForm = async (
    id: number,
    locale: Locale,
): Promise<Form | undefined> => {
    try {
        return await readForm(id, locale);
    } catch (error) {
        console.error("Failed to prefetch form:", error);
        return undefined;
    }
};
