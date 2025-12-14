import { Navbar } from "@/components/navbar"
import { ShaderAnimation } from "@/components/shader-hero"
import { About } from "@/components/about"
import { BentoGrid } from "@/components/bento-grid"
import { Experience } from "@/components/experience"
import { GithubProjects } from "@/components/github-projects"
import { BlogsPapers } from "@/components/blogs-papers"
import { Certificates } from "@/components/certificates"
import { Footer } from "@/components/footer"
import { CursorEffect } from "@/components/cursor-effect"
import { ScrollProgress } from "@/components/ui/scroll-progress"

import { ThemeToggle } from "@/components/theme-toggle"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Home as HomeIcon, User, Briefcase, Zap, GitFork, Award, BookOpen, Mail } from "lucide-react"

export default function Home() {
  const navItems = [
    { title: "Home", icon: <HomeIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#hero" },
    { title: "About", icon: <User className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#about" },
    { title: "Skills", icon: <Zap className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#skills" },
    { title: "Experience", icon: <Briefcase className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#experience" },
    { title: "Projects", icon: <GitFork className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#projects" },
    { title: "Blogs", icon: <BookOpen className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#blogs" },
    { title: "Certificates", icon: <Award className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#certificates" },
    { title: "Contact", icon: <Mail className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#contact" },
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 selection:bg-[#6366F1]/30 dark:selection:bg-[#818CF8]/30 selection:text-zinc-900 dark:selection:text-white overflow-x-hidden cursor-none transition-colors duration-700">
      <ScrollProgress />
      <CursorEffect />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Seamless sections with no gaps */}
      <section id="hero">
        <ShaderAnimation />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="experience">
        <Experience />
      </section>

      <section id="skills">
        <BentoGrid />
      </section>

      <section id="projects">
        <GithubProjects />
      </section>

      <section id="blogs">
        <BlogsPapers />
      </section>

      <section id="certificates">
        <Certificates />
      </section>

      <section id="contact">
        <Footer />
      </section>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock items={navItems} />
      </div>
    </main>
  )
}
