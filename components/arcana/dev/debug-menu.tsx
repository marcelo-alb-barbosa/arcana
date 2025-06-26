"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  Bug,
  User,
  UserX,
  Trash2,
  Download,
  RefreshCw,
  Monitor,
  X,
  ChevronUp,
  ChevronDown,
  Settings,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { isDebugModeEnabled, getDebugInfo, clearAllStorage, exportDebugData, forceDebugMode } from "@/lib/debug-utils"
import { simulateLogin, simulateLogout, isInTestMode, getTestUser } from "@/lib/test-auth"
import { useSession } from "next-auth/react"

interface DebugMenuProps {
  onAuthChange?: () => void
}

export function DebugMenu({ onAuthChange }: DebugMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [debugEnabled, setDebugEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)

    // Verificar se debug está habilitado
    const enabled = isDebugModeEnabled()
    setDebugEnabled(enabled)

    // Verificar se o modo demo está ativo
    const demoMode = localStorage.getItem("arcana-demo-mode") === "true"
    setIsDemoMode(demoMode)

    console.log("🐛 Debug Menu - Estado inicial:", {
      enabled,
      env: process.env.NEXT_PUBLIC_ENABLE_TEST_MODE,
      localStorage: typeof window !== "undefined" ? localStorage.getItem("arcana-force-debug") : null,
      mounted: true,
      demoMode,
    })

    if (enabled) {
      checkAuthStatus()
      updateDebugInfo()
    }
  }, [])

  useEffect(() => {
    if (debugEnabled && isOpen) {
      checkAuthStatus()
      updateDebugInfo()
    }
  }, [isOpen, debugEnabled])

  const checkAuthStatus = () => {
    const authStatus = status === "authenticated"
    const testModeActive = isInTestMode()

    setIsAuthenticated(authStatus)
    setIsTestMode(testModeActive)
    setUsername(session?.user?.name || null)
  }

  const updateDebugInfo = () => {
    setDebugInfo(getDebugInfo())
  }

  const handleToggleAuth = () => {
    if (isAuthenticated) {
      const success = simulateLogout()
      if (success) {
        checkAuthStatus()
        showToast("🔓 Logout Simulado", "Usuário desconectado", "destructive")
        if (onAuthChange) onAuthChange()
      }
    } else {
      const success = simulateLogin()
      if (success) {
        checkAuthStatus()
        const testUser = getTestUser()
        showToast("🔐 Login Simulado", `Conectado como ${testUser.username}`, "default")
        if (onAuthChange) onAuthChange()
      }
    }
  }

  const handleToggleDemoMode = () => {
    const newDemoMode = !isDemoMode
    localStorage.setItem("arcana-demo-mode", newDemoMode.toString())
    setIsDemoMode(newDemoMode)
    showToast(
      newDemoMode ? "🎭 Modo Demo Ativado" : "🎭 Modo Demo Desativado",
      newDemoMode ? "Banner 'Para demonstração' visível" : "Banner 'Para demonstração' oculto",
      "default",
    )
    // Recarregar a página para aplicar as mudanças
    window.location.reload()
  }

  const handleClearStorage = () => {
    const success = clearAllStorage()
    if (success) {
      checkAuthStatus()
      updateDebugInfo()
      showToast("🗑️ Storage Limpo", "Todos os dados locais foram removidos", "default")
      if (onAuthChange) onAuthChange()
    }
  }

  const handleExportDebug = () => {
    exportDebugData()
    showToast("📥 Debug Exportado", "Arquivo de debug baixado", "default")
  }

  const handleReload = () => {
    window.location.reload()
  }

  const handleForceDebug = () => {
    forceDebugMode(true)
    setDebugEnabled(true)
    showToast("🐛 Debug Forçado", "Modo debug ativado via localStorage", "default")
  }

  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    toast({
      title,
      description,
      variant,
      className: "bg-deep-black border-yellow-500 text-aged-bone",
    })
  }

  // Não renderizar no servidor
  if (!mounted) {
    return null
  }

  // Se debug não estiver habilitado, mostrar botão para forçar (apenas em desenvolvimento)
  if (!debugEnabled && process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleForceDebug}
          className="w-12 h-12 rounded-full bg-gray-500/20 border-2 border-gray-500 text-gray-500 hover:bg-gray-500/30 shadow-lg backdrop-blur-sm"
          size="icon"
          title="Ativar Debug Mode (Dev Only)"
        >
          <Settings size={16} />
        </Button>
      </div>
    )
  }

  // Só renderiza se o modo debug estiver habilitado
  if (!debugEnabled) {
    console.log("🐛 Debug Menu - Não renderizando (debug desabilitado)")
    return null
  }

  console.log("🐛 Debug Menu - Renderizando botão debug")

  return (
    <>
      {/* Botão flutuante principal - AGORA POSICIONADO ABSOLUTAMENTE */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-yellow-500/20 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/30 shadow-lg backdrop-blur-sm animate-pulse"
            size="icon"
            title="Abrir Debug Menu (Test Mode Ativo)"
          >
            <Bug size={20} />
          </Button>
        </div>
      )}

      {/* Menu de debug expandido */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 max-h-[80vh] bg-deep-black/95 border-2 border-yellow-500/50 rounded-lg shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-yellow-500/30">
            <div className="flex items-center space-x-2">
              <Bug size={16} className="text-yellow-500" />
              <span className="font-mono text-sm text-yellow-500 font-bold">DEBUG MENU</span>
              <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                ATIVO
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-6 h-6 text-yellow-500/70 hover:text-yellow-500"
              >
                {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 text-yellow-500/70 hover:text-yellow-500"
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          {/* Conteúdo */}
          {!isMinimized && (
            <div className="p-3">
              <Tabs defaultValue="auth" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-yellow-500/10">
                  <TabsTrigger value="auth" className="text-xs data-[state=active]:bg-yellow-500/20">
                    Auth
                  </TabsTrigger>
                  <TabsTrigger value="system" className="text-xs data-[state=active]:bg-yellow-500/20">
                    System
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="text-xs data-[state=active]:bg-yellow-500/20">
                    Tools
                  </TabsTrigger>
                </TabsList>

                {/* Tab de Autenticação */}
                <TabsContent value="auth" className="space-y-3 mt-3">
                  <Card className="bg-yellow-500/5 border-yellow-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-yellow-500 flex items-center">
                        <User size={14} className="mr-2" />
                        Estado de Auth
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-aged-bone/70">Status:</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            isAuthenticated ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                          }`}
                        >
                          {isAuthenticated ? "Logado" : "Deslogado"}
                        </Badge>
                      </div>
                      {isAuthenticated && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-aged-bone/70">Usuário:</span>
                            <span className="text-xs text-yellow-500 font-mono truncate max-w-[120px]">{username}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-aged-bone/70">Modo:</span>
                            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">
                              {isTestMode ? "Teste" : "Real"}
                            </Badge>
                          </div>
                        </>
                      )}
                      <Button
                        onClick={handleToggleAuth}
                        size="sm"
                        className={`w-full text-xs ${
                          isAuthenticated
                            ? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
                            : "bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/30"
                        }`}
                        variant="outline"
                      >
                        {isAuthenticated ? (
                          <>
                            <UserX size={12} className="mr-1" />
                            Logout
                          </>
                        ) : (
                          <>
                            <User size={12} className="mr-1" />
                            Login
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Nova seção para Modo Demo */}
                  <Card className="bg-yellow-500/5 border-yellow-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-yellow-500 flex items-center">
                        <Eye size={14} className="mr-2" />
                        Modo Demonstração
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-aged-bone/70">Banner "Para demonstração":</span>
                        <Switch
                          checked={isDemoMode}
                          onCheckedChange={handleToggleDemoMode}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                      <p className="text-xs text-aged-bone/50 italic">
                        {isDemoMode ? "Banner visível em todas as páginas" : "Banner oculto (modo normal)"}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab de Sistema */}
                <TabsContent value="system" className="space-y-3 mt-3">
                  <Card className="bg-yellow-500/5 border-yellow-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-yellow-500 flex items-center">
                        <Monitor size={14} className="mr-2" />
                        Info do Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-32">
                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-aged-bone/70">Viewport:</span>
                            <span className="text-yellow-500">
                              {debugInfo.viewport?.width}x{debugInfo.viewport?.height}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-aged-bone/70">Test Mode:</span>
                            <span className="text-green-500 font-bold">
                              {debugInfo.environment?.testMode || "false"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-aged-bone/70">Demo Mode:</span>
                            <span className="text-green-500 font-bold">{isDemoMode ? "true" : "false"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-aged-bone/70">Node Env:</span>
                            <span className="text-yellow-500">{debugInfo.environment?.nodeEnv || "unknown"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-aged-bone/70">Splash:</span>
                            <span className="text-yellow-500">
                              {debugInfo.localStorage?.splashShown ? "Shown" : "Not shown"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-aged-bone/70">Language:</span>
                            <span className="text-yellow-500">{debugInfo.localStorage?.language || "pt"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-aged-bone/70">Force Debug:</span>
                            <span className="text-yellow-500">{debugInfo.localStorage?.forceDebug || "false"}</span>
                          </div>
                        </div>
                      </ScrollArea>
                      <Button
                        onClick={updateDebugInfo}
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <RefreshCw size={12} className="mr-1" />
                        Atualizar
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab de Ferramentas */}
                <TabsContent value="tools" className="space-y-3 mt-3">
                  <div className="space-y-2">
                    <Button
                      onClick={handleClearStorage}
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-red-500/50 text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 size={12} className="mr-2" />
                      Limpar Storage
                    </Button>

                    <Button
                      onClick={handleExportDebug}
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                    >
                      <Download size={12} className="mr-2" />
                      Exportar Debug
                    </Button>

                    <Button
                      onClick={handleReload}
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                    >
                      <RefreshCw size={12} className="mr-2" />
                      Recarregar Página
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Footer minimizado */}
          {isMinimized && (
            <div className="p-2 flex items-center justify-center space-x-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  isAuthenticated ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                }`}
              >
                {isAuthenticated ? "AUTH" : "NO AUTH"}
              </Badge>
              <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">
                DEV
              </Badge>
              {isDemoMode && (
                <Badge variant="outline" className="text-xs border-blue-500 text-blue-500">
                  DEMO
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
