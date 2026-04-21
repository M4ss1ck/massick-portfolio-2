"use client";
import { useCallback, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { Project } from "@/payload-types";

interface UseProjectsOptions {
    favoritesOnly?: boolean;
    limit?: number;
}

interface ProjectsPage {
    docs: Project[];
    page: number;
    hasNextPage: boolean;
}

export const useProjects = ({
    favoritesOnly = false,
    limit = 10,
}: UseProjectsOptions = {}) => {
    const locale = useLocale();

    const query = useInfiniteQuery<ProjectsPage>({
        queryKey: ["projects", { locale, favoritesOnly, limit }],
        queryFn: async ({ pageParam }) => {
            const response = await fetch(
                `/api/projects?page=${pageParam}${favoritesOnly ? "&where[isFavorite][equals]=true" : ""}&limit=${limit}&sort=-publishedDate&locale=${locale}`,
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch projects: ${response.status}`,
                );
            }
            return response.json();
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.hasNextPage && !favoritesOnly
                ? lastPage.page + 1
                : undefined,
    });

    useEffect(() => {
        if (query.error) {
            console.error("Failed to fetch projects:", query.error);
        }
    }, [query.error]);

    const projects = query.data?.pages.flatMap((p) => p.docs) ?? [];
    const loading = query.isPending || query.isFetchingNextPage;
    const hasNextPage = query.hasNextPage;
    const fetchNextPage = query.fetchNextPage;

    const loadMore = useCallback(() => {
        if (!loading && hasNextPage) {
            fetchNextPage();
        }
    }, [loading, hasNextPage, fetchNextPage]);

    return {
        projects,
        loading,
        hasNextPage,
        loadMore,
    };
};
