"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FolderKanban, FileText, Brain, MessageSquare, LogOut, Briefcase, Award, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    {
        title: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Home Content",
        href: "/admin/home",
        icon: Home,
    },
    {
        title: "Experience",
        href: "/admin/experience",
        icon: Briefcase,
    },
    {
        title: "Projects",
        href: "/admin/projects",
        icon: FolderKanban,
    },
    {
        title: "Blogs",
        href: "/admin/blogs",
        icon: FileText,
    },
    {
        title: "Certificates",
        href: "/admin/certificates",
        icon: Award,
    },
    {
        title: "Skills",
        href: "/admin/skills",
        icon: Brain,
    },
    {
        title: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("admin_token")
        localStorage.removeItem("admin_user")
        router.push("/admin/login")
    }

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col z-50">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">v.01.2026</p>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                    </Link>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-auto"
            >
                <LogOut className="w-4 h-4" />
                Terminate Session
            </button>
        </aside>
    )
}
