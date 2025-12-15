"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === "/admin/login") {
            setLoading(false)
            return
        }

        const validateToken = async () => {
            const token = localStorage.getItem("admin_token")

            if (!token) {
                router.push("/admin/login")
                return
            }

            try {
                // Validate token by making a test request to a protected endpoint
                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (!res.ok) {
                    // Token is invalid or expired - clear it and redirect
                    console.log("Token invalid, clearing and redirecting to login")
                    localStorage.removeItem("admin_token")
                    localStorage.removeItem("admin_user")
                    router.push("/admin/login")
                    return
                }

                setAuthenticated(true)
            } catch (error) {
                console.error("Auth validation error:", error)
                // On network error, still allow if token exists (offline support)
                // But clear potentially stale token
                localStorage.removeItem("admin_token")
                localStorage.removeItem("admin_user")
                router.push("/admin/login")
            } finally {
                setLoading(false)
            }
        }

        validateToken()
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

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        )
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
