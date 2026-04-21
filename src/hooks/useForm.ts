"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { Form as FormType } from "@/payload-types";

const ONE_HOUR = 1000 * 60 * 60;

export const useForm = (formId: string | number) => {
    const locale = useLocale();

    const query = useQuery<FormType>({
        queryKey: ["form", { id: formId, locale }],
        queryFn: async () => {
            const response = await fetch(
                `/api/forms/${formId}?locale=${locale}`,
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch form: ${response.status}`,
                );
            }
            return response.json();
        },
        staleTime: ONE_HOUR,
        gcTime: ONE_HOUR,
    });

    useEffect(() => {
        if (query.error) {
            console.error("Failed to fetch form:", query.error);
        }
    }, [query.error]);

    return {
        form: query.data ?? null,
        loading: query.isPending,
    };
};
