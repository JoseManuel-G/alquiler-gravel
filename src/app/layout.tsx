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
    "Alquiler de bicicletas gravel en Madrid por días, medio día, fin de semana o semana. Gravel bike rental in Madrid for tourists and locals.",
  keywords: [
    "alquiler gravel Madrid",
    "alquiler bicicletas gravel Madrid",
    "alquiler bici gravel Madrid",
    "rent gravel bike Madrid",
    "gravel bike rental Madrid",
    "bike rental Madrid",
    "rent a bike in Madrid",
    "gravel routes Madrid",
    "rutas gravel Madrid",
    "alquiler bicis Casa de Campo",
    "alquiler bicicletas El Pardo",
    "alquiler bici fin de semana Madrid"
  ],
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
      "en": "/en",
    },
  },
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
  twitter: {
    card: "summary_large_image",
    title: "Alquiler Gravel Madrid | Gravel bike rental in Madrid",
    description:
      "Bicis gravel por días, fines de semana o semanas en Madrid. Gravel bikes for tourists and locals.",
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
