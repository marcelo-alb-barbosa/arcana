"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { ActionCard } from "./ui/action-card"
import { SmoothLink } from "./ui/smooth-link"
import { DebugMenu } from "./dev/debug-menu"
import { Layers, Scroll, ScrollText, Crown } from "lucide-react"
import { NotificacoesDrawer } from "./ui/notificacoes-drawer"
import { Header } from "./ui/header"
import { useIdioma } from "@/contexts/idioma-context"
import { useSession } from "next-auth/react"

interface HomeScreenProps {
  username?: string | null
  isAuthenticated: boolean
}

function HomeScreenContent({ username: initialUsername, isAuthenticated: initialAuth }: HomeScreenProps) {
  const router = useRouter()
  const { t, isLoading } = useIdioma()
  const { data: session, status } = useSession()

  // If idioma is still loading, show a simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-aged-bone/20 mb-4"></div>
          <div className="h-6 w-48 bg-aged-bone/20 rounded mb-2"></div>
          <div className="h-4 w-64 bg-aged-bone/20 rounded"></div>
        </div>
      </div>
    )
  }

  // Debug logs
  console.log("🏠 HomeScreen - Rendering with:", {
    initialUsername,
    initialAuth,
    testMode: process.env.NEXT_PUBLIC_ENABLE_TEST_MODE,
  })

  const [userCredits, setUserCredits] = useState(1500)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth)
  const [username, setUsername] = useState(initialUsername)
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined)

  // Update authentication state when session changes
  useEffect(() => {
    const authStatus = status === "authenticated"
    setIsAuthenticated(authStatus)
    setUsername(session?.user?.name || null)
    setUserAvatar(session?.user?.image || undefined)
  }, [session, status])

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

  const unreadNotifications = notifications.filter((n) => !n.read).length

  // Function to update authentication state
  const handleAuthChange = () => {
    const authStatus = status === "authenticated"
    setIsAuthenticated(authStatus)
    setUsername(session?.user?.name || null)
    setUserAvatar(session?.user?.image || undefined)

    // Force re-render of the page if necessary
    window.location.reload()
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const handleGrimoireClick = () => {
    console.log("🔮 Grimoire Click - State:", { isAuthenticated })

    // Verify current authentication using NextAuth
    const currentAuth = status === "authenticated"
    console.log("🔮 Current verification:", { currentAuth })

    if (!currentAuth) {
      console.log("🔮 Redirecting to login")
      router.push("/login")
    } else {
      console.log("🔮 Navigating to grimoire")
      router.push("/grimorio")
    }
  }

  return (
    <div className="min-h-screen bg-deep-black overflow-y-auto">
      <Header 
        isAuthenticated={isAuthenticated}
        username={username}
        userCredits={userCredits}
        unreadNotifications={unreadNotifications}
        onNotificationsOpen={() => setIsNotificationsOpen(true)}
        userImageUrl={userAvatar}
      />

      <main className="p-4 md:p-6 lg:p-8 bg-noise-pattern">
        <section className="mb-8 md:mb-12 text-center md:text-left">
          <h2 className="font-cinzel text-2xl md:text-3xl text-aged-bone">
            {isAuthenticated && username ? (
              <>
                {t("home.welcome")}, <span className="text-blood-red">{username}</span>
              </>
            ) : (
              <>
                <span className="text-blood-red">ARCANA</span>
              </>
            )}
          </h2>
          <p className="text-bone-dust-gray mt-1 text-sm">
            {isAuthenticated ? t("home.subtitle") : t("home.invisibleAwakening")}
          </p>
        </section>

        <section className="mb-8 md:mb-12">
          <h3 className="font-cinzel text-xl text-aged-bone mb-4 text-center md:text-left">{t("home.quickActions")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <ActionCard icon={Layers} title={t("home.startReading")} onClick={() => router.push("/leitura")} />
            <ActionCard icon={Scroll} title={t("home.history")} onClick={() => router.push("/history")} />
            <ActionCard icon={ScrollText} title={t("home.grimoire")} onClick={handleGrimoireClick} />
            <ActionCard
              icon={Crown}
              title={t("home.initiatesCircle")}
              onClick={() => router.push("/subscription")}
              className="bg-gradient-to-br from-purple-900/30 to-blood-red/20 border-purple-500/30 hover:border-purple-400"
            />
          </div>
        </section>
      </main>

      <footer className="p-4 text-center text-xs text-bone-dust-gray/50 border-t border-t-blood-red/20 mt-8 mobile-bottom-spacing">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <p>
            &copy; {new Date().getFullYear()} ARCANA. {t("home.footer")}
          </p>
          <div className="flex space-x-4">
            <SmoothLink href="/termos" className="hover:text-blood-red transition-colors">
              {t("footer.termsOfUse")}
            </SmoothLink>
            <SmoothLink href="/privacidade" className="hover:text-blood-red transition-colors">
              {t("footer.privacyPolicy")}
            </SmoothLink>
          </div>
        </div>
      </footer>

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

export function HomeScreen(props: HomeScreenProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-aged-bone/20 mb-4"></div>
          <div className="h-6 w-48 bg-aged-bone/20 rounded mb-2"></div>
          <div className="h-4 w-64 bg-aged-bone/20 rounded"></div>
        </div>
      </div>
    }>
      <HomeScreenContent {...props} />
    </Suspense>
  )
}
