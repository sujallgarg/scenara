import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1514",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://scenara.ai"),
  title: "Scenara — Multi-Agent AI World Simulation Platform",
  description:
    "What if you could see how the world reacts before you make your move? Scenara creates realistic, AI-powered societies to test ideas, strategies, and policies in a simulated world.",
  keywords: [
    "AI simulation platform",
    "multi-agent AI simulation",
    "AI-powered market research",
    "synthetic audience simulation",
    "test business ideas with AI",
    "social behavior simulation",
    "decision intelligence",
    "scenario planning",
    "agentic AI",
  ],
  authors: [{ name: "Scenara" }],
  creator: "Scenara",
  publisher: "Scenara",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://scenara.ai",
  },
  openGraph: {
    title: "Scenara — What if you could see how the world reacts before you make your move?",
    description:
      "Scenara creates realistic, AI-powered societies to test ideas, strategies, and policies in a simulated world — so you can spot risks and make confident decisions.",
    url: "https://scenara.ai",
    siteName: "Scenara",
    images: [
      {
        url: "/scenara-logo.png",
        width: 1200,
        height: 630,
        alt: "Scenara — Multi-Agent World Simulation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scenara — Multi-Agent AI World Simulation Platform",
    description:
      "Test ideas, strategies, and policies in realistic AI-powered simulated worlds before investing real capital.",
    images: ["/scenara-logo.png"],
    creator: "@scenara_ai",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://scenara.ai/#organization",
        name: "Scenara",
        url: "https://scenara.ai",
        logo: {
          "@type": "ImageObject",
          url: "https://scenara.ai/scenara-logo.png",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://scenara.ai/#website",
        url: "https://scenara.ai",
        name: "Scenara",
        publisher: { "@id": "https://scenara.ai/#organization" },
        description: "Multi-agent world simulation platform for testing ideas and policies.",
      },
      {
        "@type": "SoftwareApplication",
        name: "Scenara Simulation Engine",
        operatingSystem: "Web",
        applicationCategory: "BusinessApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Multi-agent AI simulation platform that lets teams test strategies, market launches, and governance policies in realistic synthetic societies.",
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#FAFCFB] text-[#0D1817] selection:bg-[#00D084] selection:text-[#041A13] antialiased">
        {children}
      </body>
    </html>
  );
}
