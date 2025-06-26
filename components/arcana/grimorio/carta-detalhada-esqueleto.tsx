"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function CartaDetalhadaEsqueleto() {
  return (
    <Card className="bg-deep-black/50 border border-aged-bone/20 shadow-md text-aged-bone overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4 flex justify-center items-center">
          <div className="aspect-[2/3.5] w-40 sm:w-48 md:w-full max-w-xs mx-auto bg-aged-bone/10 rounded-lg"></div>
        </div>
        <div className="md:w-2/3 p-4 md:p-6">
          <CardHeader className="pt-0 pb-3 px-0">
            <div className="h-8 w-3/4 bg-aged-bone/20 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-aged-bone/10 rounded"></div>
          </CardHeader>
          <CardContent className="pt-0 pb-0 px-0 space-y-2">
            <div className="h-4 bg-aged-bone/10 rounded"></div>
            <div className="h-4 bg-aged-bone/10 rounded"></div>
            <div className="h-4 w-5/6 bg-aged-bone/10 rounded"></div>
            <div className="h-4 w-3/4 bg-aged-bone/10 rounded"></div>
            <div className="mt-4 h-10 w-full bg-aged-bone/5 rounded-md"></div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
