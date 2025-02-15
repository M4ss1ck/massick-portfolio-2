"use client"
import { useState, useEffect } from 'react'
import { Down } from '@/components/icons/DownAnimated'

export const GoToId = ({ id }: { id: string }) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY < 150)
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const goToProjects = (id: string) => {
        const targetElement = document.getElementById(id)
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <button
            className={`absolute bottom-2 h-12 w-12 text-primary hover:text-other transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => goToProjects(id)}
        >
            <Down />
        </button>
    )
}