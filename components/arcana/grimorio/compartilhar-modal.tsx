"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Share2, Copy, Check, Facebook, Twitter, Instagram, Linkedin, PhoneIcon as WhatsApp } from "lucide-react"
import type { LeituraSalva } from "@/lib/grimorio-data"

interface CompartilharModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  leitura: LeituraSalva
}

export function CompartilharModal({ isOpen, onOpenChange, leitura }: CompartilharModalProps) {
  const [linkCopiado, setLinkCopiado] = useState(false)

  // URL para compartilhamento (em produção seria a URL real)
  const shareUrl = `https://arcana.app/grimorio/${leitura.id}`

  // Texto para compartilhamento
  const shareText = `Confira minha leitura de tarô sobre "${leitura.pergunta}" no ARCANA!`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  const handleShareSocial = (rede: string) => {
    let shareLink = ""

    switch (rede) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        break
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      default:
        return
    }

    // Em um ambiente real, isso abriria uma nova janela
    alert(`Em um ambiente real, abriria: ${shareLink}`)
    // window.open(shareLink, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-deep-black border-2 border-blood-red/30 text-aged-bone shadow-bone-dust sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-2xl text-aged-bone flex items-center">
            <Share2 className="mr-2 h-5 w-5 text-blood-red" /> Compartilhar Sabedoria
          </DialogTitle>
          <DialogDescription className="font-serifRegular text-bone-dust-gray pt-2">
            Compartilhe esta revelação dos arcanos com outros buscadores.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <p className="font-cinzel text-sm text-aged-bone/80">Link para compartilhamento:</p>
            <div className="flex space-x-2">
              <Input value={shareUrl} readOnly className="bg-aged-bone/10 border-bone-dust-gray text-aged-bone" />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="border-aged-bone/50 text-aged-bone hover:bg-aged-bone/10"
              >
                {linkCopiado ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-cinzel text-sm text-aged-bone/80">Compartilhar nas redes:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => handleShareSocial("facebook")}
                variant="outline"
                size="icon"
                className="border-aged-bone/30 text-aged-bone hover:bg-blue-900/20 hover:border-blue-500/50 w-12 h-12"
              >
                <Facebook size={24} />
              </Button>
              <Button
                onClick={() => handleShareSocial("twitter")}
                variant="outline"
                size="icon"
                className="border-aged-bone/30 text-aged-bone hover:bg-sky-900/20 hover:border-sky-500/50 w-12 h-12"
              >
                <Twitter size={24} />
              </Button>
              <Button
                onClick={() => handleShareSocial("whatsapp")}
                variant="outline"
                size="icon"
                className="border-aged-bone/30 text-aged-bone hover:bg-green-900/20 hover:border-green-500/50 w-12 h-12"
              >
                <WhatsApp size={24} />
              </Button>
              <Button
                onClick={() => handleShareSocial("linkedin")}
                variant="outline"
                size="icon"
                className="border-aged-bone/30 text-aged-bone hover:bg-blue-900/20 hover:border-blue-500/50 w-12 h-12"
              >
                <Linkedin size={24} />
              </Button>
              <Button
                onClick={() => handleShareSocial("instagram")}
                variant="outline"
                size="icon"
                className="border-aged-bone/30 text-aged-bone hover:bg-pink-900/20 hover:border-pink-500/50 w-12 h-12"
              >
                <Instagram size={24} />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
