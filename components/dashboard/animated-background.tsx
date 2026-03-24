"use client"

import { useEffect, useRef } from "react"

const STAR_POINTS = [
  { left: "4%", delay: "0s", duration: "11s" },
  { left: "9%", delay: "1.8s", duration: "9.8s" },
  { left: "15%", delay: "3.2s", duration: "12.6s" },
  { left: "22%", delay: "0.9s", duration: "10.7s" },
  { left: "28%", delay: "2.6s", duration: "9.4s" },
  { left: "34%", delay: "4.1s", duration: "11.9s" },
  { left: "41%", delay: "1.1s", duration: "10.1s" },
  { left: "48%", delay: "3.8s", duration: "12.2s" },
  { left: "54%", delay: "0.5s", duration: "9.9s" },
  { left: "61%", delay: "2.1s", duration: "11.4s" },
  { left: "68%", delay: "4.5s", duration: "10.4s" },
  { left: "74%", delay: "1.5s", duration: "12.1s" },
  { left: "81%", delay: "3s", duration: "9.6s" },
  { left: "88%", delay: "0.7s", duration: "11.1s" },
  { left: "94%", delay: "2.9s", duration: "10.8s" },
]

export function DashboardAnimatedBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const setCursorPosition = (x: number, y: number) => {
      container.style.setProperty("--dashboard-cursor-x", `${x}px`)
      container.style.setProperty("--dashboard-cursor-y", `${y}px`)
    }

    const setDefaultPosition = () => {
      const rect = container.getBoundingClientRect()
      setCursorPosition(rect.width * 0.6, rect.height * 0.35)
    }

    setDefaultPosition()

    const updateFromPointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (!isInside) {
        return
      }

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }

      frameRef.current = window.requestAnimationFrame(() => {
        setCursorPosition(event.clientX - rect.left, event.clientY - rect.top)
      })
    }

    window.addEventListener("pointermove", updateFromPointer, { passive: true })
    window.addEventListener("pointerdown", updateFromPointer, { passive: true })
    window.addEventListener("resize", setDefaultPosition)

    return () => {
      window.removeEventListener("pointermove", updateFromPointer)
      window.removeEventListener("pointerdown", updateFromPointer)
      window.removeEventListener("resize", setDefaultPosition)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="dashboard-background pointer-events-none absolute inset-0 overflow-hidden">
      <div className="dashboard-gradient-veil" />
      <div className="dashboard-gradient-veil dashboard-gradient-veil-secondary" />
      <div className="dashboard-cursor-wave" />
      <div className="dashboard-cursor-wave dashboard-cursor-wave-secondary" />

      {STAR_POINTS.map((star, index) => (
        <span
          key={`${star.left}-${index}`}
          className="dashboard-point-star"
          style={{
            left: star.left,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  )
}
