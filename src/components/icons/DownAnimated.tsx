import React from 'react';
import type { SVGProps } from 'react';

export function Down(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={48}
            height={48}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
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
                <use href="#arrowhead">
                    <animateTransform
                        attributeName="transform"
                        type="scale"
                        values="1;1.1;1"
                        dur="1.2s"
                        begin="0s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="1;0.6;1"
                        dur="1.2s"
                        repeatCount="indefinite"
                    />
                </use>
            </g>
            <g transform="translate(12 8)">
                <use href="#arrowhead">
                    <animateTransform
                        attributeName="transform"
                        type="scale"
                        values="1;1.1;1"
                        dur="1.2s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.6;1;0.6"
                        dur="1.2s"
                        repeatCount="indefinite"
                    />
                </use>
            </g>
        </svg>
    );
}