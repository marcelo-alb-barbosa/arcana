"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileButton } from "./profile-button"
import { NotificationBell } from "./notification-bell"
import { SmoothButton } from "./smooth-button"
import { MobileMenu } from "./mobile-menu"
import { CreditsDisplay } from "./credits-display"
import { SeletorIdioma } from "./seletor-idioma"
import { useIdioma } from "@/contexts/idioma-context"
import { useSession } from "next-auth/react"

interface HeaderProps {
  isAuthenticated?: boolean
  username?: string | null
  userCredits?: number
  unreadNotifications?: number
  onNotificationsOpen?: () => void
  userImageUrl?: string
}

export function Header({
  isAuthenticated: initialAuth,
  username: initialUsername,
  userCredits = 1500,
  unreadNotifications = 0,
  onNotificationsOpen,
  userImageUrl,
}: HeaderProps) {
  const router = useRouter()
  const { t } = useIdioma()
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth)
  const [username, setUsername] = useState(initialUsername)
  const [userImage, setUserImage] = useState(userImageUrl)

  useEffect(() => {
    // Always check authentication status using NextAuth session
    const authStatus = status === "authenticated"
    setIsAuthenticated(authStatus)
    setUsername(session?.user?.name || null)
    setUserImage(session?.user?.image || undefined)
  }, [session, status])

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between p-4 md:p-5 bg-deep-black/80 backdrop-blur-sm border-b border-b-blood-red/20">
      {/* Desktop Left Side - Language Selector */}
      <div className="hidden md:flex items-center space-x-2">
        <SeletorIdioma />
      </div>

      {/* Mobile & Desktop Center */}
      <div className="flex flex-col items-center mx-auto md:mx-0">
        <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl text-aged-bone animate-subtleGlow">
          {t("header.title")}
        </h1>
        {isAuthenticated && <CreditsDisplay credits={userCredits} className="hidden md:flex" />}
      </div>

      {/* Desktop Right Side - Login/Profile and Notifications */}
      <div className="hidden md:flex items-center space-x-3">
        {isAuthenticated ? (
          <>
            <NotificationBell 
              notificationCount={unreadNotifications} 
              onClick={onNotificationsOpen} 
            />
            <ProfileButton onClick={() => router.push("/profile")} imageUrl={userImage} />
          </>
        ) : (
          <SmoothButton
            variant="ghost"
            size="sm"
            className="text-aged-bone hover:bg-aged-bone/10 hover:text-aged-bone px-3 py-2"
            onClick={() => router.push("/login")}
          >
            <span className="text-sm font-cinzel">{t("common.login")}</span>
          </SmoothButton>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </header>
  )
}
