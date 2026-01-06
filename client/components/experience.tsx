"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import type { Experience as ExperienceType } from "@/lib/data";

interface ExperienceProps {
    experiences: ExperienceType[];
}

// Color palette for experiences (cycles through)
const colorPalette = [
    { gradient: "from-[#818CF8] to-[#6366F1]", dotColor: "#818CF8" },
    { gradient: "from-[#6366F1] to-[#4F46E5]", dotColor: "#6366F1" },
    { gradient: "from-[#4F46E5] to-[#4338CA]", dotColor: "#4F46E5" },
    { gradient: "from-[#A5B4FC] to-[#818CF8]", dotColor: "#A5B4FC" },
];

// Fallback experiences used when no data is provided
const fallbackExperiences: ExperienceType[] = [
    {
        _id: "1",
        company: "Your Company",
        role: "Your Role",
        period: "2023 - Present",
        description: "Add your experience from the admin panel.",
        tags: ["Add", "Your", "Skills"],
        order: 0,
    },
];

/**
 * Experience Section Component
 * 
 * This component receives experiences as props from the parent server component.
 * No client-side fetching - data is pre-rendered at build time via ISR.
 */
export function Experience({ experiences }: ExperienceProps) {
    // Use provided experiences or fallback
    const displayExperiences = experiences.length > 0 ? experiences : fallbackExperiences;

    return (
        <section id="experience" className="py-32 px-4 bg-white dark:bg-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#6366F1]/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#4F46E5]/5 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <motion.span
                        className="inline-block px-4 py-2 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8] text-sm font-mono mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        •// Career Journey
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
                        Professional Experience
                    </h2>
                </motion.div>

                {/* Timeline container */}
                <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#818CF8] via-[#6366F1] to-[#4F46E5] md:-translate-x-px" />

                    {displayExperiences.map((exp, index) => {
                        const colors = colorPalette[index % colorPalette.length];

                        return (
                            <motion.div
                                key={exp._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                className={`relative flex items-start gap-8 mb-16 last:mb-0 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                                    <motion.div
                                        className="w-4 h-4 rounded-full border-4 border-white dark:border-black"
                                        style={{ backgroundColor: colors.dotColor }}
                                        whileHover={{ scale: 1.5 }}
                                        animate={{
                                            boxShadow: [
                                                `0 0 0 0 ${colors.dotColor}40`,
                                                `0 0 0 10px ${colors.dotColor}00`,
                                            ],
                                        }}
                                        transition={{
                                            boxShadow: { duration: 2, repeat: Infinity },
                                        }}
                                    />
                                </div>

                                {/* Content card */}
                                <div className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="relative overflow-hidden rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl group"
                                    >
                                        {/* Glowing Effect */}
                                        <GlowingEffect
                                            spread={40}
                                            glow={true}
                                            disabled={false}
                                            proximity={64}
                                            inactiveZone={0.01}
                                            borderWidth={8}
                                        />

                                        {/* Gradient overlay on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3 font-mono">
                                                <Calendar className="w-4 h-4" />
                                                {exp.period}
                                            </div>

                                            <h3
                                                className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white group-hover:text-[#6366F1] dark:group-hover:text-[#818CF8] transition-colors"
                                            >
                                                {exp.role}
                                            </h3>

                                            <div className="flex items-center gap-2 mb-4">
                                                <Briefcase className="w-4 h-4 text-zinc-400" />
                                                <span className="font-medium text-zinc-700 dark:text-zinc-300">{exp.company}</span>
                                            </div>

                                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                                {exp.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {exp.tags.map((tag, tIndex) => (
                                                    <motion.span
                                                        key={tIndex}
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-default"
                                                    >
                                                        {tag}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
