"use client"

import { Coins } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useIdioma } from "@/contexts/idioma-context"

interface CreditsDisplayProps {
  credits: number
  className?: string
}

export function CreditsDisplay({ credits, className = "" }: CreditsDisplayProps) {
  const router = useRouter()
  const { t } = useIdioma()

  const handleClick = () => {
    router.push("/loja")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`flex items-center text-aged-bone/80 hover:text-aged-bone hover:bg-aged-bone/10 px-2 py-1 ${className}`}
      title={t("header.clickToBuyCredits")}
    >
      <Coins size={16} className="mr-1.5 text-yellow-400" />
      <span className="text-xs font-serifRegular">
        {credits} {t("header.credits")}
      </span>
    </Button>
  )
}