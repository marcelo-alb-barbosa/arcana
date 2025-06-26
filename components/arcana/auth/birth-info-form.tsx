"use client"

import {FormEvent, useState} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Skull } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface BirthInfoFormProps {
  onComplete: () => void
  onSkip: () => void
}

export function BirthInfoForm({ onComplete, onSkip }: BirthInfoFormProps) {
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    birthTime: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.dateOfBirth) {
      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Campo Obrigatório
          </div>
        ),
        description: <p className="font-serifRegular text-sm">A data de nascimento é necessária para os cálculos astrológicos.</p>,
        variant: "destructive",
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post("/api/user/astrology", {
        dateOfBirth: formData.dateOfBirth,
        birthTime: formData.birthTime || null,
      })

      if (!response.data.success) {
        throw new Error(response.data.error || "Erro ao atualizar informações astrológicas")
      }

      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Mapa Astral Calculado
          </div>
        ),
        description: <p className="font-serifRegular text-sm">Suas informações astrológicas foram calculadas com sucesso.</p>,
        className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
      })

      onComplete()
    } catch (error: any) {
      toast({
        title: (
          <div className="flex items-center font-cinzel">
            <Skull className="mr-2 h-5 w-5 text-blood-red" />
            Erro
          </div>
        ),
        description: (
          <p className="font-serifRegular text-sm">
            {error.message || "Erro ao atualizar informações astrológicas"}
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
          Informações Astrológicas
        </CardTitle>
        <CardDescription className="font-serifRegular text-bone-dust-gray pt-2">
          Para uma melhor experiência, complete seu cadastro fornecendo sua data e hora de nascimento para calcularmos seu mapa astral
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="font-cinzel text-aged-bone/80">
              Data de Nascimento
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone focus:border-blood-red font-serifRegular h-12"
              required
              disabled={isSubmitting}
              style={{ fontSize: "16px" }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthTime" className="font-cinzel text-aged-bone/80">
              Hora de Nascimento (opcional)
            </Label>
            <Input
              id="birthTime"
              type="time"
              value={formData.birthTime}
              onChange={(e) => handleInputChange("birthTime", e.target.value)}
              className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone focus:border-blood-red font-serifRegular h-12"
              disabled={isSubmitting}
              style={{ fontSize: "16px" }}
            />
            <p className="text-xs text-bone-dust-gray/70 font-serifRegular mt-1">
              A hora de nascimento é necessária para calcular seu ascendente
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-bone-dust-gray text-aged-bone hover:bg-aged-bone/10 font-cinzel"
              onClick={onSkip}
              disabled={isSubmitting}
            >
              Pular
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : (
                "Calcular"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
