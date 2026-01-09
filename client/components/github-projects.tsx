"use client"

import { motion } from "framer-motion"
import { Github } from "lucide-react"
import { ProjectBentoGrid, BentoItem } from "@/components/ui/project-bento-grid"
import type { Project } from "@/lib/data"

interface GithubProjectsProps {
  projects: Project[];
}

/**
 * Github Projects Section Component
 * 
 * This component receives projects as props from the parent server component.
 * No client-side fetching - data is pre-rendered at build time via ISR.
 */
export function GithubProjects({ projects }: GithubProjectsProps) {
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
    link : project.link,
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
            {"•// Featured Work"}
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white">Projects & Open Source</h2>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
            <p className="text-lg">No projects yet. Add some from the admin panel!</p>
          </div>
        ) : (
          <ProjectBentoGrid items={bentoItems} />
        )}
      </div>
    </section>
  )
}
