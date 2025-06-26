"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, FileText, Coins } from "lucide-react" // Adicionado Coins

interface ModoEscolhaModalProps {
  onModoSelect: (modo: "audio" | "texto") => void
}

const CUSTO_AUDIO = 200
const CUSTO_TEXTO = 100

export function ModoEscolhaModal({ onModoSelect }: ModoEscolhaModalProps) {
  return (
    <Card className="bg-deep-black/80 border-2 border-blood-red shadow-bone-dust text-aged-bone w-full max-w-md mx-auto backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-cinzel text-2xl md:text-3xl text-aged-bone">Escolha o Modo da Leitura</CardTitle>
        <CardDescription className="font-serifRegular text-bone-dust-gray pt-2">
          Como você deseja receber as revelações do oráculo?
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6 p-6 md:p-8">
        <div className="flex flex-col items-center">
          <Button
            onClick={() => onModoSelect("audio")}
            className="w-full md:w-3/4 bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel text-lg py-6 border-2 border-transparent hover:border-aged-bone transition-all duration-300"
          >
            <Volume2 className="mr-3 h-6 w-6" />
            Modo Áudio
          </Button>
          <p className="font-serifRegular text-xs text-bone-dust-gray mt-2 text-center px-4">
            Ouça o oráculo falar em tons místicos.
          </p>
          <div className="flex items-center text-yellow-400 text-xs mt-1.5">
            <Coins size={14} className="mr-1" />
            <span>Custo: {CUSTO_AUDIO} Créditos</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Button
            onClick={() => onModoSelect("texto")}
            variant="outline"
            className="w-full md:w-3/4 border-2 border-blood-red text-aged-bone hover:bg-blood-red/10 hover:text-white font-cinzel text-lg py-6 transition-all duration-300"
          >
            <FileText className="mr-3 h-6 w-6" />
            Modo Texto
          </Button>
          <p className="font-serifRegular text-xs text-bone-dust-gray mt-2 text-center px-4">
            Leia revelações simbólicas como em um grimório ancestral.
          </p>
          <div className="flex items-center text-yellow-400 text-xs mt-1.5">
            <Coins size={14} className="mr-1" />
            <span>Custo: {CUSTO_TEXTO} Créditos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
