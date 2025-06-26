"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function LeituraSalvaEsqueleto() {
  return (
    <Card className="bg-deep-black/70 border-2 border-blood-red/30 shadow-bone-dust text-aged-bone backdrop-blur-sm overflow-hidden animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="h-6 w-3/4 bg-aged-bone/20 rounded mb-2"></div>
            <div className="h-3 w-1/2 bg-aged-bone/10 rounded"></div>
          </div>
          <div className="h-4 w-16 bg-aged-bone/10 rounded"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="mb-3">
          <div className="h-4 w-20 bg-aged-bone/15 rounded mb-1"></div>
          <div className="h-4 w-full bg-aged-bone/10 rounded"></div>
        </div>

        <div className="mb-3">
          <div className="h-4 w-24 bg-aged-bone/15 rounded mb-2"></div>
          <div className="flex flex-wrap gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-[70px] sm:w-12 sm:h-[84px] bg-aged-bone/10 rounded"></div>
            ))}
          </div>
        </div>
        <div className="h-3 w-32 bg-aged-bone/10 rounded"></div>
      </CardContent>
      <CardFooter className="bg-deep-black/30 p-3">
        <div className="w-full h-8 bg-aged-bone/10 rounded"></div>
      </CardFooter>
    </Card>
  )
}
