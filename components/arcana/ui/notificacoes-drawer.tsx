"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, CheckCheck } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIdioma } from "@/contexts/idioma-context"

interface Notificacao {
  id: string
  titulo: string
  mensagem: string
  data: string
  lida: boolean
}

interface NotificacoesDrawerProps {
  notificacoes: Notificacao[]
  isOpen: boolean
  onClose: () => void
  onMarcarLida: (id: string) => void
  onMarcarTodasLidas: () => void
}

export function NotificacoesDrawer({
  notificacoes,
  isOpen,
  onClose,
  onMarcarLida,
  onMarcarTodasLidas,
}: NotificacoesDrawerProps) {
  const { t } = useIdioma()
  const [notificacoesExibidas, setNotificacoesExibidas] = useState<Notificacao[]>(notificacoes)

  // Formatar data relativa (ex: "há 2 dias")
  const formatarDataRelativa = (dataIso: string) => {
    const data = new Date(dataIso)
    const agora = new Date()
    const diferencaMs = agora.getTime() - data.getTime()
    const diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24))

    if (diferencaDias === 0) return "Hoje"
    if (diferencaDias === 1) return "Ontem"
    if (diferencaDias < 7) return `Há ${diferencaDias} dias`
    if (diferencaDias < 30) return `Há ${Math.floor(diferencaDias / 7)} semanas`
    return data.toLocaleDateString("pt-BR")
  }

  const handleMarcarLida = (id: string) => {
    onMarcarLida(id)
    setNotificacoesExibidas((prev) => prev.map((notif) => (notif.id === id ? { ...notif, lida: true } : notif)))
  }

  const handleMarcarTodasLidas = () => {
    onMarcarTodasLidas()
    setNotificacoesExibidas((prev) => prev.map((notif) => ({ ...notif, lida: true })))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-deep-black border-l border-blood-red/30 text-aged-bone w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="font-cinzel text-2xl text-aged-bone flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blood-red" /> {t("notifications.title")}
          </SheetTitle>
          <SheetDescription className="font-serifRegular text-bone-dust-gray">
            {t("notifications.subtitle")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarcarTodasLidas}
            className="text-xs text-aged-bone/70 hover:text-aged-bone"
            disabled={!notificacoesExibidas.some((n) => !n.lida)}
          >
            <CheckCheck size={14} className="mr-1" />
            {t("notifications.markAllRead")}
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          {notificacoesExibidas.length > 0 ? (
            <div className="space-y-3">
              {notificacoesExibidas.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className={`p-3 rounded-md border ${
                    notificacao.lida ? "bg-deep-black/30 border-aged-bone/10" : "bg-deep-black/60 border-blood-red/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-cinzel text-sm ${notificacao.lida ? "text-aged-bone/70" : "text-aged-bone"}`}>
                      {notificacao.titulo}
                    </h4>
                    <span className="text-xs text-bone-dust-gray">{formatarDataRelativa(notificacao.data)}</span>
                  </div>
                  <p className={`text-sm mb-2 ${notificacao.lida ? "text-bone-dust-gray" : "text-aged-bone/90"}`}>
                    {notificacao.mensagem}
                  </p>
                  {!notificacao.lida && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarcarLida(notificacao.id)}
                        className="text-xs text-aged-bone/70 hover:text-aged-bone"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        {t("notifications.markAsRead")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="mx-auto h-10 w-10 text-aged-bone/30 mb-2" />
              <p className="text-bone-dust-gray">{t("notifications.empty")}</p>
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-aged-bone/50 text-aged-bone hover:bg-aged-bone/10"
          >
            {t("notifications.close")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
