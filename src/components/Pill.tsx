import { ReactNode } from "react";

export const Pill = ({ tag }: { tag: string | ReactNode }) => (
    <span className="text-xs border border-current px-2 py-0 rounded-lg bg-opacity-65 group-hover:bg-opacity-1 text-slate-800 bg-other group-hover:text-black">{tag}</span>
)