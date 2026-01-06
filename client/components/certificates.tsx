"use client"

import { motion } from "framer-motion"
import { Award } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import type { Certificate } from "@/lib/data"

interface CertificatesProps {
    certificates: Certificate[];
}

/**
 * Certificates Section Component
 * 
 * This component receives certificates as props from the parent server component.
 * No client-side fetching - data is pre-rendered at build time via ISR.
 */
export function Certificates({ certificates }: CertificatesProps) {
    // Certificates are pre-fetched - fallback handled in lib/data.ts

    return (
        <section className="py-32 px-4 bg-zinc-50 dark:bg-black transition-colors duration-700">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 flex flex-col gap-4"
                >
                    <motion.span
                        className="inline-block px-4 py-2 w-fit rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8] text-sm font-mono"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {"•// Credentials"}
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white">Certifications</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert, i) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative"
                        >
                            {/* Glowing Shadow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] rounded-2xl blur opacity-20 group-hover:opacity-75 transition duration-500 group-hover:duration-200" />

                            <div className="relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden h-full">
                                {/* Glowing Effect */}
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={8}
                                />
                                <div className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-[#6366F1] dark:group-hover:text-[#818CF8] transition-colors">
                                        {cert.title}
                                    </h3>
                                    <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                                        <span className="font-mono">{cert.serialId}</span>
                                        <Award className="w-4 h-4 text-[#6366F1]" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
