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
    const fetchedPages = useRef<Set<number>>(new Set())

    const fetchProjects = async (page: number) => {
        if (fetchedPages.current.has(page)) return
        fetchedPages.current.add(page)

        setLoading(true)
        const response = await fetch(`/api/projects?page=${page}&limit=10&sort=-id`)
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
            <div className={`w-full flex items-center lg:col-span-2 justify-center ${loading ? 'visible' : 'invisible'}`}>
                <Loading />
            </div>
            <GoUp />
            <div aria-hidden ref={observerRef}></div>
        </div>
    )
}

export const GoUp = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > window.innerHeight);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check visibility on mount

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='fixed right-4 bottom-4 z-30'>
            <button
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out ${visible ? 'visible' : 'invisible'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeDasharray={12} strokeDashoffset={12} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M12 5l-7 7M12 5l7 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="12;0"></animate></path><path d="M12 11l-7 7M12 11l7 7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" values="12;0"></animate></path></g></svg>
            </button>
        </div>
    );
};
