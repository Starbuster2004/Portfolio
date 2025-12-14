"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4"
    >
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 dark:bg-black/5 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-2xl ring-1 ring-white/10">
        <Link
          href="#hero"
          className="px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors relative group"
        >
          Home
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="#about"
          className="px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors relative group"
        >
          About
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="#projects"
          className="px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors relative group"
        >
          Projects
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="#certificates"
          className="px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors relative group"
        >
          Certificates
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="/blog"
          className="px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors relative group"
        >
          Blog
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        <ThemeToggle />
      </div>
    </motion.header>
  )
}
