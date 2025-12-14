"use client"

import { motion } from "framer-motion"

interface SplitTextProps {
    text: string
    className?: string
    delay?: number
    duration?: number
    staggerChildren?: number
    once?: boolean
}

export function SplitText({
    text,
    className = "",
    delay = 0,
    duration = 0.5,
    staggerChildren = 0.03,
    once = true,
}: SplitTextProps) {
    const words = text.split(" ")

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: {
                staggerChildren: staggerChildren,
                delayChildren: delay,
            },
        }),
    }

    const child = {
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: -90,
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
                duration: duration,
            },
        },
    }

    return (
        <motion.span
            className={`inline-flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: "-50px" }}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    className="inline-block mr-[0.25em] overflow-hidden"
                    style={{ perspective: "1000px" }}
                >
                    <motion.span
                        className="inline-block origin-bottom"
                        variants={child}
                    >
                        {word}
                    </motion.span>
                </motion.span>
            ))}
        </motion.span>
    )
}

// Character-by-character reveal
export function SplitTextChars({
    text,
    className = "",
    delay = 0,
    staggerChildren = 0.02,
    once = true,
}: SplitTextProps) {
    const chars = text.split("")

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerChildren,
                delayChildren: delay,
            },
        },
    }

    const child = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 200,
            },
        },
    }

    return (
        <motion.span
            className={className}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once }}
        >
            {chars.map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={child}
                    style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    )
}
