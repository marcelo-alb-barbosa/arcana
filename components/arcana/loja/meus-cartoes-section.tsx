"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, PlusCircle, Trash2 } from "lucide-react"
import { FormularioAdicionarCartao } from "./formulario-adicionar-cartao"
import { useState } from "react"

// Simulação de cartões salvos
const mockCartoes = [
  { id: "c1", final: "4242", bandeira: "Visa", validade: "12/2028" },
  { id: "c2", final: "8888", bandeira: "Mastercard", validade: "06/2027" },
]

interface MeusCartoesSectionProps {
  onAdicionarCartao: () => void
  onSelecionarCartao?: (cartaoId: string) => void // Para futuras implementações
  cartoesSalvos?: typeof mockCartoes // Receberia os cartões do usuário
}

export function MeusCartoesSection({
  onAdicionarCartao,
  cartoesSalvos = [], // Default para array vazio se não houver cartões
}: MeusCartoesSectionProps) {
  const temCartoes = cartoesSalvos.length > 0
  const [formularioAberto, setFormularioAberto] = useState(false)

  const handleAdicionarCartao = (dadosCartao: any) => {
    console.log("Novo cartão adicionado:", dadosCartao)
    // Aqui você adicionaria a lógica para salvar o cartão
  }

  return (
    <Card className="bg-deep-black/50 border border-aged-bone/20 shadow-md text-aged-bone mt-8">
      <CardHeader>
        <CardTitle className="font-cinzel text-lg text-aged-bone/90">Seus Métodos de Pagamento</CardTitle>
        {!temCartoes && (
          <CardDescription className="font-serifRegular text-sm text-bone-dust-gray pt-1">
            Nenhum cartão registrado. Adicione um para prosseguir com suas aquisições.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {temCartoes &&
          cartoesSalvos.map((cartao) => (
            <div
              key={cartao.id}
              className="flex items-center justify-between p-3 bg-aged-bone/10 rounded-md border border-aged-bone/20"
            >
              <div className="flex items-center">
                <CreditCard size={20} className="mr-3 text-blood-red/70" />
                <div>
                  <p className="font-semibold text-aged-bone">
                    {cartao.bandeira} final {cartao.final}
                  </p>
                  <p className="text-xs text-bone-dust-gray">Validade: {cartao.validade}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-aged-bone/70 hover:text-blood-red">
                <Trash2 size={16} />
                <span className="sr-only">Remover cartão</span>
              </Button>
            </div>
          ))}
        <Button
          onClick={() => setFormularioAberto(true)}
          variant="outline"
          className="w-full border-blood-red text-blood-red hover:bg-blood-red hover:text-aged-bone font-cinzel"
        >
          <PlusCircle size={18} className="mr-2" />
          {temCartoes ? "Adicionar Novo Cartão" : "Adicionar Cartão de Pagamento"}
        </Button>
      </CardContent>
      <FormularioAdicionarCartao
        isOpen={formularioAberto}
        onOpenChange={setFormularioAberto}
        onAdicionarCartao={handleAdicionarCartao}
      />
    </Card>
  )
}
