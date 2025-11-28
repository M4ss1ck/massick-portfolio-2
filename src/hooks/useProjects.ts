"use client"
import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { Project } from '@/payload-types'

interface UseProjectsOptions {
    favoritesOnly?: boolean
    limit?: number
}

export const useProjects = ({ favoritesOnly = false, limit = 10 }: UseProjectsOptions = {}) => {
    const locale = useLocale()
    const [projects, setProjects] = useState<Project[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(true)
    const fetchedPages = useRef<Set<number>>(new Set())

    useEffect(() => {
        if (page > 1 && favoritesOnly) return
        if (fetchedPages.current.has(page)) return

        let isCancelled = false

        const fetchProjects = async () => {
            setLoading(true)
            try {
                const response = await fetch(
                    `/api/projects?page=${page}${favoritesOnly ? '&where[isFavorite][equals]=true' : ''}&limit=${limit}&sort=-publishedDate&locale=${locale}`
                )
                const body = await response.json()
                
                if (isCancelled) return
                
                fetchedPages.current.add(page)
                const newProjects = body.docs
                setHasNextPage(body.hasNextPage && !favoritesOnly)
                if (newProjects.length > 0) {
                    setProjects((prevProjects) => [...prevProjects, ...newProjects])
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error)
            } finally {
                if (!isCancelled) {
                    setLoading(false)
                }
            }
        }

        fetchProjects()

        return () => {
            isCancelled = true
        }
    }, [page, favoritesOnly, limit, locale])

    const loadMore = useCallback(() => {
        if (!loading && hasNextPage) {
            setPage((prevPage) => prevPage + 1)
        }
    }, [loading, hasNextPage])

    return {
        projects,
        loading,
        hasNextPage,
        loadMore,
    }
}
