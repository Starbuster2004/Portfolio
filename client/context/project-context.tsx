"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Types
interface HeroData {
    aboutTitle?: string;
    aboutSubtitle?: string;
    aboutDescription?: string;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    githubUrl?: string;
    category: "project" | "internship" | "job";
    featured: boolean;
    image?: string;
}

interface Blog {
    _id: string;
    title: string;
    summary: string;
    image?: string;
    date: string;
    tags: string[];
    slug?: string;
}

interface Certificate {
    _id: string;
    title: string;
    serialId: string;
    image: string;
    pdf?: string;
}

interface ProjectContextType {
    hero: HeroData | null;
    projects: Project[];
    blogs: Blog[];
    certificates: Certificate[];
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [hero, setHero] = useState<HeroData | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Parallel fetching for performance
            const [heroRes, projectsRes, blogsRes, certsRes] = await Promise.allSettled([
                fetch(`${API_URL}/hero`),
                fetch(`${API_URL}/projects`),
                fetch(`${API_URL}/blogs`),
                fetch(`${API_URL}/certificates`)
            ]);

            // Handle Hero
            if (heroRes.status === 'fulfilled' && heroRes.value.ok) {
                const data = await heroRes.value.json();
                if (data.data) setHero(data.data);
            }

            // Handle Projects
            if (projectsRes.status === 'fulfilled' && projectsRes.value.ok) {
                const data = await projectsRes.value.json();
                if (data.data) setProjects(data.data);
            }

            // Handle Blogs
            if (blogsRes.status === 'fulfilled' && blogsRes.value.ok) {
                const data = await blogsRes.value.json();
                if (data.data) setBlogs(data.data);
            }

            // Handle Certificates
            if (certsRes.status === 'fulfilled' && certsRes.value.ok) {
                const data = await certsRes.value.json();
                if (data.data) setCertificates(data.data);
            }

        } catch (err) {
            console.error("Global Data Fetch Error:", err);
            setError("Failed to load some portfolio data. Please try refreshing.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ProjectContext.Provider value={{ hero, projects, blogs, certificates, loading, error, refreshData: fetchData }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
}
