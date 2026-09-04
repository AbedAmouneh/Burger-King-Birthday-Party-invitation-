import type { Metadata, Viewport } from "next";
import { Lilita_One, Press_Start_2P } from "next/font/google";
import { copy } from "@/lib/copy";
import "./globals.css";

const lilita = Lilita_One({
  variable: "--font-lilita",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/**
 * WhatsApp needs an absolute og:image URL. Vercel injects VERCEL_PROJECT_
 * PRODUCTION_URL for the production domain, so previews and production both
 * resolve without hardcoding anything; NEXT_PUBLIC_SITE_URL overrides it if
 * the party ever gets a custom domain.
 */
function resolveBaseUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);

  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: resolveBaseUrl(),
  title: copy.meta.title,
  description: copy.meta.description,
  openGraph: {
    title: copy.meta.title,
    description: copy.meta.description,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: copy.meta.title,
    description: copy.meta.description,
  },
  // The link is shared by WhatsApp, not indexed.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  // The invite has one look. Never follow the system dark-mode setting.
  colorScheme: "light",
  themeColor: "#d62300",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${lilita.variable} ${pressStart.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
