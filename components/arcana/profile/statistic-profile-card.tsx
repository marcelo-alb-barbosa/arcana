import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, Star, Coins } from "lucide-react"
import { useIdioma } from "@/contexts/idioma-context"

interface StatisticProfileCardProps {
  totalLeituras: number
  arcanoFavorito: string
  creditos: number
}

export function StatisticProfileCard({ totalLeituras, arcanoFavorito, creditos }: StatisticProfileCardProps) {
  const { t } = useIdioma();
  return (
    <Card className="bg-deep-black/70 border-2 border-blood-red/30 shadow-bone-dust text-aged-bone backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-cinzel text-xl md:text-2xl text-aged-bone/90">{t("profile.mysticJourney")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 font-serifRegular text-sm">
        <div className="flex items-center justify-between p-3 bg-aged-bone/5 rounded-md">
          <div className="flex items-center">
            <Layers size={18} className="mr-3 text-blood-red/70" />
            <span>{t("profile.totalReadings")}:</span>
          </div>
          <span className="font-bold text-aged-bone">{totalLeituras}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-aged-bone/5 rounded-md">
          <div className="flex items-center">
            <Star size={18} className="mr-3 text-blood-red/70" />
            <span>{t("profile.favoriteArcana")}:</span>
          </div>
          <span className="font-bold text-aged-bone">{arcanoFavorito}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-aged-bone/5 rounded-md">
          <div className="flex items-center">
            <Coins size={18} className="mr-3 text-yellow-400" />
            <span>{t("profile.currentCredits")}:</span>
          </div>
          <span className="font-bold text-aged-bone">{creditos}</span>
        </div>
      </CardContent>
    </Card>
  )
}
