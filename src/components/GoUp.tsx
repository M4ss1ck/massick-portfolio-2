"use client";
import { useState, useEffect } from 'react';

export const GoUp = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > window.innerHeight);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check visibility on mount

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='fixed right-4 bottom-4 z-30 text-primary hover:text-other'>
            <button
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out ${visible ? 'visible' : 'invisible'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeDasharray={12} strokeDashoffset={12} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M12 5l-7 7M12 5l7 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="12;0"></animate></path><path d="M12 11l-7 7M12 11l7 7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" values="12;0"></animate></path></g></svg>
            </button>
        </div>
    );
};
