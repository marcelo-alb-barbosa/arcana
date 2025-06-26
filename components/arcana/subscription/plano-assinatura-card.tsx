"use client"

import { useState, useEffect } from "react"
import { Check, Crown, CreditCard, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { SmoothButton } from "@/components/arcana/ui/smooth-button"
import { 
  type SubscriptionPlan, 
  type Region,
  formatCurrencySync, 
  getPlanPrice,
  calculateAnnualSavings,
  getRegionalPlanContent
} from "@/lib/subscription-data"
import { ModalConfirmacaoAssinatura } from "./modal-confirmacao-assinatura"
import { useIdioma } from "@/contexts/idioma-context"

interface PlanoAssinaturaCardProps {
  plan: SubscriptionPlan
  region: Region
  isAuthenticated: boolean
}

export function PlanoAssinaturaCard({ plan, region, isAuthenticated }: PlanoAssinaturaCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [price, setPrice] = useState(0)
  const [savings, setSavings] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [regionalContent, setRegionalContent] = useState<{ title: string, description: string, features: string[] }>({
    title: "",
    description: "",
    features: []
  })
  const { t, idioma } = useIdioma()
  const router = useRouter()

  // Fetch price, savings, and regional content asynchronously
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    // Define an async function to fetch all data
    const fetchData = async () => {
      try {
        // Fetch regional content
        const content = await getRegionalPlanContent(plan, region.id)
        if (isMounted) {
          setRegionalContent(content)
        }

        // Fetch price
        try {
          const priceValue = await getPlanPrice(plan.id, region.id)
          if (isMounted) {
            setPrice(priceValue || 0)
          }
        } catch (error) {
          console.error('Error fetching price:', error)
        }

        // Fetch savings
        try {
          const savingsValue = await calculateAnnualSavings(plan.id, region.id)
          if (isMounted) {
            setSavings(savingsValue)
          }
        } catch (error) {
          console.error('Error calculating savings:', error)
        }

        if (isMounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching regional content:', error)

        // Set default content if there's an error
        if (isMounted) {
          setRegionalContent({
            title: plan.type.charAt(0).toUpperCase() + plan.type.slice(1) + " Plan",
            description: "Subscription plan",
            features: ["Features not available"]
          })
          setIsLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false
    }
  }, [plan.id, region.id])

  const handleButtonClick = () => {
    if (isAuthenticated) {
      setIsModalOpen(true)
    } else {
      // Redirect to login page
      router.push('/login')
    }
  }

  const intervalText = {
    month: t("subscription.interval.month.prefix"),
    quarter: t("subscription.interval.quarter.prefix"),
    year: t("subscription.interval.year.prefix"),
  }

  // Region-specific title, description, and features are now fetched in useEffect
  const { title, description, features } = regionalContent;

  return (
    <>
      <Card
        className={`flex flex-col h-full border transition-all duration-300 ${
          plan.popular
            ? "border-blood-red/50 shadow-lg shadow-blood-red/20"
            : "border-aged-bone/20 hover:border-aged-bone/40"
        }`}
      >
        <CardHeader className="pb-2">
          {plan.popular && (
            <Badge className="w-fit mb-2 bg-blood-red text-aged-bone hover:bg-blood-red/80">
              {t("subscription.plan.mostPopular")}
            </Badge>
          )}
          <CardTitle className="font-cinzel text-xl text-aged-bone flex items-center gap-2">
            {isLoading ? (
              <span className="animate-pulse bg-aged-bone/10 h-6 w-32 rounded"></span>
            ) : (
              <>
                {title}
                {plan.interval === "year" && <Crown className="h-4 w-4 text-blood-red" />}
              </>
            )}
          </CardTitle>
          <CardDescription className="text-bone-dust-gray">
            {isLoading ? (
              <span className="animate-pulse bg-aged-bone/10 h-4 w-48 rounded"></span>
            ) : (
              description
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="mb-4">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-aged-bone/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-aged-bone/10 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-aged-bone">
                  {formatCurrencySync(price, region.id, region.locale, region.currencyCode)}
                  <span className="text-sm font-normal text-bone-dust-gray">{intervalText[plan.interval]}</span>
                </p>
                {savings > 0 && (
                  <p className="text-sm text-blood-red mt-1">
                    {t("subscription.plan.savingsComparedToMonthly").replace("{savings}", savings.toFixed(1))}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-aged-bone">
              {t("subscription.plan.includes")}
            </p>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-4 w-4 mr-2 mt-0.5 bg-aged-bone/10 rounded"></div>
                    <div className="h-4 w-full bg-aged-bone/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-blood-red" />
                    <span className="text-sm text-bone-dust-gray">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          {isAuthenticated ? (
            <div className="w-full flex gap-2">
              <SmoothButton
                onClick={() => setIsModalOpen(true)}
                className="flex-1 bg-aged-bone/10 text-aged-bone hover:bg-aged-bone/20 border border-aged-bone/30"
              >
                {t("subscription.plan.subscribeNow")}
              </SmoothButton>
              <SmoothButton
                onClick={() => setIsModalOpen(true)}
                className="bg-blood-red text-aged-bone hover:bg-blood-red/80"
              >
                <CreditCard className="h-4 w-4" />
              </SmoothButton>
            </div>
          ) : (
            <SmoothButton
              onClick={handleButtonClick}
              className="w-full bg-blood-red text-aged-bone hover:bg-blood-red/80 font-cinzel text-sm py-2"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {t("subscription.plan.beginMysticalJourney")}
            </SmoothButton>
          )}
        </CardFooter>
      </Card>

      <ModalConfirmacaoAssinatura 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        plan={plan} 
        region={region}
        price={price}
      />
    </>
  )
}
