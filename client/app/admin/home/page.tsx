"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Save, Github, Linkedin, Twitter, Globe, Mail, FileUp, FileText, Trash2, Loader2 } from "lucide-react"

export default function AdminHome() {
    const [loading, setLoading] = useState(true)
    const [resumeUrl, setResumeUrl] = useState<string>("")
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
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
                setResumeUrl(data.resumeUrl || "")
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

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file")
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB")
            return
        }

        setUploading(true)
        try {
            const token = localStorage.getItem("admin_token")
            const API_URL = "/api"

            const formData = new FormData()
            formData.append("resume", file)

            const res = await fetch(`${API_URL}/hero/resume`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to upload resume")
            }

            const data = await res.json()
            setResumeUrl(data.data?.resumeUrl || "")
            toast.success("Resume uploaded successfully!")

            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        } catch (error) {
            console.error("Failed to upload resume:", error)
            toast.error("Failed to upload resume")
        } finally {
            setUploading(false)
        }
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

                {/* Resume Upload Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2 dark:border-zinc-800">Resume</h2>

                    <div className="space-y-4">
                        {/* Current Resume Display */}
                        {resumeUrl && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                                <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                                    <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-emerald-900 dark:text-emerald-100">Resume Uploaded</p>
                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                                    >
                                        View Current Resume →
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Upload New Resume */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <FileUp className="w-4 h-4" /> Upload Resume (PDF)
                            </label>
                            <div className="relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleResumeUpload}
                                    disabled={uploading}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                                        ${uploading
                                            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'
                                        }`}
                                >
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Uploading...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-zinc-500 dark:text-zinc-400">
                                            <FileUp className="w-10 h-10" />
                                            <div className="text-center">
                                                <span className="text-sm font-medium">Click to upload</span>
                                                <p className="text-xs mt-1">PDF files only, max 5MB</p>
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                This resume will be available for download on your portfolio&apos;s hero section.
                            </p>
                        </div>
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
