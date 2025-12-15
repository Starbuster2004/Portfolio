"use client"

import { motion } from "framer-motion"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CursorEffect } from "@/components/cursor-effect"
import type { Blog } from "@/lib/data"

interface BlogPageClientProps {
    blogs: Blog[];
}

/**
 * Blog Page Client Component
 * 
 * Handles animations and interactivity for the blog listing.
 * Data is pre-fetched by the parent server component.
 */
export function BlogPageClient({ blogs }: BlogPageClientProps) {
    return (
        <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 selection:bg-blue-200 dark:selection:bg-blue-900 selection:text-zinc-900 dark:selection:text-white overflow-x-hidden cursor-none transition-colors duration-700">
            <CursorEffect />
            <Navbar />

            <section className="pt-32 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
                            Thoughts & Insights
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Exploring the frontiers of AI, engineering, and digital experiences.
                        </p>
                    </motion.div>

                    {blogs.length === 0 ? (
                        <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
                            <p className="text-lg">No blog posts yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog, i) => (
                                <motion.article
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                                >
                                    {blog.image && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(blog.createdAt || blog.date || Date.now()).toLocaleDateString()}
                                            </div>
                                            {blog.author && (
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {blog.author}
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {blog.title}
                                        </h2>

                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow">
                                            {blog.summary || blog.content?.substring(0, 150) + '...'}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="flex gap-2">
                                                {blog.tags.slice(0, 2).map((tag, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                                                Read More <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer footerData={null} />
        </main>
    )
}
