"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    magneticStrength?: number
    as?: "button" | "a"
    href?: string
    target?: string
}

export function MagneticButton({
    children,
    className = "",
    onClick,
    magneticStrength = 0.3,
    as = "button",
    href,
    target,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springConfig = { damping: 15, stiffness: 150 }
    const xSpring = useSpring(x, springConfig)
    const ySpring = useSpring(y, springConfig)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const deltaX = (e.clientX - centerX) * magneticStrength
        const deltaY = (e.clientY - centerY) * magneticStrength

        x.set(deltaX)
        y.set(deltaY)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }

    const Component = as === "a" ? motion.a : motion.button

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
        >
            <Component
                href={href}
                target={target}
                onClick={onClick}
                style={{ x: xSpring, y: ySpring }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300",
                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500 before:via-blue-500 before:to-purple-500 before:opacity-0 before:transition-opacity before:duration-300",
                    isHovered && "before:opacity-100",
                    className
                )}
            >
                <span className="relative z-10 flex items-center gap-2">{children}</span>
            </Component>
        </motion.div>
    )
}

// Spotlight button with radial gradient that follows cursor
export function SpotlightButton({
    children,
    className = "",
    onClick,
}: {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}) {
    const ref = useRef<HTMLButtonElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative overflow-hidden rounded-full px-8 py-4 font-medium transition-all duration-300",
                "bg-zinc-900 dark:bg-white text-white dark:text-black",
                "border border-zinc-800 dark:border-zinc-200",
                className
            )}
        >
            {/* Spotlight effect */}
            <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{
                    background: isHovered
                        ? `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(0, 255, 224, 0.3) 0%, transparent 60%)`
                        : "transparent",
                }}
                transition={{ duration: 0.15 }}
            />

            {/* Animated border gradient */}
            <motion.div
                className="absolute inset-0 rounded-full opacity-0"
                animate={{ opacity: isHovered ? 1 : 0 }}
                style={{
                    background: "linear-gradient(90deg, #00FFE0, #00D9FF, #0066FF, #00FFE0)",
                    backgroundSize: "300% 100%",
                    padding: "2px",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                }}
            />

            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    )
}
