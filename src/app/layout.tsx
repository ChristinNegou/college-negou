import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "College Polyvalent Negou - Bafoussam, Cameroun",
    template: "%s | College Polyvalent Negou",
  },
  description:
    "College Polyvalent Negou - Etablissement d'enseignement secondaire a Bafoussam. De la 6eme a la Terminale. Excellence, Discipline, Reussite.",
  keywords: [
    "college", "Bafoussam", "Cameroun", "education", "secondaire",
    "lycee", "BEPC", "Baccalaureat", "Negou", "inscription",
  ],
  authors: [{ name: "College Polyvalent Negou" }],
  openGraph: {
    type: "website",
    locale: "fr_CM",
    siteName: "College Polyvalent Negou",
    title: "College Polyvalent Negou - Bafoussam, Cameroun",
    description: "Etablissement d'enseignement secondaire a Bafoussam. De la 6eme a la Terminale. Excellence, Discipline, Reussite.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
