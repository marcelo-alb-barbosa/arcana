"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Check, Palette } from "lucide-react"
import { useTheme } from "next-themes"

const temas = [
  { id: "dark", nome: "Arcano (Padrão)", icone: Moon },
  { id: "light", nome: "Iluminado", icone: Sun },
  { id: "blood", nome: "Sangue Lunar", icone: Palette },
  { id: "mystic", nome: "Místico", icone: Palette },
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const temaAtual = temas.find((t) => t.id === theme) || temas[0]
  const TemaIcone = temaAtual.icone

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-aged-bone/30 text-aged-bone hover:bg-aged-bone/10 hover:text-aged-bone"
          title="Alterar tema visual"
        >
          <TemaIcone size={16} className="mr-2" />
          <span className="text-sm font-cinzel">{temaAtual.nome}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-deep-black border-2 border-blood-red/30 text-aged-bone shadow-bone-dust min-w-[180px]"
      >
        {temas.map((temaOpcao) => (
          <DropdownMenuItem
            key={temaOpcao.id}
            onClick={() => {
              setTheme(temaOpcao.id)
              setIsOpen(false)
            }}
            className="cursor-pointer hover:bg-aged-bone/10 focus:bg-aged-bone/10 font-serifRegular"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <temaOpcao.icone size={16} className="mr-2" />
                <span className="text-sm">{temaOpcao.nome}</span>
              </div>
              {theme === temaOpcao.id && <Check size={16} className="text-blood-red" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
