"use client"

import { motion } from "framer-motion"
import { LineChart, Users } from "lucide-react"

const projects = [
  {
    title: "Predictive Logic v1.0",
    org: "Vodafone Idea Foundation",
    role: "AI Data Analyst",
    metric: "15%",
    metricLabel: "Efficiency Boost",
    desc: "Developed predictive models improving data processing efficiency. Analyzed complex datasets for strategic decision-making.",
    gradient: "from-orange-500 to-red-600",
    icon: LineChart,
    date: "Oct - Nov 2024",
  },
  {
    title: "System Command",
    org: "ECESA",
    role: "Technical Co-Head",
    metric: "2024",
    metricLabel: "Present",
    desc: "Led technical workshops and managed project timelines. Orchestrated events on emerging technologies.",
    gradient: "from-cyan-400 to-blue-500",
    icon: Users,
    date: "Feb 2024 - Present",
  },
]

export function Features() {
  return (
    <section
      id="performance"
      className="relative py-32 px-4 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-700"
    >
      {/* Intro section */}
      <div className="max-w-7xl mx-auto mb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
            The Next AI Enthusatic.
          </h2>
          <p className="text-xl md:text-3xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl mx-auto">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">B.Tech ECE Architecture.</span>
            <br />
            Engineered for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Generative AI
            </span>
            ,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
              Big Data
            </span>
            , and{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">
              Computer Vision
            </span>
            .
          </p>
        </motion.div>
      </div>

      {/* Performance Records */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h2 className="text-sm font-mono text-purple-600 dark:text-purple-400 tracking-wider uppercase mb-4">
            // Field Tests
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white">Performance History</h3>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              whileHover={{ scale: 1.02, y: -8 }}
              className="group relative h-full bg-white dark:bg-black rounded-3xl p-8 border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Animated gradient border on hover */}
              <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl bg-gradient-to-r ${project.gradient} blur-xl -z-10`}
                initial={false}
              />

              {/* Top gradient line */}
              <div
                className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="flex items-start justify-between mb-8">
                <motion.div
                  className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <project.icon className="w-6 h-6 text-zinc-900 dark:text-white" />
                </motion.div>
                <div className="text-right">
                  <div
                    className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${project.gradient}`}
                  >
                    {project.metric}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 uppercase mt-1">{project.metricLabel}</div>
                </div>
              </div>

              <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{project.title}</h4>
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                {project.org} · {project.role}
              </div>
              <div className="text-xs font-mono text-zinc-400 dark:text-zinc-600 mb-6">{project.date}</div>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{project.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
