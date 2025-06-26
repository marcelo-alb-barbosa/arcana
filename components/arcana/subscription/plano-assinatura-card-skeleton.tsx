import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PlanoAssinaturaCardSkeleton() {
  return (
    <Card className="flex flex-col h-full border border-aged-bone/20">
      <CardHeader className="pb-2">
        {/* Popular badge skeleton */}
        <div className="w-fit mb-2">
          <Skeleton className="w-28 h-5 bg-blood-red/30" />
        </div>

        {/* Title with crown icon skeleton */}
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="w-32 h-6 bg-aged-bone/20" />
          <Skeleton className="h-4 w-4 rounded-full bg-blood-red/30" />
        </div>

        {/* Description skeleton */}
        <Skeleton className="w-11/12 h-4 bg-bone-dust-gray/20" />
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        {/* Price skeleton with currency symbol and interval */}
        <div className="mb-4">
          <div className="flex items-baseline">
            <Skeleton className="w-6 h-6 mr-1 bg-aged-bone/20" /> {/* Currency symbol */}
            <Skeleton className="w-16 h-8 mr-1 bg-aged-bone/20" /> {/* Price */}
            <Skeleton className="w-14 h-4 ml-1 bg-bone-dust-gray/20" /> {/* Interval */}
          </div>

          {/* Savings text skeleton */}
          <Skeleton className="w-3/4 h-4 mt-1 bg-blood-red/30" />
        </div>

        {/* Features section */}
        <div className="space-y-2">
          {/* "Includes:" text skeleton */}
          <Skeleton className="w-20 h-4 mb-2 bg-aged-bone/20" />

          {/* Features list with varying widths */}
          <div className="space-y-2">
            <div className="flex items-start">
              <Skeleton className="h-4 w-4 mr-2 mt-0.5 rounded-full bg-blood-red/30" /> {/* Check icon */}
              <Skeleton className="w-11/12 h-4 bg-bone-dust-gray/20" /> {/* Feature text */}
            </div>
            <div className="flex items-start">
              <Skeleton className="h-4 w-4 mr-2 mt-0.5 rounded-full bg-blood-red/30" />
              <Skeleton className="w-3/4 h-4 bg-bone-dust-gray/20" /> {/* Shorter feature */}
            </div>
            <div className="flex items-start">
              <Skeleton className="h-4 w-4 mr-2 mt-0.5 rounded-full bg-blood-red/30" />
              <Skeleton className="w-10/12 h-4 bg-bone-dust-gray/20" /> {/* Medium feature */}
            </div>
            <div className="flex items-start">
              <Skeleton className="h-4 w-4 mr-2 mt-0.5 rounded-full bg-blood-red/30" />
              <Skeleton className="w-5/6 h-4 bg-bone-dust-gray/20" /> {/* Another feature */}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {/* Button skeleton with icon */}
        <div className="w-full flex gap-2">
          <div className="w-full flex items-center justify-center bg-aged-bone/10 border border-aged-bone/30 rounded-md h-10">
            <Skeleton className="w-1/2 h-4 bg-aged-bone/20" /> {/* Button text */}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
