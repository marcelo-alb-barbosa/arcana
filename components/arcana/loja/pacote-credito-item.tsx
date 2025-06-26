"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, ShoppingCart } from "lucide-react"

export interface PacoteCredito {
  id: string
  creditos: number
  precoUSD: number
  descricao?: string
  icone?: React.ElementType // Para ícones de moedas antigas, se tiver
}

interface PacoteCreditoItemProps {
  pacote: PacoteCredito
  onComprarClick: (pacote: PacoteCredito) => void
}

export function PacoteCreditoItem({ pacote, onComprarClick }: PacoteCreditoItemProps) {
  return (
    <Card className="bg-deep-black/60 border-2 border-blood-red/40 shadow-bone-dust text-aged-bone hover:border-blood-red transition-all duration-300 flex flex-col">
      <CardHeader className="text-center items-center pt-6 pb-4">
        {pacote.icone ? (
          <pacote.icone className="w-12 h-12 text-yellow-400 mb-2" />
        ) : (
          <Coins className="w-12 h-12 text-yellow-400 mb-2" strokeWidth={1.5} />
        )}
        <CardTitle className="font-cinzel text-2xl text-aged-bone">{pacote.creditos} Créditos</CardTitle>
        {pacote.descricao && (
          <CardDescription className="font-serifRegular text-xs text-bone-dust-gray pt-1">
            {pacote.descricao}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-between flex-grow p-6 pt-2">
        <p className="font-cinzel text-3xl text-yellow-500 mb-6">US$ {pacote.precoUSD.toFixed(2)}</p>
        <Button
          onClick={() => onComprarClick(pacote)}
          className="w-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel text-lg py-3"
        >
          <ShoppingCart size={18} className="mr-2" />
          Adquirir
        </Button>
      </CardContent>
    </Card>
  )
}
