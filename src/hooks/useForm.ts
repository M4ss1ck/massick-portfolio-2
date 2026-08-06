"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { Form as FormType } from "@/payload-types";

export const useForm = (formId: string | number, initialForm?: FormType) => {
    const locale = useLocale();

    const query = useQuery<FormType>({
        initialData: initialForm,
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
