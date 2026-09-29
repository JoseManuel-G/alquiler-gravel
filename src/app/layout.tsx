import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://j2data.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "J² Data & AI | Power BI, Microsoft Fabric e Inteligencia Artificial",
  description: "Consultoría boutique especializada en Power BI, Microsoft Fabric, agentes de IA y optimización de modelos semánticos.",
  keywords: ["Power BI", "Microsoft Fabric", "agentes IA", "modelos semánticos", "consultoría de datos", "Business Intelligence"],
  openGraph: {
    type: "website", locale: "es_ES", url: siteUrl, siteName: "J² Data & AI",
    title: "J² Data & AI | Datos que deciden",
    description: "Soluciones de Power BI, Microsoft Fabric e IA que convierten la complejidad en mejores decisiones.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
