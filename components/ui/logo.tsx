import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  withText?: boolean
  className?: string
  linkToHome?: boolean
}

export function Logo({
  size = 'md',
  withText = true,
  className = '',
  linkToHome = true,
}: LogoProps) {
  // Define size dimensions
  const dimensions = {
    sm: { width: 40, height: 40, textSize: 'text-lg' },
    md: { width: 60, height: 60, textSize: 'text-xl' },
    lg: { width: 120, height: 120, textSize: 'text-3xl' },
  }

  const { width, height, textSize } = dimensions[size]
  
  const logoContent = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative animate-subtleGlow">
        <Image 
          src="/logo.svg" 
          alt="ARCANA" 
          width={width} 
          height={height}
          priority
        />
      </div>
      
      {withText && (
        <span className={`font-cinzel ${textSize} text-aged-bone tracking-wider`}>
          ARCANA
        </span>
      )}
    </div>
  )
  
  if (linkToHome) {
    return (
      <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-aged-bone rounded-md">
        {logoContent}
      </Link>
    )
  }
  
  return logoContent
}