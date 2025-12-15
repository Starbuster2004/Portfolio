"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Marquee from "@/components/ui/marquee"
import SphereImageGrid from "@/components/ui/sphere-image-grid"
import type { HeroData } from "@/lib/data"

interface Skill {
  name: string
  icon: string
  category?: string
}

interface BentoGridProps {
  heroData?: HeroData | null;
}

/**
 * Skills/BentoGrid Section Component
 * 
 * This component receives heroData (including skills) as props from the parent server component.
 * No client-side fetching - data is pre-rendered at build time via ISR.
 */
export function BentoGrid({ heroData }: BentoGridProps) {
  const skills: Skill[] = heroData?.skills || []
  const [displayedSkills, setDisplayedSkills] = useState<Skill[]>(skills.slice(0, 6))

  useEffect(() => {
    if (skills.length <= 6) return

    const interval = setInterval(() => {
      const shuffled = [...skills].sort(() => 0.5 - Math.random())
      setDisplayedSkills(shuffled.slice(0, 6))
    }, 3000)

    return () => clearInterval(interval)
  }, [skills])

  const sphereImages = skills.map((skill, index) => ({
    id: `skill-${index}`,
    src: skill.icon,
    alt: skill.name,
    title: skill.name,
    description: skill.category
  }))

  return (
    <section id="architecture" className="py-32 px-4 bg-white dark:bg-black transition-colors duration-700">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8] text-sm font-mono mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {"// System Architecture"}
          </motion.span>
          <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white">Skills & Technologies</h3>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Sphere Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 relative min-h-[500px] rounded-3xl bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10" />

            {skills.length === 0 ? (
              <div className="flex items-center gap-2 text-zinc-500">
                No skills added yet. Add some from the admin panel!
              </div>
            ) : (
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <SphereImageGrid
                  images={sphereImages}
                  containerSize={600}
                  sphereRadius={200}
                  autoRotate={true}
                  autoRotateSpeed={0.5}
                  dragSensitivity={0.8}
                  baseImageScale={0.15}
                />
              </div>
            )}

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>
          </motion.div>


          {/* Marquee Section */}
          <div className="lg:col-span-1 h-[500px] flex flex-col relative overflow-hidden bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-black z-10 pointer-events-none fade-out" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black z-10 pointer-events-none fade-out" />

            {skills.length === 0 ? (
              <div className="flex flex-col gap-4 p-4 items-center justify-center h-full text-zinc-500">
                No skills to display
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <Marquee vertical className="[--duration:20s] flex-1 py-4">
                  {skills.slice(0, Math.ceil(skills.length / 2)).map((skill, i) => (
                    <SkillCard key={i} skill={skill} />
                  ))}
                </Marquee>
                <Marquee vertical reverse className="[--duration:20s] flex-1 py-4">
                  {skills.slice(Math.ceil(skills.length / 2)).map((skill, i) => (
                    <SkillCard key={i} skill={skill} />
                  ))}
                </Marquee>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mx-2">
      <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 p-1.5 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
        <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
      </div>
      <span className="font-medium text-sm text-zinc-900 dark:text-white">{skill.name}</span>
    </div>
  );
}
