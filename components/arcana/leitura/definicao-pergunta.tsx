"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Send, RefreshCw, Loader2 } from "lucide-react"
import { buscarPerguntasSugeridas, buscarPerguntaAleatoria } from "@/lib/api-simulators"

interface DefinicaoPerguntaProps {
  modo: "audio" | "texto"
  onPerguntaSubmit: (pergunta: string) => void
}

interface PerguntaTarot {
  id: string
  texto: string
  categoria: "amor" | "trabalho" | "familia" | "dinheiro" | "saude" | "geral"
  popularidade: number
}

const categorias = [
  { value: "todas", label: "Todas" },
  { value: "amor", label: "❤️ Amor" },
  { value: "trabalho", label: "💼 Trabalho" },
  { value: "dinheiro", label: "💰 Dinheiro" },
  { value: "familia", label: "👨‍👩‍👧‍👦 Família" },
  { value: "saude", label: "🏥 Saúde" },
  { value: "geral", label: "🌟 Vida Geral" },
]

export function DefinicaoPergunta({ modo, onPerguntaSubmit }: DefinicaoPerguntaProps) {
  const [perguntaAtual, setPerguntaAtual] = useState("")
  const [perguntasSugeridas, setPerguntasSugeridas] = useState<PerguntaTarot[]>([])
  const [indicePerguntaAtual, setIndicePerguntaAtual] = useState(0)
  const [mostrarInputPersonalizado, setMostrarInputPersonalizado] = useState(false)
  const [categoriaAtual, setCategoriaAtual] = useState("todas")
  const [isLoadingPerguntas, setIsLoadingPerguntas] = useState(true)
  const [isLoadingNovaPergunta, setIsLoadingNovaPergunta] = useState(false)

  // Carregar perguntas iniciais
  useEffect(() => {
    carregarPerguntas(categoriaAtual)
  }, [categoriaAtual])

  const carregarPerguntas = async (categoria: string) => {
    setIsLoadingPerguntas(true)
    try {
      const perguntas = await buscarPerguntasSugeridas(categoria)
      setPerguntasSugeridas(perguntas)
      setIndicePerguntaAtual(0)
      if (perguntas.length > 0 && !mostrarInputPersonalizado) {
        setPerguntaAtual(perguntas[0].texto)
      }
    } catch (error) {
      console.error("Erro ao carregar perguntas:", error)
    } finally {
      setIsLoadingPerguntas(false)
    }
  }

  const handleSelecionarPredefinida = () => {
    if (perguntasSugeridas[indicePerguntaAtual]) {
      setPerguntaAtual(perguntasSugeridas[indicePerguntaAtual].texto)
      setMostrarInputPersonalizado(false)
    }
  }

  const proximaPergunta = () => {
    if (perguntasSugeridas.length > 0) {
      const novoIndice = (indicePerguntaAtual + 1) % perguntasSugeridas.length
      setIndicePerguntaAtual(novoIndice)
      if (!mostrarInputPersonalizado) {
        setPerguntaAtual(perguntasSugeridas[novoIndice].texto)
      }
    }
  }

  const perguntaAnterior = () => {
    if (perguntasSugeridas.length > 0) {
      const novoIndice = (indicePerguntaAtual - 1 + perguntasSugeridas.length) % perguntasSugeridas.length
      setIndicePerguntaAtual(novoIndice)
      if (!mostrarInputPersonalizado) {
        setPerguntaAtual(perguntasSugeridas[novoIndice].texto)
      }
    }
  }

  const buscarPerguntaAleatoriaNova = async () => {
    setIsLoadingNovaPergunta(true)
    try {
      const perguntaAleatoria = await buscarPerguntaAleatoria()
      setPerguntaAtual(perguntaAleatoria.texto)
      setMostrarInputPersonalizado(false)
    } catch (error) {
      console.error("Erro ao buscar pergunta aleatória:", error)
    } finally {
      setIsLoadingNovaPergunta(false)
    }
  }

  const handleSubmit = () => {
    if (perguntaAtual.trim()) {
      onPerguntaSubmit(perguntaAtual.trim())
    } else {
      alert("Por favor, defina sua pergunta.")
    }
  }

  const perguntaAtualExibida = perguntasSugeridas[indicePerguntaAtual]?.texto || "Carregando perguntas..."

  return (
    <Card className="bg-deep-black/70 border-2 border-blood-red/50 shadow-bone-dust text-aged-bone w-full backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-cinzel text-2xl md:text-3xl text-aged-bone">Defina sua Pergunta</CardTitle>
        <CardDescription className="font-serifRegular text-bone-dust-gray pt-2">
          Concentre-se em sua intenção. O que você busca revelar? (Modo: {modo})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Seletor de Categoria */}
        <div className="space-y-2">
          <p className="font-cinzel text-sm text-aged-bone/80">Categoria:</p>
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <Button
                key={cat.value}
                onClick={() => setCategoriaAtual(cat.value)}
                variant={categoriaAtual === cat.value ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  categoriaAtual === cat.value
                    ? "bg-blood-red text-aged-bone hover:bg-blood-red/80"
                    : "border-aged-bone/50 text-aged-bone hover:bg-aged-bone/10"
                }`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Perguntas Sugeridas */}
        {!mostrarInputPersonalizado && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-between">
              <p className="font-cinzel text-lg text-aged-bone">Perguntas Populares:</p>
              <Button
                onClick={buscarPerguntaAleatoriaNova}
                variant="ghost"
                size="sm"
                className="text-aged-bone hover:text-blood-red"
                disabled={isLoadingNovaPergunta}
              >
                {isLoadingNovaPergunta ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              </Button>
            </div>

            {isLoadingPerguntas ? (
              <div className="p-4 border border-dashed border-bone-dust-gray/50 rounded-md min-h-[80px] flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-aged-bone/50" />
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 md:space-x-4 p-4 border border-dashed border-bone-dust-gray/50 rounded-md min-h-[80px]">
                <Button
                  onClick={perguntaAnterior}
                  variant="ghost"
                  size="icon"
                  className="text-aged-bone hover:text-blood-red"
                  disabled={perguntasSugeridas.length === 0}
                >
                  <ChevronLeft size={24} />
                </Button>
                <p className="font-serifRegular text-aged-bone/90 text-center flex-grow min-h-[40px] flex items-center justify-center px-2">
                  {perguntaAtualExibida}
                </p>
                <Button
                  onClick={proximaPergunta}
                  variant="ghost"
                  size="icon"
                  className="text-aged-bone hover:text-blood-red"
                  disabled={perguntasSugeridas.length === 0}
                >
                  <ChevronRight size={24} />
                </Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={handleSelecionarPredefinida}
                className="bg-aged-bone text-deep-black hover:bg-aged-bone/80 font-cinzel"
                disabled={perguntasSugeridas.length === 0 || isLoadingPerguntas}
              >
                Usar esta Pergunta
              </Button>
              <Button
                onClick={() => {
                  setMostrarInputPersonalizado(true)
                  setPerguntaAtual("")
                }}
                variant="link"
                className="text-blood-red hover:text-blood-red/80 font-cinzel"
              >
                Escrever minha própria pergunta
              </Button>
            </div>
          </div>
        )}

        {/* Pergunta Personalizada */}
        {mostrarInputPersonalizado && (
          <div className="space-y-4">
            <Textarea
              placeholder="Escreva sua questão aqui... (ex: Será que ele gosta de mim?)"
              value={perguntaAtual}
              onChange={(e) => setPerguntaAtual(e.target.value)}
              className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone placeholder:text-bone-dust-gray/70 focus:border-blood-red min-h-[100px] font-serifRegular"
              rows={4}
            />
            <Button
              onClick={() => setMostrarInputPersonalizado(false)}
              variant="link"
              className="text-blood-red hover:text-blood-red/80 font-cinzel text-sm"
            >
              Ver perguntas sugeridas
            </Button>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel text-lg py-3 mt-4"
          disabled={!perguntaAtual.trim()}
        >
          <Send className="mr-2 h-5 w-5" />
          Iniciar Ritual
        </Button>
      </CardContent>
    </Card>
  )
}
