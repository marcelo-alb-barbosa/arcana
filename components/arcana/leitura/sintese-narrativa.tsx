"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Share2, Scroll, X, RotateCcw, Pause, Volume2 } from "lucide-react"
import { ShareModal } from "@/components/arcana/ui/share-modal"
import type { TarotCardData } from "@/lib/tarot-data"

interface SinteseNarrativaProps {
  cartas: TarotCardData[]
  pergunta: string
  modo?: "audio" | "texto"
  onFechar?: () => void
}

export function SinteseNarrativa({ cartas, pergunta, modo = "texto", onFechar }: SinteseNarrativaProps) {
  const [copiado, setCopiado] = useState(false)
  const [shareModalAberto, setShareModalAberto] = useState(false)
  const [reproduzindo, setReproduzindo] = useState(false)
  const [audioSuportado, setAudioSuportado] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Verificar se Speech Synthesis API está disponível
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setAudioSuportado(true)
    }

    // Cleanup ao desmontar componente
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const gerarNarrativa = () => {
    const introducao = `Em sua busca por respostas sobre "${pergunta}", você encontrou cinco sábios no caminho dos arcanos...`

    const encontros = cartas
      .map((carta, index) => {
        const posicoes = ["primeiro", "segundo", "terceiro", "quarto", "quinto"]
        const tipos = carta.arcanoMaior ? "Mestre Arcano" : "Sábio Elemental"

        return `O ${posicoes[index]} sábio, ${carta.nome} - ${tipos}, revelou que ${carta.resumo || "há segredos a serem descobertos"}. Sua sabedoria ancestral sussurra: "${carta.significado || "Observe além do véu da realidade comum"}."`
      })
      .join("\n\n")

    const sintese = `Ao final desta jornada mística, os cinco sábios sussurram em uníssono: As cartas revelam um caminho de transformação e crescimento. ${cartas[0]?.nome || "O primeiro arcano"} inicia sua jornada, ${cartas[2]?.nome || "O arcano central"} oferece o centro de equilíbrio, e ${cartas[4]?.nome || "O arcano final"} mostra o destino que aguarda. Confie na sabedoria ancestral e permita que os arcanos guiem seus próximos passos.`

    return `${introducao}\n\n${encontros}\n\n${sintese}`
  }

  const gerarTextoCompartilhamento = () => {
    const resumo = cartas
      .map((carta) => `• ${carta.nome}: ${carta.significado || "Mistério a ser revelado"}`)
      .join("\n")

    return `🔮 LEITURA DE TARÔ - ARCANA 🔮

Pergunta: "${pergunta}"

Cartas Reveladas:
${resumo}

✨ Síntese: Os arcanos revelam um caminho de sabedoria e transformação. Cada carta oferece uma perspectiva única para guiar sua jornada.

🌙 Descubra sua própria leitura no ARCANA - onde os mistérios se revelam.

#Tarot #ARCANA #Misticismo #Autoconhecimento`
  }

  const reproduzirAudio = () => {
    if (!audioSuportado) return

    if (reproduzindo) {
      // Pausar áudio
      window.speechSynthesis.cancel()
      setReproduzindo(false)
      return
    }

    // Iniciar reprodução
    const textoParaFalar = gerarNarrativa()
    const utterance = new SpeechSynthesisUtterance(textoParaFalar)

    // Configurações de voz
    utterance.rate = 0.8 // Velocidade mais lenta para narrativa mística
    utterance.pitch = 0.9 // Tom ligeiramente mais grave
    utterance.volume = 0.9

    // Tentar usar uma voz em português se disponível
    const voices = window.speechSynthesis.getVoices()
    const portugueseVoice = voices.find((voice) => voice.lang.includes("pt") || voice.lang.includes("br"))
    if (portugueseVoice) {
      utterance.voice = portugueseVoice
    }

    // Event listeners
    utterance.onstart = () => {
      setReproduzindo(true)
    }

    utterance.onend = () => {
      setReproduzindo(false)
    }

    utterance.onerror = () => {
      setReproduzindo(false)
      console.error("Erro na reprodução de áudio")
    }

    speechSynthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const copiarTexto = async () => {
    try {
      await navigator.clipboard.writeText(gerarTextoCompartilhamento())
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
      // Fallback para navegadores que não suportam clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = gerarTextoCompartilhamento()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  const abrirCompartilhamento = () => {
    setShareModalAberto(true)
  }

  const novaLeitura = () => {
    // Parar áudio se estiver reproduzindo
    if (reproduzindo) {
      window.speechSynthesis.cancel()
    }
    window.location.href = "/leitura"
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-6 relative">
        {/* Botão Fechar */}
        {onFechar && (
          <Button
            onClick={() => {
              // Parar áudio se estiver reproduzindo
              if (reproduzindo) {
                window.speechSynthesis.cancel()
              }
              onFechar()
            }}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-aged-bone hover:bg-aged-bone/10"
          >
            <X className="w-6 h-6" />
          </Button>
        )}

        <Card className="bg-gradient-to-br from-aged-bone/10 to-aged-bone/5 border-2 border-aged-bone/30 backdrop-blur-sm">
          <div className="p-8">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Scroll className="w-8 h-8 text-aged-bone" />
                <h2 className="font-cinzel text-3xl text-aged-bone">A Sabedoria dos Arcanos</h2>
                <Scroll className="w-8 h-8 text-aged-bone scale-x-[-1]" />
              </div>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-aged-bone to-transparent mx-auto" />

              {/* Botão de Áudio - aparece apenas no modo áudio ou se áudio estiver suportado */}
              {(modo === "audio" || audioSuportado) && (
                <div className="mt-6">
                  <Button
                    onClick={reproduzirAudio}
                    className={`${
                      reproduzindo ? "bg-blood-red/80 hover:bg-blood-red" : "bg-blood-red hover:bg-blood-red/80"
                    } text-aged-bone font-cinzel transition-all duration-300`}
                    disabled={!audioSuportado}
                  >
                    {reproduzindo ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pausar Narrativa
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-5 h-5 mr-2" />
                        Escutar Narrativa
                      </>
                    )}
                  </Button>

                  {!audioSuportado && (
                    <p className="text-aged-bone/60 text-sm mt-2">Áudio não suportado neste navegador</p>
                  )}
                </div>
              )}
            </div>

            {/* Narrativa */}
            <div className="prose prose-invert max-w-none">
              <div className="font-serifRegular text-aged-bone/90 leading-relaxed text-lg space-y-6">
                {gerarNarrativa()
                  .split("\n\n")
                  .map((paragrafo, index) => (
                    <p
                      key={index}
                      className={`animate-fadeIn ${reproduzindo ? "text-aged-bone" : ""}`}
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      {paragrafo}
                    </p>
                  ))}
              </div>
            </div>

            {/* Seção de Compartilhamento */}
            <div className="mt-12 pt-8 border-t border-aged-bone/20">
              <h3 className="font-cinzel text-xl text-aged-bone mb-4 text-center">Compartilhe sua Jornada Mística</h3>

              <div className="bg-deep-black/30 rounded-lg p-4 mb-6 border border-aged-bone/20">
                <pre className="font-serifRegular text-sm text-aged-bone/80 whitespace-pre-wrap leading-relaxed">
                  {gerarTextoCompartilhamento()}
                </pre>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={copiarTexto} className="bg-blood-red hover:bg-blood-red/80 text-aged-bone font-cinzel">
                  <Copy className="w-4 h-4 mr-2" />
                  {copiado ? "Copiado!" : "Copiar Texto"}
                </Button>

                <Button
                  onClick={abrirCompartilhamento}
                  variant="outline"
                  className="border-aged-bone/30 text-aged-bone hover:bg-aged-bone/10 font-cinzel"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>

                <Button
                  onClick={novaLeitura}
                  className="bg-aged-bone text-deep-black hover:bg-aged-bone/80 font-cinzel"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nova Leitura
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de Compartilhamento */}
      <ShareModal
        isOpen={shareModalAberto}
        onClose={setShareModalAberto}
        title="Minha Leitura de Tarô - ARCANA"
        text={gerarTextoCompartilhamento()}
      />
    </>
  )
}
