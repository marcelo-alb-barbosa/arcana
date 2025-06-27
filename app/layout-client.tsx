"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/arcana/ui/header"
import { NotificacoesDrawer } from "@/components/arcana/ui/notificacoes-drawer"

interface LayoutClientProps {
  children: React.ReactNode
  cinzelVariable: string
}

export function LayoutClient({ children, cinzelVariable }: LayoutClientProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [userImage, setUserImage] = useState<string | undefined>(undefined)
  const [userCredits, setUserCredits] = useState(1500)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Bônus de Créditos",
      message: "Você recebeu 500 créditos de boas-vindas!",
      date: new Date(2025, 0, 15).toISOString(),
      read: false,
    },
    {
      id: "n2",
      title: "Novo Arcano Disponível",
      message: "O arcano 'A Estrela' foi adicionado à sua coleção.",
      date: new Date(2025, 0, 10).toISOString(),
      read: true,
    },
    {
      id: "n3",
      title: "Leitura Recomendada",
      message: "Baseado no seu profile, recomendamos uma leitura sobre 'Caminhos Profissionais'.",
      date: new Date(2025, 0, 5).toISOString(),
      read: false,
    },
  ])

  // Update authentication state when session changes
  useEffect(() => {
    const authStatus = status === "authenticated"
    setIsAuthenticated(authStatus)
    setUsername(session?.user?.name || null)
    setUserImage(session?.user?.image || undefined)
  }, [session, status])

  const unreadNotifications = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  // Check if we should hide the header (e.g., on authentication-related pages)
  const shouldHideHeader = pathname === "/login" || 
                          pathname === "/signup" || 
                          pathname.startsWith("/auth/error")

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideHeader && (
        <Header 
          isAuthenticated={isAuthenticated}
          username={username}
          userCredits={userCredits}
          unreadNotifications={unreadNotifications}
          onNotificationsOpen={() => setIsNotificationsOpen(true)}
          userImageUrl={userImage}
          pathname={pathname}
        />
      )}
      <div className={`flex-grow content-container overflow-y-auto ${!shouldHideHeader ? 'pt-16 md:pt-20' : ''}`}>
        {children}
      </div>
      {isAuthenticated && (
        <NotificacoesDrawer
          notificacoes={notifications}
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onMarcarLida={markAsRead}
          onMarcarTodasLidas={markAllAsRead}
        />
      )}
    </div>
  )
}
