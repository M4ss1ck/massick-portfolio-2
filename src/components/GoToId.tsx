"use client"
import { Down } from '@/components/icons/DownAnimated'

export const GoToId = ({ id }: { id: string }) => {
    const goToProjects = (id: string) => {
        const targetElement = document.getElementById(id)
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }
    return (
        <button className='absolute bottom-0 h-8 w-8 text-primary hover:text-other' onClick={() => goToProjects(id)}>
            <Down />
        </button>
    )
}