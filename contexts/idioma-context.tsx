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
  isLoading: boolean
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

// Função segura para acessar localStorage
const getLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') {
    return defaultValue
  }
  try {
    const value = localStorage.getItem(key)
    if (value === null) {
      return defaultValue
    }
    return value
  } catch (error) {
    console.error('Error accessing localStorage:', error)
    return defaultValue
  }
}

// Função segura para definir localStorage
const setLocalStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<IdiomaSuportado>("pt")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingAttempts, setLoadingAttempts] = useState(0)

  // Log component state
  console.log("🌐 IdiomaProvider - Rendering, isLoading:", isLoading, "idioma:", idioma, "attempts:", loadingAttempts)

  // Primary loading effect - try to load language and set loading state
  useEffect(() => {
    console.log("🌐 IdiomaProvider - Primary loading effect running")

    try {
      // Carregar idioma salvo do localStorage de forma segura
      const idiomaSalvo = getLocalStorage("arcana-idioma", "pt") as IdiomaSuportado
      console.log("🌐 IdiomaProvider - Loaded language:", idiomaSalvo)

      if (idiomaSalvo && ["pt", "en", "es", "fr", "it", "de", "ru", "ja", "zh", "ar"].includes(idiomaSalvo)) {
        setIdiomaState(idiomaSalvo)
      }

      // Set loading to false immediately - no need to wait
      console.log("🌐 IdiomaProvider - Setting isLoading to false")
      setIsLoading(false)
    } catch (error) {
      console.error("🌐 IdiomaProvider - Error in primary loading effect:", error)
      // Increment loading attempts to trigger backup effect
      setLoadingAttempts(prev => prev + 1)
    }
  }, [])

  // Backup loading effect - triggered if loading attempts > 0
  useEffect(() => {
    if (loadingAttempts > 0 && isLoading) {
      console.log("🌐 IdiomaProvider - Backup loading effect running, attempt:", loadingAttempts)

      // Try again with a delay
      const backupTimeout = setTimeout(() => {
        try {
          // Use default language (pt) as fallback
          console.log("🌐 IdiomaProvider - Using default language as fallback")
          setIdiomaState("pt")
          setIsLoading(false)
        } catch (error) {
          console.error("🌐 IdiomaProvider - Error in backup loading effect:", error)
          // If we're still failing after multiple attempts, force loading to complete
          if (loadingAttempts >= 3) {
            console.log("🚨 IdiomaProvider - Forcing loading to complete after multiple failures")
            setIsLoading(false)
          } else {
            // Try again
            setLoadingAttempts(prev => prev + 1)
          }
        }
      }, 500) // 500ms delay between attempts

      return () => clearTimeout(backupTimeout)
    }
  }, [loadingAttempts, isLoading])

  // Emergency timeout - absolute last resort
  useEffect(() => {
    if (isLoading) {
      console.log("🌐 IdiomaProvider - Setting up emergency timeout")

      const emergencyTimeout = setTimeout(() => {
        console.log("🚨 IdiomaProvider - Emergency timeout: forcing loading to complete")
        setIsLoading(false)
      }, 1000) // 1 second maximum wait time

      return () => clearTimeout(emergencyTimeout)
    }
  }, [isLoading])

  const setIdioma = (novoIdioma: IdiomaSuportado) => {
    setIdiomaState(novoIdioma)
    setLocalStorage("arcana-idioma", novoIdioma)
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

  return <IdiomaContext.Provider value={{ idioma, setIdioma, t, isLoading }}>{children}</IdiomaContext.Provider>
}

export function useIdioma() {
  const context = useContext(IdiomaContext)
  if (context === undefined) {
    throw new Error("useIdioma deve ser usado dentro de um IdiomaProvider")
  }
  return context
}
