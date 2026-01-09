"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CursorEffect() {
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Use motion values with springs for smooth animation
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  // Smoother spring config
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const dotSpringConfig = { damping: 35, stiffness: 800, mass: 0.3 }

  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  const dotXSpring = useSpring(cursorX, dotSpringConfig)
  const dotYSpring = useSpring(cursorY, dotSpringConfig)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)

    const target = e.target as HTMLElement
    const computedStyle = window.getComputedStyle(target)
    setIsPointer(
      computedStyle.cursor === "pointer" ||
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.closest("a") !== null ||
      target.closest("button") !== null
    )
  }, [cursorX, cursorY])

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter])

  return (
    <>
      {/* Main Cursor Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#6366F1]/50 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
          borderColor: isPointer ? "rgba(255, 255, 255, 0.8)" : "rgba(99, 102, 241, 0.5)",
        }}
        transition={{
          scale: { type: "spring", stiffness: 500, damping: 28 },
          opacity: { duration: 0.15 },
          borderColor: { duration: 0.15 },
        }}
      />

      {/* Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#6366F1] pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: dotXSpring,
          y: dotYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isPointer ? 0 : 1,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { type: "spring", stiffness: 500, damping: 28 },
        }}
      />

      {/* Glow trail effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[40]"
        style={{
          background: `radial-gradient(200px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(90, 92, 240, 0.08), transparent 60%)`,
        }}
      />
    </>
  )
}
