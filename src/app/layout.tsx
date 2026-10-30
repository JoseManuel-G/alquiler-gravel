import type { Metadata, Viewport } from "next";
import { Header, Footer } from "@/components/shell";
import "./globals.css";
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
export const viewport: Viewport = { themeColor: "#102a43" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <Header />
        <div id="contenido">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
