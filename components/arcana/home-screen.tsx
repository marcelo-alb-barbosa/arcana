"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { ActionCard } from "./ui/action-card"
import { SmoothLink } from "./ui/smooth-link"
import { DebugMenu } from "./dev/debug-menu"
import { Layers, Scroll, ScrollText, Crown } from "lucide-react"
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

  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth)
  const [username, setUsername] = useState(initialUsername)

  // Update authentication state when session changes
  useEffect(() => {
    const authStatus = status === "authenticated"
    setIsAuthenticated(authStatus)
    setUsername(session?.user?.name || null)
  }, [session, status])

  // Remove the transition class when the page loads
  useEffect(() => {
    // Remove the transition-out class if it exists
    if (typeof document !== 'undefined') {
      document.body.classList.remove('page-transition-out')
    }
  }, [])

  // Function to update authentication state
  const handleAuthChange = () => {
    const authStatus = status === "authenticated"
    setIsAuthenticated(authStatus)
    setUsername(session?.user?.name || null)

    // Force re-render of the page if necessary
    window.location.reload()
  }

  const handleGrimoireClick = () => {
    console.log("🔮 Grimoire Click - State:", { isAuthenticated })

    // Verify current authentication using NextAuth
    const currentAuth = status === "authenticated"
    console.log("🔮 Current verification:", { currentAuth })

    if (!currentAuth) {
      console.log("🔮 Redirecting to login")
      // Add a smooth transition effect before navigating
      document.body.classList.add('page-transition-out')

      // Delay navigation to allow transition effect to complete
      setTimeout(() => {
        router.push("/login")
      }, 300)
    } else {
      console.log("🔮 Navigating to grimoire")
      // Add a smooth transition effect before navigating
      document.body.classList.add('page-transition-out')

      // Delay navigation to allow transition effect to complete
      setTimeout(() => {
        router.push("/grimorio")
      }, 300)
    }
  }

  return (
    <div className="min-h-screen bg-deep-black">
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
