import { Skull } from "lucide-react"
import { useIdioma } from "@/contexts/idioma-context"
import { Suspense, useEffect, useState, useCallback } from "react"

// Get splash screen timeout from environment variable or use default
const SPLASH_SCREEN_TIMEOUT = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SPLASH_SCREEN_TIMEOUT 
  ? parseInt(process.env.NEXT_PUBLIC_SPLASH_SCREEN_TIMEOUT, 10) 
  : 4000; // Default 4 seconds

interface SplashContentProps {
  onComplete?: () => void;
}

function SplashContent({ onComplete }: SplashContentProps) {
  const { t, isLoading } = useIdioma()
  const [fadeOut, setFadeOut] = useState(false)

  // Handle completion callback
  const handleComplete = useCallback(() => {
    console.log("🔮 SplashContent - Starting fade out animation")
    setFadeOut(true)

    // Wait for fade out animation to complete before calling onComplete
    setTimeout(() => {
      console.log("🔮 SplashContent - Animation complete, calling onComplete")
      if (onComplete) {
        onComplete()
      }
    }, 1000) // 1 second for fade out animation
  }, [onComplete])

  // Set up configurable timer for automatic exit
  useEffect(() => {
    console.log(`🔮 SplashContent - Setting up ${SPLASH_SCREEN_TIMEOUT/1000}-second exit timer`)

    const exitTimeout = setTimeout(() => {
      console.log(`🔮 SplashContent - ${SPLASH_SCREEN_TIMEOUT/1000}-second timer complete, starting exit`)
      handleComplete()
    }, SPLASH_SCREEN_TIMEOUT)

    return () => clearTimeout(exitTimeout)
  }, [handleComplete])

  // If idioma is still loading, show a simple loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-black p-8 text-center" id="splash-loading">
        <div className="animate-pulse">
          <Skull className="mx-auto h-20 w-20 md:h-28 md:w-28 text-aged-bone/40" strokeWidth={1.5} />
        </div>
        <div className="mt-6 h-12 w-48 bg-aged-bone/10 rounded animate-pulse"></div>
        <div className="mt-4 h-4 w-64 bg-aged-bone/10 rounded animate-pulse"></div>
      </div>
    )
  }

  // CSS classes for animations
  const containerClass = fadeOut 
    ? "opacity-0 transition-opacity duration-1000 ease-out" 
    : "opacity-100 transition-opacity duration-1000 ease-in"

  const cornerClass = "opacity-0 animate-[fadeIn_1s_ease-in_0.3s_forwards]"
  const skullClass = "opacity-0 animate-[fadeIn_1s_ease-in_0.1s_forwards]"
  const titleClass = "opacity-0 animate-[fadeIn_1s_ease-in_0.5s_forwards] shimmer-text"
  const subtitleClass = "opacity-0 animate-[fadeIn_1s_ease-in_0.7s_forwards]"

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-black p-8 text-center ${containerClass}`} 
      id="splash-screen-content"
    >
      <div className={`corner-ornament corner-top-left ${cornerClass}`}></div>
      <div className={`corner-ornament corner-top-right ${cornerClass}`}></div>
      <div className={`corner-ornament corner-bottom-left ${cornerClass}`}></div>
      <div className={`corner-ornament corner-bottom-right ${cornerClass}`}></div>

      <div className={skullClass}>
        <Skull className="mx-auto h-20 w-20 md:h-28 md:w-28 text-aged-bone/80" strokeWidth={1.5} />
      </div>

      <h1 className={`mt-6 font-cinzel text-5xl md:text-7xl font-bold text-aged-bone ${titleClass}`} id="splash-title">
        {t("splash.title")}
      </h1>

      <p className={`mt-4 font-cinzel text-sm md:text-base text-aged-bone/80 ${subtitleClass}`} id="splash-subtitle">
        {t("splash.subtitle")}
      </p>
    </div>
  )
}

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  // State to track if we've already completed
  const [hasCompleted, setHasCompleted] = useState(false);

  // Safe wrapper for onComplete to prevent multiple calls
  const safeComplete = useCallback(() => {
    if (!hasCompleted && onComplete) {
      console.log("🔮 SplashScreen - Calling onComplete (safe wrapper)");
      setHasCompleted(true);
      onComplete();
    }
  }, [hasCompleted, onComplete]);

  // Basic error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("🚨 SplashScreen - Error caught:", event.error);
      safeComplete();
      event.preventDefault();
      return true;
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleGlobalError);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('error', handleGlobalError);
      }
    };
  }, [safeComplete]);

  // Backup timeout to ensure splash screen doesn't get stuck
  useEffect(() => {
    const backupTimeout = setTimeout(() => {
      console.log("🔮 SplashScreen - Backup timeout: ensuring completion");
      safeComplete();
    }, SPLASH_SCREEN_TIMEOUT + 2000); // Configured timeout + 2s buffer (1s for fade out + 1s extra)

    return () => clearTimeout(backupTimeout);
  }, [safeComplete]);

  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-black p-8 text-center">
        <div className="animate-pulse">
          <Skull className="mx-auto h-20 w-20 md:h-28 md:w-28 text-aged-bone/40" strokeWidth={1.5} />
        </div>
        <div className="mt-6 h-12 w-48 bg-aged-bone/10 rounded animate-pulse"></div>
        <div className="mt-4 h-4 w-64 bg-aged-bone/10 rounded animate-pulse"></div>
      </div>
    }>
      <SplashContent onComplete={safeComplete} />
    </Suspense>
  )
}
