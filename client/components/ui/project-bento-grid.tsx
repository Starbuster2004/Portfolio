"use client";

import { cn } from "@/lib/utils";
import {
    Github,
    ExternalLink,
} from "lucide-react";
import React from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export interface BentoItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
    image?: string;
    githubUrl?: string;
    link?: string;
}

interface BentoGridProps {
    items: BentoItem[];
}


export function ProjectBentoGrid({ items }: BentoGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
            {items.map((item, index) => (
                <BentoGridItem key={index} item={item} />
            ))}
        </div>
    );
}

function BentoGridItem({ item }: { item: BentoItem }) {
    const divRef = React.useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = React.useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group relative p-4 rounded-xl overflow-hidden transition-all duration-300 min-h-[300px] flex flex-col justify-end",
                "border border-gray-100/80 dark:border-white/10 bg-white dark:bg-black",
                "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
                "hover:-translate-y-0.5 will-change-transform",
                item.colSpan || "col-span-1",
                item.colSpan === 2 ? "md:col-span-2" : "",
                {
                    "shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5":
                        item.hasPersistentHover,
                    "dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)]":
                        item.hasPersistentHover,
                }
            )}
        >
            {/* Glowing Effect */}
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={8}
            />
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99,102,241,.15), transparent 40%)`,
                }}
            />
            {/* Background Image */}
            {item.image && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                        {item.icon}
                    </div>
                    {item.status && (
                        <span
                            className={cn(
                                "text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm",
                                "bg-white/10 text-gray-200",
                                "transition-colors duration-300 group-hover:bg-white/20"
                            )}
                        >
                            {item.status}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium text-white tracking-tight text-xl">
                        {item.title}
                        <span className="ml-2 text-xs text-gray-300 font-normal">
                            {item.meta}
                        </span>
                    </h3>
                    <p className="text-sm text-gray-300 leading-snug font-[425] line-clamp-2">
                        {item.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-300">
                        {item.tags?.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.githubUrl && (
                            <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                        {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
