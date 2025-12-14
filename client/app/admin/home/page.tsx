"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Save, Github, Linkedin, Twitter, Globe, Mail } from "lucide-react"

export default function AdminHome() {
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        heroTitle: "",
        heroSubtitle: "",
        aboutTitle: "// About Me",
        aboutSubtitle: "",
        aboutDescription: "",
        skills: [],
        footerText: "© 2024",
        email: "",
        socialLinks: {
            github: "",
            linkedin: "",
            twitter: "",
            website: "",
        },
    })

    useEffect(() => {
        fetchHomeData()
    }, [])

    const fetchHomeData = async () => {
        try {
            // Use Next.js proxy
            const API_URL = "/api"
            const res = await fetch(`${API_URL}/hero`)
            const response = await res.json()
            const data = response.data

            if (data) {
                setFormData({
                    heroTitle: data.heroTitle || "",
                    heroSubtitle: data.heroSubtitle || "",
                    aboutTitle: data.aboutTitle || "// About Me",
                    aboutSubtitle: data.aboutSubtitle || "",
                    aboutDescription: data.aboutDescription || "",
                    skills: data.skills || [],
                    footerText: data.footerText || "",
                    email: data.email || "",
                    socialLinks: data.socialLinks || {
                        github: "",
                        linkedin: "",
                        twitter: "",
                        website: "",
                    },
                })
            }
        } catch (error) {
            console.error("Failed to fetch home data:", error)
            toast.error("Failed to load home data")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

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
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Server Error:", errorData);
                throw new Error(errorData.message || "Failed to update");
            }

            toast.success("Home page updated successfully")
        } catch (error) {
            console.error("Failed to update home data:", error)
            toast.error("Failed to update home data")
        } finally {
            setLoading(false)
        }
    }

    const updateSocialLink = (key: string, value: string) => {
        setFormData({
            ...formData,
            socialLinks: {
                ...formData.socialLinks,
                [key]: value,
            },
        })
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Home Page Content</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Manage the content for your Hero, About, and Contact sections</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2 dark:border-zinc-800">Hero Section</h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hero Title</label>
                        <input
                            type="text"
                            value={formData.heroTitle}
                            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hero Subtitle</label>
                        <input
                            type="text"
                            value={formData.heroSubtitle}
                            onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2 dark:border-zinc-800">About Section</h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Section Title (Small)</label>
                        <input
                            type="text"
                            value={formData.aboutTitle}
                            onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Main Headline</label>
                        <input
                            type="text"
                            value={formData.aboutSubtitle}
                            onChange={(e) => setFormData({ ...formData, aboutSubtitle: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Markdown supported)</label>
                        <textarea
                            rows={8}
                            value={formData.aboutDescription}
                            onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2 dark:border-zinc-800">Contact & Social Links</h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Github className="w-4 h-4" /> GitHub URL
                            </label>
                            <input
                                type="url"
                                value={formData.socialLinks.github}
                                onChange={(e) => updateSocialLink("github", e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://github.com/username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Linkedin className="w-4 h-4" /> LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin}
                                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Twitter className="w-4 h-4" /> Twitter URL
                            </label>
                            <input
                                type="url"
                                value={formData.socialLinks.twitter}
                                onChange={(e) => updateSocialLink("twitter", e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://twitter.com/username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Globe className="w-4 h-4" /> Website URL
                            </label>
                            <input
                                type="url"
                                value={formData.socialLinks.website}
                                onChange={(e) => updateSocialLink("website", e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2 dark:border-zinc-800">Footer</h2>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Footer Text</label>
                        <input
                            type="text"
                            value={formData.footerText}
                            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
                >
                    <Save className="w-5 h-5" />
                    Save Changes
                </button>
            </form>
        </div>
    )
}
