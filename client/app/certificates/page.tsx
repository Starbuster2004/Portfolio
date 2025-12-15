import { Metadata } from "next"
import { getCertificates, getHeroData } from "@/lib/data"
import { CertificatesPageClient } from "./certificates-page-client"

export const metadata: Metadata = {
    title: "Certifications | Govindraj Kotalwar",
    description: "Professional certifications and credentials in AI, machine learning, and cloud technologies.",
    openGraph: {
        title: "Certifications | Govindraj Kotalwar",
        description: "Professional certifications and credentials in AI, machine learning, and cloud technologies.",
        type: "website",
    },
}

/**
 * Certificates Page - Server Component with ISR
 * 
 * Fetches certificates at build time and revalidates hourly.
 * The actual interactive UI is rendered by a client component.
 */
export default async function CertificatesPage() {
    // Fetch data at build time (ISR enabled - revalidates hourly)
    const [certificates, heroData] = await Promise.all([
        getCertificates(),
        getHeroData()
    ]);

    return <CertificatesPageClient certificates={certificates} footerData={heroData} />;
}

