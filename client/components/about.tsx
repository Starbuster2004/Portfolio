"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
    const y = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);

    const [aboutData, setAboutData] = useState({
        title: "// About Me",
        subtitle: "I build intelligent systems that bridge the gap between data and human experience.",
        description: "As an AI Engineer and Data Scientist, I interpret complex datasets to solve real-world problems. My passion lies in creating machine learning models that are not just accurate, but also interpretable and actionable.\n\nWith a strong foundation in both software engineering and statistical modeling, I approach every project with a holistic view—ensuring that the backend logic is as robust as the frontend is intuitive.\n\nI'm constantly exploring the bleeding edge of AI, from Large Language Models to Computer Vision. I believe the best solutions come from a deep understanding of the problem space combined with the right technological tools.\n\nWhen I'm not coding, you can find me analyzing market trends, contributing to open-source projects, or exploring the latest developments in generative AI.",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use Next.js proxy - hides backend URL from browser
                const res = await fetch("/api/hero");
                if (!res.ok) throw new Error("Failed to fetch");
                const response = await res.json();
                const data = response.data;

                if (data) {
                    setAboutData({
                        title: data.aboutTitle || "// About Me",
                        subtitle: data.aboutSubtitle || "I build intelligent systems that bridge the gap between data and human experience.",
                        description: data.aboutDescription || "As an AI Engineer and Data Scientist, I interpret complex datasets to solve real-world problems. My passion lies in creating machine learning models that are not just accurate, but also interpretable and actionable.\n\nWith a strong foundation in both software engineering and statistical modeling, I approach every project with a holistic view—ensuring that the backend logic is as robust as the frontend is intuitive.\n\nI'm constantly exploring the bleeding edge of AI, from Large Language Models to Computer Vision. I believe the best solutions come from a deep understanding of the problem space combined with the right technological tools.\n\nWhen I'm not coding, you can find me analyzing market trends, contributing to open-source projects, or exploring the latest developments in generative AI."
                    });
                }
            } catch {
                // Silently fail - component will show default data
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <section ref={containerRef} className="py-32 px-4 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/5 blur-[150px] rounded-full -translate-y-1/2" />
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                {loading ? (
                    <div className="py-32 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-3 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-zinc-500 font-mono">Loading...</span>
                    </div>
                ) : (
                    <motion.div style={{ opacity, y }} className="space-y-8">
                        <motion.div
                            className="flex items-center gap-2 px-4 py-2 w-fit rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8] text-xs font-mono tracking-wider"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <motion.span
                                className="w-2 h-2 rounded-full bg-[#6366F1]"
                                animate={{
                                    opacity: [1, 0.5, 1],
                                    boxShadow: [
                                        "0 0 0 0 rgba(99, 102, 241, 0.4)",
                                        "0 0 0 8px rgba(99, 102, 241, 0)",
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            {aboutData.title}
                        </motion.div>

                        <h3 className="text-3xl md:text-5xl font-bold leading-tight text-zinc-900 dark:text-white text-left">
                            {aboutData.subtitle}
                        </h3>

                        <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap text-left">
                            {aboutData.description}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
