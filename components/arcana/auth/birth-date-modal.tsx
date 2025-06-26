"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Skull } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface BirthDateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BirthDateModal({ open, onOpenChange }: BirthDateModalProps) {
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    birthTime: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Check local storage on component mount
  useEffect(() => {
    const hasUserDismissedModal = localStorage.getItem("birthDateModalDismissed") === "true"
    if (hasUserDismissedModal && open) {
      onOpenChange(false)
    }
  }, [open, onOpenChange])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
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

      onOpenChange(false)
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

  const handleSkip = () => {
    // Store in local storage that user has dismissed the modal
    localStorage.setItem("birthDateModalDismissed", "true")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-deep-black border-2 border-blood-red/50 shadow-bone-dust text-aged-bone">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-2xl text-aged-bone">
            Informações Astrológicas
          </DialogTitle>
          <DialogDescription className="font-serifRegular text-bone-dust-gray pt-2">
            Para uma melhor experiência, complete seu cadastro fornecendo sua data e hora de nascimento para calcularmos seu mapa astral
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-bone-dust-gray text-aged-bone hover:bg-aged-bone/10 font-cinzel"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Pular
          </Button>
          <Button
            type="button"
            className="flex-1 bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
              "Calcular"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}