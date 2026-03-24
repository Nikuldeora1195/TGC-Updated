"use client"

import { useEffect, useRef } from "react"

interface HeroInteractiveBackgroundProps {
  containerClassName?: string
}

export function HeroInteractiveBackground({ containerClassName }: HeroInteractiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const setCursorPosition = (x: number, y: number) => {
      const rect = container.getBoundingClientRect()
      container.style.setProperty("--hero-cursor-x", `${x - rect.left}px`)
      container.style.setProperty("--hero-cursor-y", `${y - rect.top}px`)
    }

    const rect = container.getBoundingClientRect()
    container.style.setProperty("--hero-cursor-x", `${rect.width * 0.55}px`)
    container.style.setProperty("--hero-cursor-y", `${rect.height * 0.4}px`)

    const updateFromPointer = (event: PointerEvent) => {
      if (!container.contains(event.target as Node)) {
        return
      }

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }

      frameRef.current = window.requestAnimationFrame(() => {
        setCursorPosition(event.clientX, event.clientY)
      })
    }

    window.addEventListener("pointermove", updateFromPointer, { passive: true })
    window.addEventListener("pointerdown", updateFromPointer, { passive: true })

    return () => {
      window.removeEventListener("pointermove", updateFromPointer)
      window.removeEventListener("pointerdown", updateFromPointer)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className={containerClassName}>
      <div className="hero-cursor-bubble hero-cursor-bubble-core" />
      <div className="hero-cursor-bubble hero-cursor-bubble-ring hero-cursor-bubble-ring-a" />
      <div className="hero-cursor-bubble hero-cursor-bubble-ring hero-cursor-bubble-ring-b" />
      <div className="hero-cursor-bubble hero-cursor-bubble-ring hero-cursor-bubble-ring-c" />
    </div>
  )
}
