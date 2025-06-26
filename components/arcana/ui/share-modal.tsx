"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, MessageCircle, Mail } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  title: string
  text: string
  url?: string
}

export function ShareModal({ isOpen, onClose, title, text, url }: ShareModalProps) {
  const [copiado, setCopiado] = useState(false)

  const copiarTexto = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
    }
  }

  const compartilharWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
    onClose(false)
  }

  const compartilharEmail = () => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(text)
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
    window.open(mailtoUrl)
    onClose(false)
  }

  const compartilharTelegram = () => {
    const telegramUrl = `https://t.me/share/url?text=${encodeURIComponent(text)}`
    window.open(telegramUrl, "_blank")
    onClose(false)
  }

  const compartilharTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(twitterUrl, "_blank")
    onClose(false)
  }

  const compartilharFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`
    window.open(facebookUrl, "_blank")
    onClose(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-deep-black/95 border-2 border-aged-bone/30 text-aged-bone backdrop-blur-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl text-aged-bone text-center">Compartilhar Leitura</DialogTitle>
          <DialogDescription className="text-aged-bone/70 text-center">
            Escolha como deseja compartilhar sua jornada mística
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-4">
          {/* Texto para compartilhamento */}
          <div className="bg-deep-black/50 rounded-lg p-3 border border-aged-bone/20 max-h-32 overflow-y-auto">
            <pre className="font-serifRegular text-xs text-aged-bone/80 whitespace-pre-wrap">{text}</pre>
          </div>

          {/* Botões de compartilhamento */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={compartilharWhatsApp} className="bg-green-600 hover:bg-green-700 text-white font-cinzel">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>

            <Button onClick={compartilharTelegram} className="bg-blue-500 hover:bg-blue-600 text-white font-cinzel">
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram
            </Button>

            <Button onClick={compartilharTwitter} className="bg-sky-500 hover:bg-sky-600 text-white font-cinzel">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter
            </Button>

            <Button onClick={compartilharFacebook} className="bg-blue-600 hover:bg-blue-700 text-white font-cinzel">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>

            <Button onClick={compartilharEmail} className="bg-gray-600 hover:bg-gray-700 text-white font-cinzel">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>

            <Button onClick={copiarTexto} className="bg-blood-red hover:bg-blood-red/80 text-aged-bone font-cinzel">
              <Copy className="w-4 h-4 mr-2" />
              {copiado ? "Copiado!" : "Copiar"}
            </Button>
          </div>

          {/* Botão Fechar */}
          <div className="pt-4 border-t border-aged-bone/20">
            <Button
              onClick={() => onClose(false)}
              variant="outline"
              className="w-full border-aged-bone/30 text-aged-bone hover:bg-aged-bone/10 font-cinzel"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
