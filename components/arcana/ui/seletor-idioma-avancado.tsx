"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Globe } from "lucide-react"
import { useIdioma } from "@/contexts/idioma-context"

const idiomas = [
  { codigo: "pt", bandeira: "🇧🇷" },
  { codigo: "en", bandeira: "🇺🇸" },
  { codigo: "es", bandeira: "🇪🇸" },
  { codigo: "fr", bandeira: "🇫🇷" },
  { codigo: "it", bandeira: "🇮🇹" },
  { codigo: "de", bandeira: "🇩🇪" },
  { codigo: "ru", bandeira: "🇷🇺" },
  { codigo: "ja", bandeira: "🇯🇵" },
  { codigo: "zh", bandeira: "🇨🇳" },
  { codigo: "ar", bandeira: "🇸🇦" },
]

export default function SeletorIdiomaAvancado() {
  const { idioma, setIdioma, t } = useIdioma()

  return (
    <Card className="bg-deep-black/50 border-blood-red/30">
      <CardHeader>
        <CardTitle className="font-cinzel text-aged-bone flex items-center gap-2">
          <Globe size={20} />
          {t("language.changeLanguage")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {idiomas.map((lang) => (
            <Button
              key={lang.codigo}
              variant={idioma === lang.codigo ? "default" : "outline"}
              className={`
                h-auto p-3 justify-start text-left relative
                ${
                  idioma === lang.codigo
                    ? "bg-blood-red/20 border-blood-red text-aged-bone"
                    : "bg-deep-black/30 border-bone-dust-gray/30 text-bone-dust-gray hover:bg-aged-bone/10 hover:text-aged-bone"
                }
              `}
              onClick={() => setIdioma(lang.codigo as any)}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-xl">{lang.bandeira}</span>
                <div className="flex-1">
                  <div className="font-cinzel text-sm">
                    {t(
                      `language.${lang.codigo === "pt" ? "portuguese" : lang.codigo === "en" ? "english" : lang.codigo === "es" ? "spanish" : lang.codigo === "fr" ? "french" : lang.codigo === "it" ? "italian" : lang.codigo === "de" ? "german" : lang.codigo === "ru" ? "russian" : lang.codigo === "ja" ? "japanese" : lang.codigo === "zh" ? "chinese" : "arabic"}`,
                    )}
                  </div>
                </div>
                {idioma === lang.codigo && <Check size={16} className="text-blood-red" />}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
