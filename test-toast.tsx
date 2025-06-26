"use client"

import { useToast } from "@/hooks/use-toast"
import { Skull } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestToast() {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: (
        <div className="flex items-center font-cinzel">
          <Skull className="mr-2 h-5 w-5 text-blood-red" />
          Campo Obrigatório
        </div>
      ),
      description: <p className="font-serifRegular text-sm">A data de nascimento é necessária para os cálculos astrológicos.</p>,
      variant: "destructive",
      className: "bg-deep-black border-blood-red text-aged-bone shadow-bone-dust",
    })
  }

  return (
    <div className="p-4">
      <Button onClick={handleClick}>Show Toast</Button>
    </div>
  )
}