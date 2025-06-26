"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { LayoutProfile } from "@/components/arcana/profile/layout-profile"
import { InfoUserCard } from "@/components/arcana/profile/info-user-card"
import { StatisticProfileCard } from "@/components/arcana/profile/statistic-profile-card"
import { ActionProfileCard } from "@/components/arcana/profile/action-profile-card"
import { AuthGuard } from "@/components/arcana/auth/auth-guard"
import ConfigProfileCard from "@/components/arcana/profile/config-profile-card"

// Mock apenas para a Jornada Mística
const mockJornadaData = {
    totalLeituras: 42,
    arcanoFavorito: "A Lua",
    creditos: 1500,
}

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        membroDesde: "",
        avatarUrl: "/placeholder.svg?width=120&height=120",
        dataNascimento: "",
        signoLua: "Não informado",
        signoAscendente: "Não informado",
    })

    useEffect(() => {
        async function fetchUserData() {
            if (status === "authenticated") {
                try {
                    // Fetch user data from API route
                    const response = await fetch('/api/user')

                    if (!response.ok) {
                        throw new Error('Falha ao buscar dados do usuário')
                    }

                    const userData = await response.json()

                    console.log("API response:", userData)

                    // Make sure we have valid data before updating state
                    if (userData && typeof userData === 'object') {
                        const name = userData.name || "Usuário Arcana";
                        const email = userData.email || "";
                        const createdAt = userData.createdAt ? new Date(userData.createdAt) : null;
                        const membroDesde = createdAt ? format(createdAt, "'Desde' MMMM, yyyy", { locale: ptBR }) : "";
                        const image = userData.image || "/placeholder.svg?width=120&height=120";
                        const dateOfBirth = userData.profile?.dateOfBirth ? new Date(userData.profile.dateOfBirth) : null;
                        const dataNascimento = dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : "";
                        const signoLua = userData.profile?.moonSign || "Não informado";
                        const signoAscendente = userData.profile?.ascendant || "Não informado";

                        console.log("Formatted data:", {
                            name,
                            email,
                            createdAt,
                            membroDesde,
                            image,
                            dateOfBirth,
                            dataNascimento
                        });

                        setUserData({
                            username: name,
                            email: email,
                            membroDesde: membroDesde,
                            avatarUrl: image,
                            dataNascimento: dataNascimento,
                            signoLua: signoLua,
                            signoAscendente: signoAscendente
                        });
                    } else {
                        console.error("Invalid user data received:", userData);
                    }

                    console.log("Processed userData:", {
                        username: userData.name || "Usuário Arcana",
                        email: userData.email || "",
                        membroDesde: userData.createdAt ? format(new Date(userData.createdAt), "'Desde' MMMM, yyyy", { locale: ptBR }) : "",
                        avatarUrl: userData.image || "/placeholder.svg?width=120&height=120"
                    })
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário:", error)
                }
            }
        }

        fetchUserData().then()
    }, [status])

    return (
        <AuthGuard>
            <LayoutProfile pageTitle="Perfil">
                <InfoUserCard
                    username={userData.username}
                    email={userData.email}
                    membroDesde={userData.membroDesde}
                    avatarUrl={userData.avatarUrl}
                    dataNascimento={userData.dataNascimento}
                    signoLua={userData.signoLua}
                    signoAscendente={userData.signoAscendente}
                />
                <StatisticProfileCard
                    totalLeituras={mockJornadaData.totalLeituras}
                    arcanoFavorito={mockJornadaData.arcanoFavorito}
                    creditos={mockJornadaData.creditos}
                />
                <ConfigProfileCard />
                <ActionProfileCard />
            </LayoutProfile>
        </AuthGuard>
    )
}
