import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center p-4">
      <h1 className="font-cinzel text-6xl text-blood-red mb-4">404</h1>
      <h2 className="font-cinzel text-2xl text-aged-bone mb-4">Página Não Encontrada</h2>
      <p className="text-bone-dust-gray max-w-md text-center mb-8">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-blood-red/20 hover:bg-blood-red/30 text-aged-bone border border-blood-red/50 rounded-md transition-colors"
      >
        <span>Voltar para a Página Inicial</span>
      </Link>
    </div>
  )
}