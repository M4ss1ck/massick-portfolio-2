import React from "react";
import type { SVGProps } from "react";

export function Down(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={48}
            height={48}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
            className="chevron-pulse"
        >
            <defs>
                <path
                    id="arrowhead"
                    d="M-8 5L0 13 8 5"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </defs>
            <g transform="translate(12 0)">
                <use href="#arrowhead" />
            </g>
            <g transform="translate(12 8)">
                <use href="#arrowhead" className="chevron-offbeat" />
            </g>
        </svg>
    );
}
