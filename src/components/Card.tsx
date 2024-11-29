"use client"
import type { Project } from "@/payload-types";
import Tilt from 'react-parallax-tilt';
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { SVGProps } from "react";
import dayjs from "dayjs";

interface CardProps {
    project: Project;
}

export const Card = ({ project }: CardProps) => {
    const t = useTranslations();
    const locale = useLocale();
    // const imageSrc = project.coverImage && typeof project.coverImage !== 'number' && project.coverImage.url
    //     ? project.coverImage.url
    //     : "/images/hacker.png"
    const imageSrc = project.coverImage && typeof project.coverImage !== 'number' && project.coverImage.filename
        ? `/media/${project.coverImage.filename}`
        : "/images/hacker.png"
    return (
        <Tilt
            glareEnable={true}
        >
            <div className="group grid grid-cols-1 sm:grid-cols-3 max-w-sm sm:max-w-lg hover:z-20 hover:shadow-lg hover:shadow-current rounded-lg transition-all duration-300 ease-in-out gap-x-2 h-full">
                <div
                    aria-hidden
                    className="absolute h-full w-full -z-10"
                    style={{
                        backgroundImage: `url(${imageSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        filter: 'blur(8px)',
                    }}></div>
                <div
                    className="col-span-1 relative"
                >
                    <Image
                        className="rounded-lg blur-none p-2 mx-auto"
                        src={imageSrc}
                        width={160}
                        height={160}
                        alt={t(project.title)}
                    />
                    {
                        project.publishedDate
                            ? <p className="text-xs border border-current m-2 px-2 py-1 rounded-lg group-hover:text-white text-gray-400 absolute bottom-1 group-hover:bg-black bg-opacity-50">
                                {dayjs(project.publishedDate).locale(locale).format('MMMM YYYY')}
                            </p>
                            : null
                    }
                </div>
                <div className="col-span-1 sm:col-span-2 p-2 mx-2">
                    <h3 className="text-xl p-2 font-body backdrop-filter backdrop-blur-lg bg-black bg-opacity-70">
                        {project.url
                            ? <Link href={project.url} target="_blank" className="underline-animation">{t(project.title)}</Link>
                            : t(project.title)}
                    </h3>
                    <div className="py-1 gap-2 flex items-center justify-start flex-row flex-wrap font-display">
                        {project.tags?.map((tag) => (
                            typeof tag !== 'number' ? <Pill key={tag.id} tag={tag.name} /> : null
                        ))}
                    </div>
                    <p className="font-display backdrop-filter backdrop-blur-lg bg-black bg-opacity-65 p-2 group-hover:text-white text-gray-400">{t(project.description)}</p>
                    {
                        project.demo
                            ? <Link href={project.demo} target="_blank" className="underline-animation">
                                <span>
                                    <LineMdLink className="w-4 h-4 inline-flex" />&nbsp;{t("demo")}
                                </span>
                            </Link>
                            : null
                    }
                </div>
            </div>
        </Tilt>
    )
}

const Pill = ({ tag }: { tag: string }) => (
    <span className="text-xs border border-current px-2 py-0 rounded-lg bg-opacity-65 group-hover:bg-opacity-1 text-slate-800 bg-white group-hover:text-black">{tag}</span>
)

export function LineMdLink(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeDasharray={28} strokeDashoffset={28} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="28;0" className="inline-flex"></animate></path></svg>);
}