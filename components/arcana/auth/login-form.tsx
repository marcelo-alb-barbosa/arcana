"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, LogIn, Skull, Instagram, Mail } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { SocialButton } from "@/components/ui/social-button"
import { useRouter } from "next/navigation"
import axios from "axios"
import { BirthInfoForm } from "./birth-info-form"

interface LoginFormProps {
  onLoginSuccess: () => void
  isLoading: boolean
}

export function LoginForm({ onLoginSuccess, isLoading }: LoginFormProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [showBirthInfoForm, setShowBirthInfoForm] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingUserData, setIsCheckingUserData] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const { toast } = useToast()

  // Use effect to check birth date when session is authenticated and login was successful
  useEffect(() => {
    if (status === "authenticated" && loginSuccess && !isCheckingUserData && !showBirthInfoForm) {
      console.log("Session authenticated and login successful, checking birth date")
      checkUserBirthDate()
      setLoginSuccess(false) // Reset to prevent multiple checks
    }
  }, [status, loginSuccess])

  // Check if user has birth date after successful login
  const checkUserBirthDate = async () => {
    try {
      setIsCheckingUserData(true)
      const response = await axios.get("/api/user/astrology")

      // Show welcome message after successful login
      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Bem-vindo de volta
          </div>
        ),
        description: <p className="font-serifRegular text-sm">Sua conexão com os arcanos foi restabelecida.</p>,
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })

      if (response.data.success) {
        // If user doesn't have a profile or doesn't have a date of birth, show the birth info form
        if (!response.data.data || !response.data.data.dateOfBirth) {
          console.log("User needs to provide birth date, showing BirthInfoForm")
          setShowBirthInfoForm(true)
        } else {
          // User already has birth date, proceed with login success
          console.log("User already has birth date, proceeding with login success")
          onLoginSuccess()
        }
      } else {
        // If there's an error, still proceed with login success
        console.error("Error in API response:", response.data.error)
        onLoginSuccess()
      }
    } catch (error) {
      console.error("Error checking user birth date:", error)
      // If there's an error, still proceed with login success
      onLoginSuccess()
    } finally {
      setIsCheckingUserData(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialLogin = async (provider: string) => {
    setIsSubmitting(true)
    try {
      // Login social com NextAuth
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/"
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // If the result is false, it means the user doesn't exist
      // This should no longer happen since we're creating users in auth.ts
      // But we'll keep this as a fallback
      if (result?.ok === false) {
        // Show message that user doesn't exist
        toast({
          title: (
            <div className="flex items-center font-cinzel">
              <Skull className="mr-2 h-5 w-5 text-blood-red" />
              Usuário não encontrado
            </div>
          ),
          description: (
            <p className="font-serifRegular text-sm">
              Você ainda não possui uma conta. Por favor, registre-se primeiro.
            </p>
          ),
          variant: "destructive",
          className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
        })

        // Redirect to signup page
        router.push('/signup')
        return
      }

      // Set login success to trigger the useEffect hook
      setLoginSuccess(true)
    } catch (error: any) {
      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Acesso Negado
          </div>
        ),
        description: (
          <p className="font-serifRegular text-sm">
            {error.message || "Os arcanos rejeitaram sua tentativa de entrada."}
          </p>
        ),
        variant: "destructive",
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      // Login com NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        throw new Error("As credenciais não foram reconhecidas pelos guardiões dos arcanos.")
      }

      // Set login success to trigger the useEffect hook
      setLoginSuccess(true)
    } catch (error: any) {
      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Acesso Negado
          </div>
        ),
        description: (
          <p className="font-serifRegular text-sm">
            {error.message || "Os arcanos rejeitaram sua tentativa de entrada."}
          </p>
        ),
        variant: "destructive",
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  // Handle birth info form completion
  const handleBirthInfoComplete = () => {
    setShowBirthInfoForm(false)
    onLoginSuccess()
  }

  // Handle birth info form skip
  const handleBirthInfoSkip = () => {
    setShowBirthInfoForm(false)
    onLoginSuccess()
  }

  // Show birth info form if needed
  if (showBirthInfoForm) {
    return <BirthInfoForm onComplete={handleBirthInfoComplete} onSkip={handleBirthInfoSkip} />
  }

  // Show loading state while checking user data
  if (isCheckingUserData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-deep-black/80 border-2 border-blood-red/50 shadow-bone-dust text-aged-bone backdrop-blur-sm w-full max-w-md rounded-lg">
        <Loader2 size={40} className="animate-spin text-blood-red mb-4" />
        <p className="font-cinzel text-lg text-aged-bone">Consultando os arcanos...</p>
      </div>
    )
  }

  return (
    <Card className="bg-deep-black/80 border-2 border-blood-red/50 shadow-bone-dust text-aged-bone backdrop-blur-sm w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-cinzel text-2xl text-aged-bone">
          Retorno ao Santuário
        </CardTitle>
        <CardDescription className="font-serifRegular text-bone-dust-gray pt-2">
          Reconecte-se com os arcanos que aguardam por você
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-cinzel text-aged-bone/80">
              Email Místico
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="seu@email.arcano"
              className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone placeholder:text-bone-dust-gray/70 focus:border-blood-red font-serifRegular h-12"
              required
              disabled={isSubmitting || isLoading}
              style={{ fontSize: "16px" }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-cinzel text-aged-bone/80">
              Palavra de Poder
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="••••••••"
                className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone placeholder:text-bone-dust-gray/70 focus:border-blood-red font-serifRegular pr-10 h-12"
                required
                disabled={isSubmitting || isLoading}
                style={{ fontSize: "16px" }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-aged-bone/70 hover:text-aged-bone"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
              className="border-bone-dust-gray data-[state=checked]:bg-blood-red data-[state=checked]:border-blood-red"
              disabled={isSubmitting || isLoading}
            />
            <Label htmlFor="remember" className="text-sm font-serifRegular text-aged-bone/80">
              Manter conexão com os arcanos
            </Label>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  className="w-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel text-lg py-3 h-14 mt-4"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <Loader2 size={18} className="mr-2 animate-spin" />
                  ) : (
                    <LogIn size={18} className="mr-2" />
                  )}
                  {isSubmitting || isLoading
                    ? "Conectando aos arcanos..."
                    : "Entrar no Santuário"}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-deep-black border-blood-red/50 text-aged-bone">
                Clique para entrar na sua conta
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>

        <div className="space-y-4">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-bone-dust-gray/30"></div>
            <span className="mx-4 flex-shrink text-xs text-bone-dust-gray/70 font-serifRegular">ou continue com</span>
            <div className="flex-grow border-t border-bone-dust-gray/30"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SocialButton
              icon={Instagram}
              onClick={() => handleSocialLogin("instagram")}
              label="Instagram"
              disabled={isSubmitting || isLoading}
              hint="Entrar usando sua conta do Instagram"
            />
            <SocialButton
              icon={Mail}
              onClick={() => handleSocialLogin("google")}
              label="Google"
              disabled={isSubmitting || isLoading}
              hint="Entrar usando sua conta do Google"
            />
          </div>
        </div>

        <div className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  onClick={() => router.push('/signup')}
                  className="text-blood-red hover:text-blood-red/80 font-cinzel text-sm"
                  disabled={isSubmitting || isLoading}
                >
                  Primeira vez nos arcanos? Inicie sua jornada
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-deep-black border-blood-red/50 text-aged-bone">
                Ir para a página de cadastro
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

      </CardContent>
    </Card>
  )
}
