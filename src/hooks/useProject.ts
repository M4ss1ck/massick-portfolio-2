"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { Project } from "@/payload-types";

export const useProject = (id: string | number) => {
    const locale = useLocale();

    const query = useQuery<Project>({
        queryKey: ["project", { id, locale }],
        queryFn: async () => {
            const response = await fetch(
                `/api/projects/${id}?depth=2&locale=${locale}`,
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch project: ${response.status}`,
                );
            }
            return response.json();
        },
    });

    useEffect(() => {
        if (query.error) {
            console.error("Failed to fetch project:", query.error);
        }
    }, [query.error]);

    return {
        project: query.data ?? null,
        loading: query.isPending,
    };
};
