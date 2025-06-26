"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Languages, Check, Globe } from "lucide-react"
import { useIdioma } from "@/contexts/idioma-context"

const idiomas = [
  { codigo: "pt" as const, nome: "Português", bandeira: "🇧🇷" },
  { codigo: "en" as const, nome: "English", bandeira: "🇺🇸" },
  { codigo: "es" as const, nome: "Español", bandeira: "🇪🇸" },
  { codigo: "fr" as const, nome: "Français", bandeira: "🇫🇷" },
  { codigo: "it" as const, nome: "Italiano", bandeira: "🇮🇹" },
  { codigo: "de" as const, nome: "Deutsch", bandeira: "🇩🇪" },
  { codigo: "ru" as const, nome: "Русский", bandeira: "🇷🇺" },
  { codigo: "ja" as const, nome: "日本語", bandeira: "🇯🇵" },
  { codigo: "zh" as const, nome: "中文", bandeira: "🇨🇳" },
  { codigo: "ar" as const, nome: "العربية", bandeira: "🇸🇦" },
]

interface SeletorIdiomaProps {
  className?: string
  expanded?: boolean
}

export function SeletorIdioma({ className = "", expanded = false }: SeletorIdiomaProps) {
  const { idioma, setIdioma, t } = useIdioma()
  const [isOpen, setIsOpen] = useState(false)

  // Encontrar o idioma atual na lista de idiomas
  const idiomaAtual = idiomas.find((i) => i.codigo === idioma) || idiomas[0]

  // Se estiver no modo expandido, mostrar botões em uma grade flexível
  if (expanded) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {idiomas.map((idiomaOpcao) => (
          <Button
            key={idiomaOpcao.codigo}
            variant={idioma === idiomaOpcao.codigo ? "default" : "outline"}
            size="sm"
            onClick={() => setIdioma(idiomaOpcao.codigo)}
            className={`${
              idioma === idiomaOpcao.codigo
                ? "bg-blood-red text-aged-bone hover:bg-blood-red/80"
                : "border-aged-bone/30 text-aged-bone hover:bg-aged-bone/10"
            }`}
          >
            <span className="mr-1 text-base">{idiomaOpcao.bandeira}</span>
            <span className="text-xs font-cinzel">{idiomaOpcao.nome}</span>
          </Button>
        ))}
      </div>
    )
  }

  // Modo popover com grid para melhor usabilidade
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`text-aged-bone hover:bg-aged-bone/10 hover:text-aged-bone px-2 py-1 ${className}`}
          title={t("language.changeLanguage")}
        >
          <Languages size={16} className="mr-1.5" />
          <span className="text-xs font-serifRegular">{idiomaAtual?.bandeira}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[280px] p-3 bg-deep-black border-2 border-blood-red/30 text-aged-bone shadow-bone-dust"
      >
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blood-red/20">
          <Globe size={16} className="text-blood-red" />
          <h3 className="text-sm font-cinzel">{t("language.changeLanguage")}</h3>
        </div>
        <div className="grid grid-cols-2 gap-1 mt-2">
          {idiomas.map((idiomaOpcao) => (
            <Button
              key={idiomaOpcao.codigo}
              variant={idioma === idiomaOpcao.codigo ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIdioma(idiomaOpcao.codigo)
                setIsOpen(false)
              }}
              className={`h-auto py-1.5 px-2 justify-start text-left ${
                idioma === idiomaOpcao.codigo
                  ? "bg-blood-red/20 border-blood-red text-aged-bone"
                  : "bg-deep-black/30 border-bone-dust-gray/30 text-bone-dust-gray hover:bg-aged-bone/10 hover:text-aged-bone"
              }`}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="text-base">{idiomaOpcao.bandeira}</span>
                <span className="text-xs font-serifRegular truncate">{idiomaOpcao.nome}</span>
                {idioma === idiomaOpcao.codigo && <Check size={12} className="text-blood-red ml-auto" />}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
