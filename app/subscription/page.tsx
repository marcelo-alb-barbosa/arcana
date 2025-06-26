"use client"

import { useState, useEffect } from "react"
import { LayoutSubscription } from "@/components/arcana/subscription/layout-subscription"
import { PlanoAssinaturaCard } from "@/components/arcana/subscription/plano-assinatura-card"
import { PlanoAssinaturaCardSkeleton } from "@/components/arcana/subscription/plano-assinatura-card-skeleton"
import { StatusAssinaturaCard } from "@/components/arcana/subscription/status-assinatura-card"
import {
  getPlans,
  getSubscriptionStatus,
  getRegions,
  getUserRegion,
  formatCurrencySync,
  getInitialSubscriptionStatus
} from "@/lib/subscription-data"
import { useRouter } from "next/navigation"
import { useIdioma } from "@/contexts/idioma-context"
import { useSession } from "next-auth/react"

export default function AssinaturaPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [subscriptionStatus, setSubscriptionStatus] = useState(getInitialSubscriptionStatus())
    // Default region for Brazil
    const [selectedRegion, setSelectedRegion] = useState({
        id: 'BR',
        name: 'Brasil',
        currencyCode: 'BRL',
        locale: 'pt-BR',
    })
    const [regions, setRegions] = useState<Array<any>>([])
    const [plans, setPlans] = useState<Array<any>>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { t, idioma } = useIdioma()
    const { data: session, status } = useSession()

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login')
        }
    }, [status, router])

    // Fetch regions and plans on component mount
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const regionsData = await getRegions();
                if (regionsData && regionsData.length > 0) {
                    setRegions(regionsData);
                }
            } catch (error) {
                console.error('Error fetching regions:', error);
            }
        };

        const fetchPlans = async () => {
            try {
                const plansData = await getPlans();
                if (plansData && plansData.length > 0) {
                    setPlans(plansData);
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        };

        fetchRegions().then();
        fetchPlans().then();
    }, []);

    useEffect(() => {
        // Check authentication status using NextAuth session
        const isUserAuthenticated = status === "authenticated" && !!session?.user
        setIsAuthenticated(isUserAuthenticated)

        if (isUserAuthenticated && session?.user) {
            const currentUserId = session.user.id || session.user.email
            setUserId(currentUserId)

            // Fetch subscription status
            const fetchSubscriptionStatus = async () => {
                try {
                    const status = await getSubscriptionStatus(currentUserId)
                    setSubscriptionStatus(status)

                    // If user has an active subscription, set the region from it
                    if (status.active && status.region) {
                        setSelectedRegion(status.region)
                    } else {
                        // Otherwise, try to get the user's region from their profile or IP
                        const userRegion = await getUserRegion(currentUserId)
                        if (userRegion) {
                            setSelectedRegion(userRegion)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching subscription status:', error)
                } finally {
                    setIsLoading(false)
                }
            }

            fetchSubscriptionStatus().then()
        } else {
            // For non-authenticated users, detect region from IP
            const detectRegion = async () => {
                try {
                    const userRegion = await getUserRegion()
                    if (userRegion) {
                        setSelectedRegion(userRegion)
                    }
                } catch (error) {
                    console.error('Error detecting region:', error)
                } finally {
                    setIsLoading(false)
                }
            }

            detectRegion().then()
        }
    }, [status, session])

    const handleCancelarAssinatura = async () => {
        if (!userId || !subscriptionStatus.active) return;

        const confirmMessage = idioma === 'pt'
            ? "Tem certeza que deseja cancelar sua subscription? Você continuará tendo acesso aos benefícios até o final do período pago."
            : idioma === 'es'
                ? "¿Estás seguro de que deseas cancelar tu suscripción? Seguirás teniendo acceso a los beneficios hasta el final del período pagado."
                : "Are you sure you want to cancel your subscription? You will continue to have access to the benefits until the end of the paid period.";

        if (!confirm(confirmMessage)) return;

        try {
            const response = await fetch('/api/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'cancel',
                    subscriptionId: subscriptionStatus.subscription?.id,
                    userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            const data = await response.json();

            if (data.success) {
                // Refresh subscription status
                const status = await getSubscriptionStatus(userId);
                setSubscriptionStatus(status);

                alert(idioma === 'pt'
                    ? "Sua subscription será cancelada ao final do período atual."
                    : idioma === 'es'
                        ? "Tu suscripción se cancelará al final del período actual."
                        : "Your subscription will be canceled at the end of the current period.");
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error canceling subscription:', error);
            alert(idioma === 'pt'
                ? "Erro ao cancelar subscription. Por favor, tente novamente."
                : idioma === 'es'
                    ? "Error al cancelar la suscripción. Por favor, inténtalo de nuevo."
                    : "Error canceling subscription. Please try again.");
        }
    }

    const handleRenovarAssinatura = async () => {
        if (!userId || !subscriptionStatus.active) return;

        try {
            const response = await fetch('/api/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reactivate',
                    subscriptionId: subscriptionStatus.subscription?.id,
                    userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to reactivate subscription');
            }

            const data = await response.json();

            if (data.success) {
                // Refresh subscription status
                const status = await getSubscriptionStatus(userId);
                setSubscriptionStatus(status);

                alert(idioma === 'pt'
                    ? "Sua subscription foi reativada com sucesso."
                    : idioma === 'es'
                        ? "Tu suscripción ha sido reactivada con éxito."
                        : "Your subscription has been successfully reactivated.");
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error reactivating subscription:', error);
            alert(idioma === 'pt'
                ? "Erro ao reativar subscription. Por favor, tente novamente."
                : idioma === 'es'
                    ? "Error al reactivar la suscripción. Por favor, inténtalo de nuevo."
                    : "Error reactivating subscription. Please try again.");
        }
    }

    // Region is now automatically detected based on user's IP address

    const translations = {
        yourSubscription: idioma === 'pt' ? 'Sua Assinatura' :
                          idioma === 'es' ? 'Tu Suscripción' :
                          'Your Subscription',
        availablePlans: idioma === 'pt' ? 'Planos Disponíveis' :
                        idioma === 'es' ? 'Planes Disponibles' :
                        'Available Plans',
        benefits: idioma === 'pt' ? 'Benefícios do Círculo dos Iniciados' :
                  idioma === 'es' ? 'Beneficios del Círculo de Iniciados' :
                  'Benefits of the Circle of Initiates',
        creditBonus: idioma === 'pt' ? 'Bônus em Créditos' :
                     idioma === 'es' ? 'Bonos en Créditos' :
                     'Credit Bonuses',
        creditBonusDesc: idioma === 'pt' ? 'Receba 20% a mais de créditos no valor da sua subscription e 10% de bônus em todas as recargas adicionais.' :
                         idioma === 'es' ? 'Recibe un 20% más de créditos en el valor de tu suscripción y un 10% de bonificación en todas las recargas adicionales.' :
                         'Receive 20% more credits on your subscription value and 10% bonus on all additional recharges.',
        expandedGrimoire: idioma === 'pt' ? 'Grimório Pessoal Expandido' :
                          idioma === 'es' ? 'Grimorio Personal Expandido' :
                          'Expanded Personal Grimoire',
        expandedGrimoireDesc: idioma === 'pt' ? 'Acesse recursos exclusivos no seu grimório pessoal, incluindo análises avançadas, histórico completo e insights personalizados.' :
                              idioma === 'es' ? 'Accede a recursos exclusivos en tu grimorio personal, incluyendo análisis avanzados, historial completo e insights personalizados.' :
                              'Access exclusive resources in your personal grimoire, including advanced analytics, complete history, and personalized insights.',
        affiliateProgram: idioma === 'pt' ? 'Programa de Afiliados' :
                          idioma === 'es' ? 'Programa de Afiliados' :
                          'Affiliate Program',
        affiliateProgramDesc: idioma === 'pt' ? 'Em breve' :
                              idioma === 'es' ? 'Próximamente' :
                              'Coming soon',
        prioritySupport: idioma === 'pt' ? 'Suporte Prioritário' :
                         idioma === 'es' ? 'Soporte Prioritario' :
                         'Priority Support',
        prioritySupportDesc: idioma === 'pt' ? 'Receba atendimento prioritário e acesso a recursos exclusivos da plataforma.' :
                             idioma === 'es' ? 'Recibe atención prioritaria y acceso a recursos exclusivos de la plataforma.' :
                             'Receive priority service and access to exclusive platform resources.',
        faq: idioma === 'pt' ? 'Perguntas Frequentes' :
             idioma === 'es' ? 'Preguntas Frecuentes' :
             'Frequently Asked Questions',
    }

    // Show loading state while checking authentication
    if (status === "loading") {
        return (
            <LayoutSubscription>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-aged-bone/20 mb-4"></div>
                        <div className="h-4 w-48 bg-aged-bone/20 rounded"></div>
                    </div>
                </div>
            </LayoutSubscription>
        )
    }

    // If not authenticated, don't render anything (will redirect to login)
    if (status === "unauthenticated") {
        return null
    }

    return (
        <LayoutSubscription
            subtitle={idioma === 'pt'
                ? "Torne-se um membro do Círculo dos Iniciados e desbloqueie benefícios exclusivos, incluindo bônus em créditos, grimório pessoal expandido e muito mais."
                : idioma === 'es'
                    ? "Conviértete en miembro del Círculo de Iniciados y desbloquea beneficios exclusivos, incluyendo bonos en créditos, grimorio personal expandido y mucho más."
                    : "Become a member of the Circle of Initiates and unlock exclusive benefits, including credit bonuses, expanded personal grimoire, and much more."
            }
        >
            {/* Region is automatically detected based on user's IP address */}

            {/* Status da subscription atual */}
            <section className="mb-8">
                <h3 className="font-cinzel text-xl text-aged-bone mb-4">{translations.yourSubscription}</h3>
                <StatusAssinaturaCard
                    status={{
                        ...subscriptionStatus,
                        region: selectedRegion
                    }}
                    onCancelar={handleCancelarAssinatura}
                    onRenovar={handleRenovarAssinatura}
                />
            </section>

            {/* Planos disponíveis */}
            <section className="mb-8">
                <h3 className="font-cinzel text-xl text-aged-bone mb-4">{translations.availablePlans}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans && plans.length > 0 ? (
                        plans.map((plan) => (
                            <PlanoAssinaturaCard
                                key={plan.id}
                                plan={plan}
                                region={selectedRegion}
                                isAuthenticated={isAuthenticated}
                            />
                        ))
                    ) : (
                        <>
                            <PlanoAssinaturaCardSkeleton />
                            <PlanoAssinaturaCardSkeleton />
                            <PlanoAssinaturaCardSkeleton />
                        </>
                    )}
                </div>
            </section>

            {/* Benefícios da subscription */}
            <section className="mb-8">
                <h3 className="font-cinzel text-xl text-aged-bone mb-4">{translations.benefits}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-6">
                        <h4 className="font-cinzel text-lg text-aged-bone mb-3">{translations.creditBonus}</h4>
                        <p className="text-bone-dust-gray mb-4">
                            {translations.creditBonusDesc}
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt'
                                        ? `Plano Místico: 1.200 créditos/mês (valor equivalente: ${formatCurrencySync(9.99, selectedRegion.id, selectedRegion.locale, selectedRegion.currencyCode)})`
                                        : idioma === 'es'
                                            ? `Plan Místico: 1.200 créditos/mes (valor equivalente: ${formatCurrencySync(9.99, selectedRegion.id, selectedRegion.locale, selectedRegion.currencyCode)})`
                                            : `Mystic Plan: 1,200 credits/month (equivalent value: ${formatCurrencySync(9.99, selectedRegion.id, selectedRegion.locale, selectedRegion.currencyCode)})`
                                    }
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt'
                                        ? `Plano Oráculo: 3.600 créditos/trimestre (valor equivalente: ${formatCurrencySync(24.99, selectedRegion.id, selectedRegion.locale, selectedRegion.currencyCode)})`
                                        : idioma === 'es'
                                            ? `Plan Oráculo: 3.600 créditos/trimestre (valor equivalente: ${formatCurrencySync(24.99, selectedRegion.id, selectedRegion.locale, selectedRegion.currencyCode)})`
                                            : `Oracle Plan: 3,600 credits/quarter (equivalent value: ${formatCurrencySync(24.99, selectedRegion.id, selectedRegion.locale, selectedRegion.currencyCode)})`
                                    }
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt'
                                        ? `Plano Mestre: 12.960 créditos/ano (valor equivalente: ${formatCurrencySync(89.99, selectedRegion.id, selectedRegion.locale, selectedRegion.currencyCode)})`
                                        : idioma === 'es'
                                            ? `Plan Maestro: 12.960 créditos/año (valor equivalente: ${formatCurrencySync(89.99, selectedRegion.id, selectedRegion.locale, selectedRegion.currencyCode)})`
                                            : `Master Plan: 12,960 credits/year (equivalent value: ${formatCurrencySync(89.99, selectedRegion.id, selectedRegion.locale, selectedRegion.currencyCode)})`
                                    }
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-6">
                        <h4 className="font-cinzel text-lg text-aged-bone mb-3">{translations.expandedGrimoire}</h4>
                        <p className="text-bone-dust-gray mb-4">
                            {translations.expandedGrimoireDesc}
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt' ? "Armazenamento ilimitado de leituras" :
                                     idioma === 'es' ? "Almacenamiento ilimitado de lecturas" :
                                     "Unlimited reading storage"}
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt' ? "Análises aprofundadas de padrões" :
                                     idioma === 'es' ? "Análisis profundos de patrones" :
                                     "In-depth pattern analysis"}
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt' ? "Exportação de leituras em PDF" :
                                     idioma === 'es' ? "Exportación de lecturas en PDF" :
                                     "Export readings to PDF"}
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt' ? "Acesso a arcanos exclusivos" :
                                     idioma === 'es' ? "Acceso a arcanos exclusivos" :
                                     "Access to exclusive arcana"}
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-6">
                        <h4 className="font-cinzel text-lg text-aged-bone mb-3">{translations.affiliateProgram}</h4>
                        <p className="text-bone-dust-gray mb-4">
                            {idioma === 'pt' ? "Em breve" :
                             idioma === 'es' ? "Próximamente" :
                             "Coming soon"}
                        </p>
                    </div>

                    <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-6">
                        <h4 className="font-cinzel text-lg text-aged-bone mb-3">{translations.prioritySupport}</h4>
                        <p className="text-bone-dust-gray mb-4">
                            {translations.prioritySupportDesc}
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt' ? "Suporte prioritário via chat" :
                                     idioma === 'es' ? "Soporte prioritario vía chat" :
                                     "Priority support via chat"}
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt' ? "Acesso antecipado a novos recursos" :
                                     idioma === 'es' ? "Acceso anticipado a nuevas funciones" :
                                     "Early access to new features"}
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt' ? "Consultas personalizadas" :
                                     idioma === 'es' ? "Consultas personalizadas" :
                                     "Personalized consultations"}
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blood-red mr-2">•</span>
                                <span className="text-bone-dust-gray text-sm">
                                    {idioma === 'pt' ? "Participação em eventos exclusivos" :
                                     idioma === 'es' ? "Participación en eventos exclusivos" :
                                     "Participation in exclusive events"}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section>
                <h3 className="font-cinzel text-xl text-aged-bone mb-4">{translations.faq}</h3>
                <div className="space-y-4">
                    <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-4">
                        <h4 className="font-medium text-aged-bone mb-2">
                            {idioma === 'pt' ? "Como funciona a cobrança?" :
                             idioma === 'es' ? "¿Cómo funciona el cobro?" :
                             "How does billing work?"}
                        </h4>
                        <p className="text-bone-dust-gray text-sm">
                            {idioma === 'pt'
                                ? "A cobrança é feita automaticamente no início de cada período (mensal, trimestral ou anual), de acordo com o plano escolhido. Você pode cancelar a qualquer momento."
                                : idioma === 'es'
                                    ? "El cobro se realiza automáticamente al inicio de cada período (mensual, trimestral o anual), según el plan elegido. Puedes cancelar en cualquier momento."
                                    : "Billing is done automatically at the beginning of each period (monthly, quarterly, or annual), according to the chosen plan. You can cancel at any time."
                            }
                        </p>
                    </div>

                    <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-4">
                        <h4 className="font-medium text-aged-bone mb-2">
                            {idioma === 'pt' ? "Posso mudar de plano?" :
                             idioma === 'es' ? "¿Puedo cambiar de plan?" :
                             "Can I change plans?"}
                        </h4>
                        <p className="text-bone-dust-gray text-sm">
                            {idioma === 'pt'
                                ? "Sim, você pode mudar de plano a qualquer momento. A mudança será aplicada no próximo ciclo de cobrança."
                                : idioma === 'es'
                                    ? "Sí, puedes cambiar de plan en cualquier momento. El cambio se aplicará en el próximo ciclo de facturación."
                                    : "Yes, you can change plans at any time. The change will be applied in the next billing cycle."
                            }
                        </p>
                    </div>

                    <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-4">
                        <h4 className="font-medium text-aged-bone mb-2">
                            {idioma === 'pt' ? "Como cancelar minha subscription?" :
                             idioma === 'es' ? "¿Cómo cancelar mi suscripción?" :
                             "How do I cancel my subscription?"}
                        </h4>
                        <p className="text-bone-dust-gray text-sm">
                            {idioma === 'pt'
                                ? "Você pode cancelar sua subscription a qualquer momento através da página de configurações do seu profile. Após o cancelamento, você continuará tendo acesso aos benefícios até o final do período pago."
                                : idioma === 'es'
                                    ? "Puedes cancelar tu suscripción en cualquier momento a través de la página de configuración de tu profile. Después de la cancelación, seguirás teniendo acceso a los beneficios hasta el final del período pagado."
                                    : "You can cancel your subscription at any time through your profile settings page. After cancellation, you will continue to have access to the benefits until the end of the paid period."
                            }
                        </p>
                    </div>

                    <div className="bg-aged-bone/5 border border-aged-bone/20 rounded-lg p-4">
                        <h4 className="font-medium text-aged-bone mb-2">
                            {idioma === 'pt' ? "Os créditos expiram?" :
                             idioma === 'es' ? "¿Los créditos caducan?" :
                             "Do credits expire?"}
                        </h4>
                        <p className="text-bone-dust-gray text-sm">
                            {idioma === 'pt'
                                ? "Os créditos adquiridos através da subscription não expiram enquanto sua subscription estiver ativa. Após o cancelamento, você terá 90 dias para utilizar os créditos restantes."
                                : idioma === 'es'
                                    ? "Los créditos adquiridos a través de la suscripción no caducan mientras tu suscripción esté activa. Después de la cancelación, tendrás 90 días para utilizar los créditos restantes."
                                    : "Credits acquired through the subscription do not expire while your subscription is active. After cancellation, you will have 90 days to use the remaining credits."
                            }
                        </p>
                    </div>
                </div>
            </section>
        </LayoutSubscription>
    )
}
