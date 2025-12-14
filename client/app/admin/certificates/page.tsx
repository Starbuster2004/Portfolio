"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Pencil, Trash2, X, Upload, Image as ImageIcon, Award } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Certificate {
    _id: string
    title: string
    serialId: string
    image: string
}

export default function AdminCertificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)

    useEffect(() => {
        fetchCertificates()
    }, [])

    const fetchCertificates = async () => {
        try {
            // Use Next.js proxy
            const API_URL = "/api"
            const res = await fetch(`${API_URL}/certificates`)
            const data = await res.json()
            if (data.data) {
                setCertificates(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch certificates:", error)
            toast.error("Failed to load certificates")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certificate?")) return

        try {
            const token = localStorage.getItem("admin_token")
            // Use Next.js proxy
            const API_URL = "/api"
            const res = await fetch(`${API_URL}/certificates/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) throw new Error("Failed to delete")

            setCertificates(certificates.filter((c) => c._id !== id))
            toast.success("Certificate deleted")
        } catch (error) {
            toast.error("Failed to delete certificate")
        }
    }

    const filteredCertificates = certificates.filter(
        (cert) =>
            cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.serialId.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Certificates</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage your certifications and awards</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button
                            onClick={() => setEditingCertificate(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-4 h-4" />
                            Add Certificate
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingCertificate ? "Edit Certificate" : "Add New Certificate"}</DialogTitle>
                        </DialogHeader>
                        <CertificateForm
                            certificate={editingCertificate}
                            onSuccess={() => {
                                setIsDialogOpen(false)
                                fetchCertificates()
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCertificates.map((cert) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                                <img
                                    src={cert.image}
                                    alt={cert.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDelete(cert._id)}
                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{cert.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                    <Award className="w-4 h-4" />
                                    <span>{cert.serialId}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

function CertificateForm({ certificate, onSuccess }: { certificate: Certificate | null; onSuccess: () => void }) {
    const [title, setTitle] = useState(certificate?.title || "")
    const [serialId, setSerialId] = useState(certificate?.serialId || "")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState(certificate?.image || "")
    const [loading, setLoading] = useState(false)

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
            // Use Next.js proxy
            const API_URL = "/api"

            const formData = new FormData()
            formData.append("title", title)
            formData.append("serialId", serialId)
            if (imageFile) {
                formData.append("image", imageFile)
            }
            if (pdfFile) {
                formData.append("pdf", pdfFile)
            }

            const url = certificate ? `${API_URL}/certificates/${certificate._id}` : `${API_URL}/certificates`
            const method = certificate ? "PUT" : "POST"

            // Note: PUT might not be implemented in backend for certificates yet, but sticking to pattern
            // Actually, I only implemented POST and DELETE in the backend controller.
            // So editing is not supported yet in backend. I will stick to POST for now.

            if (certificate) {
                toast.error("Editing not supported yet")
                setLoading(false)
                return
            }

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            if (!res.ok) throw new Error("Failed to save certificate")

            toast.success("Certificate saved successfully")
            onSuccess()
        } catch (error) {
            console.error(error)
            toast.error("Failed to save certificate")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Certificate Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. AWS Certified Solutions Architect"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Serial ID / Credential ID</label>
                <input
                    type="text"
                    value={serialId}
                    onChange={(e) => setSerialId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. ABC-123-XYZ"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Certificate Image</label>
                <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-700">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-zinc-400" />
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="cert-image"
                                required={!certificate}
                            />
                            <label
                                htmlFor="cert-image"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Image
                            </label>
                        </div>

                        <div>
                            <label className="text-xs font-medium mb-1 block">PDF Document (Optional)</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-zinc-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Certificate"}
            </button>
        </form>
    )
}
