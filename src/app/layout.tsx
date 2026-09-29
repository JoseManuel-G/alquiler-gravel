import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://j2data.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "J² Data & AI | Estrategia, plataformas de datos, analítica e IA",
  description: "Consultoría boutique de datos e IA: estrategia, arquitecturas lakehouse y data warehouse, Snowflake, Microsoft Fabric, Power BI y agentes inteligentes.",
  keywords: ["consultoría de datos", "estrategia de datos", "lakehouse", "data warehouse", "Snowflake", "Microsoft Fabric", "Power BI", "modelos semánticos", "agentes IA"],
  openGraph: {
    type: "website", locale: "es_ES", url: siteUrl, siteName: "J² Data & AI",
    title: "J² Data & AI | Datos que deciden",
    description: "Estrategia, plataformas, analítica e IA para convertir datos complejos en mejores decisiones.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
