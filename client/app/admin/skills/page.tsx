"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Save, Loader2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface Skill {
    name: string
    icon: string
}

export default function SkillsManager() {
    const [skills, setSkills] = useState<Skill[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [newSkill, setNewSkill] = useState({ name: "", icon: "" })

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        try {
            // Use Next.js proxy
            const API_URL = "/api"
            const res = await fetch(`${API_URL}/hero`)
            const data = await res.json()
            if (data.data?.skills) {
                setSkills(data.data.skills)
            }
        } catch (error) {
            toast.error("Failed to load skills")
        } finally {
            setLoading(false)
        }
    }

    const handleAddSkill = () => {
        if (!newSkill.name || !newSkill.icon) {
            toast.error("Please fill in both name and icon URL")
            return
        }
        setSkills([...skills, newSkill])
        setNewSkill({ name: "", icon: "" })
    }

    const handleRemoveSkill = (index: number) => {
        const newSkills = [...skills]
        newSkills.splice(index, 1)
        setSkills(newSkills)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem("admin_token")
            // Use Next.js proxy
            const API_URL = "/api"

            const res = await fetch(`${API_URL}/hero`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ skills }),
            })

            if (!res.ok) throw new Error("Failed to save")

            toast.success("Skills updated successfully")
        } catch (error) {
            toast.error("Failed to save changes")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Skills Management</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage the skills displayed in the 3D sphere.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Skill */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 sticky top-8">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Add New Skill</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">
                                    Skill Name
                                </label>
                                <input
                                    type="text"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. React"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">
                                    Icon
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return

                                            const formData = new FormData()
                                            formData.append("icon", file)

                                            try {
                                                const token = localStorage.getItem("admin_token")
                                                // Use Next.js proxy
                                                const API_URL = "/api"

                                                toast.info("Uploading icon...")
                                                const res = await fetch(`${API_URL}/hero/skills/icon`, {
                                                    method: "POST",
                                                    headers: { Authorization: `Bearer ${token}` },
                                                    body: formData,
                                                })

                                                if (!res.ok) throw new Error("Upload failed")

                                                const data = await res.json()
                                                setNewSkill({ ...newSkill, icon: data.data.iconUrl })
                                                toast.success("Icon uploaded")
                                            } catch (error) {
                                                toast.error("Failed to upload icon")
                                            }
                                        }}
                                        className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                                        <span className="text-xs text-zinc-400">OR URL</span>
                                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                                    </div>
                                    <input
                                        type="text"
                                        value={newSkill.icon}
                                        onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                                {newSkill.icon && (
                                    <div className="mt-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex justify-center">
                                        <img src={newSkill.icon} alt="Preview" className="h-12 w-12 object-contain" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleAddSkill}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add to List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Skills List */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={`${skill.name}-${index}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                                className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 group"
                            >
                                <div className="w-10 h-10 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                                    <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-zinc-900 dark:text-white">{skill.name}</h3>
                                    <a href={skill.icon} target="_blank" rel="noreferrer" className="text-xs text-zinc-500 hover:text-blue-500 flex items-center gap-1">
                                        {skill.icon.substring(0, 40)}... <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <button
                                    onClick={() => handleRemoveSkill(index)}
                                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {skills.length === 0 && (
                        <div className="text-center py-12 text-zinc-500">
                            No skills added yet. Add one to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
