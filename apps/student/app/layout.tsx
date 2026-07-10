import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Kalam, Outfit } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { MixpanelProvider } from '@/components/providers/MixpanelProvider';
import { ClarityScript } from '@/components/analytics/ClarityScript';
import { ConsentGate } from '@/features/legal/components/ConsentGate';
import "./globals.css";
import Navbar from "./components/Navbar";
import CollegePredictorBanner from "@/features/landing/components/CollegePredictorBanner";
// BitsatBanner archived 2026-06 — see app/_bitsat-2026-archive/_README.md.
// The College Predictor banner above replaced it as the evergreen homepage
// promo (predictor works year-round, unlike the exam-window-specific plan).
import Footer from "./components/Footer";
import { CommandPalette } from "./components/CommandPalette";
import { getSearchItems } from "@/features/landing/lib/searchIndices";

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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://www.canvasclasses.in";

// theme-color tints the mobile browser/PWA status bar. Next 15 emits this from the
// viewport export (it was moved out of `metadata`). Dark to match the app shell.
export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Canvas Classes",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "Canvas",
  },
  alternates: {
    canonical: './',
    // Explicit India targeting — emits <link rel="alternate" hreflang="en-IN" />
    // and a self-referencing x-default. Pages that override `alternates` will
    // need to re-declare this if they care; most leaf pages set their own
    // canonical and Google will inherit hreflang from the cluster.
    languages: {
      'en-IN': './',
      'x-default': './',
    },
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
    // Set GOOGLE_SITE_VERIFICATION in .env.local (the long code from
    // https://search.google.com/search-console — "HTML tag" method).
    // We read it from env so the real code never lands in git.
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "Education",
  // Favicons:
  // - The browser picks the SVG variant matching the user's OS / browser
  //   color scheme (dark UA -> white logo on dark tabs, light UA -> black
  //   logo on light tabs). Modern browsers honour the `media` attribute
  //   on `<link rel="icon">`.
  // - `app/favicon.ico` is auto-emitted by Next.js as a final fallback for
  //   browsers that don't support SVG favicons (vanishingly rare in 2026).
  // - `apple-icon.png` (square PNG in /public) is used for iOS home-screen.
  icons: {
    icon: [
      { url: '/icon-light.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.svg',  type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/icons/apple-touch-icon.png',
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
  foundingDate: "2014",
  founder: {
    "@type": "Person",
    name: "Paaras Sir",
    alternateName: "Paaras Thakur",
    jobTitle: "Founder & Chemistry Educator",
    description: "15+ years experienced Chemistry educator for JEE & NEET. Ex-Allen, Ex-Unacademy.",
    image: `${siteUrl}/paaras-sir.jpg`, // Assuming an image exists or will be added, otherwise logo
    sameAs: [
      "https://www.youtube.com/@canvasclasses",
      "https://www.instagram.com/canvasclasses",
      // Add other social profiles if available
    ],
    worksFor: {
      "@type": "EducationalOrganization",
      name: "Canvas Classes"
    }
  },
  areaServed: {
    "@type": "Country",
    name: "India"
  },
  teaches: ["Chemistry", "JEE Chemistry", "NEET Chemistry", "CBSE Chemistry"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Chemistry Courses",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "JEE/NEET Chemistry",
          description: "Complete Chemistry Video Lectures for JEE Main, Advanced & NEET"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "NCERT Solutions",
          description: "Chapter-wise NCERT Solutions for Class 11 & 12 Chemistry"
        }
      }
    ]
  }
};

import { AuthButton } from "@/features/auth/components/AuthButton";
import { ConditionalFooter } from "./components/ConditionalFooter";
import GoogleAnalytics from "./components/GoogleAnalytics";
import CloudflareAnalytics from "./components/CloudflareAnalytics";
import { ServiceWorkerRegistrar } from "./components/ServiceWorkerRegistrar";
import { InstallBanner } from "@/features/pwa/InstallBanner";

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
        className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <ServiceWorkerRegistrar />
        <GoogleAnalytics />
        <CloudflareAnalytics />
        <ClarityScript />
        <MixpanelProvider>
          <CommandPalette itemsPromise={getSearchItems()} />
          <Navbar authButton={<AuthButton />} />
          <CollegePredictorBanner />
          {children}
          <ConditionalFooter />
        </MixpanelProvider>
        <ConsentGate />
        <InstallBanner />
        {/* KEEP — Vercel Analytics + Speed Insights are intentionally retained (decided 2026-06,
            founder) alongside GoogleAnalytics / Clarity / Mixpanel. Do NOT remove in a cost or
            cleanup pass — a prior "multi-thread catch-all" commit stripped these by accident.
            See DEEPENING_BACKLOG.md #19. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
