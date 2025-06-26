// Simulador de autenticação para o ARCANA

interface AuthRequest {
  email: string
  password: string
  username?: string
  isLogin: boolean
}

interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    username: string
    avatar?: string
    memberSince: string
  }
}

// Usuários de demonstração
const demoUsers = [
  {
    id: "user1",
    email: "demo@arcana.com",
    password: "arcana123",
    username: "Peregrino das Sombras",
    avatar: "/placeholder.svg?width=120&height=120",
    memberSince: "Solstício de Inverno, 2024",
  },
  {
    id: "user2",
    email: "bruxa@arcana.com",
    password: "mystical456",
    username: "Guardiã dos Véus",
    avatar: "/placeholder.svg?width=120&height=120",
    memberSince: "Lua Nova de Outubro, 2024",
  },
]

export const simularAutenticacao = async (request: AuthRequest): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (request.isLogin) {
        // Modo Login
        const user = demoUsers.find((u) => u.email === request.email && u.password === request.password)

        if (user) {
          resolve({
            success: true,
            message: "Os arcanos reconhecem sua presença. Bem-vindo de volta ao santuário.",
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
              avatar: user.avatar,
              memberSince: user.memberSince,
            },
          })
        } else {
          resolve({
            success: false,
            message: "As credenciais não foram reconhecidas pelos guardiões dos arcanos.",
          })
        }
      } else {
        // Modo Registro
        if (!request.username || request.username.length < 3) {
          resolve({
            success: false,
            message: "O nome de invocador deve ter pelo menos 3 caracteres.",
          })
          return
        }

        if (request.password.length < 6) {
          resolve({
            success: false,
            message: "A palavra de poder deve ter pelo menos 6 caracteres.",
          })
          return
        }

        // Verificar se email já existe
        const existingUser = demoUsers.find((u) => u.email === request.email)
        if (existingUser) {
          resolve({
            success: false,
            message: "Este email já está vinculado a outro invocador dos arcanos.",
          })
          return
        }

        // Simular criação de conta
        const newUser = {
          id: `user_${Date.now()}`,
          email: request.email,
          username: request.username,
          avatar: "/placeholder.svg?width=120&height=120",
          memberSince: new Date().toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          }),
        }

        resolve({
          success: true,
          message: `Bem-vindo aos arcanos, ${request.username}. Sua jornada mística começou.`,
          user: newUser,
        })
      }
    }, 1200) // Simular delay de rede
  })
}

// Função para verificar se o usuário está autenticado
export const verificarAutenticacao = (): { isAuthenticated: boolean; user?: any } => {
  if (typeof window === "undefined") return { isAuthenticated: false }

  try {
    const authData = localStorage.getItem("arcana-auth")
    if (!authData) return { isAuthenticated: false }

    const parsed = JSON.parse(authData)
    const isValid = parsed.isAuthenticated && parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 // 24 horas

    return {
      isAuthenticated: isValid,
      user: isValid ? parsed.user : undefined,
    }
  } catch {
    return { isAuthenticated: false }
  }
}

// Função para salvar dados de autenticação
export const salvarAutenticacao = (user: any) => {
  if (typeof window !== "undefined") {
    const authData = {
      isAuthenticated: true,
      timestamp: Date.now(),
      user
    }
    localStorage.setItem("arcana-auth", JSON.stringify(authData))
  }
}

// Função para fazer logout
export const fazerLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("arcana-auth")
  }
}
