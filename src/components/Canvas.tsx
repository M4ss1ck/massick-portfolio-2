// adapted from https://github.com/Egrodo/noahyamamoto.com.old/blob/master/src/components/Canvas.js
"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"

/* Mouse trail adapted from a jQuery Codepen by Bryan C https://codepen.io/bryjch/pen/QEoXwA */

class Letter {
  x: number
  y: number
  char: string
  lifetime: number
  constructor(x: number, y: number, char: string) {
    this.x = x
    this.y = y
    this.char = char
    this.lifetime = 0
  }
}

function Canvas({ r = 4, g = 158, b = 42, text = "m4ss1ck" }) {
  const [{ cHeight, cWidth }, setSize] = useState({ cHeight: 0, cWidth: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chars = text + " "
  const charIndex = useRef(0)
  const lastX = useRef(0)

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

      const letters: Letter[] = []

      const addLetter = (x: number, y: number) => {
        const direction = x > lastX.current ? 1 : -1
        charIndex.current = (charIndex.current + direction + chars.length) % chars.length
        const char = chars[charIndex.current]
        const letter = new Letter(x, y, char)
        letters.push(letter)
        lastX.current = x
      }

      const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        addLetter(clientX - rect.left, clientY - rect.top)
      }

      document.addEventListener("mousemove", handleMouseMove, false)

      const animateLetters = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        const duration = (6 * (1 * 1000)) / 60 // Last longer now

        for (let i = 0; i < letters.length; ++i) {
          const letter = letters[i]
          letter.lifetime += 1

          if (letter.lifetime > duration) {
            // If the letter dies, remove it.
            letters.shift()
          } else {
            // Otherwise animate it:
            const lifePercent = letter.lifetime / duration
            const fallRate = 2 * lifePercent

            ctx.font = "20px monospace"
            ctx.fillStyle = `rgb(${r},${g},${b})`
            ctx.fillText(letter.char, letter.x, letter.y + fallRate * letter.lifetime)
          }
        }
        requestAnimationFrame(animateLetters)
      }

      animateLetters()

      return () => {
        document.removeEventListener("mousemove", handleMouseMove, false)
      }
    }
  }, [r, g, b, chars])

  useEffect(() => {
    // Set height and width on load because if set in state body isn't defined yet.
    setSize({
      cHeight: window.innerHeight,
      cWidth: document.body.clientWidth,
    })

    const handleResize = () => {
      setSize({
        cHeight: window.innerHeight,
        cWidth: document.body.clientWidth,
      })
    }

    window.addEventListener("resize", handleResize, false)

    // If the device supports cursors, start animation.
    if (matchMedia("(pointer:fine)").matches) {
      startAnimation()
    }

    return () => {
      window.removeEventListener("resize", handleResize, false)
    }
  }, [startAnimation])

  return (
    <canvas
      ref={canvasRef}
      width={cWidth}
      height={cHeight}
      style={{ zIndex: -1 }}
    />
  )
}

export default Canvas
