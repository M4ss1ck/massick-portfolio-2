"use client";
import { ViewTransition } from "react";
import Image from "next/image";
import { Card } from "./Card";
import { Loading } from "./icons/Loading";
import { useTranslations, useLocale } from "next-intl";
import dayjs from "dayjs";
import "dayjs/locale/es";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Pill } from "./Pill";
import { ReadingProgress } from "./ReadingProgress";
import { useProject } from "@/hooks/useProject";

export const ProjectDetails = ({ id }: { id: string | number }) => {
    const t = useTranslations();
    const locale = useLocale();
    const { project, loading } = useProject(id);

    if (!project || loading)
        return (
            <div className="grid grid-cols-1 min-h-[50dvh] text-secondary text-lg place-content-center">
                <Loading />
            </div>
        );

    const fallbackDate = dayjs();
    const imageSrc =
        project.coverImage &&
            typeof project.coverImage !== "number" &&
            project.coverImage.filename
            ? `/media/${project.coverImage.filename}`
            : "/images/clean.png";

    return (
        <>
            <ReadingProgress />
            <title>{t(project.title)}</title>
            <ViewTransition name={`project-image-${project.id}`} share="morph">
                <Image
                    className="rounded-lg blur-none p-2 w-full max-w-2xl h-auto mx-auto scroll-reveal"
                    src={imageSrc}
                    width={800}
                    height={800}
                    alt={project.title}
                />
            </ViewTransition>
            <div className="grid grid-cols-1 gap-2 space-y-2 py-4 mx-2 space-x-2 grid-flow-row-dense max-w-prose">
                <h1
                    className="text-6xl text-primary font-display w-full text-left"
                    style={{
                        viewTransitionName: `project-title-${project.id}`,
                    }}
                >
                    {project.title}
                </h1>
                <p className="text-secondary font-body text-2xl">
                    <em>{project.description}</em>
                </p>
                <p className="text-secondary">
                    {dayjs(project.publishedDate ?? fallbackDate)
                        .locale(locale)
                        .format("MMMM YYYY")}
                </p>
                {project.url && (
                    <p className="text-other">
                        <Link
                            className="underline-animation"
                            href={project.url}
                        >
                            URL
                        </Link>
                    </p>
                )}
                {project.demo && (
                    <p className="text-other">
                        <Link
                            className="underline-animation"
                            href={project.demo}
                        >
                            DEMO
                        </Link>
                    </p>
                )}

                {project.tags && project.tags.length > 0 && (
                    <div className="tag-stagger py-1 gap-2 flex items-center justify-start flex-row flex-wrap font-display">
                        {project.tags.map((tag, i) =>
                            typeof tag !== "number" ? (
                                <span
                                    key={tag.id}
                                    style={{ ["--i" as string]: i }}
                                >
                                    <Pill tag={tag.name} />
                                </span>
                            ) : null,
                        )}
                    </div>
                )}

                {project.content && (
                    <div className="rich-text-content font-body text-primary">
                        <RichText data={project.content} />
                    </div>
                )}

                <h2 className="text-xl text-other font-display">
                    {t("Related Projects")}
                </h2>
                <div className="grid grid-cols-1 gap-2 space-y-2 py-4 mx-2 space-x-2 grid-flow-row-dense text-other scroll-reveal">
                    {project.relatedProjects &&
                        project.relatedProjects.filter((p) => typeof p !== "number")
                            .length > 0
                        ? project.relatedProjects
                            .filter((p) => typeof p !== "number")
                            .map((relatedProject) => (
                                <Card
                                    key={relatedProject.id}
                                    project={relatedProject}
                                />
                            ))
                        : t("No related projects")}
                </div>
            </div>
        </>
    );
};
