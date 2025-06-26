import type { TarotCardData } from "./tarot-data"
import { baralhoExemplo } from "./tarot-data"

export interface LeituraSalva {
  id: string
  dataLeitura: string // ISO string for date
  pergunta: string
  modo: "audio" | "texto"
  cartas: TarotCardData[]
  dialogoArcanos: string // A síntese que já temos
  custoCreditos: number
}

// Função para pegar N cartas aleatórias do baralhoExemplo para simulação
const getRandomCards = (count: number): TarotCardData[] => {
  const shuffled = [...baralhoExemplo].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const leiturasSalvasExemplo: LeituraSalva[] = [
  {
    id: "ls001",
    dataLeitura: new Date(2025, 0, 15, 10, 30, 0).toISOString(), // 15 Jan 2025, 10:30
    pergunta: "Qual meu maior desafio atual e como superá-lo?",
    modo: "texto",
    cartas: [baralhoExemplo[0], baralhoExemplo[1], baralhoExemplo[2], baralhoExemplo[3], baralhoExemplo[4]],
    dialogoArcanos: "O Louco ⇾ Ás de Paus ⇾ O Mago ⇾ Dois de Copas ⇾ A Sacerdotisa",
    custoCreditos: 100,
  },
  {
    id: "ls002",
    dataLeitura: new Date(2025, 1, 20, 18, 45, 0).toISOString(), // 20 Feb 2025, 18:45
    pergunta: "Que energias devo focar para meu crescimento espiritual este mês?",
    modo: "audio",
    cartas: [baralhoExemplo[5], baralhoExemplo[6], baralhoExemplo[0], baralhoExemplo[2], baralhoExemplo[1]],
    dialogoArcanos: "A Imperatriz ⇾ Três de Espadas ⇾ O Louco ⇾ O Mago ⇾ Ás de Paus",
    custoCreditos: 200,
  },
  {
    id: "ls003",
    dataLeitura: new Date(2025, 2, 5, 14, 0, 0).toISOString(), // 05 Mar 2025, 14:00
    pergunta: "Como posso melhorar meus relacionamentos próximos?",
    modo: "texto",
    cartas: getRandomCards(5),
    dialogoArcanos: "Uma combinação única de arcanos se revelou...",
    custoCreditos: 100,
  },
]
