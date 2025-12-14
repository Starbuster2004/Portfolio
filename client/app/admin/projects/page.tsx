"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Edit2, Loader2, ExternalLink, Github, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Project {
    _id: string
    title: string
    description: string
    technologies: string[]
    link?: string
    githubUrl?: string
    category: "project" | "internship" | "job"
    featured: boolean
    image?: string
}

export default function ProjectsManager() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            // Use Next.js proxy for all API calls
            const API_URL = "/api"
            const res = await fetch(`${API_URL}/projects`)
            const data = await res.json()
            if (data.data) {
                setProjects(data.data)
            }
        } catch (error) {
            toast.error("Failed to load projects")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return

        try {
            const token = localStorage.getItem("admin_token")
            // Use Next.js proxy for all API calls
            const API_URL = "/api"

            const res = await fetch(`${API_URL}/projects/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) throw new Error("Failed to delete")

            setProjects(projects.filter(p => p._id !== id))
            toast.success("Project deleted")
        } catch (error) {
            toast.error("Failed to delete project")
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Projects</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage your portfolio projects and work experience.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProject(null)
                        setIsDialogOpen(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    Add Project
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {projects.map((project) => (
                            <motion.div
                                key={project._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col"
                            >
                                <div className="aspect-video bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden">
                                    {project.image ? (
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingProject(project)
                                                setIsDialogOpen(true)
                                            }}
                                            className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur rounded-lg hover:text-blue-500 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur rounded-lg hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 capitalize">
                                            {project.category}
                                        </span>
                                        <div className="flex gap-2">
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{project.title}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-4 flex-1">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="text-xs text-zinc-500 font-mono">
                                                #{tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span className="text-xs text-zinc-500 font-mono">+{project.technologies.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <ProjectDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                project={editingProject}
                onSave={() => {
                    setIsDialogOpen(false)
                    fetchProjects()
                }}
            />
        </div>
    )
}

function ProjectDialog({ isOpen, onClose, project, onSave }: { isOpen: boolean; onClose: () => void; project: Project | null; onSave: () => void }) {
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        technologies: "",
        category: "project",
        link: "",
        githubUrl: "",
        featured: false
    })

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                technologies: project.technologies.join(", "),
                category: project.category,
                link: project.link || "",
                githubUrl: project.githubUrl || "",
                featured: project.featured
            })
            setPreviewUrl(project.image || "")
        } else {
            setFormData({
                title: "",
                description: "",
                technologies: "",
                category: "project",
                link: "",
                githubUrl: "",
                featured: false
            })
            setPreviewUrl("")
        }
        setImageFile(null)
    }, [project, isOpen])

    if (!isOpen) return null

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = localStorage.getItem("admin_token")
            // Use Next.js proxy for all API calls
            const API_URL = "/api"

            const data = new FormData()
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("category", formData.category)
            data.append("featured", String(formData.featured))

            // Handle technologies array
            const techs = formData.technologies.split(",").map(t => t.trim()).filter(Boolean)
            techs.forEach(t => data.append("technologies[]", t)) // Append individually or as JSON string depending on backend
            // Actually, backend Zod schema expects array or string. Multer might flatten. 
            // Safest is to send as comma-separated string if backend handles it, or append multiple times.
            // Looking at backend: "technologies: z.union([z.array(z.string()), z.string().transform(...)])"
            // So sending as comma-separated string is fine and handled by Zod transform.
            data.append("technologies", formData.technologies)

            if (formData.link) data.append("link", formData.link)
            if (formData.githubUrl) data.append("githubUrl", formData.githubUrl)
            if (imageFile) data.append("image", imageFile)

            const url = project ? `${API_URL}/projects/${project._id}` : `${API_URL}/projects`
            const method = project ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Content-Type header must be undefined for FormData to set boundary
                },
                body: data,
            })

            if (!res.ok) throw new Error("Failed to save")

            toast.success(project ? "Project updated" : "Project created")
            onSave()
        } catch (error) {
            console.error(error)
            toast.error("Failed to save project")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {project ? "Edit Project" : "New Project"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                        <ExternalLink className="w-4 h-4 rotate-45" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Image</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="flex-1 text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                            <label className="text-sm font-medium">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                            >
                                <option value="project">Project</option>
                                <option value="internship">Internship</option>
                                <option value="job">Job</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Technologies (comma separated)</label>
                        <input
                            required
                            value={formData.technologies}
                            onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                            placeholder="React, Node.js, TypeScript"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Project Link</label>
                            <input
                                value={formData.link}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">GitHub URL</label>
                            <input
                                value={formData.githubUrl}
                                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                            className="rounded border-zinc-300"
                        />
                        <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
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
                            {loading ? "Saving..." : "Save Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
