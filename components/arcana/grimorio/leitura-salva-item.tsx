"use client"

import type { LeituraSalva } from "@/lib/grimorio-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CalendarDays, HelpCircle, Eye, Coins, Mic, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface LeituraSalvaItemProps {
  leitura: LeituraSalva
}

export function LeituraSalvaItem({ leitura }: LeituraSalvaItemProps) {
  const router = useRouter()
  const dataFormatada = new Date(leitura.dataLeitura).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleVerDetalhes = () => {
    router.push(`/grimorio/${leitura.id}`)
  }

  return (
    <Card className="bg-deep-black/70 border-2 border-blood-red/30 shadow-bone-dust text-aged-bone backdrop-blur-sm overflow-hidden hover:border-blood-red/60 transition-colors duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-cinzel text-xl md:text-2xl text-aged-bone/90 leading-tight">
              Oráculo de {new Date(leitura.dataLeitura).toLocaleDateString("pt-BR", { month: "long" })}
            </CardTitle>
            <CardDescription className="font-serifRegular text-xs text-bone-dust-gray flex items-center mt-1">
              <CalendarDays size={14} className="mr-1.5" /> {dataFormatada}
            </CardDescription>
          </div>
          <div className="flex items-center text-xs font-serifRegular text-aged-bone/70">
            {leitura.modo === "audio" ? (
              <Mic size={14} className="mr-1 text-purple-400" />
            ) : (
              <FileText size={14} className="mr-1 text-blue-400" />
            )}
            Modo {leitura.modo.charAt(0).toUpperCase() + leitura.modo.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="mb-3">
          <p className="font-cinzel text-sm text-aged-bone/80 mb-1 flex items-center">
            <HelpCircle size={16} className="mr-2 text-blood-red/70" /> A Questão Proposta:
          </p>
          <p className="font-serifRegular text-aged-bone/95 italic ml-1">"{leitura.pergunta}"</p>
        </div>

        <div className="mb-3">
          <p className="font-cinzel text-sm text-aged-bone/80 mb-2">Arcanos Revelados:</p>
          <div className="flex flex-wrap gap-1.5">
            {leitura.cartas.slice(0, 5).map(
              (
                carta, // Mostra até 5 cartas como preview
              ) => (
                <div
                  key={carta.id}
                  className="relative w-10 h-[70px] sm:w-12 sm:h-[84px] border border-aged-bone/30 rounded overflow-hidden group"
                  title={carta.nome}
                >
                  <Image
                    src={carta.imagemUrl || "/placeholder.svg"}
                    alt={carta.nome}
                    fill
                    sizes="(max-width: 639px) 40px, 48px"
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
              ),
            )}
            {leitura.cartas.length > 5 && (
              <div className="w-10 h-[70px] sm:w-12 sm:h-[84px] border border-dashed border-aged-bone/30 rounded bg-deep-black/50 flex items-center justify-center text-xs text-aged-bone/70">
                +{leitura.cartas.length - 5}
              </div>
            )}
          </div>
        </div>
        <p className="font-serifRegular text-xs text-bone-dust-gray mt-2 flex items-center">
          <Coins size={14} className="mr-1.5 text-yellow-400" />
          Custo da Leitura: {leitura.custoCreditos} créditos
        </p>
      </CardContent>
      <CardFooter className="bg-deep-black/30 p-3">
        <Button
          onClick={handleVerDetalhes}
          variant="outline"
          className="w-full border-aged-bone/50 text-aged-bone hover:bg-aged-bone/10 hover:text-white font-cinzel text-sm"
        >
          <Eye size={16} className="mr-2" />
          Revisitar Sabedoria
        </Button>
      </CardFooter>
    </Card>
  )
}
