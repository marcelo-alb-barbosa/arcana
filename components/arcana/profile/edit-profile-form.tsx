"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UserCircle, UploadCloud, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useIdioma } from "@/contexts/idioma-context"
import Image from "next/image"

interface EditProfileFormProps {
  currentUsername: string
  currentAvatarUrl?: string
  currentDataNascimento?: string
  currentHorarioNascimento?: string
  onProfileSaveAttempt: (data: { 
    username: string; 
    avatarFile?: File; 
    dataNascimento?: string;
    horarioNascimento?: string;
  }) => Promise<boolean> // Retorna true se sucesso
  isSaving: boolean
}

export function EditProfileForm({
  currentUsername,
  currentAvatarUrl = "/placeholder.svg?width=120&height=120",
  currentDataNascimento = "",
  currentHorarioNascimento = "",
  onProfileSaveAttempt,
  isSaving,
}: EditProfileFormProps) {
  const [username, setUsername] = useState(currentUsername)
  const [dataNascimento, setDataNascimento] = useState(currentDataNascimento)
  const [horarioNascimento, setHorarioNascimento] = useState(currentHorarioNascimento)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatarUrl)
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined)
  const { toast } = useToast()
  const { t } = useIdioma()

  // Atualizar estados quando as props mudarem
  useEffect(() => {
    setUsername(currentUsername)
    setDataNascimento(currentDataNascimento)
    setHorarioNascimento(currentHorarioNascimento)
    setAvatarPreview(currentAvatarUrl)
  }, [currentUsername, currentDataNascimento, currentHorarioNascimento, currentAvatarUrl])

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const success = await onProfileSaveAttempt({ 
      username, 
      avatarFile, 
      dataNascimento, 
      horarioNascimento 
    })
    if (success) {
      // O toast de sucesso será disparado pela página pai
    } else {
      // O toast de erro será disparado pela página pai
    }
  }

  return (
    <Card className="bg-deep-black/70 border-2 border-blood-red/30 shadow-bone-dust text-aged-bone backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-cinzel text-xl md:text-2xl text-aged-bone/90">{t("profile.editForm.title")}</CardTitle>
        <CardDescription className="font-serifRegular text-bone-dust-gray">
          {t("profile.editForm.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <Label htmlFor="avatar" className="font-cinzel text-aged-bone/80">
              {t("profile.editForm.avatar")}
            </Label>
            <div className="relative w-32 h-32 md:w-36 md:h-36 mx-auto rounded-full border-2 border-aged-bone/50 overflow-hidden bg-deep-black/50 group cursor-pointer">
              {avatarPreview ? (
                <Image
                  src={avatarPreview || "/placeholder.svg"}
                  alt={t("profile.editForm.avatarPreview")}
                  fill
                  sizes="(max-width: 767px) 128px, 144px"
                  style={{ objectFit: "cover" }}
                  className="group-hover:opacity-70 transition-opacity"
                />
              ) : (
                <UserCircle
                  className="w-full h-full text-aged-bone/50 p-4 group-hover:opacity-70 transition-opacity"
                  strokeWidth={1}
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <UploadCloud size={32} className="text-aged-bone mb-1" />
                <span className="text-xs text-aged-bone">{t("profile.editForm.change")}</span>
              </div>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="font-cinzel text-aged-bone/80">
              {t("profile.editForm.username")}
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone placeholder:text-bone-dust-gray/70 focus:border-blood-red font-serifRegular"
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataNascimento" className="font-cinzel text-aged-bone/80">
              {t("profile.editForm.birthDate")}
            </Label>
            <Input
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone placeholder:text-bone-dust-gray/70 focus:border-blood-red font-serifRegular appearance-none"
              style={{ colorScheme: "dark" }}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="horarioNascimento" className="font-cinzel text-aged-bone/80">
              {t("profile.editForm.birthTime")}
            </Label>
            <Input
              id="horarioNascimento"
              type="time"
              value={horarioNascimento}
              onChange={(e) => setHorarioNascimento(e.target.value)}
              className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone placeholder:text-bone-dust-gray/70 focus:border-blood-red font-serifRegular appearance-none"
              style={{ colorScheme: "dark" }}
              disabled={isSaving}
            />
            <p className="text-xs text-bone-dust-gray/80 font-serifRegular">
              {t("profile.editForm.birthTimeDescription")}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel text-lg py-3"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
            {isSaving ? t("profile.editForm.saving") : t("profile.editForm.save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
