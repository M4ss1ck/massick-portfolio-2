"use client"
import React, { useEffect } from 'react'

const LettersAnimation = () => {
    useEffect(() => {
        const letters = document.querySelectorAll(".animateletter")
        let duration = 500
        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i]
            duration += 400
            letter.animate(
                [
                    { transform: `translateY(-100vh) scale(0,0)` },
                    { transform: `translateY(0) scale(1,1)` },
                ],
                { duration: duration, iterations: 1, easing: "ease-in-out" }
            )
        }
    }, [])
    return (
        <></>
    )
}

export default LettersAnimation