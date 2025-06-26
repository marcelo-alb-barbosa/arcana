"use client"

import type React from "react"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock, Calendar, User } from "lucide-react"
import { useIdioma } from "@/contexts/idioma-context"

interface FormularioAdicionarCartaoProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAdicionarCartao: (dadosCartao: DadosCartao) => void
}

interface DadosCartao {
  numero: string
  nome: string
  validade: string
  cvv: string
  bandeira: string
}

export function FormularioAdicionarCartao({ isOpen, onOpenChange, onAdicionarCartao }: FormularioAdicionarCartaoProps) {
  const { t } = useIdioma()
  const [dadosCartao, setDadosCartao] = useState<DadosCartao>({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
    bandeira: "",
  })

  const [erros, setErros] = useState<Partial<DadosCartao>>({})

  const detectarBandeira = (numero: string) => {
    const numeroLimpo = numero.replace(/\s/g, "")
    if (numeroLimpo.startsWith("4")) return "Visa"
    if (numeroLimpo.startsWith("5") || numeroLimpo.startsWith("2")) return "Mastercard"
    if (numeroLimpo.startsWith("3")) return "American Express"
    return "Desconhecida"
  }

  const formatarNumeroCartao = (valor: string) => {
    const numeroLimpo = valor.replace(/\D/g, "")
    const numeroFormatado = numeroLimpo.replace(/(\d{4})(?=\d)/g, "$1 ")
    return numeroFormatado.substring(0, 19) // Máximo 16 dígitos + 3 espaços
  }

  const formatarValidade = (valor: string) => {
    const numeroLimpo = valor.replace(/\D/g, "")
    if (numeroLimpo.length >= 2) {
      return `${numeroLimpo.substring(0, 2)}/${numeroLimpo.substring(2, 4)}`
    }
    return numeroLimpo
  }

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    const numeroFormatado = formatarNumeroCartao(valor)
    const bandeira = detectarBandeira(numeroFormatado)

    setDadosCartao((prev) => ({
      ...prev,
      numero: numeroFormatado,
      bandeira,
    }))
  }

  const handleValidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    const validadeFormatada = formatarValidade(valor)

    setDadosCartao((prev) => ({
      ...prev,
      validade: validadeFormatada,
    }))
  }

  const validarFormulario = () => {
    const novosErros: Partial<DadosCartao> = {}

    if (!dadosCartao.numero || dadosCartao.numero.replace(/\s/g, "").length < 13) {
      novosErros.numero = t("card.error.invalidNumber")
    }

    if (!dadosCartao.nome || dadosCartao.nome.length < 2) {
      novosErros.nome = t("card.error.invalidName")
    }

    if (!dadosCartao.validade || dadosCartao.validade.length !== 5) {
      novosErros.validade = t("card.error.invalidExpiry")
    }

    if (!dadosCartao.cvv || dadosCartao.cvv.length < 3) {
      novosErros.cvv = t("card.error.invalidCvv")
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validarFormulario()) {
      onAdicionarCartao(dadosCartao)
      onOpenChange(false)

      // Resetar formulário
      setDadosCartao({
        numero: "",
        nome: "",
        validade: "",
        cvv: "",
        bandeira: "",
      })
      setErros({})
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-deep-black border-2 border-blood-red text-aged-bone shadow-bone-dust sm:max-w-md">
        <DialogHeader className="text-center items-center">
          <CreditCard className="w-16 h-16 text-blood-red mb-3" strokeWidth={1.5} />
          <DialogTitle className="font-cinzel text-2xl text-aged-bone">{t("card.addTitle")}</DialogTitle>
          <DialogDescription className="font-serifRegular text-bone-dust-gray pt-2">
            {t("card.addDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Número do Cartão */}
          <div className="space-y-2">
            <Label htmlFor="numero" className="font-cinzel text-aged-bone flex items-center gap-2">
              <CreditCard size={16} />
              {t("card.number")}
            </Label>
            <Input
              id="numero"
              type="text"
              value={dadosCartao.numero}
              onChange={handleNumeroChange}
              placeholder="1234 5678 9012 3456"
              className="bg-deep-black/80 border-blood-red/50 text-aged-bone"
            />
            {dadosCartao.bandeira && <p className="text-xs text-blood-red">{dadosCartao.bandeira}</p>}
            {erros.numero && <p className="text-xs text-red-400">{erros.numero}</p>}
          </div>

          {/* Nome no Cartão */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="font-cinzel text-aged-bone flex items-center gap-2">
              <User size={16} />
              {t("card.holderName")}
            </Label>
            <Input
              id="nome"
              type="text"
              value={dadosCartao.nome}
              onChange={(e) => setDadosCartao((prev) => ({ ...prev, nome: e.target.value.toUpperCase() }))}
              placeholder="JOÃO DA SILVA"
              className="bg-deep-black/80 border-blood-red/50 text-aged-bone"
            />
            {erros.nome && <p className="text-xs text-red-400">{erros.nome}</p>}
          </div>

          {/* Validade e CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validade" className="font-cinzel text-aged-bone flex items-center gap-2">
                <Calendar size={16} />
                {t("card.expiry")}
              </Label>
              <Input
                id="validade"
                type="text"
                value={dadosCartao.validade}
                onChange={handleValidadeChange}
                placeholder="MM/AA"
                className="bg-deep-black/80 border-blood-red/50 text-aged-bone"
              />
              {erros.validade && <p className="text-xs text-red-400">{erros.validade}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv" className="font-cinzel text-aged-bone flex items-center gap-2">
                <Lock size={16} />
                {t("card.cvv")}
              </Label>
              <Input
                id="cvv"
                type="text"
                value={dadosCartao.cvv}
                onChange={(e) =>
                  setDadosCartao((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, "").substring(0, 4) }))
                }
                placeholder="123"
                className="bg-deep-black/80 border-blood-red/50 text-aged-bone"
              />
              {erros.cvv && <p className="text-xs text-red-400">{erros.cvv}</p>}
            </div>
          </div>

          {/* Aviso de Segurança */}
          <div className="bg-blood-red/10 border border-blood-red/30 rounded-md p-3">
            <p className="text-xs text-bone-dust-gray text-center">
              <Lock size={12} className="inline mr-1" />
              {t("card.securityNotice")}
            </p>
          </div>

          <DialogFooter className="sm:justify-center gap-2 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-aged-bone/50 text-aged-bone hover:bg-aged-bone/10 hover:text-white font-cinzel"
              >
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel">
              <CreditCard size={18} className="mr-2" />
              {t("card.addButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
