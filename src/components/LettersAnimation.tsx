"use client"
import React, { useEffect } from 'react'

const LettersAnimation = ({ title }: { title: string }) => {
    const array = [...title]

    useEffect(() => {
        const letters: NodeListOf<HTMLElement> = document.querySelectorAll(".animateletter")
        let duration = 400
        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i]
            letter.style.visibility = 'visible'
            duration += 200
            letter.animate(
                [
                    { transform: `translateY(-100vh) scale(0,0)` },
                    { transform: `translateY(0) scale(1,1)` },
                ],
                { duration, iterations: 1, easing: "ease-in-out" }
            )
        }
    }, [])
    return (
        <h1
            aria-label={title}
            className="flex absolute z-10 flex-wrap justify-center items-center text-2xl text-center uppercase md:text-5xl lg:text-7xl font-display"
        >
            {array.map((letter, index) => {
                return (
                    <span
                        key={index}
                        className={
                            letter === " "
                                ? "min-w-[1rem] mr-auto w-full"
                                : "animateletter transition duration-300 hover:skew-y-12 hover:even:-skew-y-12 hover:-translate-y-16 hover:even:-translate-y-14 hover:scale-150 min-w-[1rem] cursor-default"
                        }
                        style={{ visibility: 'hidden' }}
                    >
                        {letter}
                    </span>
                )
            })}
        </h1>
    )
}

export default LettersAnimation