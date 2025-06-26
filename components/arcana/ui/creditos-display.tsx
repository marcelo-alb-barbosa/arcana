"use client"

import { Coins } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useIdioma } from "@/contexts/idioma-context"

interface CreditosDisplayProps {
  creditos: number
  className?: string
}

export function CreditosDisplay({ creditos, className = "" }: CreditosDisplayProps) {
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
      title="Clique para comprar créditos"
    >
      <Coins size={16} className="mr-1.5 text-yellow-400" />
      <span className="text-xs font-serifRegular">
        {creditos} {t("header.credits")}
      </span>
    </Button>
  )
}
