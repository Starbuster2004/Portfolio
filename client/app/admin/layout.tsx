"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === "/admin/login") {
            setLoading(false)
            return
        }

        const token = localStorage.getItem("admin_token")
        if (!token) {
            router.push("/admin/login")
        } else {
            setLoading(false)
        }
    }, [pathname, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    if (pathname === "/admin/login") {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <AdminSidebar />
            <main className="pl-64 p-8">
                <div className="max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    )
}
