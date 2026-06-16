import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://alquilergravelmadrid.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alquiler Gravel Madrid | Bicicletas gravel por días",
    template: "%s | Alquiler Gravel Madrid",
  },
  description:
    "Alquiler de bicicletas gravel en Madrid por días, medio día, fin de semana o semana. Bicis gravel revisadas, rutas por Casa de Campo, El Pardo, Madrid Río, Anillo Verde y Sierra de Madrid.",
  keywords: [
    "alquiler gravel Madrid",
    "alquiler bicicletas gravel Madrid",
    "alquiler bici gravel Madrid",
    "rent gravel bike Madrid",
    "gravel bike rental Madrid",
    "rutas gravel Madrid",
    "alquiler bicis Casa de Campo",
    "alquiler bicicletas El Pardo",
    "alquiler bici fin de semana Madrid"
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Alquiler Gravel Madrid",
    title: "Alquiler Gravel Madrid | Bicicletas gravel por días",
    description:
      "Alquila una bicicleta gravel en Madrid para rutas por Casa de Campo, El Pardo, Anillo Verde, Madrid Río y Sierra de Madrid.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
