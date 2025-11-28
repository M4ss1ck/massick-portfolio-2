"use client"
import { useState, useEffect } from 'react'
import Image from "next/image";
import { Card } from './Card'
import { Project } from '@/payload-types'
import { Loading } from './icons/Loading'
import { useTranslations, useLocale } from "next-intl";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Link from 'next/link';

export const ProjectDetails = ({ id }: { id: string | number }) => {
    const t = useTranslations();
    const locale = useLocale();

    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        const fetchProjects = async (id: number | string) => {
            setLoading(true)
            try {
                const response = await fetch(`/api/projects/${id}?depth=2&locale=${locale}`)
                const body = await response.json()
                setProject(body)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects(id)
    }, [id, locale])

    if (!project || loading) return <div className='grid grid-cols-1 min-h-[50dvh] text-secondary text-lg place-content-center'>
        <Loading />
    </div>

    const fallbackDate = dayjs()
    const imageSrc = project.coverImage && typeof project.coverImage !== 'number' && project.coverImage.filename
        ? `/media/${project.coverImage.filename}`
        : "/images/hacker.png"

    return (
        <div className='grid grid-cols-1 gap-2 space-y-2 py-4 mx-2 space-x-2 grid-flow-row-dense max-w-prose'>
            <title>{t(project.title)}</title>
            <Image
                className="rounded-lg blur-none p-2 mx-auto"
                src={imageSrc}
                width={500}
                height={500}
                alt={project.title}
            />
            <h1 className='text-4xl text-primary font-display w-full text-center'>{project.title}</h1>
            <p className='text-secondary font-body text-xl'><em>{project.description}</em></p>
            <p className='text-secondary'>{dayjs(project.publishedDate ?? fallbackDate).locale(locale).format('MMMM YYYY')}</p>
            <p className='text-other'>{project.url ? <Link className='underline-animation' href={project.url}>URL</Link> : 'No url available'}</p>
            <p className='text-other'>{project.demo ? <Link className='underline-animation' href={project.demo}>DEMO</Link> : 'No demo available'}</p>

            <h2 className='text-xl text-primary font-display'>{t("Related Projects")}</h2>
            <div className='grid grid-cols-1 gap-2 space-y-2 py-4 mx-2 space-x-2 grid-flow-row-dense text-other'>
                {project.relatedProjects && project.relatedProjects.filter(p => typeof p !== 'number').length > 0 ? project.relatedProjects.filter(p => typeof p !== 'number').map((relatedProject) => (
                    <Card key={relatedProject.id} project={relatedProject} />
                )) : t('No related projects')}
            </div>
        </div>
    )
}
