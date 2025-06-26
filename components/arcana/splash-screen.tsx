import { Skull } from "lucide-react"
import { useIdioma } from "@/contexts/idioma-context"

export function SplashScreen() {
  const { t } = useIdioma()

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-black p-8 text-center">

      <div className="corner-ornament corner-top-left opacity-0 animate-fadeInDelayed"></div>
      <div className="corner-ornament corner-top-right opacity-0 animate-fadeInDelayed"></div>
      <div className="corner-ornament corner-bottom-left opacity-0 animate-fadeInDelayed"></div>
      <div className="corner-ornament corner-bottom-right opacity-0 animate-fadeInDelayed"></div>

      <div className="opacity-0 animate-fadeIn">
        <Skull className="mx-auto h-20 w-20 md:h-28 md:w-28 text-aged-bone/80" strokeWidth={1.5} />
      </div>

      <h1 className="mt-6 font-cinzel text-5xl md:text-7xl font-bold text-aged-bone opacity-0 animate-fadeInDelayed shimmer-text">
        {t("splash.title")}
      </h1>

      <p className="mt-4 font-cinzel text-sm md:text-base text-aged-bone/80 opacity-0 animate-[fadeInUp_1.2s_ease-out_1s_forwards]">
        {t("splash.subtitle")}
      </p>
    </div>
  )
}
