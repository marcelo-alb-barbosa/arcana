"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, UserPlus, Skull, Instagram, Mail } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { SocialButton } from "@/components/ui/social-button"
import { useRouter } from "next/navigation"
import axios from "axios"

interface SignupFormProps {
  onSignupSuccess: () => void
  isLoading: boolean
}

export function SignupForm({ onSignupSuccess, isLoading }: SignupFormProps) {
  const router = useRouter()
  const { status } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    acceptTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialLogin = async (provider: string) => {
    // Validação dos termos para login social
    if (!formData.acceptTerms) {
      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Termos Necessários
          </div>
        ),
        description: (
          <p className="font-serifRegular text-sm">Você deve aceitar os Termos de Uso para criar uma conta.</p>
        ),
        variant: "destructive",
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // For social login, we need to create a random password since we don't have one
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

      // Attempt social login
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/"
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // If the result is false, it means the user doesn't exist
      // For signup, this is expected - we need to register them
      if (result?.ok === false) {
        // We need to use the email from the form data
        if (!formData.email || formData.email.trim() === "") {
          throw new Error("É necessário fornecer um email para cadastro com login social");
        }

        // Create a new user with the API
        try {
          // Use the username from the form if available, or generate one
          const username = formData.username || `User_${provider}_${Date.now().toString().slice(-6)}`;

          // Register with API using form data and random password
          const response = await axios.post("/api/register", {
            name: username,
            email: formData.email,
            password: randomPassword,
            isSocialLogin: true
          });

          if (!response.data.success) {
            throw new Error(response.data.error || "Não foi possível completar o registro");
          }

          // Try social login again now that the user is registered
          const secondResult = await signIn(provider, {
            redirect: false,
            callbackUrl: "/"
          });

          if (secondResult?.error) {
            throw new Error(secondResult.error);
          }
        } catch (registerError: any) {
          throw new Error(registerError.message || "Erro ao registrar com login social");
        }
      }

      // Show success message
      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Iniciação Completa
          </div>
        ),
        description: <p className="font-serifRegular text-sm">Sua jornada nos arcanos começou.</p>,
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })

      // Proceed with signup success
      onSignupSuccess()
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

    // Validação dos termos para registro
    if (!formData.acceptTerms) {
      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Termos Necessários
          </div>
        ),
        description: (
          <p className="font-serifRegular text-sm">Você deve aceitar os Termos de Uso para criar uma conta.</p>
        ),
        variant: "destructive",
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Registro com API
      const response = await axios.post("/api/register", {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      })

      if (!response.data.success) {
        throw new Error(response.data.error || "Não foi possível completar o registro")
      }

      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Iniciação Completa
          </div>
        ),
        description: <p className="font-serifRegular text-sm">Sua jornada nos arcanos começou.</p>,
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })

      // Login automático após registro
      await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      // Proceed with signup success
      onSignupSuccess()
    } catch (error: any) {
      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Registro Negado
          </div>
        ),
        description: (
          <p className="font-serifRegular text-sm">
            {error.message || "Os arcanos rejeitaram sua tentativa de registro."}
          </p>
        ),
        variant: "destructive",
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <Card className="bg-deep-black/80 border-2 border-blood-red/50 shadow-bone-dust text-aged-bone backdrop-blur-sm w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-cinzel text-2xl text-aged-bone">
          Iniciação nos Mistérios
        </CardTitle>
        <CardDescription className="font-serifRegular text-bone-dust-gray pt-2">
          Dê o primeiro passo na jornada pelos véus do invisível
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="font-cinzel text-aged-bone/80">
              Nome de Invocador
            </Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Como deseja ser conhecido nos arcanos?"
              className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone placeholder:text-bone-dust-gray/70 focus:border-blood-red font-serifRegular h-12"
              required
              disabled={isSubmitting || isLoading}
              style={{ fontSize: "16px" }}
            />
          </div>

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

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                className="border-bone-dust-gray data-[state=checked]:bg-blood-red data-[state=checked]:border-blood-red mt-0.5"
                disabled={isSubmitting || isLoading}
              />
              <Label htmlFor="acceptTerms" className="text-sm font-serifRegular text-aged-bone/80 leading-relaxed">
                Aceito os{" "}
                <Link href="/termos" className="text-blood-red hover:text-blood-red/80 underline">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link href="/privacidade" className="text-blood-red hover:text-blood-red/80 underline">
                  Política de Privacidade
                </Link>{" "}
                do ARCANA
              </Label>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  className="w-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel text-lg py-3 h-14 mt-4"
                  disabled={isSubmitting || isLoading || !formData.acceptTerms}
                >
                  {isSubmitting || isLoading ? (
                    <Loader2 size={18} className="mr-2 animate-spin" />
                  ) : (
                    <UserPlus size={18} className="mr-2" />
                  )}
                  {isSubmitting || isLoading
                    ? "Conectando aos arcanos..."
                    : "Iniciar Jornada"}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-deep-black border-blood-red/50 text-aged-bone">
                {!formData.acceptTerms 
                  ? "Para destravar o botão, aceite os Termos de Uso e a Política de Privacidade" 
                  : "Clique para criar sua conta no ARCANA"}
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
              disabled={isSubmitting || isLoading || !formData.acceptTerms}
              hint="Cadastre-se usando sua conta do Instagram"
              disabledHint="Para destravar o botão, aceite os Termos de Uso e a Política de Privacidade"
            />
            <SocialButton
              icon={Mail}
              onClick={() => handleSocialLogin("google")}
              label="Google"
              disabled={isSubmitting || isLoading || !formData.acceptTerms}
              hint="Cadastre-se usando sua conta do Google"
              disabledHint="Para destravar o botão, aceite os Termos de Uso e a Política de Privacidade"
            />
          </div>
        </div>

        <div className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  onClick={() => router.push('/login')}
                  className="text-blood-red hover:text-blood-red/80 font-cinzel text-sm"
                  disabled={isSubmitting || isLoading}
                >
                  Já possui acesso? Retorne ao santuário
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-deep-black border-blood-red/50 text-aged-bone">
                Ir para a página de login
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

      </CardContent>
    </Card>
  )
}
