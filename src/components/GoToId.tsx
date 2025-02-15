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
        <button className={`absolute bottom-0 h-8 w-8 text-primary hover:text-other transition-all duration-300 ease-in-out ${visible ? 'visible' : 'invisible'}`} onClick={() => goToProjects(id)}>
            <Down />
        </button>
    )
}