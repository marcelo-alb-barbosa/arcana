'use client'

import { useState } from 'react'
import { Logo } from '@/components/ui/logo'
import { LoadingIndicator } from '@/components/ui/loading-indicator'

export default function IdentityDemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000) // 3 seconds of loading
  }
  
  return (
    <div className="min-h-screen bg-deep-black text-aged-bone p-8">
      <h1 className="text-3xl font-cinzel mb-8 text-center">ARCANA Identity Elements</h1>
      
      <div className="max-w-4xl mx-auto grid gap-16">
        {/* Logo Section */}
        <section className="border border-blood-red rounded-md p-6 bg-black/30">
          <h2 className="text-2xl font-cinzel mb-6 text-center">Logo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Logo size="sm" />
              <p className="mt-4 text-sm text-center">Small Logo</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Logo size="md" />
              <p className="mt-4 text-sm text-center">Medium Logo</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Logo size="lg" />
              <p className="mt-4 text-sm text-center">Large Logo</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="flex flex-col items-center">
              <Logo withText={false} />
              <p className="mt-4 text-sm text-center">Without Text</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Logo linkToHome={false} />
              <p className="mt-4 text-sm text-center">Without Link</p>
            </div>
          </div>
        </section>
        
        {/* Loading Indicator Section */}
        <section className="border border-blood-red rounded-md p-6 bg-black/30">
          <h2 className="text-2xl font-cinzel mb-6 text-center">Loading Indicators</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <LoadingIndicator size="sm" />
              <p className="mt-4 text-sm text-center">Small Indicator</p>
            </div>
            
            <div className="flex flex-col items-center">
              <LoadingIndicator size="md" />
              <p className="mt-4 text-sm text-center">Medium Indicator</p>
            </div>
            
            <div className="flex flex-col items-center">
              <LoadingIndicator size="lg" />
              <p className="mt-4 text-sm text-center">Large Indicator</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center mt-12">
            <LoadingIndicator text="Consultando os astros..." />
            <p className="mt-4 text-sm text-center">Custom Text</p>
          </div>
          
          <div className="flex justify-center mt-12">
            <button
              onClick={simulateLoading}
              className="px-6 py-3 bg-blood-red text-aged-bone font-cinzel rounded-md hover:bg-blood-red/80 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : 'Simular Carregamento'}
            </button>
          </div>
          
          {isLoading && (
            <div className="mt-8 flex justify-center">
              <LoadingIndicator text="Processando sua solicitação..." />
            </div>
          )}
        </section>
        
        {/* Color Palette Section */}
        <section className="border border-blood-red rounded-md p-6 bg-black/30">
          <h2 className="text-2xl font-cinzel mb-6 text-center">Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <div className="h-24 bg-deep-black border border-aged-bone/20 rounded-md"></div>
              <p className="mt-2 text-sm text-center">Deep Black</p>
              <p className="text-xs text-center text-aged-bone/70">#0A0A0A</p>
            </div>
            
            <div className="flex flex-col">
              <div className="h-24 bg-blood-red border border-aged-bone/20 rounded-md"></div>
              <p className="mt-2 text-sm text-center">Blood Red</p>
              <p className="text-xs text-center text-aged-bone/70">#8B1E24</p>
            </div>
            
            <div className="flex flex-col">
              <div className="h-24 bg-aged-bone border border-aged-bone/20 rounded-md"></div>
              <p className="mt-2 text-sm text-center text-deep-black">Aged Bone</p>
              <p className="text-xs text-center text-deep-black/70">#D9CBA5</p>
            </div>
            
            <div className="flex flex-col">
              <div className="h-24 bg-bone-dust-gray border border-aged-bone/20 rounded-md"></div>
              <p className="mt-2 text-sm text-center text-deep-black">Bone Dust Gray</p>
              <p className="text-xs text-center text-deep-black/70">#B0B0B0</p>
            </div>
          </div>
        </section>
        
        {/* Typography Section */}
        <section className="border border-blood-red rounded-md p-6 bg-black/30">
          <h2 className="text-2xl font-cinzel mb-6 text-center">Typography</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <h3 className="text-xl font-cinzel mb-4">Cinzel Decorative</h3>
              <p className="font-cinzel text-3xl">ARCANA</p>
              <p className="font-cinzel text-2xl">Tarot & Astrologia</p>
              <p className="font-cinzel text-xl">Revelando seu destino</p>
              <p className="font-cinzel text-lg">Mistérios ancestrais</p>
              <p className="mt-4 text-sm text-aged-bone/70">Usado para títulos e elementos decorativos</p>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-xl font-cinzel mb-4">Georgia (Serif)</h3>
              <p className="font-serifRegular text-3xl">ARCANA</p>
              <p className="font-serifRegular text-2xl">Tarot & Astrologia</p>
              <p className="font-serifRegular text-xl">Revelando seu destino</p>
              <p className="font-serifRegular text-lg">Mistérios ancestrais</p>
              <p className="mt-4 text-sm text-aged-bone/70">Usado para corpo de texto e conteúdo principal</p>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="mt-16 text-center text-sm text-aged-bone/60">
        <p>ARCANA - Sistema de Leitura de Tarô e Astrologia</p>
        <p className="mt-2">Desenvolvido com mistério e sabedoria ancestral</p>
      </footer>
    </div>
  )
}