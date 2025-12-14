"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BadgeCheck, ScrollText } from "lucide-react"
import Link from "next/link"

interface Certificate {
  _id: string
  title: string
  serialId: string
  image: string
}

export function TechSpecs() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // Use Next.js proxy - hides backend URL from browser
        const res = await fetch("/api/certificates")
        const data = await res.json()
        if (data.data) {
          setCertificates(data.data)
        }
      } catch {
        // Silently fail - component handles empty state
      } finally {
        setLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  // Show nothing if no certificates
  if (!loading && certificates.length === 0) return null

  return (
    <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800/50 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/3"
          >
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
              <BadgeCheck className="text-[#6366F1]" />
              Certifications
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
              Verified technical credentials and validated operational capabilities.
            </p>
            <Link
              href="/certificates"
              className="text-[#6366F1] hover:text-[#4F46E5] text-sm font-medium transition-colors"
            >
              View all certificates →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              ))
            ) : (
              certificates.slice(0, 4).map((cert) => (
                <div
                  key={cert._id}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-[#6366F1]/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-[#6366F1]/10">
                    <ScrollText className="w-4 h-4 text-[#6366F1]" />
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200 line-clamp-1">{cert.title}</span>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
