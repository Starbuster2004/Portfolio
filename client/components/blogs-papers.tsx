"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import type { Blog } from "@/lib/data";

interface BlogsPapersProps {
    blogs: Blog[];
}

/**
 * Blogs & Papers Section Component
 * 
 * This component receives blogs as props from the parent server component.
 * No client-side fetching - data is pre-rendered at build time via ISR.
 */
export function BlogsPapers({ blogs }: BlogsPapersProps) {
    // Use provided blogs (fallback data is handled in lib/data.ts)
    const displayBlogs = blogs;

    return (
        <section id="blogs" className="py-32 px-4 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto">
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
                        {"// Insights & Research"}
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white">Blogs & Publications</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayBlogs.slice(0, 4).map((item, index) => (
                        <motion.a
                            href={item.slug ? `/blog/${item.slug}` : '#'}
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative flex flex-col justify-between p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-[#6366F1]/50 transition-colors"
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
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    {item.tags.includes("Paper") ? (
                                        <div className="p-2 rounded-lg bg-[#6366F1]/10 text-[#6366F1] dark:text-[#818CF8]">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="p-2 rounded-lg bg-[#818CF8]/10 text-[#818CF8] dark:text-[#A5B4FC]">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div className="text-sm text-zinc-500 font-mono">
                                        {new Date(item.date || item.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-[#6366F1] dark:group-hover:text-[#818CF8] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                                    {item.summary || item.content?.substring(0, 150) + '...'}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag, t) => (
                                        <span key={t} className="px-3 py-1 text-xs font-medium rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="ml-auto w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
