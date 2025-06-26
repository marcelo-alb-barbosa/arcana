"use client"

import { useState, useEffect } from "react"
import { Check, CreditCard, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type SubscriptionPlan, type Region, formatCurrencySync, getRegionalPlanContent } from "@/lib/subscription-data"
import { useIdioma } from "@/contexts/idioma-context"

interface ModalConfirmacaoAssinaturaProps {
  isOpen: boolean
  onClose: () => void
  plan: SubscriptionPlan
  region: Region
  price: number
}

export function ModalConfirmacaoAssinatura({ 
  isOpen, 
  onClose, 
  plan, 
  region, 
  price 
}: ModalConfirmacaoAssinaturaProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [planTitle, setPlanTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { t, idioma } = useIdioma()

  // Fetch regional content when component mounts or when plan/region changes
  useEffect(() => {
    let isMounted = true

    const fetchRegionalContent = async () => {
      try {
        setIsLoading(true)
        const content = await getRegionalPlanContent(plan, region.id)
        if (isMounted) {
          setPlanTitle(content.title)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching regional plan content:', error)
        if (isMounted) {
          // Set a default title if there's an error
          setPlanTitle(plan.type.charAt(0).toUpperCase() + plan.type.slice(1) + " Plan")
          setIsLoading(false)
        }
      }
    }

    fetchRegionalContent()

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false
    }
  }, [plan, region.id])

  const handleConfirm = async () => {
    setIsProcessing(true)

    try {
      // Get user ID from localStorage (in a real app, this would come from an auth context)
      const authData = localStorage.getItem("arcana-auth")
      let userId = ""

      if (authData) {
        const parsed = JSON.parse(authData)
        userId = parsed.user?.id || ""
      }

      // Call the API to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: plan.id, 
          regionId: region.id,
          userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
        return;
      }

      // If we're in development/testing mode and no URL is returned
      setIsProcessing(false)
      setIsSuccess(true)

      // Close after success
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error processing subscription:', error)
      setIsProcessing(false)
      // Show error message
      alert(t("subscription.error.processingFailed"))
    }
  }

  const getIntervalText = (interval: string) => {
    return t(`subscription.interval.${interval}.adjective`)
  }

  const intervalText = getIntervalText(plan.interval)
  const formattedPrice = formatCurrencySync(price, region.id, region.locale, region.currencyCode)

  // planTitle is now fetched in useEffect

  // Use the translation function for all text

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-deep-black border-aged-bone/30 text-aged-bone sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl text-aged-bone">{t("subscription.modal.title")}</DialogTitle>
          <DialogDescription className="text-bone-dust-gray">
            {t("subscription.modal.subtitle").replace("{planTitle}", planTitle)}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <>
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <span className="text-bone-dust-gray">{t("subscription.modal.plan")}</span>
                {isLoading ? (
                  <span className="font-medium text-bone-dust-gray">{t("subscription.modal.loading")}</span>
                ) : (
                  <span className="font-medium">{planTitle}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-bone-dust-gray">{t("subscription.modal.value")}</span>
                <span className="font-medium">
                  {formattedPrice}/{intervalText}
                </span>
              </div>
              {/* Only show credits if they exist */}
              {plan.credits && (
                <div className="flex justify-between items-center">
                  <span className="text-bone-dust-gray">{t("subscription.modal.credits")}</span>
                  <span className="font-medium">{plan.credits.toLocaleString()} créditos</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-bone-dust-gray">{t("subscription.modal.renewal")}</span>
                <span className="font-medium">{t("subscription.modal.automatic")}</span>
              </div>

              <div className="pt-2 border-t border-aged-bone/20">
                <p className="text-sm text-bone-dust-gray">
                  {t("subscription.modal.disclaimer")
                    .replace("{interval}", intervalText)
                    .replace("{price}", formattedPrice)}
                </p>
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-bone-dust-gray hover:text-aged-bone hover:bg-aged-bone/10"
                disabled={isProcessing}
              >
                {t("subscription.modal.cancel")}
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="bg-blood-red text-aged-bone hover:bg-blood-red/80"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("subscription.modal.processing")}
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t("subscription.modal.confirm")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="rounded-full bg-emerald-700/20 p-3 mb-4">
              <Check className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-medium text-aged-bone mb-2">{t("subscription.modal.successTitle")}</h3>
            <p className="text-center text-bone-dust-gray">
              {t("subscription.modal.successMessage").replace("{planTitle}", planTitle)}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
