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
    return (
        <Tilt
            glareEnable={true}
        >
            <div className="group grid grid-cols-3 max-w-sm sm:max-w-lg hover:z-20 hover:shadow-lg hover:shadow-current rounded-lg transition-all duration-300 ease-in-out">
                <div className="col-span-1">
                    <Image
                        className="rounded-lg"
                        src={
                            project.coverImage && typeof project.coverImage !== 'number' && project.coverImage.url
                                ? project.coverImage.url
                                : "/images/hacker.png"
                        }
                        width={160}
                        height={160}
                        alt={t(project.title)}
                    />
                    {
                        project.publishedDate
                            ? <p className="text-xs border border-current px-2 py-1 rounded-lg group-hover:text-white text-gray-400 absolute bottom-1">
                                {dayjs(project.publishedDate).locale(locale).format('MMMM YYYY')}
                            </p>
                            : null
                    }
                </div>
                <div className="col-span-2">
                    <h3 className="text-xl py-2">
                        {project.url
                            ? <Link href={project.url} target="_blank" className="underline-animation">{project.title}</Link>
                            : project.title}
                    </h3>
                    <div className="py-1 gap-2 flex items-center justify-start flex-row flex-wrap">
                        {project.tags?.map((tag) => (
                            typeof tag !== 'number' ? <Pill key={tag.id} tag={tag.name} /> : null
                        ))}
                    </div>
                    <p>{t(project.description)}</p>
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
    <span className="text-xs border border-current px-2 py-1 rounded-lg group-hover:bg-white group-hover:text-black">{tag}</span>
)

export function LineMdLink(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeDasharray={28} strokeDashoffset={28} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="28;0" className="inline-flex"></animate></path></svg>);
}