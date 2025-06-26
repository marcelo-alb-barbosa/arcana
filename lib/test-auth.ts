// Utilitários para autenticação de teste

export const isTestModeEnabled = (): boolean => {
  if (typeof window === "undefined") return false

  // Verifica se o modo de teste está habilitado via env
  return process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === "true"
}

export const getTestUser = () => ({
  id: "test_user",
  email: "teste@arcana.com",
  username: "Testador dos Arcanos",
  avatar: "/placeholder.svg?width=120&height=120",
  memberSince: "Modo de Teste Ativo",
})

export const simulateLogin = () => {
  if (!isTestModeEnabled()) return false

  const testUser = getTestUser()
  localStorage.setItem(
    "arcana-auth",
    JSON.stringify({
      isAuthenticated: true,
      user: testUser,
      timestamp: Date.now(),
      isTestMode: true,
    }),
  )
  return true
}

export const simulateLogout = () => {
  if (!isTestModeEnabled()) return false

  localStorage.removeItem("arcana-auth")
  return true
}

export const isInTestMode = (): boolean => {
  if (typeof window === "undefined") return false

  try {
    const authData = localStorage.getItem("arcana-auth")
    if (!authData) return false

    const parsed = JSON.parse(authData)
    return parsed.isTestMode === true
  } catch {
    return false
  }
}
