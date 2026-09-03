import type { Metadata, Viewport } from "next";
import { Lilita_One, Press_Start_2P } from "next/font/google";
import { SITE_NAME } from "@/lib/event";
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

export const metadata: Metadata = {
  title: `${SITE_NAME}: Abed & Lynn`,
  description: "By order of the King & Queen: one birthday, two crowns.",
};

export const viewport: Viewport = {
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
