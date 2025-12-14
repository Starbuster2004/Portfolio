"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Edit2, Loader2, ExternalLink, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface Blog {
    _id: string
    title: string
    summary: string
    content: string
    tags: string[]
    image?: string
    createdAt: string
}

export default function BlogsManager() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null)

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        try {
            // Use Next.js proxy
            const API_URL = "/api"
            const res = await fetch(`${API_URL}/blogs`)
            const data = await res.json()
            if (data.data) {
                setBlogs(data.data)
            }
        } catch (error) {
            toast.error("Failed to load blogs")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog?")) return

        try {
            const token = localStorage.getItem("admin_token")
            // Use Next.js proxy
            const API_URL = "/api"

            const res = await fetch(`${API_URL}/blogs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) throw new Error("Failed to delete")

            setBlogs(blogs.filter(b => b._id !== id))
            toast.success("Blog deleted")
        } catch (error) {
            toast.error("Failed to delete blog")
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Blogs</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage your blog posts and articles.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingBlog(null)
                        setIsDialogOpen(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    Add Blog
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {blogs.map((blog) => (
                            <motion.div
                                key={blog._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col"
                            >
                                <div className="aspect-video bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden">
                                    {blog.image ? (
                                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingBlog(blog)
                                                setIsDialogOpen(true)
                                            }}
                                            className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur rounded-lg hover:text-blue-500 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur rounded-lg hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{blog.title}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-4 flex-1">
                                        {blog.summary}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="px-2 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <BlogDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                blog={editingBlog}
                onSave={() => {
                    setIsDialogOpen(false)
                    fetchBlogs()
                }}
            />
        </div>
    )
}

function BlogDialog({ isOpen, onClose, blog, onSave }: { isOpen: boolean; onClose: () => void; blog: Blog | null; onSave: () => void }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        content: "",
        tags: "",
    })

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title,
                summary: blog.summary,
                content: blog.content,
                tags: blog.tags.join(", "),
            })
        } else {
            setFormData({
                title: "",
                summary: "",
                content: "",
                tags: "",
            })
        }
    }, [blog, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = localStorage.getItem("admin_token")
            // Use Next.js proxy
            const API_URL = "/api"

            const payload = {
                ...formData,
                tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
            }

            const url = blog ? `${API_URL}/blogs/${blog._id}` : `${API_URL}/blogs`
            const method = blog ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to save")

            toast.success(blog ? "Blog updated" : "Blog created")
            onSave()
        } catch (error) {
            toast.error("Failed to save blog")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {blog ? "Edit Blog" : "New Blog"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                        <ExternalLink className="w-4 h-4 rotate-45" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <input
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Summary</label>
                        <textarea
                            required
                            rows={2}
                            value={formData.summary}
                            onChange={e => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Content</label>
                        <textarea
                            required
                            rows={8}
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-sm"
                            placeholder="Markdown content..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags (comma separated)</label>
                        <input
                            required
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                            placeholder="Tech, AI, Tutorial"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Blog"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
