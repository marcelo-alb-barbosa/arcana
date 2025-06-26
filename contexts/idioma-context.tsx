"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import pt from "../locales/pt"
import en from "../locales/en"
import es from "../locales/es"
import fr from "../locales/fr"
import it from "../locales/it"
import de from "../locales/de"
import ru from "../locales/ru"
import ja from "../locales/ja"
import zh from "../locales/zh"
import ar from "../locales/ar"

type IdiomaSuportado = "pt" | "en" | "es" | "fr" | "it" | "de" | "ru" | "ja" | "zh" | "ar"

interface IdiomaContextType {
  idioma: IdiomaSuportado
  setIdioma: (idioma: IdiomaSuportado) => void
  t: (key: string) => string
}

const IdiomaContext = createContext<IdiomaContextType | undefined>(undefined)

// Traduções
const traducoes = {
  pt,
  en,
  es,
  fr,
  it,
  de,
  ja,
  zh,
  ru,
  ar,
}

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<IdiomaSuportado>("pt")

  useEffect(() => {
    // Carregar idioma salvo do localStorage
    const idiomaSalvo = localStorage.getItem("arcana-idioma") as IdiomaSuportado
    if (idiomaSalvo && ["pt", "en", "es", "fr", "it", "de", "ru", "ja", "zh", "ar"].includes(idiomaSalvo)) {
      setIdiomaState(idiomaSalvo)
    }
  }, [])

  const setIdioma = (novoIdioma: IdiomaSuportado) => {
    setIdiomaState(novoIdioma)
    localStorage.setItem("arcana-idioma", novoIdioma)
  }

  const t = (key: string): string => {
    // Verificar se a chave existe no idioma atual
    if (traducoes[idioma] && traducoes[idioma][key as keyof (typeof traducoes)[typeof idioma]]) {
      return traducoes[idioma][key as keyof (typeof traducoes)[typeof idioma]]
    }

    // Se não existir no idioma atual, tentar em inglês
    if (idioma !== "en" && traducoes["en"] && traducoes["en"][key as keyof (typeof traducoes)["en"]]) {
      return traducoes["en"][key as keyof (typeof traducoes)["en"]]
    }

    // Se não existir em inglês, retornar a chave
    return key
  }

  return <IdiomaContext.Provider value={{ idioma, setIdioma, t }}>{children}</IdiomaContext.Provider>
}

export function useIdioma() {
  const context = useContext(IdiomaContext)
  if (context === undefined) {
    throw new Error("useIdioma deve ser usado dentro de um IdiomaProvider")
  }
  return context
}
