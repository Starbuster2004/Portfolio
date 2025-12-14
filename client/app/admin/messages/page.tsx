"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Loader2, Mail, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Contact {
    _id: string
    name: string
    email: string
    message: string
    createdAt: string
}

export default function MessagesManager() {
    const [messages, setMessages] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("admin_token")
            // Use Next.js proxy
            const API_URL = "/api"
            const res = await fetch(`${API_URL}/contact`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (data.data?.items) {
                setMessages(data.data.items)
            } else if (Array.isArray(data.data)) {
                setMessages(data.data)
            }
        } catch (error) {
            toast.error("Failed to load messages")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return

        try {
            const token = localStorage.getItem("admin_token")
            // Use Next.js proxy
            const API_URL = "/api"

            const res = await fetch(`${API_URL}/contact/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) throw new Error("Failed to delete")

            setMessages(messages.filter(m => m._id !== id))
            toast.success("Message deleted")
        } catch (error) {
            toast.error("Failed to delete message")
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Messages</h1>
                <p className="text-zinc-500 dark:text-zinc-400">View and manage contact form submissions.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-6"
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                {msg.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-zinc-900 dark:text-white">{msg.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                    <Mail className="w-3 h-3" />
                                                    <a href={`mailto:${msg.email}`} className="hover:text-blue-500 transition-colors">
                                                        {msg.email}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                                        {msg.message}
                                    </div>
                                </div>

                                <div className="flex md:flex-col justify-end gap-2">
                                    <button
                                        onClick={() => handleDelete(msg._id)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {messages.length === 0 && (
                        <div className="text-center py-12 text-zinc-500">
                            No messages found.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
