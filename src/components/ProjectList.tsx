"use client"
import { useState, useEffect, useRef, useCallback } from 'react'
import { Card } from './Card'
import { Project } from '@/payload-types'
import { Loading } from './icons/Loading'

export const ProjectList = ({ favoritesOnly = false, limit = 10 }) => {
    const [projects, setProjects] = useState<Project[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(true)
    const observerRef = useRef<HTMLDivElement | null>(null)
    const fetchedPages = useRef<Set<number>>(new Set())

    const fetchProjects = useCallback(async (page: number) => {
        if (fetchedPages.current.has(page)) return
        fetchedPages.current.add(page)

        setLoading(true)
        const response = await fetch(`/api/projects?page=${page}${favoritesOnly ? '&where[isFavorite][equals]=true' : ''}&limit=${limit}&sort=-id`)
        const body = await response.json()
        const newProjects = body.docs
        setHasNextPage(body.hasNextPage && !favoritesOnly)
        if (newProjects.length > 0)
            setProjects((prevProjects) => [...prevProjects, ...newProjects])
        setLoading(false)
    }, [favoritesOnly, limit])

    useEffect(() => {
        fetchProjects(page)
    }, [page, fetchProjects])

    useEffect(() => {
        if (!hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setPage((prevPage) => prevPage + 1)
                }
            },
            { threshold: 0.3 }
        )
        const currentRef = observerRef.current;
        if (currentRef) {
            observer.observe(currentRef)
        }
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [loading, hasNextPage])

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-2 space-y-2 py-4 mx-2 space-x-2 grid-flow-row-dense'>
            {projects.map((project) => (
                <Card key={project.id} project={project} />
            ))}
            <div className={`w-full flex items-center lg:col-span-2 justify-center text-secondary ${loading ? 'visible' : 'invisible'}`}>
                <Loading />
            </div>
            <div aria-hidden ref={observerRef}></div>
        </div>
    )
}
