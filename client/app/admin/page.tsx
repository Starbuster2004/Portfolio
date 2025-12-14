"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FolderKanban, FileText, MessageSquare, Brain } from "lucide-react"
import { toast } from "sonner"

interface Stats {
    projects: number
    blogs: number
    messages: number
    skills: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ projects: 0, blogs: 0, messages: 0, skills: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("admin_token")
                const headers = { Authorization: `Bearer ${token}` }
                // Use Next.js proxy
                const API_URL = "/api"

                const [projectsRes, blogsRes, messagesRes, heroRes] = await Promise.all([
                    fetch(`${API_URL}/projects`, { headers }),
                    fetch(`${API_URL}/blogs`, { headers }),
                    fetch(`${API_URL}/contact`, { headers }),
                    fetch(`${API_URL}/hero`, { headers }),
                ])

                const projects = await projectsRes.json()
                const blogs = await blogsRes.json()
                const messages = await messagesRes.json()
                const hero = await heroRes.json()

                setStats({
                    projects: projects.count || projects.data?.length || 0,
                    blogs: blogs.count || blogs.data?.length || 0,
                    messages: messages.count || messages.data?.length || 0,
                    skills: hero.data?.skills?.length || 0,
                })
            } catch (error) {
                console.error("Failed to fetch stats:", error)
                toast.error("Failed to load dashboard stats")
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const statCards = [
        {
            title: "Total Projects",
            value: stats.projects,
            icon: FolderKanban,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Published Blogs",
            value: stats.blogs,
            icon: FileText,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "Active Skills",
            value: stats.skills,
            icon: Brain,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Messages",
            value: stats.messages,
            icon: MessageSquare,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.title}</h3>
                            {loading ? (
                                <div className="h-8 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                            ) : (
                                <p className="text-3xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
