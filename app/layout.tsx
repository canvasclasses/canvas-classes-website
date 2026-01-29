import type { Metadata } from "next";
import { Geist, Geist_Mono, Kalam } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CommandPalette } from "./components/CommandPalette";
import { getSearchItems } from "./lib/searchIndices";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = "https://www.canvasclasses.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: './',
  },
  title: {
    default: "Canvas Classes - Free JEE & NEET Chemistry Preparation",
    template: "%s | Canvas Classes",
  },
  description:
    "Master Chemistry for JEE & NEET with free video lectures, handwritten notes, NCERT solutions, flashcards, and practice materials by Paaras Sir. Join thousands of successful students.",
  keywords: [
    "JEE Chemistry",
    "NEET Chemistry",
    "CBSE Chemistry",
    "Chemistry coaching",
    "Free chemistry lectures",
    "NCERT solutions chemistry",
    "Paaras Sir chemistry",
    "Canvas Classes",
    "IIT JEE preparation",
    "NEET preparation",
    "Class 11 chemistry",
    "Class 12 chemistry",
    "Organic chemistry",
    "Inorganic chemistry",
    "Physical chemistry",
  ],
  authors: [{ name: "Paaras Sir", url: siteUrl }],
  creator: "Canvas Classes",
  publisher: "Canvas Classes",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Canvas Classes",
    title: "Canvas Classes - Free JEE & NEET Chemistry Preparation",
    description:
      "Master Chemistry for JEE & NEET with free video lectures, handwritten notes, NCERT solutions, and practice materials by Paaras Sir.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Canvas Classes - Master Chemistry with Confidence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canvas Classes - Free JEE & NEET Chemistry Preparation",
    description:
      "Master Chemistry for JEE & NEET with free video lectures, handwritten notes, and NCERT solutions by Paaras Sir.",
    images: ["/logo.png"],
    creator: "@canvasclasses",
  },
  verification: {
    // google: "your-google-verification-code", // Replace with actual code
  },
  category: "Education",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

// Structured Data (JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Canvas Classes",
  description:
    "Free JEE & NEET Chemistry coaching with video lectures, NCERT solutions, and practice materials.",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    "https://www.youtube.com/@canvasclasses",
    "https://www.instagram.com/canvasclasses",
  ],
  founder: {
    "@type": "Person",
    name: "Paaras Sir",
  },
  areaServed: "India",
  teaches: ["Chemistry", "JEE Chemistry", "NEET Chemistry", "CBSE Chemistry"],
};

import { AuthButton } from "./components/AuthButton";

// ... existing imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} antialiased`}
      >
        <CommandPalette itemsPromise={getSearchItems()} />
        <Navbar authButton={<AuthButton />} />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
