import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/components/app-context";
import { getResorts } from "@/lib/catalog";
import { Header, Footer } from "@/components/shell";
import "./globals.css";
import "./redesign.css";
import "./sport.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: {
    default: "Ski Match — La montaña se disfruta en compañía",
    template: "%s | Ski Match",
  },
  description:
    "Descubre Baqueira Beret, Formigal-Panticosa y Sierra Nevada. Conecta con compañeros de esquí y snowboard de tu nivel y organiza tu próxima escapada.",
  applicationName: "Ski Match",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ski Match — Nos vemos arriba",
    description: "Tu próxima montaña. Tu próxima aventura. Tu gente.",
    type: "website",
    locale: "es_ES",
  },
};
export const viewport: Viewport = { themeColor: "#0c1c2c" };
export default async function Layout({ children }: { children: React.ReactNode }) {
  const { resorts, error } = await getResorts();
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <AppProvider resorts={resorts} catalogError={error}><Header />
        <div id="contenido">{children}</div>
        <Footer /></AppProvider>
      </body>
    </html>
  );
}
