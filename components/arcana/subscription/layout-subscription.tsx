"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useIdioma } from "@/contexts/idioma-context"

interface LayoutSubscriptionProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function LayoutSubscription({ children, title, subtitle }: LayoutSubscriptionProps) {
  const { t } = useIdioma()

  return (
    <div className="bg-deep-black">
      <div className="pt-4 md:pt-5 px-4 md:px-5 flex items-center">
        <Link href="/" className="text-aged-bone hover:text-blood-red transition-colors">
          <ArrowLeft size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8" />
          <span className="sr-only">{t("history.back")}</span>
        </Link>
        <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl text-aged-bone animate-subtleGlow mx-auto">
          {t("subscription.layout.title")}
        </h1>
        <div className="w-10" />
      </div>

      <main className="p-4 md:p-6 lg:p-8 bg-noise-pattern">
        <div className="max-w-4xl mx-auto">
          {(title || subtitle) && (
            <section className="mb-8 md:mb-12 text-center">
              {title && <h2 className="font-cinzel text-2xl md:text-3xl text-aged-bone mb-2">{title}</h2>}
              {subtitle && <p className="text-bone-dust-gray max-w-2xl mx-auto">{subtitle}</p>}
            </section>
          )}

          {children}
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-bone-dust-gray/50 border-t border-t-blood-red/20 mt-8">
        <div className="max-w-4xl mx-auto">
          <p>&copy; {new Date().getFullYear()} ARCANA. {t("subscription.footer.copyright")}</p>
          <p className="mt-1">
            {t("subscription.footer.disclaimer")}
          </p>
        </div>
      </footer>
    </div>
  )
}
