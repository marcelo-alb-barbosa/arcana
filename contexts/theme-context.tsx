"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type TemaSuportado = "arcano" | "iluminado" | "sangue-lunar" | "mistico"

interface ThemeContextType {
  tema: TemaSuportado
  setTema: (tema: TemaSuportado) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTemaState] = useState<TemaSuportado>("arcano")

  useEffect(() => {
    // Carregar tema salvo do localStorage
    const temaSalvo = localStorage.getItem("arcana-theme") as TemaSuportado
    if (temaSalvo && ["arcano", "iluminado", "sangue-lunar", "mistico"].includes(temaSalvo)) {
      setTemaState(temaSalvo)
      document.documentElement.className = `theme-${temaSalvo}`
    } else {
      // Tema padrão
      document.documentElement.className = "theme-arcano"
    }
  }, [])

  const setTema = (novoTema: TemaSuportado) => {
    setTemaState(novoTema)
    localStorage.setItem("arcana-theme", novoTema)
    document.documentElement.className = `theme-${novoTema}`
  }

  return <ThemeContext.Provider value={{ tema, setTema }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider")
  }
  return context
}
