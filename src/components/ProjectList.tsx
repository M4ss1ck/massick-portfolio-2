"use client"
import { useState, useEffect, useRef } from 'react'
import { Card } from './Card'
import { Project } from '@/payload-types'
import { Loading } from './icons/Loading'

export const ProjectList = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(true)
    const observerRef = useRef<HTMLDivElement | null>(null)

    const fetchProjects = async (page: number) => {
        setLoading(true)
        const response = await fetch(`/api/projects?page=${page}&limit=5`)
        const body = await response.json()
        const newProjects = body.docs
        setHasNextPage(body.hasNextPage)
        if (newProjects.length > 0)
            setProjects((prevProjects) => [...prevProjects, ...newProjects])
        setLoading(false)
    }

    useEffect(() => {
        fetchProjects(page)
    }, [page])

    useEffect(() => {
        if (!hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setPage((prevPage) => prevPage + 1)
                }
            },
            { threshold: 1.0 }
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
        <div className='grid grid-cols-1 gap-2 space-y-2 py-4'>
            {projects.map((project) => (
                <Card key={project.id} project={project} />
            ))}
            {loading && <div className='w-full flex items-center justify-center'>
                <Loading />
            </div>}
            <div aria-hidden ref={observerRef}></div>
        </div>
    )
}
