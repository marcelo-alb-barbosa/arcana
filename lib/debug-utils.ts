// Utilitários para modo de debug/desenvolvimento

export const isDebugModeEnabled = (): boolean => {
  if (typeof window === "undefined") return false

  // Verificar tanto a env quanto localStorage para debug forçado
  const envEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === "true"
  const localEnabled = localStorage.getItem("arcana-force-debug") === "true"

  return envEnabled || localEnabled
}

// Função para forçar debug mode (útil para testes)
export const forceDebugMode = (enabled: boolean) => {
  if (typeof window === "undefined") return

  if (enabled) {
    localStorage.setItem("arcana-force-debug", "true")
  } else {
    localStorage.removeItem("arcana-force-debug")
  }
}

export const getDebugInfo = () => {
  if (typeof window === "undefined") return {}

  return {
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    localStorage: {
      authData: localStorage.getItem("arcana-auth"),
      splashShown: sessionStorage.getItem("arcana-splash-shown"),
      language: localStorage.getItem("arcana-idioma"),
      forceDebug: localStorage.getItem("arcana-force-debug"),
    },
    environment: {
      testMode: process.env.NEXT_PUBLIC_ENABLE_TEST_MODE,
      nodeEnv: process.env.NODE_ENV,
    },
    timestamp: new Date().toISOString(),
  }
}

export const clearAllStorage = () => {
  if (typeof window === "undefined") return false

  try {
    localStorage.clear()
    sessionStorage.clear()
    return true
  } catch (error) {
    console.error("Erro ao limpar storage:", error)
    return false
  }
}

export const exportDebugData = () => {
  const debugInfo = getDebugInfo()
  const dataStr = JSON.stringify(debugInfo, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })

  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = `arcana-debug-${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
