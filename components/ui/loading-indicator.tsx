import React from 'react'

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingIndicator({
  size = 'md',
  text = 'REVELANDO',
  className = '',
}: LoadingIndicatorProps) {
  // Define size dimensions
  const dimensions = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 200, height: 200 },
  }

  const { width, height } = dimensions[size]
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img 
        src="/loading-animation.svg" 
        alt={text}
        width={width}
        height={height}
        className="animate-fadeIn"
      />
      
      {/* Optional additional text below the animation */}
      {text !== 'REVELANDO' && (
        <p className="mt-4 font-cinzel text-aged-bone text-sm animate-subtleGlow">
          {text}
        </p>
      )}
    </div>
  )
}

// Usage example:
// <LoadingIndicator size="md" text="Consultando os astros..." />