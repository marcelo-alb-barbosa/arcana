import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserCircle, Mail, CalendarDays, Sun, Moon, Sparkles } from "lucide-react"
import { formatarDataNascimento, getSignoSolar } from "@/lib/astro-utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useIdioma } from "@/contexts/idioma-context"

interface InfoUserCardProps {
  username: string
  email: string
  membroDesde: string
  dataNascimento?: string
  signoLua?: string
  signoAscendente?: string
  avatarUrl?: string
}

export function InfoUserCard({
  username,
  email,
  membroDesde,
  dataNascimento,
  signoLua,
  signoAscendente,
  avatarUrl = "/placeholder.svg?width=100&height=100",
}: InfoUserCardProps) {
  const { t, idioma } = useIdioma();
  console.log("InfoUserCard props:", {
    username,
    email,
    membroDesde,
    dataNascimento,
    signoLua,
    signoAscendente,
    avatarUrl
  });

  const signoSolar = dataNascimento
    ? getSignoSolar(
        new Date(dataNascimento).getUTCDate() + 1, 
        new Date(dataNascimento).getUTCMonth() + 1,
        idioma
      )
    : t("profile.notInformed")

  const signoLuaDisplay = signoLua || t("profile.notInformed")
  const signoAscendenteDisplay = signoAscendente || t("profile.notInformed")

  return (
    <Card className="bg-deep-black/70 border-2 border-blood-red/30 shadow-bone-dust text-aged-bone backdrop-blur-sm">
      <CardHeader className="items-center text-center pb-4">
        <Avatar className="w-24 h-24 md:w-28 md:h-28 border-2 border-aged-bone/50 mb-4 bg-deep-black">
          {avatarUrl ? (
            <AvatarImage
              src={avatarUrl}
              alt={`${t("profile.avatarOf")} ${username || t("profile.user")}`}
            />
          ) : null}
          <AvatarFallback className="bg-deep-black">
            <UserCircle className="w-4/5 h-4/5 text-aged-bone/70" strokeWidth={1} />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="font-cinzel text-2xl md:text-3xl text-aged-bone">
          {username || t("profile.arcanaUser")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 font-serifRegular text-sm text-bone-dust-gray">
        <div className="flex items-center">
          <Mail size={18} className="mr-3 text-blood-red/70 flex-shrink-0" />
          <span>{email}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays size={18} className="mr-3 text-blood-red/70 flex-shrink-0" />
          <span>{t("profile.memberSince")} {membroDesde || t("profile.notAvailable")}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays size={18} className="mr-3 text-blood-red/70 flex-shrink-0" />
          <span>{t("profile.birthDate")} {formatarDataNascimento(dataNascimento, idioma)}</span>
        </div>
        <CardDescription className="font-cinzel text-aged-bone/80 pt-3 text-center border-t border-aged-bone/20 mt-4">
          {t("profile.astralMap")}
        </CardDescription>
        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="flex flex-col items-center p-2 bg-aged-bone/5 rounded">
            <Sun size={20} className="mb-1 text-yellow-400" />
            <span className="text-xs font-semibold">{t("profile.sun")}</span>
            <span className="text-xs">{signoSolar}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-aged-bone/5 rounded">
            <Moon size={20} className="mb-1 text-slate-300" />
            <span className="text-xs font-semibold">{t("profile.moon")}</span>
            <span className="text-xs">{signoLuaDisplay}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-aged-bone/5 rounded">
            <Sparkles size={20} className="mb-1 text-purple-400" />
            <span className="text-xs font-semibold">{t("profile.ascendant")}</span>
            <span className="text-xs">{signoAscendenteDisplay}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
