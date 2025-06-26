"use client"

import type { LucideIcon } from "lucide-react"

interface ActionCardProps {
  icon: LucideIcon
  title: string
  onClick?: () => void
  className?: string
}

export function ActionCard({ icon: Icon, title, onClick, className }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full aspect-[3/2] md:aspect-square lg:aspect-[4/3] bg-deep-black/50 border-2 border-blood-red rounded-lg p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-bone-dust hover:bg-blood-red/20 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blood-red focus:ring-opacity-50 btn-press ${className || ''}`}
    >
      <Icon
        className="h-10 w-10 md:h-12 md:w-12 text-aged-bone group-hover:text-blood-red transition-colors duration-300"
        strokeWidth={1.5}
      />
      <h3 className="mt-3 md:mt-4 font-cinzel text-lg md:text-xl font-bold text-aged-bone group-hover:text-white transition-colors duration-300">
        {title}
      </h3>
    </button>
  )
}
