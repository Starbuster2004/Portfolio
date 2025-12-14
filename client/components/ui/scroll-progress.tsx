"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    })

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
            style={{
                scaleX,
                background: "linear-gradient(90deg, #A5B4FC, #818CF8, #6366F1, #4F46E5)",
            }}
        />
    )
}
