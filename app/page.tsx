"use client"

import { useState, useEffect, Suspense } from "react"
import { SplashScreen } from "@/components/arcana/splash-screen"
import { HomeScreen } from "@/components/arcana/home-screen"
import { PageTransition } from "@/components/arcana/ui/page-transition"
import { useSession } from "next-auth/react"

// Get splash screen timeout from environment variable or use default
const SPLASH_SCREEN_TIMEOUT = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SPLASH_SCREEN_TIMEOUT 
  ? parseInt(process.env.NEXT_PUBLIC_SPLASH_SCREEN_TIMEOUT, 10) 
  : 4000; // Default 4 seconds

// Safe function to access sessionStorage
const getSessionStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return defaultValue
  }
  try {
    const value = sessionStorage.getItem(key)
    if (value === null) {
      return defaultValue
    }
    return value
  } catch (error) {
    console.error('Error accessing sessionStorage:', error)
    return defaultValue
  }
}

// Safe function to set sessionStorage
const setSessionStorage = (key: string, value: string) => {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return
  }
  try {
    sessionStorage.setItem(key, value)
  } catch (error) {
    console.error('Error setting sessionStorage:', error)
  }
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()

  // Check if we're on the client side
  useEffect(() => {
    console.log("🏠 AppContent - Setting isClient to true")
    setIsClient(true)

    // Set a global timeout to force loading to complete
    const globalTimeout = setTimeout(() => {
      console.log("🏠 AppContent - Global timeout: forcing loading to complete")
      setIsLoading(false)
      setShowSplash(false)
    }, SPLASH_SCREEN_TIMEOUT + 4000) // Configured timeout + 4s buffer (absolute maximum)

    return () => clearTimeout(globalTimeout)
  }, [])

  // Force hide splash screen after a maximum time to prevent getting stuck
  useEffect(() => {
    if (showSplash) {
      console.log("🏠 AppContent - Splash screen is showing, setting up backup timeout")

      // Backup timeout to ensure splash screen doesn't get stuck
      // This is just a fallback in case the splash screen component fails
      const backupTimeout = setTimeout(() => {
        console.log("🔄 Backup timeout: hiding splash screen")
        setShowSplash(false)
        setIsLoading(false)
      }, SPLASH_SCREEN_TIMEOUT + 2000) // Configured timeout + 2s buffer (1s for fade out + 1s extra)

      return () => {
        clearTimeout(backupTimeout)
      }
    }
  }, [showSplash])

  useEffect(() => {
    if (!isClient) {
      console.log("🏠 AppContent - Not on client yet, skipping session effect")
      return
    }

    console.log("🏠 AppContent - Client-side effect running, auth status:", status)
    setIsLoading(true)

    try {
      const authStatus = status === "authenticated"
      setIsAuthenticated(authStatus)

      if (authStatus && session?.user?.name) {
        setUsername(session.user.name)
      }

      // Check for emergency reload flag first
      const emergencyReload = getSessionStorage("arcana-emergency-reload", null)
      if (emergencyReload) {
        console.log("🏠 AppContent - Emergency reload detected, skipping splash screen")
        setShowSplash(false)
        setIsLoading(false)
        try {
          // Clear the emergency flag but keep splash-shown flag
          if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.removeItem("arcana-emergency-reload")
          }
        } catch (e) {
          console.error("Failed to clear emergency reload flag:", e)
        }
        return
      }

      const splashShown = getSessionStorage("arcana-splash-shown", null)
      console.log("🏠 AppContent - Splash shown in session:", splashShown)

      if (!splashShown) {
        console.log("🏠 AppContent - Setting splash to show (first visit)")
        setShowSplash(true)

        // Set the flag with multiple fallbacks
        try {
          setSessionStorage("arcana-splash-shown", "true")
          // Also try direct access as backup
          if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem("arcana-splash-shown", "true")
          }
        } catch (e) {
          console.error("Failed to set splash shown flag:", e)
        }
      } else {
        console.log("🏠 AppContent - Splash already shown, skipping")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("🏠 AppContent - Error in session effect:", error)
      // Ensure we don't get stuck in loading state
      setIsLoading(false)
      setShowSplash(false)
    }
  }, [session, status, isClient])

  // Loading state for initial render or when explicitly loading
  if (!isClient || isLoading) {
    console.log("🏠 AppContent - Showing loading state, isClient:", isClient, "isLoading:", isLoading)
    return (
      <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-aged-bone/20 mb-4"></div>
          <div className="h-6 w-48 bg-aged-bone/20 rounded mb-2"></div>
          <div className="h-4 w-64 bg-aged-bone/20 rounded"></div>
        </div>
      </div>
    )
  }

  // Show splash screen if needed
  if (showSplash) {
    console.log("🏠 AppContent - Showing splash screen")
    return <SplashScreen onComplete={() => {
      console.log("🏠 AppContent - Splash screen completed callback")
      setShowSplash(false)
      setIsLoading(false)
    }} />
  }

  // Main content with transition
  console.log("🏠 AppContent - Showing main content")
  return (
    <PageTransition delay={50}>
      <HomeScreen username={username} isAuthenticated={isAuthenticated} />
    </PageTransition>
  )
}

export default function ArcanaAppPage() {
  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("🚨 ArcanaAppPage - Global error caught:", event.error);

      // Try to set emergency flags
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem("arcana-splash-shown", "true");
          window.sessionStorage.setItem("arcana-emergency-reload", "true");

          // Check if we should force reload
          const shouldReload = !window.sessionStorage.getItem("arcana-error-handled");
          if (shouldReload) {
            // Set a flag to prevent infinite reload loops
            window.sessionStorage.setItem("arcana-error-handled", "true");
            console.log("🚨 ArcanaAppPage - Setting error handled flag and forcing reload");

            // Delay reload slightly to allow other cleanup
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        }
      } catch (e) {
        console.error("Failed to handle global error:", e);
      }

      // Prevent default error handling
      event.preventDefault();
      return true;
    };

    // Add global error handler
    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleGlobalError);
    }

    // Clean up on unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('error', handleGlobalError);
      }
    };
  }, []);

  // Clear error handled flag after successful render
  useEffect(() => {
    // Wait a bit to ensure the app is fully rendered
    const clearErrorTimeout = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.removeItem("arcana-error-handled");
          console.log("🏠 ArcanaAppPage - Cleared error handled flag after successful render");
        }
      } catch (e) {
        console.error("Failed to clear error handled flag:", e);
      }
    }, 5000);

    return () => clearTimeout(clearErrorTimeout);
  }, []);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-aged-bone/20 mb-4"></div>
          <div className="h-6 w-48 bg-aged-bone/20 rounded mb-2"></div>
          <div className="h-4 w-64 bg-aged-bone/20 rounded"></div>
        </div>
      </div>
    }>
      <AppContent />
    </Suspense>
  )
}
