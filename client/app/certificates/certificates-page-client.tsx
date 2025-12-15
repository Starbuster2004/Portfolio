"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Award, FileText, Download } from "lucide-react"
import type { Certificate, HeroData } from "@/lib/data"

interface CertificatesPageClientProps {
    certificates: Certificate[];
    footerData: HeroData | null;
}

/**
 * Certificates Page Client Component
 * 
 * Handles animations and interactivity for the certificates listing.
 * Data is pre-fetched by the parent server component.
 */
export function CertificatesPageClient({ certificates, footerData }: CertificatesPageClientProps) {
    return (
        <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
            <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">Certifications & Awards</h1>

                {certificates.length === 0 ? (
                    <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
                        <p className="text-lg">No certificates yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert) => (
                            <motion.div
                                key={cert._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {cert.pdf && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a
                                                href={cert.pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:scale-105 transition-transform"
                                            >
                                                <FileText className="w-4 h-4" />
                                                View Certificate
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-zinc-900 dark:text-white mb-2 leading-tight">{cert.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                            <Award className="w-4 h-4" />
                                            <span>{cert.serialId}</span>
                                        </div>
                                        {cert.pdf && (
                                            <a href={cert.pdf} download className="text-zinc-400 hover:text-blue-500 transition-colors">
                                                <Download className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <Footer footerData={footerData} />
        </main>
    )
}
