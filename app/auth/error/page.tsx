"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageTransition } from "@/components/arcana/ui/page-transition"
import { Skull, ArrowLeft, AlertTriangle } from "lucide-react"
import { SmoothButton } from "@/components/arcana/ui/smooth-button"
import { Button } from "@/components/ui/button"
import { useIdioma } from "@/contexts/idioma-context"

function ErrorContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const error = searchParams.get("error")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const { t } = useIdioma()

    useEffect(() => {
        // Map error codes to user-friendly messages
        const errorMessages: Record<string, string> = {
            "AccessDenied": t("auth.error.accessDenied"),
            "Configuration": t("auth.error.configuration"),
            "Verification": t("auth.error.verification"),
            "OAuthSignin": t("auth.error.oauthSignin"),
            "OAuthCallback": t("auth.error.oauthCallback"),
            "OAuthCreateAccount": t("auth.error.oauthCreateAccount"),
            "EmailCreateAccount": t("auth.error.emailCreateAccount"),
            "Callback": t("auth.error.callback"),
            "OAuthAccountNotLinked": t("auth.error.oauthAccountNotLinked"),
            "EmailSignin": t("auth.error.emailSignin"),
            "CredentialsSignin": t("auth.error.credentialsSignin"),
            "SessionRequired": t("auth.error.sessionRequired"),
            "Default": t("auth.error.default")
        }

        // Set the error message based on the error code
        setErrorMessage(errorMessages[error || ""] || errorMessages["Default"])
    }, [error, t])

    const handleGoBack = () => {
        router.push("/login")
    }

    const handleSignUp = () => {
        router.push("/signup")
    }

    const handleGoHome = () => {
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
                        <span className="text-sm">{t("auth.backToLogin")}</span>
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
                            <Skull className="h-14 w-14 md:h-20 md:w-20 text-blood-red/80" strokeWidth={1.5} />
                        </div>
                        <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-aged-bone shimmer-text mb-1 sm:mb-2">
                            ARCANA
                        </h1>
                        <p className="font-serifRegular text-sm text-bone-dust-gray">{t("auth.error.arcanaRejected")}</p>
                    </div>

                    {/* Error Message */}
                    <div className="bg-deep-black/80 border-2 border-blood-red/50 shadow-bone-dust text-aged-bone backdrop-blur-sm w-full max-w-md rounded-lg p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <AlertTriangle className="h-12 w-12 text-blood-red" strokeWidth={1.5} />
                            <h2 className="font-cinzel text-xl text-aged-bone">{t("auth.error.title")}</h2>
                            <p className="font-serifRegular text-bone-dust-gray">{errorMessage}</p>

                            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
                                <Button 
                                    onClick={handleSignUp}
                                    className="w-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel"
                                >
                                    {t("auth.error.signUp")}
                                </Button>
                                <Button 
                                    onClick={handleGoHome}
                                    variant="outline"
                                    className="w-full border-bone-dust-gray text-aged-bone hover:bg-aged-bone/10 font-cinzel"
                                >
                                    {t("auth.error.goHome")}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-xs text-bone-dust-gray/70">
                            "{t("auth.error.quote")}"
                        </p>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-deep-black text-aged-bone flex flex-col items-center justify-center p-4">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-aged-bone/20 mb-4"></div>
                    <div className="h-6 w-48 bg-aged-bone/20 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-aged-bone/20 rounded"></div>
                </div>
            </div>
        }>
            <ErrorContent />
        </Suspense>
    )
}
