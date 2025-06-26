"use client"

import { UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface ProfileButtonProps {
  onClick?: () => void
  imageUrl?: string
}

export function ProfileButton({ onClick, imageUrl }: ProfileButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-aged-bone hover:bg-aged-bone/10 hover:text-aged-bone p-2" // Added padding for larger icon hit area
      onClick={onClick}
      aria-label="Perfil do Usuário"
    >
      {imageUrl ? (
        <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-blood-red/50">
          <AvatarImage 
            src={imageUrl} 
            alt="Avatar do usuário"
          />
          <AvatarFallback>
            <UserCircle className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.75} />
          </AvatarFallback>
        </Avatar>
      ) : (
        <UserCircle className="h-8 w-8 md:h-9 md:w-9" strokeWidth={1.75} />
      )}
    </Button>
  )
}
