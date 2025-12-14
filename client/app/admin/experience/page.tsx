"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, Save, X, GripVertical } from "lucide-react"

interface Experience {
    _id: string
    company: string
    role: string
    period: string
    description: string
    tags: string[]
    order: number
    isActive: boolean
}

export default function AdminExperience() {
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [formData, setFormData] = useState({
        company: "",
        role: "",
        period: "",
        description: "",
        tags: "",
        isActive: true,
    })

    // Use Next.js proxy
    const API_URL = "/api"

    useEffect(() => {
        fetchExperiences()
    }, [])

    const fetchExperiences = async () => {
        try {
            const token = localStorage.getItem("admin_token")
            const res = await fetch(`${API_URL}/experiences/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.data) {
                setExperiences(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch experiences:", error)
            toast.error("Failed to load experiences")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem("admin_token")

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
            }

            const url = editingId
                ? `${API_URL}/experiences/${editingId}`
                : `${API_URL}/experiences`

            const res = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to save")

            toast.success(editingId ? "Experience updated" : "Experience added")
            resetForm()
            fetchExperiences()
        } catch (error) {
            console.error("Error saving experience:", error)
            toast.error("Failed to save experience")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this experience?")) return

        const token = localStorage.getItem("admin_token")
        try {
            const res = await fetch(`${API_URL}/experiences/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) throw new Error("Failed to delete")

            toast.success("Experience deleted")
            fetchExperiences()
        } catch (error) {
            console.error("Error deleting experience:", error)
            toast.error("Failed to delete experience")
        }
    }

    const handleEdit = (exp: Experience) => {
        setEditingId(exp._id)
        setFormData({
            company: exp.company,
            role: exp.role,
            period: exp.period,
            description: exp.description,
            tags: exp.tags.join(", "),
            isActive: exp.isActive,
        })
        setShowAddForm(true)
    }

    const resetForm = () => {
        setEditingId(null)
        setShowAddForm(false)
        setFormData({
            company: "",
            role: "",
            period: "",
            description: "",
            tags: "",
            isActive: true,
        })
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Experience</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage your work experience and career history</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Experience
                </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">{editingId ? "Edit Experience" : "Add New Experience"}</h2>
                        <button type="button" onClick={resetForm} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company</label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Company Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role / Position</label>
                            <input
                                type="text"
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Senior Engineer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Period</label>
                        <input
                            type="text"
                            required
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="2020 - Present"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Describe your responsibilities and achievements..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Python, PyTorch, FastAPI"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 rounded"
                        />
                        <label htmlFor="isActive" className="text-sm">Active (visible on website)</label>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {editingId ? "Update" : "Create"}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Experience List */}
            <div className="space-y-4">
                {experiences.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        No experiences yet. Add your first work experience!
                    </div>
                ) : (
                    experiences.map((exp) => (
                        <div
                            key={exp._id}
                            className={`bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 ${!exp.isActive ? 'opacity-50' : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 text-zinc-400 cursor-grab">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{exp.role}</h3>
                                        {!exp.isActive && (
                                            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">Hidden</span>
                                        )}
                                    </div>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">{exp.company}</p>
                                    <p className="text-sm text-zinc-500 mb-2">{exp.period}</p>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">{exp.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {exp.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(exp)}
                                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-indigo-600"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp._id)}
                                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
