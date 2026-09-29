import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://j2data.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
