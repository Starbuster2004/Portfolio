"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import type { HeroData } from "@/lib/data"

interface ShaderAnimationProps {
    heroData?: HeroData | null;
}

// Default values for hero section
const defaultHeroData = {
    heroTitle: "Govindraj Kotalwar",
    heroSubtitle: "AI Engineer • Full Stack Developer",
};

export function ShaderAnimation({ heroData }: ShaderAnimationProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<{
        camera: THREE.Camera
        scene: THREE.Scene
        renderer: THREE.WebGLRenderer
        uniforms: any
        animationId: number
    } | null>(null)

    // Parse hero title into first and last name
    const fullName = heroData?.heroTitle || defaultHeroData.heroTitle;
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || "Govindraj";
    const lastName = nameParts.slice(1).join(' ') || "Kotalwar";

    // Parse subtitle into parts (split by • or |)
    const subtitle = heroData?.heroSubtitle || defaultHeroData.heroSubtitle;
    const subtitleParts = subtitle.split(/[•|]/).map(s => s.trim()).filter(Boolean);
    const subtitle1 = subtitleParts[0] || "AI Engineer";
    const subtitle2 = subtitleParts[1] || "Full Stack Developer";

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current

        // Vertex shader
        const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

        // Fragment shader
        const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }
        
        gl_FragColor = vec4(color[0],color[1],color[2],1.0);
      }
    `

        // Initialize Three.js scene
        const camera = new THREE.Camera()
        camera.position.z = 1

        const scene = new THREE.Scene()
        const geometry = new THREE.PlaneGeometry(2, 2)

        const uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() },
        }

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)

        container.appendChild(renderer.domElement)

        // Handle window resize
        const onWindowResize = () => {
            const width = container.clientWidth
            const height = container.clientHeight
            renderer.setSize(width, height)
            uniforms.resolution.value.x = renderer.domElement.width
            uniforms.resolution.value.y = renderer.domElement.height
        }

        // Initial resize
        onWindowResize()
        window.addEventListener("resize", onWindowResize, false)

        // Animation loop
        const animate = () => {
            const animationId = requestAnimationFrame(animate)
            uniforms.time.value += 0.05
            renderer.render(scene, camera)

            if (sceneRef.current) {
                sceneRef.current.animationId = animationId
            }
        }

        // Store scene references for cleanup
        sceneRef.current = {
            camera,
            scene,
            renderer,
            uniforms,
            animationId: 0,
        }

        // Start animation
        animate()

        // Cleanup function
        return () => {
            window.removeEventListener("resize", onWindowResize)

            if (sceneRef.current) {
                cancelAnimationFrame(sceneRef.current.animationId)

                if (container && sceneRef.current.renderer.domElement) {
                    container.removeChild(sceneRef.current.renderer.domElement)
                }

                sceneRef.current.renderer.dispose()
                geometry.dispose()
                material.dispose()
            }
        }
    }, [])

    return (
        <div className="relative w-full h-screen">
            <div
                ref={containerRef}
                className="absolute inset-0 w-full h-full"
                style={{ background: "#000", overflow: "hidden" }}
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    {/* Status badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
                    >
                        <motion.span
                            className="w-2 h-2 rounded-full bg-[#6366F1]"
                            animate={{
                                opacity: [1, 0.5, 1],
                                boxShadow: [
                                    "0 0 10px #6366F1",
                                    "0 0 20px #6366F1",
                                    "0 0 10px #6366F1"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-sm font-mono text-white/80">Available for Hire</span>
                    </motion.div>

                    {/* Animated Name - Now Dynamic */}
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mix-blend-difference overflow-hidden">
                        <motion.span
                            className="block text-white"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {firstName}
                        </motion.span>
                        <motion.span
                            className="block bg-gradient-to-r from-[#818CF8] via-[#6366F1] to-[#4F46E5] bg-clip-text text-transparent"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {lastName}
                        </motion.span>
                    </h1>

                    {/* Subtitle with HyperText effect - Now Dynamic */}
                    <motion.div
                        className="mt-6 flex items-center justify-center gap-3 pointer-events-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        <HyperText
                            text={subtitle1}
                            className="text-xl md:text-2xl font-light tracking-wide text-[#818CF8]"
                            duration={600}
                        />
                        <span className="text-white/30 text-xl md:text-2xl">•</span>
                        <HyperText
                            text={subtitle2}
                            className="text-xl md:text-2xl font-light tracking-wide text-white/70"
                            duration={800}
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <ArrowDown className="w-8 h-8 text-white/50" />
                </motion.div>
            </motion.div>
        </div>
    )
}
