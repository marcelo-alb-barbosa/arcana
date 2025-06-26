"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignupForm } from "@/components/arcana/auth/signup-form"
import { PageTransition } from "@/components/arcana/ui/page-transition"
import { Skull, ArrowLeft } from "lucide-react"
import { SmoothButton } from "@/components/arcana/ui/smooth-button"
import { useSession } from "next-auth/react"

export default function SignupPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { status } = useSession()

    // Verificar se o usuário já está autenticado e redirecionar para a home
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/")
        }
    }, [router, status])

    const handleSignupSuccess = () => {
        // Simular delay de autenticação
        setIsLoading(true)
        setTimeout(() => {
            router.push("/")
        }, 1500)
    }

    const handleGoBack = () => {
        router.push("/")
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-deep-black text-aged-bone flex flex-col items-center justify-center p-4 relative bg-noise-pattern mobile-full-height">
                {/* Botão de voltar */}
                <div className="absolute top-4 left-4 z-10">
                    <SmoothButton
                        variant="ghost"
                        size="sm"
                        onClick={handleGoBack}
                        className="text-aged-bone/70 hover:text-aged-bone hover:bg-aged-bone/10"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        <span className="text-sm">Voltar</span>
                    </SmoothButton>
                </div>

                {/* Corner Ornaments - hidden on small screens */}
                <div className="corner-ornament corner-top-left opacity-30 hidden sm:block"></div>
                <div className="corner-ornament corner-top-right opacity-30 hidden sm:block"></div>
                <div className="corner-ornament corner-bottom-left opacity-30 hidden sm:block"></div>
                <div className="corner-ornament corner-bottom-right opacity-30 hidden sm:block"></div>

                <div className="w-full max-w-md space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4 sm:mb-6">
                            <Skull className="h-14 w-14 md:h-20 md:w-20 text-aged-bone/80" strokeWidth={1.5} />
                        </div>
                        <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-aged-bone shimmer-text mb-1 sm:mb-2">
                            ARCANA
                        </h1>
                        <p className="font-serifRegular text-sm text-bone-dust-gray">Inicie sua jornada nos arcanos</p>
                    </div>

                    {/* Signup Form */}
                    <SignupForm onSignupSuccess={handleSignupSuccess} isLoading={isLoading} />

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-xs text-bone-dust-gray/70">
                            "Apenas aqueles com intenção verdadeira podem despertar o invisível"
                        </p>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}