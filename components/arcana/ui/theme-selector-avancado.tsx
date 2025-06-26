"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Moon, Sun, Droplets, Stars, Palette } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useIdioma } from "@/contexts/idioma-context"

const temas = [
  {
    id: "arcano",
    icone: Moon,
    cores: ["#0a0a0a", "#8b1538", "#f5f5dc", "#666666"],
  },
  {
    id: "iluminado",
    icone: Sun,
    cores: ["#faf9f6", "#d4af37", "#2c1810", "#8b7355"],
  },
  {
    id: "sangue-lunar",
    icone: Droplets,
    cores: ["#1a0000", "#cc0000", "#ffcccc", "#800000"],
  },
  {
    id: "mistico",
    icone: Stars,
    cores: ["#1a0d1a", "#6a0dad", "#e6ccff", "#4b0082"],
  },
]

export default function ThemeSelectorAvancado() {
  const { tema, setTema } = useTheme()
  const { t } = useIdioma()

  return (
    <Card className="bg-deep-black/50 border-blood-red/30">
      <CardHeader>
        <CardTitle className="font-cinzel text-aged-bone flex items-center gap-2">
          <Palette size={20} />
          {t("theme.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {temas.map((temaItem) => {
            const IconeComponente = temaItem.icone
            return (
              <Button
                key={temaItem.id}
                variant="outline"
                className={`
                  h-auto p-4 flex-col items-start text-left relative
                  ${
                    tema === temaItem.id
                      ? "bg-blood-red/20 border-blood-red"
                      : "bg-deep-black/30 border-bone-dust-gray/30 hover:bg-blood-red/10"
                  }
                `}
                onClick={() => setTema(temaItem.id as any)}
              >
                <div className="flex items-center gap-3 w-full mb-2">
                  <IconeComponente size={20} className="text-aged-bone" />
                  <div className="flex-1">
                    <div className="font-cinzel text-sm text-aged-bone">{t(`theme.${temaItem.id}`)}</div>
                  </div>
                  {tema === temaItem.id && <Check size={16} className="text-blood-red" />}
                </div>

                {/* Preview das cores */}
                <div className="flex gap-1 w-full">
                  {temaItem.cores.map((cor, index) => (
                    <div
                      key={index}
                      className="h-4 flex-1 rounded-sm border border-bone-dust-gray/30"
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
