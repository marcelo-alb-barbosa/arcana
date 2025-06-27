import type React from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LayoutPerfilProps {
  children: React.ReactNode
  pageTitle?: string
  backLink?: string
}

export function LayoutProfile({ children, pageTitle = "Seu Santuário", backLink = "/" }: LayoutPerfilProps) {
  return (
    <div className="bg-deep-black text-aged-bone flex flex-col items-center relative bg-noise-pattern pt-4 sm:pt-6">
      {/* Page title */}
      <div className="w-full flex items-center justify-between px-4 sm:px-6 mb-4 sm:mb-6 relative z-10">
        <Link href={backLink} className="text-aged-bone hover:text-blood-red transition-colors">
          <ArrowLeft size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8" />
          <span className="sr-only">Voltar</span>
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2 text-center max-w-[60%] sm:max-w-none">
          <h1 className="font-cinzel text-lg sm:text-2xl md:text-3xl lg:text-4xl text-aged-bone animate-fadeIn leading-tight">
            {pageTitle}
          </h1>
        </div>

        <div className="w-7 sm:w-8"></div>
      </div>

      <div className="w-full max-w-md px-4 pb-8 space-y-6 md:space-y-8 animate-fadeInUp">{children}</div>
    </div>
  )
}
