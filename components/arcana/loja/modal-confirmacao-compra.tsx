"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { PacoteCredito } from "./pacote-credito-item"
import { Coins, CheckCircle } from "lucide-react"

interface ModalConfirmacaoCompraProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  pacote: PacoteCredito | null
  onConfirmarCompra: (pacote: PacoteCredito) => void
}

export function ModalConfirmacaoCompra({
  isOpen,
  onOpenChange,
  pacote,
  onConfirmarCompra,
}: ModalConfirmacaoCompraProps) {
  if (!pacote) return null

  const handleConfirm = () => {
    onConfirmarCompra(pacote)
    onOpenChange(false) // Fecha o modal após confirmar
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-deep-black border-2 border-blood-red text-aged-bone shadow-bone-dust sm:max-w-md">
        <DialogHeader className="text-center items-center">
          <Coins className="w-16 h-16 text-yellow-400 mb-3" strokeWidth={1.5} />
          <DialogTitle className="font-cinzel text-2xl text-aged-bone">Confirmar Aquisição</DialogTitle>
          <DialogDescription className="font-serifRegular text-bone-dust-gray pt-2">
            Você está prestes a adquirir <strong className="text-yellow-500">{pacote.creditos} Créditos</strong> por{" "}
            <strong className="text-yellow-500">US$ {pacote.precoUSD.toFixed(2)}</strong>.
          </DialogDescription>
        </DialogHeader>
        <p className="font-serifRegular text-xs text-bone-dust-gray/80 text-center py-4">
          Ao confirmar, a transação será processada (simulação). Esta ação é um rito final.
        </p>
        <DialogFooter className="sm:justify-center gap-2 pt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-aged-bone/50 text-aged-bone hover:bg-aged-bone/10 hover:text-white font-cinzel"
            >
              Cancelar Ritual
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel"
          >
            <CheckCircle size={18} className="mr-2" />
            Confirmar e Pagar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
