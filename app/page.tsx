import { Metadata } from "next";
import LandingPage from "./components/landing/LandingPage";

const BASE_URL = "https://www.canvasclasses.in";

export const metadata: Metadata = {
  title:
    "Canvas Classes — Free JEE, NEET & CBSE Chemistry by Paaras Sir | Video Lectures, NCERT Solutions, Practice",
  description:
    "Free JEE, NEET, BITSAT & CBSE Chemistry preparation by Paaras Sir. Hundreds of video lectures, NCERT solutions for Class 11 & 12, interactive simulators, flashcards, and PYQ practice — all in one place.",
  keywords: [
    "JEE Chemistry",
    "NEET Chemistry",
    "BITSAT Chemistry",
    "CBSE Chemistry Class 11",
    "CBSE Chemistry Class 12",
    "Free chemistry coaching",
    "NCERT solutions chemistry",
    "JEE Main Chemistry video lectures",
    "NEET Chemistry video lectures",
    "Paaras Sir",
    "Canvas Classes",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Canvas Classes",
    title:
      "Canvas Classes — Free JEE, NEET & CBSE Chemistry by Paaras Sir",
    description:
      "Hundreds of free video lectures, NCERT solutions, simulators, flashcards, and PYQ practice for JEE, NEET, BITSAT & CBSE Chemistry.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Canvas Classes — Free JEE & NEET Chemistry by Paaras Sir",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Canvas Classes — Free JEE, NEET & CBSE Chemistry by Paaras Sir",
    description:
      "Hundreds of free video lectures, NCERT solutions, simulators, flashcards, and PYQ practice for JEE, NEET, BITSAT & CBSE Chemistry.",
    creator: "@canvasclasses",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Canvas Classes",
  alternateName: "Canvas Classes by Paaras Sir",
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.png`,
  description:
    "Free JEE, NEET, BITSAT & CBSE Chemistry preparation platform — video lectures, NCERT solutions, interactive simulators, flashcards, and PYQ practice by Paaras Sir.",
  founder: {
    "@type": "Person",
    name: "Paaras Sir",
  },
  sameAs: [
    "https://www.youtube.com/@canvasclasses",
    "https://www.instagram.com/canvasclasses",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: BASE_URL,
  name: "Canvas Classes",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/the-crucible?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/*
        Server-rendered SEO header — visually hidden but read by Googlebot
        and AI crawlers. The visual hero contains an animated typewriter
        H2; this gives crawlers a stable, keyword-rich H1 + answer-first
        intro paragraph at first paint.
      */}
      <header className="sr-only">
        <h1>
          Canvas Classes — Free JEE, NEET, BITSAT & CBSE Chemistry by Paaras Sir
        </h1>
        <p>
          Canvas Classes is a free Chemistry preparation platform for students
          of Class 9 to Class 12 preparing for JEE Main, JEE Advanced, NEET,
          BITSAT and CBSE board exams. Built by Paaras Sir, it offers hundreds
          of full-chapter video lectures, complete NCERT solutions for Class
          11 and Class 12 Chemistry, interactive simulators (periodic trends,
          salt analysis, organic reactions), curated previous year question
          banks, daily revision flashcards, handwritten notes, and an adaptive
          practice engine called The Crucible — all entirely free.
        </p>
      </header>

      <LandingPage />
    </main>
  );
}
