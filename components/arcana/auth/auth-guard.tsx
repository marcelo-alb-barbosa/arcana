"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Skull, Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { status } = useSession()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      if (status === "loading") {
        return;
      }

      if (status !== "authenticated") {
        router.push("/login")
      } else {
        setIsAuthenticated(true)
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [router, status])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-deep-black text-aged-bone flex flex-col items-center justify-center p-4 relative bg-noise-pattern">
        <div className="text-center">
          <Skull className="mx-auto h-16 w-16 text-aged-bone/80 mb-4" strokeWidth={1.5} />
          <h1 className="font-cinzel text-3xl text-aged-bone mb-4">ARCANA</h1>
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-blood-red" />
            <p className="font-serifRegular text-bone-dust-gray">Verificando conexão com os arcanos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirecionando para login
  }

  return <>{children}</>
}
