import React from 'react'
import type { SVGProps } from 'react';

export function ExternalLink(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path strokeDasharray={36} strokeDashoffset={36} d="M12 5c-3.87 0 -7 3.13 -7 7c0 3.87 3.13 7 7 7c3.87 0 7 -3.13 7 -7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="36;0"></animate></path><path strokeDasharray={12} strokeDashoffset={12} d="M13 11l7 -7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="12;0"></animate></path><path strokeDasharray={8} strokeDashoffset={8} d="M21 3h-6M21 3v6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="8;0"></animate></path></g></svg>);
}