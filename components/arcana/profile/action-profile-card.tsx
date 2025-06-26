"use client"

import { Edit, BookOpen, ShoppingCart, Receipt, LogOut } from "lucide-react"
import { SmoothLink } from "@/components/arcana/ui/smooth-link"
import { useIdioma } from "@/contexts/idioma-context"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function ActionProfileCard() {
  const { t } = useIdioma()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-6 space-y-4">
      <h3 className="font-cinzel text-xl text-aged-bone text-center">{t("profile.actions")}</h3>

      <div className="grid grid-cols-1 gap-3">
        <SmoothLink
          href="/profile/edit"
          className="flex items-center gap-3 p-4 bg-aged-bone/5 hover:bg-aged-bone/10 border border-aged-bone/20 rounded-lg transition-colors group"
        >
          <Edit className="w-5 h-5 text-blood-red group-hover:text-aged-bone transition-colors" />
          <span className="text-aged-bone group-hover:text-aged-bone/90 transition-colors">
            {t("profile.editProfile")}
          </span>
        </SmoothLink>

        <SmoothLink
          href="/grimorio"
          className="flex items-center gap-3 p-4 bg-aged-bone/5 hover:bg-aged-bone/10 border border-aged-bone/20 rounded-lg transition-colors group"
        >
          <BookOpen className="w-5 h-5 text-blood-red group-hover:text-aged-bone transition-colors" />
          <span className="text-aged-bone group-hover:text-aged-bone/90 transition-colors">
            {t("profile.myGrimoire")}
          </span>
        </SmoothLink>

        <SmoothLink
          href="/loja"
          className="flex items-center gap-3 p-4 bg-aged-bone/5 hover:bg-aged-bone/10 border border-aged-bone/20 rounded-lg transition-colors group"
        >
          <ShoppingCart className="w-5 h-5 text-blood-red group-hover:text-aged-bone transition-colors" />
          <span className="text-aged-bone group-hover:text-aged-bone/90 transition-colors">
            {t("profile.buyCredits")}
          </span>
        </SmoothLink>

        <SmoothLink
          href="/perfil/transacoes"
          className="flex items-center gap-3 p-4 bg-aged-bone/5 hover:bg-aged-bone/10 border border-aged-bone/20 rounded-lg transition-colors group"
        >
          <Receipt className="w-5 h-5 text-blood-red group-hover:text-aged-bone transition-colors" />
          <span className="text-aged-bone group-hover:text-aged-bone/90 transition-colors">
            {t("transaction.history")}
          </span>
        </SmoothLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 bg-aged-bone/5 hover:bg-aged-bone/10 border border-aged-bone/20 rounded-lg transition-colors group w-full text-left"
        >
          <LogOut className="w-5 h-5 text-blood-red group-hover:text-aged-bone transition-colors" />
          <span className="text-aged-bone group-hover:text-aged-bone/90 transition-colors">
            {t("profile.logout") || "Logout"}
          </span>
        </button>
      </div>
    </div>
  )
}
