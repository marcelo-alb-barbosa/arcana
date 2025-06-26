"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LayoutProfile } from "@/components/arcana/profile/layout-profile"
import { EditProfileForm } from "@/components/arcana/profile/edit-profile-form"
import { useToast } from "@/hooks/use-toast"
import { Skull } from "lucide-react"
import { useSession } from "next-auth/react"

// Interface para os dados do usuário
interface UserProfile {
    username: string
    avatarUrl?: string
    dataNascimento?: string // "YYYY-MM-DD"
    horarioNascimento?: string // "HH:MM"
}

export default function PaginaEditarPerfil() {
    const router = useRouter()
    const { toast } = useToast()
    const { data: session } = useSession()
    const [currentUserData, setCurrentUserData] = useState<UserProfile>({
        username: "",
        avatarUrl: "/placeholder.svg?width=120&height=120",
    })
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Buscar dados do usuário da API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user")
                if (!response.ok) {
                    throw new Error("Falha ao carregar dados do perfil")
                }

                const userData = await response.json()

                setCurrentUserData({
                    username: userData.name || "",
                    avatarUrl: userData.image || "/placeholder.svg?width=120&height=120",
                    dataNascimento: userData.profile?.dateOfBirth 
                        ? new Date(userData.profile.dateOfBirth).toISOString().split('T')[0] 
                        : undefined,
                    horarioNascimento: userData.profile?.birthTime || undefined
                })
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error)
                toast({
                    title: (
                        <div className="flex items-center font-cinzel">
                            <Skull className="mr-2 h-5 w-5 text-blood-red" />
                            Erro ao Carregar
                        </div>
                    ),
                    description: <p className="font-serifRegular text-sm">Não foi possível carregar seus dados.</p>,
                    variant: "destructive",
                    className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (session?.user) {
            fetchUserData()
        } else {
            setIsLoading(false)
        }
    }, [session, toast])

    const handleProfileSaveAttempt = async (data: {
        username: string
        avatarFile?: File
        dataNascimento?: string
        horarioNascimento?: string
    }): Promise<boolean> => {
        setIsSaving(true)
        try {
            // Em uma app real, se houver avatarFile, você o enviaria para um serviço de storage
            // e obteria a URL para salvar no perfil.
            let avatarUrl = undefined
            // Aqui iria o código para upload do avatar e obtenção da URL

            const response = await fetch("/api/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: data.username,
                    dateOfBirth: data.dataNascimento,
                    birthTime: data.horarioNascimento,
                    avatarUrl: avatarUrl,
                }),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                setCurrentUserData({
                    username: result.data.name,
                    avatarUrl: result.data.image || currentUserData.avatarUrl,
                    dataNascimento: result.data.profile?.dateOfBirth 
                        ? new Date(result.data.profile.dateOfBirth).toISOString().split('T')[0] 
                        : undefined,
                    horarioNascimento: result.data.profile?.birthTime || undefined
                })

                toast({
                    title: (
                        <div className="flex items-center font-cinzel">
                            <Skull className="mr-2 h-5 w-5 text-blood-red" />
                            Santuário Atualizado
                        </div>
                    ),
                    description: <p className="font-serifRegular text-sm">{result.message}</p>,
                    className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
                })

                // Redirecionar após um pequeno delay para o toast ser visto
                setTimeout(() => router.push("/profile"), 1500);
                setIsSaving(false)
                return true
            } else {
                throw new Error(result.error || "Falha desconhecida ao salvar.")
            }
        } catch (error: any) {
            toast({
                title: (
                    <div className="flex items-center font-cinzel">
                        <Skull className="mr-2 h-5 w-5 text-blood-red" />
                        Erro nos Ritos
                    </div>
                ),
                description: <p className="font-serifRegular text-sm">{error.message || "Ocorreu um erro."}</p>,
                variant: "destructive",
                className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
            })
            setIsSaving(false)
            return false
        }
    }

    if (isLoading) {
        return (
            <LayoutProfile pageTitle="Carregando..." backLink="/profile">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse text-aged-bone font-cinzel text-xl">
                        Carregando seus dados...
                    </div>
                </div>
            </LayoutProfile>
        )
    }

    return (
        <LayoutProfile pageTitle="Editar Santuário" backLink="/profile">
            <EditProfileForm
                currentUsername={currentUserData.username}
                currentAvatarUrl={currentUserData.avatarUrl}
                currentDataNascimento={currentUserData.dataNascimento}
                currentHorarioNascimento={currentUserData.horarioNascimento}
                onProfileSaveAttempt={handleProfileSaveAttempt}
                isSaving={isSaving}
            />
        </LayoutProfile>
    )
}
