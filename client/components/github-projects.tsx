"use client"

import { motion } from "framer-motion"
import { Github, Star, GitFork, ArrowUpRight, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { ProjectBentoGrid, BentoItem } from "@/components/ui/project-bento-grid"

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

export function GithubProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      // Use Next.js proxy - hides backend URL from browser
      const res = await fetch("/api/projects")
      const data = await res.json()
      if (data.data) {
        setProjects(data.data)
      }
    } catch {
      // Silently fail - component handles empty state
    } finally {
      setLoading(false)
    }
  }

  const bentoItems: BentoItem[] = projects.map((project, i) => ({
    title: project.title,
    description: project.description,
    icon: <Github className="w-4 h-4 text-white" />,
    status: project.category,
    tags: project.technologies,
    meta: project.featured ? "Featured" : undefined,
    colSpan: i === 0 || i === 3 || i === 6 ? 2 : 1,
    hasPersistentHover: false,
    image: project.image,
    githubUrl: project.githubUrl,
    link: project.link
  }))

  return (
    <section className="py-32 px-4 bg-zinc-50 dark:bg-black transition-colors duration-700">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col gap-4"
        >
          <motion.span
            className="inline-block px-4 py-2 w-fit rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8] text-sm font-mono"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {"// Featured Work"}
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white">Projects & Open Source</h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[300px] rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <ProjectBentoGrid items={bentoItems} />
        )}
      </div>
    </section>
  )
}
