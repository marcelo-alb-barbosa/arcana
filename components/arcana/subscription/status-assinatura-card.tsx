"use client"

import { useState, useEffect } from "react"
import { CalendarDays, CreditCard, RefreshCw, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type SubscriptionStatus, formatCurrencySync, getRegionalPlanContent } from "@/lib/subscription-data"
import { useIdioma } from "@/contexts/idioma-context"

interface StatusAssinaturaCardProps {
  status: SubscriptionStatus
  onCancelar?: () => void
  onRenovar?: () => void
}

export function StatusAssinaturaCard({ status, onCancelar, onRenovar }: StatusAssinaturaCardProps) {
  const [regionalContent, setRegionalContent] = useState<{ title: string, description: string, features: string[] }>({
    title: "",
    description: "",
    features: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const { t, idioma } = useIdioma()

  // Fetch regional content when component mounts or when plan/region changes
  useEffect(() => {
    let isMounted = true

    const fetchRegionalContent = async () => {
      if (!status.active || !status.plan || !status.region) {
        if (isMounted) {
          setIsLoading(false)
        }
        return
      }

      try {
        setIsLoading(true)
        const content = await getRegionalPlanContent(status.plan, status.region.id)
        if (isMounted) {
          setRegionalContent(content)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching regional plan content:', error)
        if (isMounted) {
          // Set a default title and description if there's an error
          setRegionalContent({
            title: status.plan.type.charAt(0).toUpperCase() + status.plan.type.slice(1) + " Plan",
            description: "Subscription plan",
            features: []
          })
          setIsLoading(false)
        }
      }
    }

    fetchRegionalContent()

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false
    }
  }, [status.active, status.plan, status.region])

  // Use the translation function for all text

  const getIntervalText = (interval: string) => {
    return t(`subscription.interval.${interval}`)
  }

  if (!status.active || !status.plan || !status.region) {
    return (
      <Card className="border-aged-bone/20">
        <CardHeader>
          <CardTitle className="font-cinzel text-xl text-aged-bone">{t("subscription.status.title")}</CardTitle>
          <CardDescription className="text-bone-dust-gray">{t("subscription.status.noSubscription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-bone-dust-gray">
            {t("subscription.status.subscribeMessage")}
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(status.region?.locale || "pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Card className="border-blood-red/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-cinzel text-xl text-aged-bone">
            {isLoading ? (
              <span className="animate-pulse bg-aged-bone/10 h-6 w-32 rounded"></span>
            ) : (
              regionalContent.title
            )}
          </CardTitle>
          <Badge className="bg-emerald-700 text-aged-bone hover:bg-emerald-700/80">{t("subscription.status.active")}</Badge>
        </div>
        <CardDescription className="text-bone-dust-gray">
          {isLoading ? (
            <span className="animate-pulse bg-aged-bone/10 h-4 w-48 rounded"></span>
          ) : (
            regionalContent.description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blood-red" />
            <span className="text-sm text-bone-dust-gray">{t("subscription.status.value")}</span>
          </div>
          <span className="text-sm font-medium text-aged-bone">
            {formatCurrencySync(status.price || 0, status.region.id, status.region.locale, status.region.currencyCode)}/
            {getIntervalText(status.plan.interval)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blood-red" />
            <span className="text-sm text-bone-dust-gray">{t("subscription.status.startDate")}</span>
          </div>
          <span className="text-sm font-medium text-aged-bone">
            {status.startDate ? formatDate(status.startDate) : "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-blood-red" />
            <span className="text-sm text-bone-dust-gray">{t("subscription.status.nextBilling")}</span>
          </div>
          <span className="text-sm font-medium text-aged-bone">
            {status.nextBillingDate ? formatDate(status.nextBillingDate) : "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blood-red" />
            <span className="text-sm text-bone-dust-gray">{t("subscription.status.autoRenewal")}</span>
          </div>
          <span className="text-sm font-medium text-aged-bone">
            {status.autoRenew ? t("subscription.status.enabled") : t("subscription.status.disabled")}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button
          variant="outline"
          className="flex-1 border-aged-bone/30 text-aged-bone hover:bg-aged-bone/10"
          onClick={onCancelar}
        >
          {t("subscription.status.cancel")}
        </Button>
        {!status.autoRenew && (
          <Button className="flex-1 bg-blood-red text-aged-bone hover:bg-blood-red/80" onClick={onRenovar}>
            {t("subscription.status.enableRenewal")}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
