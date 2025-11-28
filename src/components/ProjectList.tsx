"use client"
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Card } from './Card'
import { SkeletonCard } from './SkeletonCard'
import { Loading } from './icons/Loading'
import { Link } from './AnimatedLink'
import { useProjects } from '@/hooks/useProjects'

export const ProjectList = ({ favoritesOnly = false, limit = 10 }) => {
    const t = useTranslations()
    const { projects, loading, hasNextPage, loadMore } = useProjects({ favoritesOnly, limit })
    const observerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore()
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
    }, [loadMore, hasNextPage])

    return (loading && projects.length === 0
        ? <div className={`grid grid-cols-1 lg:grid-cols-2 gap-2 space-y-2 py-4 mx-2 space-x-2 grid-flow-row-dense text-secondary`}>
            {[...Array(limit).keys()].map((i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
        : <div className='grid grid-cols-1 lg:grid-cols-2 gap-2 space-y-2 py-4 mx-2 space-x-2 grid-flow-row-dense'>
            {projects.map((project) => (
                <Card key={project.id} project={project} />
            ))}
            {favoritesOnly && !loading && projects.length > 0
                ? <Link href="/projects" className='text-primary underline-animation ml-auto mb-auto font-display lg:col-span-2'>{t("See more")}</Link>
                : null
            }
            <div className={`w-full flex items-center lg:col-span-2 justify-center text-secondary ${loading ? 'visible' : 'invisible'}`}>
                <Loading />
            </div>
            <div aria-hidden ref={observerRef}></div>
        </div>
    )
}
