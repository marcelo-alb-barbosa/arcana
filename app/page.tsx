"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/arcana/splash-screen"
import { HomeScreen } from "@/components/arcana/home-screen"
import { PageTransition } from "@/components/arcana/ui/page-transition"
import { useSession } from "next-auth/react"

export default function ArcanaAppPage() {
  const [showSplash, setShowSplash] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    const authStatus = status === "authenticated"
    setIsAuthenticated(authStatus)

    if (authStatus && session?.user?.name) {
      setUsername(session.user.name)
    }

    const splashShown = sessionStorage.getItem("arcana-splash-shown")

    if (!splashShown) {
      setShowSplash(true)
      sessionStorage.setItem("arcana-splash-shown", "true")

      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 3500)

      return () => clearTimeout(timer)
    }
  }, [session, status])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <PageTransition>
      <HomeScreen username={username} isAuthenticated={isAuthenticated} />
    </PageTransition>
  )
}
