import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { headers } from "next/headers";
import { trackVisit } from "@/lib/tracker";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BioTech Uncharted — Pioneering the Future of Biotech",
    template: "%s | BioTech Uncharted",
  },
  description:
    "BioTech Uncharted explores the frontiers of biological science and AI-driven biotechnology — research, publications, and discoveries from our team.",
  keywords: ["biotech", "biotechnology", "computational biology", "research", "publications", "synthetic biology"],
  openGraph: {
    title: "BioTech Uncharted",
    description: "Pioneering the future of biotech — research, publications, and discoveries.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Extract custom x-pathname set in middleware
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  // Track the visit if it's a public path (and not internal static assets/api)
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.includes(".")) {
    trackVisit(headersList, pathname).catch((err) => {
      console.error("Traffic tracking failed:", err);
    });
  }

  return (
    <html lang="en">
      <body className={inter.className} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
