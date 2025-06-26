"use client"

import { useState } from "react"
import { Calendar, CreditCard, Filter, Receipt } from "lucide-react"
import { useIdioma } from "@/contexts/idioma-context"

interface Transacao {
  id: string
  data: string
  valor: number
  creditos: number
  metodo: string
  status: "aprovada" | "pendente" | "rejeitada"
  cartaoFinal: string
}

// Mock de dados de transações
const mockTransacoes: Transacao[] = [
  {
    id: "TXN-2024-001",
    data: "2024-01-15T14:30:00",
    valor: 29.9,
    creditos: 500,
    metodo: "Visa",
    status: "aprovada",
    cartaoFinal: "4532",
  },
  {
    id: "TXN-2024-002",
    data: "2024-01-10T09:15:00",
    valor: 49.9,
    creditos: 1000,
    metodo: "Mastercard",
    status: "aprovada",
    cartaoFinal: "8765",
  },
  {
    id: "TXN-2024-003",
    data: "2024-01-08T16:45:00",
    valor: 19.9,
    creditos: 250,
    metodo: "Visa",
    status: "pendente",
    cartaoFinal: "4532",
  },
  {
    id: "TXN-2024-004",
    data: "2024-01-05T11:20:00",
    valor: 99.9,
    creditos: 2500,
    metodo: "American Express",
    status: "rejeitada",
    cartaoFinal: "1234",
  },
  {
    id: "TXN-2024-005",
    data: "2024-01-03T13:10:00",
    valor: 29.9,
    creditos: 500,
    metodo: "Mastercard",
    status: "aprovada",
    cartaoFinal: "8765",
  },
]

export function HistoricoTransacoes() {
  const { t } = useIdioma()
  const [filtroStatus, setFiltroStatus] = useState<string>("todas")

  const transacoesFiltradas = mockTransacoes.filter((transacao) => {
    if (filtroStatus === "todas") return true
    return transacao.status === filtroStatus
  })

  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovada":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pendente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "rejeitada":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "aprovada":
        return t("transaction.approved")
      case "pendente":
        return t("transaction.pending")
      case "rejeitada":
        return t("transaction.rejected")
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-cinzel text-2xl text-aged-bone">{t("transaction.history")}</h2>
        <p className="text-aged-bone/70 text-sm">{t("transaction.historyDescription")}</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setFiltroStatus("todas")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroStatus === "todas"
              ? "bg-blood-red text-aged-bone"
              : "bg-aged-bone/10 text-aged-bone/70 hover:bg-aged-bone/20"
          }`}
        >
          <Filter className="w-4 h-4 inline mr-2" />
          {t("transaction.all")}
        </button>
        <button
          onClick={() => setFiltroStatus("aprovada")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroStatus === "aprovada"
              ? "bg-blood-red text-aged-bone"
              : "bg-aged-bone/10 text-aged-bone/70 hover:bg-aged-bone/20"
          }`}
        >
          {t("transaction.approved")}
        </button>
        <button
          onClick={() => setFiltroStatus("pendente")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroStatus === "pendente"
              ? "bg-blood-red text-aged-bone"
              : "bg-aged-bone/10 text-aged-bone/70 hover:bg-aged-bone/20"
          }`}
        >
          {t("transaction.pending")}
        </button>
        <button
          onClick={() => setFiltroStatus("rejeitada")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroStatus === "rejeitada"
              ? "bg-blood-red text-aged-bone"
              : "bg-aged-bone/10 text-aged-bone/70 hover:bg-aged-bone/20"
          }`}
        >
          {t("transaction.rejected")}
        </button>
      </div>

      {/* Lista de Transações */}
      <div className="space-y-4">
        {transacoesFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-aged-bone/30 mx-auto mb-4" />
            <p className="text-aged-bone/70">{t("transaction.noTransactions")}</p>
          </div>
        ) : (
          transacoesFiltradas.map((transacao) => (
            <div
              key={transacao.id}
              className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-4 hover:bg-aged-bone/10 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Informações principais */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-aged-bone/70" />
                    <span className="text-sm text-aged-bone/70">{formatarData(transacao.data)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-aged-bone/70" />
                    <span className="text-sm text-aged-bone/70">
                      {transacao.metodo} •••• {transacao.cartaoFinal}
                    </span>
                  </div>

                  <div className="text-xs text-aged-bone/50">ID: {transacao.id}</div>
                </div>

                {/* Valores */}
                <div className="text-right space-y-1">
                  <div className="font-cinzel text-lg text-aged-bone">{formatarValor(transacao.valor)}</div>
                  <div className="text-sm text-aged-bone/70">
                    {transacao.creditos} {t("transaction.credits")}
                  </div>
                </div>

                {/* Status */}
                <div className="sm:ml-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transacao.status)}`}
                  >
                    {getStatusText(transacao.status)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resumo */}
      {transacoesFiltradas.length > 0 && (
        <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-4">
          <div className="text-center space-y-2">
            <h3 className="font-cinzel text-lg text-aged-bone">{t("transaction.summary")}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-aged-bone/70">{t("transaction.totalSpent")}:</span>
                <div className="font-cinzel text-aged-bone">
                  {formatarValor(
                    transacoesFiltradas.filter((t) => t.status === "aprovada").reduce((total, t) => total + t.valor, 0),
                  )}
                </div>
              </div>
              <div>
                <span className="text-aged-bone/70">{t("transaction.totalCredits")}:</span>
                <div className="font-cinzel text-aged-bone">
                  {transacoesFiltradas
                    .filter((t) => t.status === "aprovada")
                    .reduce((total, t) => total + t.creditos, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
