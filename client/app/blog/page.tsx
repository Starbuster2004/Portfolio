import { Metadata } from "next"
import { getBlogs } from "@/lib/data"
import { BlogPageClient } from "./blog-page-client"

export const metadata: Metadata = {
    title: "Blog | Govindraj Kotalwar",
    description: "Thoughts and insights on AI, machine learning, and software engineering.",
    openGraph: {
        title: "Blog | Govindraj Kotalwar",
        description: "Thoughts and insights on AI, machine learning, and software engineering.",
        type: "website",
    },
}

/**
 * Blog Page - Server Component with ISR
 * 
 * Fetches blogs at build time and revalidates hourly.
 * The actual interactive UI is rendered by a client component.
 */
export default async function BlogPage() {
    // Fetch blogs at build time (ISR enabled - revalidates hourly)
    const blogs = await getBlogs();

    return <BlogPageClient blogs={blogs} />;
}

