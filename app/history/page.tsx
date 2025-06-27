"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useIdioma } from "@/contexts/idioma-context"
import { ChevronUp, Scroll, Sparkles, Users, Globe, Compass, ArrowLeft } from "lucide-react"

export default function HistoriaPage() {
    const { t } = useIdioma()
    const [showBackToTop, setShowBackToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <div className="bg-deep-black text-aged-bone">

            <main className="p-4 md:p-6 lg:p-8 bg-noise-pattern">
                <section className="max-w-4xl mx-auto">
                    <div className="text-center mb-8 md:mb-12">
                        <p className="text-aged-bone font-medium text-lg md:text-xl mb-8 text-shadow-sm">{t("history.subtitle")}</p>
                    </div>

                    <div className="space-y-8 md:space-y-12">
                        {/* Seção 1: As Origens */}
                        <div className="bg-deep-black/50 border border-blood-red/20 rounded-lg p-6 md:p-8 shadow-lg shadow-blood-red/5 animate-fadeIn hover:border-blood-red/40 transition-all duration-500 bg-noise-pattern bg-opacity-10 bg-blend-overlay">
                            <div className="flex items-start gap-4">
                                <div className="bg-blood-red/10 p-3 rounded-full animate-fadeInUp">
                                    <Scroll className="w-8 h-8 text-blood-red animate-subtleGlow" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="font-cinzel text-2xl md:text-3xl text-blood-red mb-4 flex items-center">
                                        {t("history.section1.title")}
                                    </h2>
                                    <div className="w-full h-0.5 bg-gradient-to-r from-blood-red/5 via-blood-red/20 to-blood-red/5 mb-6"></div>
                                    <p className="text-aged-bone font-medium leading-relaxed mb-4 animate-fadeInUpDelayed text-shadow-sm">
                                        {t("history.section1.p1")}
                                    </p>
                                    <p className="text-aged-bone font-medium leading-relaxed animate-fadeInUpDelayed text-shadow-sm">
                                        {t("history.section1.p2")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seção 2: A Evolução */}
                        <div className="bg-deep-black/50 border border-blood-red/20 rounded-lg p-6 md:p-8 shadow-lg shadow-blood-red/5 animate-fadeIn delay-200 hover:border-blood-red/40 transition-all duration-500 bg-noise-pattern bg-opacity-10 bg-blend-overlay">
                            <div className="flex items-start gap-4">
                                <div className="bg-blood-red/10 p-3 rounded-full animate-fadeInUp delay-200">
                                    <Sparkles className="w-8 h-8 text-blood-red animate-subtleGlow" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="font-cinzel text-2xl md:text-3xl text-blood-red mb-4 flex items-center">
                                        {t("history.section2.title")}
                                    </h2>
                                    <div className="w-full h-0.5 bg-gradient-to-r from-blood-red/5 via-blood-red/20 to-blood-red/5 mb-6"></div>
                                    <p className="text-aged-bone font-medium leading-relaxed mb-4 animate-fadeInUpDelayed delay-300 text-shadow-sm">
                                        {t("history.section2.p1")}
                                    </p>
                                    <p className="text-aged-bone font-medium leading-relaxed animate-fadeInUpDelayed delay-300 text-shadow-sm">
                                        {t("history.section2.p2")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seção 3: Os 22 Arcanos Maiores */}
                        <div className="bg-deep-black/50 border border-blood-red/20 rounded-lg p-6 md:p-8 shadow-lg shadow-blood-red/5 animate-fadeIn delay-400 hover:border-blood-red/40 transition-all duration-500 bg-noise-pattern bg-opacity-10 bg-blend-overlay">
                            <div className="flex items-start gap-4">
                                <div className="bg-blood-red/10 p-3 rounded-full animate-fadeInUp delay-400">
                                    <Users className="w-8 h-8 text-blood-red animate-subtleGlow" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="font-cinzel text-2xl md:text-3xl text-blood-red mb-4 flex items-center">
                                        {t("history.section3.title")}
                                    </h2>
                                    <div className="w-full h-0.5 bg-gradient-to-r from-blood-red/5 via-blood-red/20 to-blood-red/5 mb-6"></div>
                                    <p className="text-aged-bone font-medium leading-relaxed mb-4 animate-fadeInUpDelayed delay-500 text-shadow-sm">
                                        {t("history.section3.p1")}
                                    </p>
                                    <p className="text-aged-bone font-medium leading-relaxed animate-fadeInUpDelayed delay-500 text-shadow-sm">
                                        {t("history.section3.p2")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seção 4: O ARCANA Moderno */}
                        <div className="bg-deep-black/50 border border-blood-red/20 rounded-lg p-6 md:p-8 shadow-lg shadow-blood-red/5 animate-fadeIn delay-600 hover:border-blood-red/40 transition-all duration-500 bg-noise-pattern bg-opacity-10 bg-blend-overlay">
                            <div className="flex items-start gap-4">
                                <div className="bg-blood-red/10 p-3 rounded-full animate-fadeInUp delay-600">
                                    <Globe className="w-8 h-8 text-blood-red animate-subtleGlow" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="font-cinzel text-2xl md:text-3xl text-blood-red mb-4 flex items-center">
                                        {t("history.section4.title")}
                                    </h2>
                                    <div className="w-full h-0.5 bg-gradient-to-r from-blood-red/5 via-blood-red/20 to-blood-red/5 mb-6"></div>
                                    <p className="text-aged-bone font-medium leading-relaxed mb-4 animate-fadeInUpDelayed delay-700 text-shadow-sm">
                                        {t("history.section4.p1")}
                                    </p>
                                    <p className="text-aged-bone font-medium leading-relaxed animate-fadeInUpDelayed delay-700 text-shadow-sm">
                                        {t("history.section4.p2")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seção 5: Sua Jornada */}
                        <div className="bg-deep-black/50 border border-blood-red/20 rounded-lg p-6 md:p-8 shadow-lg shadow-blood-red/5 animate-fadeIn delay-800 hover:border-blood-red/40 transition-all duration-500 bg-noise-pattern bg-opacity-10 bg-blend-overlay">
                            <div className="flex items-start gap-4">
                                <div className="bg-blood-red/10 p-3 rounded-full animate-fadeInUp delay-800">
                                    <Compass className="w-8 h-8 text-blood-red animate-subtleGlow" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="font-cinzel text-2xl md:text-3xl text-blood-red mb-4 flex items-center">
                                        {t("history.section5.title")}
                                    </h2>
                                    <div className="w-full h-0.5 bg-gradient-to-r from-blood-red/5 via-blood-red/20 to-blood-red/5 mb-6"></div>
                                    <p className="text-aged-bone font-medium leading-relaxed mb-4 animate-fadeInUpDelayed delay-900 text-shadow-sm">
                                        {t("history.section5.p1")}
                                    </p>
                                    <p className="text-aged-bone font-medium leading-relaxed animate-fadeInUpDelayed delay-900 text-shadow-sm">
                                        {t("history.section5.p2")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Botão Voltar ao Topo */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 bg-blood-red hover:bg-blood-red/80 text-aged-bone p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blood-red/50"
                    aria-label={t("common.backToTop")}
                >
                    <ChevronUp className="w-6 h-6" />
                </button>
            )}
        </div>
    )
}
