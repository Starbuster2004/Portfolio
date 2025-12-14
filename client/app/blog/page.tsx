"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CursorEffect } from "@/components/cursor-effect"

interface Blog {
    _id: string
    title: string
    content: string
    author: string
    tags: string[]
    createdAt: string
    image?: string
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
                const res = await fetch(`${API_URL}/blogs`)
                const data = await res.json()
                if (data.data) {
                    setBlogs(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch blogs", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBlogs()
    }, [])

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

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-96 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                            ))}
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
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {blog.author}
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {blog.title}
                                        </h2>

                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow">
                                            {blog.content}
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
            <Footer />
        </main>
    )
}
