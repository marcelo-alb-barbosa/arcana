"use client"

import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { useIdioma } from "@/contexts/idioma-context"

function NotFoundContent() {
  const { t } = useIdioma()

  return (
    <div className="min-h-screen bg-deep-black flex flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between p-4 md:p-5 bg-deep-black/80 backdrop-blur-sm border-b border-b-blood-red/20">
        <Link href="/" className="text-aged-bone hover:text-blood-red transition-colors">
          <ArrowLeft size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8" />
          <span className="sr-only">{t("history.back")}</span>
        </Link>
        <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl text-aged-bone animate-subtleGlow">
          {t("header.title")}
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 bg-noise-pattern">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 md:mb-12">
            <h2 className="font-cinzel text-6xl md:text-8xl text-blood-red mb-4 animate-subtleGlow">404</h2>
            <h3 className="font-cinzel text-2xl md:text-3xl text-aged-bone mb-4">{t("notFound.title")}</h3>
            <p className="text-bone-dust-gray max-w-2xl mx-auto mb-8">
              {t("notFound.description")}
            </p>

            <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-6 max-w-md mx-auto mb-8">
              <p className="text-bone-dust-gray italic">
                {t("notFound.quote")}
              </p>
              <p className="text-blood-red mt-2">{t("notFound.quoteAuthor")}</p>
            </div>

            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blood-red/20 hover:bg-blood-red/30 text-aged-bone border border-blood-red/50 rounded-md transition-colors"
            >
              <Home size={20} />
              <span>{t("notFound.returnHome")}</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-bone-dust-gray/50 border-t border-t-blood-red/20">
        <div className="max-w-4xl mx-auto">
          <p>&copy; {new Date().getFullYear()} {t("notFound.copyright")}</p>
        </div>
      </footer>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-deep-black text-aged-bone flex flex-col items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-aged-bone/20 mb-4"></div>
          <div className="h-6 w-48 bg-aged-bone/20 rounded mb-2"></div>
          <div className="h-4 w-64 bg-aged-bone/20 rounded"></div>
        </div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  )
}
