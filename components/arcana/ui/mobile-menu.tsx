"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogIn, BookOpen, Scroll, Layers, BookHeart, ShoppingBag } from "lucide-react"
import { SmoothLink } from "./smooth-link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useIdioma } from "@/contexts/idioma-context"
import { SeletorIdioma } from "./seletor-idioma"
import { CreditsDisplay } from "./credits-display"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState(1500)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useIdioma()

  const { data: session, status } = useSession()

  useEffect(() => {
    const authStatus = status === "authenticated"
    setIsAuthenticated(authStatus)
    if (authStatus && session?.user) {
      setUsername(session.user.name || null)
      setUserAvatar(session.user.image || null)
    }
  }, [session, status])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setIsOpen(false)

    toast({
      title: "Shadow Farewell",
      description: "You have disconnected from ARCANA. See you soon.",
      className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
    })

    setTimeout(() => {
      // Add a smooth transition effect before navigating
      document.body.classList.add('page-transition-out')

      // Delay navigation to allow transition effect to complete
      setTimeout(() => {
        router.push("/login")
      }, 300)
    }, 1000)
  }

  const handleNavigation = (path: string) => {
    console.log("📱 Mobile Menu - Navigating to:", path)
    setIsOpen(false)

    // Add a smooth transition effect before navigating
    document.body.classList.add('page-transition-out')

    // Delay navigation to allow transition effect to complete
    setTimeout(() => {
      router.push(path)
    }, 300)
  }

  const handleGrimoireClick = () => {
    console.log("📱 Mobile Menu - Grimoire Click")

    // Verify current authentication using NextAuth
    const currentAuth = status === "authenticated"
    console.log("📱 Current verification:", { currentAuth })

    setIsOpen(false)

    if (!currentAuth) {
      console.log("📱 Redirecting to login")
      // Add a smooth transition effect before navigating
      document.body.classList.add('page-transition-out')

      // Delay navigation to allow transition effect to complete
      setTimeout(() => {
        router.push("/login")
      }, 300)
    } else {
      console.log("📱 Navigating to grimoire")
      // Add a smooth transition effect before navigating
      document.body.classList.add('page-transition-out')

      // Delay navigation to allow transition effect to complete
      setTimeout(() => {
        router.push("/grimorio")
      }, 300)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-aged-bone hover:bg-aged-bone/10 md:hidden">
          <Menu size={24} />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-xs p-0 bg-deep-black border-l border-blood-red/30" hideCloseButton={true}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-blood-red/20 flex items-center justify-between">
            <h2 className="font-cinzel text-xl text-aged-bone">{t("header.title")}</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-aged-bone">
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* User info if authenticated */}
          {isAuthenticated && (
            <div className="p-4 border-b border-blood-red/20 bg-deep-black/50">
              <div className="flex items-center space-x-3 mb-2">
                {userAvatar ? (
                  <Avatar className="w-10 h-10 border-2 border-blood-red/50">
                    <AvatarImage 
                      src={userAvatar} 
                      alt="Avatar do usuário" 
                    />
                    <AvatarFallback className="bg-blood-red/20">
                      <User size={20} className="text-aged-bone" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-10 h-10 bg-blood-red/20">
                    <AvatarFallback className="bg-blood-red/20">
                      <User size={20} className="text-aged-bone" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="font-cinzel text-sm text-aged-bone">{username}</p>
                  <p className="text-xs text-bone-dust-gray">{t("menu.arcanaSeeker")}</p>
                </div>
              </div>
              <div className="mt-2">
                <CreditsDisplay credits={userCredits} className="justify-start" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-2">
            <nav className="px-2">
              <ul className="space-y-1">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-aged-bone hover:bg-aged-bone/10 font-cinzel"
                    onClick={() => handleNavigation("/")}
                  >
                    <Scroll className="mr-3 h-5 w-5" />
                    {t("menu.home")}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-aged-bone hover:bg-aged-bone/10 font-cinzel"
                    onClick={() => handleNavigation("/leitura")}
                  >
                    <Layers className="mr-3 h-5 w-5" />
                    {t("menu.startReading")}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-aged-bone hover:bg-aged-bone/10 font-cinzel"
                    onClick={() => handleNavigation("/history")}
                  >
                    <Scroll className="mr-3 h-5 w-5" />
                    {t("menu.history")}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-aged-bone hover:bg-aged-bone/10 font-cinzel"
                    onClick={handleGrimoireClick}
                  >
                    <BookHeart className="mr-3 h-5 w-5" />
                    {t("menu.grimoire")}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-aged-bone hover:bg-aged-bone/10 font-cinzel"
                    onClick={() => handleNavigation("/profile")}
                  >
                    <User className="mr-3 h-5 w-5" />
                    {t("menu.profile")}
                  </Button>
                </li>
                {isAuthenticated && (
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-aged-bone hover:bg-aged-bone/10 font-cinzel"
                      onClick={() => handleNavigation("/loja")}
                    >
                      <ShoppingBag className="mr-3 h-5 w-5" />
                      {t("menu.creditsShop")}
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blood-red/20">
            <div className="flex items-center justify-between mb-4">
              <SeletorIdioma />
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-blood-red text-blood-red hover:bg-blood-red/10"
                >
                  {t("menu.logout")}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigation("/login")}
                  className="border-blood-red text-blood-red hover:bg-blood-red/10"
                >
                  <LogIn size={16} className="mr-2" />
                  {t("menu.login")}
                </Button>
              )}
            </div>
            <div className="flex justify-between text-xs text-bone-dust-gray/70">
              <SmoothLink href="/termos" className="hover:text-blood-red">
                {t("menu.terms")}
              </SmoothLink>
              <SmoothLink href="/privacidade" className="hover:text-blood-red">
                {t("menu.privacy")}
              </SmoothLink>
              <span>&copy; {new Date().getFullYear()} {t("header.title")}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
