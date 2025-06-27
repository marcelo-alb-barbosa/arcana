import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { IdiomaProvider } from "@/contexts/idioma-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { SessionProvider } from "@/components/providers/session-provider"
import { BirthDateCheckProvider } from "@/components/providers/birth-date-check-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { LayoutClient } from "./layout-client"

// Font imports
import { Cinzel_Decorative } from 'next/font/google'

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-cinzel',
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
  colorScheme: "dark",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://arcana-game.com"),
  title: {
    default: "ARCANA | Um jogo que desperta o invisível",
    template: "%s | ARCANA"
  },
  description: "ARCANA é uma experiência mística de leitura de cartas de tarô que revela sabedoria ancestral e guia sua jornada espiritual. Descubra os segredos dos arcanos e desperte o invisível.",
  keywords: ["arcana", "tarô", "tarot", "misticismo", "cartas", "leitura", "espiritual", "oráculo", "arcanos", "jogo místico", "divinação", "esoterismo", "ocultismo"],
  authors: [{ name: "Equipe ARCANA", url: "https://arcana-game.com/sobre" }],
  creator: "ARCANA Studios",
  publisher: "ARCANA Publishing",

  // Additional meta tags
  other: {
    "format-detection": "telephone=no",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    "application-name": "ARCANA",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "ARCANA",
    "mobile-web-app-capable": "yes",
  },

  // Theme configuration
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],

  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US", "es_ES", "fr_FR", "it_IT", "de_DE", "ru_RU", "ja_JP", "zh_CN", "ar_SA"],
    url: "https://arcanabrasil.com",
    siteName: "ARCANA",
    title: "ARCANA | Desperte o invisível",
    description: "Uma experiência mística de leitura de cartas de tarô que revela sabedoria ancestral e guia sua jornada espiritual.",
    images: [
      "/images/background-texture.webp",
      // {
      //   url: "/images/og-image.jpg",
      //   width: 1200,
      //   height: 630,
      //   alt: "ARCANA - Um jogo que desperta o invisível",
      // },
      // {
      //   url: "/images/og-image-alt.jpg",
      //   width: 1200,
      //   height: 630,
      //   alt: "Descubra os segredos dos arcanos",
      // }
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "ARCANA | Desperte o invisível",
    description: "Uma experiência mística de leitura de cartas de tarô que revela sabedoria ancestral e guia sua jornada espiritual.",
    creator: "@arcana_game",
    site: "@arcana_official",
    images: ["/images/twitter-image.jpg"],
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
      { rel: "shortcut icon", url: "/favicon.ico" },
    ],
  },

  // App manifest
  manifest: "/manifest.json",

  // Canonical URL and language alternates
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
      "fr-FR": "/fr",
      "it-IT": "/it",
      "de-DE": "/de",
      "ru-RU": "/ru",
      "ja-JP": "/ja",
      "zh-CN": "/zh",
      "ar-SA": "/ar",
    },
    types: {
      "application/rss+xml": [
        { url: "/blog/rss", title: "ARCANA Blog RSS Feed" },
        { url: "/news/rss", title: "ARCANA News RSS Feed" },
      ],
    },
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Verification
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
    // bing: "bing-verification-code",
    other: {
      me: ["marcelo@arcana-game.com", "https://twitter.com/arcana_game"],
    },
  },

  // App information
  applicationName: "ARCANA",
  category: "Entertainment",

  // Other metadata
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: true,
    url: true,
  },
  appleWebApp: {
    capable: true,
    title: "ARCANA",
    statusBarStyle: "black-translucent",
  },
  itunes: {
    appId: "app-id",
    appArgument: "arcana://",
  },
  appLinks: {
    ios: {
      url: "arcana://",
      app_store_id: "app-store-id",
    },
    android: {
      package: "com.arcana.app",
      app_name: "ARCANA",
    },
    web: {
      url: "https://arcana-game.com",
      should_fallback: true,
    },
  },
  archives: [
    "https://arcana-game.com/archives/2024",
    "https://arcana-game.com/archives/2023",
  ],
  bookmarks: [
    "https://arcana-game.com/favoritos",
  ],
  assets: [
    "https://arcana-game.com/assets",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`bg-deep-black text-aged-bone font-serifRegular ${cinzel.variable}`} suppressHydrationWarning itemScope itemType="https://schema.org/WebPage">
        <SessionProvider>
          <NextThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            themes={["dark", "light", "blood", "mystic"]}
          >
            <ThemeProvider>
              <IdiomaProvider>
                <Toaster />
                <BirthDateCheckProvider />
                <LayoutClient cinzelVariable={cinzel.variable}>
                  {children}
                </LayoutClient>
                <SpeedInsights />
              </IdiomaProvider>
            </ThemeProvider>
          </NextThemeProvider>
        </SessionProvider>

        {/* Service Worker Registration */}
        <script src="/sw-register.js" defer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ARCANA",
              "description": "ARCANA é uma experiência mística de leitura de cartas de tarô que revela sabedoria ancestral e guia sua jornada espiritual.",
              "url": "https://arcana-game.com",
              "applicationCategory": "Entertainment",
              "genre": "Tarot & Mysticism",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "ARCANA Studios",
                "url": "https://arcana-game.com"
              },
              "publisher": {
                "@type": "Organization",
                "name": "ARCANA Publishing",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://arcana-game.com/logo.png"
                }
              },
              "screenshot": [
                {
                  "@type": "ImageObject",
                  "url": "https://arcana-game.com/screenshots/home.jpg",
                  "caption": "ARCANA Home Screen"
                },
                {
                  "@type": "ImageObject",
                  "url": "https://arcana-game.com/screenshots/reading.jpg",
                  "caption": "Tarot Reading Experience"
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1024"
              }
            })
          }}
        />
      </body>
    </html>
  )
}
